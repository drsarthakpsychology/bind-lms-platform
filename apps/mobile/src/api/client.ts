import { Platform } from "react-native";

import { config } from "@/lib/config";
import { APP_HEADERS, type ApiErrorCode, type ApiResponse, type AuthTokens, type RefreshResult } from "./contract";
import { ApiFailure } from "./errors";

/**
 * The API client. One small fetch wrapper that speaks the contract
 * (docs/app/API_CONTRACT.md):
 *  - sends the bearer token, device id, app version and platform
 *  - unwraps { ok, data } and turns { ok: false, error } into ApiFailure
 *  - on token_expired refreshes once (one refresh at a time) and repeats
 *  - reports the session-ending codes to whoever is listening (the session)
 * The transport can be swapped: the real server, or the mock server that
 * lives inside the app (EXPO_PUBLIC_API_MODE=mock) so screens work without one.
 */

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type RawRequest = { method: Method; path: string; headers: Record<string, string>; body?: unknown };
export type RawResponse = { status: number; json: unknown; /** The answer's ETag header, when it has one (GETs). */ etag?: string | null; /** The server's clock (the Date header), to correct a phone whose clock is wrong. */ date?: string | null };
export type Transport = (req: RawRequest) => Promise<RawResponse>;

export type TokenSource = {
  get: () => AuthTokens | null;
  set: (tokens: AuthTokens) => Promise<void> | void;
  deviceId: () => string;
};

/** Codes that end or pause the session; the session store listens for them. */
export type SessionEvent = { code: Extract<ApiErrorCode, "device_replaced" | "account_expired" | "account_blocked" | "upgrade_required" | "unauthenticated">; message: string; details: Record<string, unknown> };

/** How long the server may take to start answering. React Native's fetch has no time limit of its own, so a stalled
 * mobile connection left a screen on its skeleton for ever. */
export const CALL_TIMEOUT_MS = 30_000;
/**
 * Once the answer has started, how long its body may take to arrive. A big answer (the
 * medicine library, a long section) on a slow but working connection used to run out of the
 * same 30 seconds and fail every time, retries included.
 */
export const BODY_TIMEOUT_MS = 60_000;

const SLOW_LINE = "The connection is too slow right now. Check your internet and try again.";

export function makeFetchTransport(f: typeof fetch = (...a) => fetch(...a), timeoutMs = CALL_TIMEOUT_MS, bodyMs = BODY_TIMEOUT_MS): Transport {
  return async (req) => {
    const ctrl = typeof AbortController === "function" ? new AbortController() : null;
    let timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
    try {
      let res: Response;
      try {
        res = await f(config.apiUrl + req.path, { method: req.method, headers: req.headers, body: req.body === undefined ? undefined : JSON.stringify(req.body), signal: ctrl?.signal });
      } catch {
        // `timeout` lets the online check tell "too slow" from "no internet".
        throw ctrl?.signal.aborted ? new ApiFailure("network", SLOW_LINE, 0, { timeout: true }) : new ApiFailure("network", "No internet. Check your connection and try again.");
      }
      // The server has answered: the body gets its own, longer, time.
      if (timer) clearTimeout(timer);
      timer = ctrl ? setTimeout(() => ctrl.abort(), bodyMs) : null;
      let json: unknown = null;
      try {
        json = res.status === 304 ? null : await res.json();
      } catch {
        if (ctrl?.signal.aborted) throw new ApiFailure("network", SLOW_LINE, 0, { timeout: true });
        json = null;
      }
      let etag: string | null = null;
      let date: string | null = null;
      try {
        etag = res.headers?.get?.("ETag") ?? null;
        date = res.headers?.get?.("Date") ?? null;
      } catch {
        etag = null;
      }
      return { status: res.status, json, etag, date };
    } finally {
      if (timer) clearTimeout(timer);
    }
  };
}

export const fetchTransport: Transport = makeFetchTransport();

/**
 * An answer that is not the contract's JSON (an HTML error page, an empty 405).
 * The phone did reach a server, so this never says "check your internet".
 * 404 and 405 mean the server has no such route yet: `not_found`, so the
 * screens' fallbacks and "Coming in the next update" states still work.
 */
