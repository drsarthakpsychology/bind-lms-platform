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
export type RawResponse = { status: number; json: unknown };
export type Transport = (req: RawRequest) => Promise<RawResponse>;

export type TokenSource = {
  get: () => AuthTokens | null;
  set: (tokens: AuthTokens) => Promise<void> | void;
  deviceId: () => string;
};

/** Codes that end or pause the session; the session store listens for them. */
export type SessionEvent = { code: Extract<ApiErrorCode, "device_replaced" | "account_expired" | "account_blocked" | "upgrade_required" | "unauthenticated">; message: string; details: Record<string, unknown> };

/** How long one call may take. React Native's fetch has no time limit of its own, so a stalled
 * mobile connection left a screen on its skeleton for ever. */
export const CALL_TIMEOUT_MS = 30_000;

export function makeFetchTransport(f: typeof fetch = (...a) => fetch(...a), timeoutMs = CALL_TIMEOUT_MS): Transport {
  return async (req) => {
    const ctrl = typeof AbortController === "function" ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
    try {
      let res: Response;
      try {
        res = await f(config.apiUrl + req.path, { method: req.method, headers: req.headers, body: req.body === undefined ? undefined : JSON.stringify(req.body), signal: ctrl?.signal });
      } catch {
        throw new ApiFailure("network", ctrl?.signal.aborted ? "The connection is too slow right now. Check your internet and try again." : "No internet. Check your connection and try again.");
      }
      let json: unknown = null;
      try {
        json = await res.json();
      } catch {
        if (ctrl?.signal.aborted) throw new ApiFailure("network", "The connection is too slow right now. Check your internet and try again.");
        json = null;
      }
      return { status: res.status, json };
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

export function createClient(deps: { transport: Transport; tokens: TokenSource; onSessionEvent?: (e: SessionEvent) => void; version?: string; platform?: string }) {
  let refreshing: Promise<AuthTokens> | null = null;

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
    const res = await deps.transport({ method, path: q ? `${path}?${q}` : path, headers, body: opts.body });
    const json = res.json as ApiResponse<T> | null;
    if (json && typeof json === "object" && "ok" in json) {
      if (json.ok) return json.data;
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
      // Refresh a little early so a request does not fail just to learn the token ran out.
      if (tokens && Date.parse(tokens.expiresAt) - Date.now() < 30_000) tokens = await refresh();
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
  };
}

export type ApiClient = ReturnType<typeof createClient>;