export function notJson(status: number): ApiFailure {
  if (status === 404 || status === 405) return new ApiFailure("not_found", "This part is not on the server yet. Update the app, or try again later.", status);
  if (status >= 500) return new ApiFailure("server_error", "Something went wrong on our side. Try again in a minute.", status);
  if (status === 401 || status === 403) return new ApiFailure("forbidden", "The server refused this request. Sign out and in again, or ask us.", status);
  return new ApiFailure("bad_request", "The server gave an answer the app did not understand. If you are on public Wi-Fi, open its sign-in page first, then try again.", status);
}

export type CallOptions ={ body?: unknown; /** False for public routes. */ auth?: boolean; query?: Record<string, string | number | boolean | null | undefined> };

/** How many GET answers the client keeps with their ETag (most recent first out last). */
export const HELD_MAX = 200;

export function createClient(deps: { transport: Transport; tokens: TokenSource; onSessionEvent?: (e: SessionEvent) => void; version?: string; platform?: string }) {
  let refreshing: Promise<AuthTokens> | null = null;
  /**
   * How far the phone's clock is from the server's (server minus phone, ms), from the Date
   * header of each answer. A phone set hours ahead thought every new token had already run
   * out, so every call renewed the sign-in first; the renewals hit the limit and screens
   * showed "Could not load". Only large gaps count (the header has one-second steps).
   */
  let skew = 0;
  const serverNow = () => Date.now() + skew;
  const noteDate = (d: string | null | undefined) => {
    if (!d) return;
    const t = Date.parse(d);
    if (!Number.isFinite(t)) return;
    const gap = t - Date.now();
    skew = Math.abs(gap) > 60_000 ? gap : 0;
  };
  /**
   * The last answer of each GET address with its ETag (docs/app/API_CONTRACT.md
   * section 1). The next GET of that address sends If-None-Match; an unchanged
   * answer comes back as an empty 304 and the held copy is used, so a repeat
   * open costs a few hundred bytes instead of the whole answer. Kept in memory
   * only, for this sign-in (cleared on sign-out); never written to the phone.
   */
  const held = new Map<string, { etag: string; data: unknown }>();
  const hold = (key: string, etag: string, data: unknown) => {
    held.delete(key);
    held.set(key, { etag, data });
    if (held.size > HELD_MAX) {
      const oldest = held.keys().next().value;
      if (oldest !== undefined) held.delete(oldest);
    }
  };

  const baseHeaders = (): Record<string, string> => {
    const h: Record<string, string> = {
      Accept: "application/json",
      [APP_HEADERS.appVersion]: deps.version ?? config.appVersion,
      [APP_HEADERS.platform]: deps.platform ?? (Platform.OS === "ios" ? "ios" : "android"),
    };
    // Every call says which phone it is. /auth/refresh needs it too, and it is sent
    // without a bearer token: leaving it out made every renewal fail after the
    // first hour, so every screen showed "Could not load".
    let id = "";
    try {
      id = deps.tokens.deviceId();
    } catch {
      id = "";
    }
    if (id) h[APP_HEADERS.deviceId] = id;
    return h;
  };

  async function send<T>(method: Method, path: string, opts: CallOptions, token: string | null): Promise<T> {
    const headers = baseHeaders();
    if (opts.body !== undefined) headers["Content-Type"] = "application/json";
    if (token) headers[APP_HEADERS.authorization] = `Bearer ${token}`;
    const q = opts.query
      ? Object.entries(opts.query)
          .filter(([, v]) => v !== undefined && v !== null && v !== "")
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join("&")
      : "";
    const full = q ? `${path}?${q}` : path;
    const mine = method === "GET" ? held.get(full) : undefined;
    if (mine) headers["If-None-Match"] = mine.etag;
    let res = await deps.transport({ method, path: full, headers, body: opts.body });
    noteDate(res.date);
    if (res.status === 304) {
      // Unchanged: the copy we hold is the answer.
      if (mine) {
        hold(full, mine.etag, mine.data);
        return mine.data as T;
      }
      // A 304 for a copy we no longer hold: ask again without the header.
      delete headers["If-None-Match"];
      res = await deps.transport({ method, path: full, headers, body: opts.body });
    }
    const json = res.json as ApiResponse<T> | null;
    if (json && typeof json === "object" && "ok" in json) {
      if (json.ok) {
        if (method === "GET") {
          if (res.etag) hold(full, res.etag, json.data);
          else held.delete(full);
        }
        return json.data;
      }
      // An error answer without its error part (a proxy, an older server) is still a plain failure, never a TypeError.
      const err = (json as { error?: Partial<{ code: ApiErrorCode; message: string; details: Record<string, unknown> }> }).error;
      if (!err || typeof err.code !== "string") throw notJson(res.status);
      throw new ApiFailure(err.code, typeof err.message === "string" && err.message ? err.message : notJson(res.status).message, res.status, err.details && typeof err.details === "object" ? err.details : {});
    }
    throw notJson(res.status);
  }

  function refresh(): Promise<AuthTokens> {
    if (refreshing) return refreshing;
    const current = deps.tokens.get();
    if (!current) return Promise.reject(new ApiFailure("unauthenticated", "Sign in again.", 401));
    refreshing = send<RefreshResult>("POST", "/auth/refresh", { body: { refreshToken: current.refreshToken } }, null)
      .then(async (r) => {
        await deps.tokens.set(r.tokens);
        return r.tokens;
      })
      .catch((e: unknown) => {
        // No internet: keep the session and let the screen offer Try again.
        // A server without the renewal route (a broken deploy answering 404) is not a refused sign-in either.
        if (e instanceof ApiFailure && (e.code === "network" || e.code === "server_error" || e.code === "rate_limited" || e.code === "not_found")) throw e;
        // The session codes (phone replaced, account paused) pass through as they are.
        if (e instanceof ApiFailure && (e.code === "device_replaced" || e.code === "account_expired" || e.code === "account_blocked" || e.code === "upgrade_required")) throw e;
        // Anything else means the saved sign-in cannot be renewed: sign in again, never a stuck app.
        throw new ApiFailure("unauthenticated", "Please sign in again.", 401);
      })
      .finally(() => {
        refreshing = null;
      });
    return refreshing;
  }

  function report(e: unknown): void {
    if (!(e instanceof ApiFailure)) return;
    if (e.code === "device_replaced" || e.code === "account_expired" || e.code === "account_blocked" || e.code === "upgrade_required" || e.code === "unauthenticated") {
      deps.onSessionEvent?.({ code: e.code, message: e.message, details: e.details });
    }
  }

  async function call<T>(method: Method, path: string, opts: CallOptions = {}): Promise<T> {
    const auth = opts.auth !== false;
    try {
      let tokens = auth ? deps.tokens.get() : null;
      if (auth && !tokens) throw new ApiFailure("unauthenticated", "Sign in again.", 401);
      // Refresh a little early so a request does not fail just to learn the token ran out
      // (by the server's clock). When that early renewal cannot get through, the token may
      // still be good for a few seconds: try with it rather than fail at once.
      if (tokens && Date.parse(tokens.expiresAt) - serverNow() < 30_000) {
        try {
          tokens = await refresh();
        } catch (e) {
          const stillGood = Date.parse(tokens.expiresAt) - serverNow() > 0;
          if (!(stillGood && e instanceof ApiFailure && (e.code === "network" || e.code === "server_error" || e.code === "rate_limited"))) throw e;
        }
      }
      try {
        return await send<T>(method, path, opts, tokens?.accessToken ?? null);
      } catch (e) {
        if (auth && e instanceof ApiFailure && e.code === "token_expired") {
          const next = await refresh();
          return await send<T>(method, path, opts, next.accessToken);
        }
        throw e;
      }
    } catch (e) {
      // A failed public call (wrong password) is not a session event.
      if (auth || (e instanceof ApiFailure && e.code === "upgrade_required")) report(e);
      throw e;
    }
  }

  return {
    get: <T,>(path: string, opts?: Omit<CallOptions, "body">) => call<T>("GET", path, opts),
    post: <T,>(path: string, body?: unknown, opts?: Omit<CallOptions, "body">) => call<T>("POST", path, { ...opts, body: body ?? {} }),
    put: <T,>(path: string, body?: unknown, opts?: Omit<CallOptions, "body">) => call<T>("PUT", path, { ...opts, body: body ?? {} }),
    patch: <T,>(path: string, body?: unknown, opts?: Omit<CallOptions, "body">) => call<T>("PATCH", path, { ...opts, body: body ?? {} }),
    del: <T,>(path: string, opts?: Omit<CallOptions, "body">) => call<T>("DELETE", path, opts),
    /** Drop every held answer (sign-out: the next account never gets this one's copies). */
    forgetHeld: () => held.clear(),
    /** The server's time now, as best the client knows it (ms). */
    serverNow,
  };
}

export type ApiClient = ReturnType<typeof createClient>;
