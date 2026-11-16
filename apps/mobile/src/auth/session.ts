import { createClient, type ApiClient, type SessionEvent, type Transport } from "@/api/client";
import type { AuthTokens, DeviceInfo, Me, SignInResult, SignOutResult } from "@/api/contract";
import { meView } from "@/api/adapt";
import { ApiFailure } from "@/api/errors";
import { createStore } from "@/lib/store";
import type { KeyValue } from "@/lib/storage";
import { createPinVault, shouldLock, type Hasher } from "./pin";

/**
 * The session: who is signed in, and whether the app is open or locked.
 *
 *   loading  reading the keystore at start
 *   visitor  nobody signed in
 *   setPin   just signed in with email and password; must choose a PIN
 *   locked   signed in, PIN needed (every cold start, and after 5 minutes away)
 *   ready    open
 *
 * Tokens and the device id live in the keystore. The PIN is local to the
 * phone (see pin.ts). Five wrong PINs, "opened on another device", or an
 * ended account sign the phone out and say why on the next screen.
 */

export type Phase = "loading" | "visitor" | "setPin" | "locked" | "ready";
export type Notice = null | "device_replaced" | "account_expired" | "pin_tries" | "forgot_pin";
export type Gate = null | { kind: "update"; minVersion: string | null; storeUrl: string | null } | { kind: "paused"; message: string };

export type SessionState = { phase: Phase; me: Me | null; notice: Notice; gate: Gate; triesLeft: number };

const K = { tokens: "vibha.tokens.v1", device: "vibha.device.v1", me: "vibha.me.v1" } as const;

export type SessionDeps = {
  secure: KeyValue;
  /** Not secret: a copy of /me so the app can open without waiting for the network. */
  prefs: KeyValue;
  transport: Transport;
  hash: Hasher;
  /** A random id: letters, digits, dash. At least 16 characters. */
  randomId: () => string;
  now?: () => number;
  device?: () => Omit<DeviceInfo, "id">;
  pinMaxTries: number;
  lockAfterMs: number;
  /** Called after any sign-out so caches can be cleared. */
  onSignedOut?: () => void;
  /** Called before a sign-out the person chose, while the tokens still work: send what is waiting. */
  beforeSignOut?: () => Promise<void>;
};

export function createSession(deps: SessionDeps) {
  const now = deps.now ?? Date.now;
  const store = createStore<SessionState>({ phase: "loading", me: null, notice: null, gate: null, triesLeft: deps.pinMaxTries });
  const pin = createPinVault({ store: deps.secure, hash: deps.hash, randomSalt: deps.randomId, maxTries: deps.pinMaxTries });
  let tokens: AuthTokens | null = null;
  let deviceId = "";
  let backgroundedAt: number | null = null;
  let lockAfterMs = deps.lockAfterMs;

  async function clearLocal(): Promise<void> {
    tokens = null;
    await Promise.all([deps.secure.remove(K.tokens), deps.prefs.remove(K.me), pin.clear()]).catch(() => undefined);
    deps.onSignedOut?.();
  }

  async function endSession(notice: Notice): Promise<void> {
    await clearLocal();
    store.set({ phase: "visitor", me: null, notice, triesLeft: deps.pinMaxTries });
  }

  function onSessionEvent(e: SessionEvent): void {
    switch (e.code) {
      case "device_replaced":
        void endSession("device_replaced");
        break;
      case "account_expired":
        void endSession("account_expired");
        break;
      case "unauthenticated":
        // The refresh token is gone or was revoked: back to sign-in, quietly. Not while the
        // keystore is still being read at start: a call made then has no tokens yet, and must
        // never sign out the account that is about to be loaded.
        if (store.get().phase !== "visitor" && store.get().phase !== "loading") void endSession(null);
        break;
      case "account_blocked":
        store.set({ gate: { kind: "paused", message: e.message } });
        break;
      case "upgrade_required":
        store.set({ gate: { kind: "update", minVersion: typeof e.details.minVersion === "string" ? e.details.minVersion : null, storeUrl: typeof e.details.storeUrl === "string" ? e.details.storeUrl : null } });
        break;
    }
  }

  const api: ApiClient = createClient({
    transport: deps.transport,
    onSessionEvent,
    tokens: {
      get: () => tokens,
      set: async (t) => {
        tokens = t;
        await deps.secure.set(K.tokens, JSON.stringify(t));
      },
      deviceId: () => deviceId,
    },
  });

  async function setMe(raw: Me): Promise<void> {
    const me = meView(raw);
    store.set({ me });
    await deps.prefs.set(K.me, JSON.stringify(me)).catch(() => undefined);
  }

  return {
    store,
    api,
    pin,
    deviceId: () => deviceId,
    hasTokens: () => tokens !== null,
    /** Headers for a file the app fetches itself (materials, uploads): the bearer token and the device id. Refreshes first if the token is about to run out. */
    async authHeaders(): Promise<Record<string, string>> {
      if (tokens && Date.parse(tokens.expiresAt) - now() < 60_000) await api.get("/me").catch(() => undefined);
      return tokens ? { Authorization: `Bearer ${tokens.accessToken}`, "X-App-Device-Id": deviceId } : {};
    },
    /** Let /config change the lock time without a release. */
    setLockAfter(ms: number) {
      if (ms > 0) lockAfterMs = ms;
    },

    /** Read the keystore and decide the first screen. */
    async boot(): Promise<void> {
      let id = await deps.secure.get(K.device).catch(() => null);
      if (!id || !/^[A-Za-z0-9._-]{16,80}$/.test(id)) {
        id = deps.randomId();
        await deps.secure.set(K.device, id).catch(() => undefined);
      }
      deviceId = id;
      const raw = await deps.secure.get(K.tokens).catch(() => null);
      if (!raw) {
        store.set({ phase: "visitor" });
        return;
      }
      try {
        tokens = JSON.parse(raw) as AuthTokens;
      } catch {
        tokens = null;
      }
      if (!tokens?.refreshToken) {
        await clearLocal();
        store.set({ phase: "visitor" });
        return;
      }
      let me: Me | null = null;
      try {
        const cached = await deps.prefs.get(K.me);
        me = cached ? meView(JSON.parse(cached)) : null;
      } catch {
        me = null;
      }
      const hasPin = await pin.has();
      store.set({ phase: hasPin ? "locked" : "setPin", me, triesLeft: hasPin ? await pin.triesLeft() : deps.pinMaxTries });
    },

    /** Email and password, once. Then the PIN takes over. Throws ApiFailure with the server's message. */
    async signIn(email: string, password: string): Promise<void> {
      const device: DeviceInfo = { id: deviceId, ...(deps.device?.() ?? { name: "Phone", platform: "android" }) };
      const r = await api.post<SignInResult>("/auth/sign-in", { email: email.trim().toLowerCase(), password, device }, { auth: false });
      if (!r?.tokens?.accessToken || !r.tokens.refreshToken || !r.me) throw new ApiFailure("server_error", "The server gave an answer the app did not understand. Try again.");
      tokens = r.tokens;
      await deps.secure.set(K.tokens, JSON.stringify(r.tokens));
      await pin.clear();
      await setMe(r.me);
      store.set({ phase: "setPin", notice: null, gate: null, triesLeft: deps.pinMaxTries });
    },

    async choosePin(value: string): Promise<void> {
      await pin.set(value);
      store.set({ phase: "ready", triesLeft: deps.pinMaxTries });
    },

    /** True when the PIN opened the app. The fifth wrong try signs out. */
    async unlock(value: string): Promise<boolean> {
      const r = await pin.verify(value);
      if (r.ok) {
        backgroundedAt = null;
        store.set({ phase: "ready", triesLeft: deps.pinMaxTries });
        return true;
      }
      if (r.lockedOut) {
        await this.signOut("pin_tries");
        return false;
      }
      store.set({ triesLeft: r.triesLeft });
      return false;
    },

    /**
     * Settings > Change PIN, step one: is this the current PIN? A wrong one
     * counts like a wrong try on the lock screen; the fifth signs out.
     */
    async checkPin(value: string): Promise<{ ok: boolean; triesLeft: number }> {
      const r = await pin.verify(value);
      if (r.ok) {
        store.set({ triesLeft: deps.pinMaxTries });
        return { ok: true, triesLeft: deps.pinMaxTries };
      }
      if (r.lockedOut) {
        await this.signOut("pin_tries");
        return { ok: false, triesLeft: 0 };
      }
      store.set({ triesLeft: r.triesLeft });
      return { ok: false, triesLeft: r.triesLeft };
    },

    /** Settings > Change PIN, last step (after checkPin said yes). */
    async changePin(value: string): Promise<void> {
      await pin.set(value);
      store.set({ triesLeft: deps.pinMaxTries });
    },

    /** The phone's fingerprint or face check matched on the lock screen: open, like a right PIN. */
    openWithBiometric(): void {
      if (store.get().phase !== "locked") return;
      backgroundedAt = null;
      store.set({ phase: "ready" });
    },

    /** Forgot the PIN: sign out; signing in with the password again lets them choose a new one. */
    async forgotPin(): Promise<void> {
      await this.signOut("forgot_pin");
    },

    async signOut(notice: Notice = null): Promise<void> {
      // Signing out by choice (or to choose a new PIN): send the saves still on the phone first,
      // for a few seconds at most, or that watch time and progress would be thrown away.
      if (tokens && (notice === null || notice === "forgot_pin") && deps.beforeSignOut) {
        await Promise.race([deps.beforeSignOut().catch(() => undefined), new Promise((r) => setTimeout(r, 5000))]);
      }
      if (tokens) {
        // Tell the server, but never let a failure keep the phone signed in.
        await api.post<SignOutResult>("/auth/sign-out").catch(() => undefined);
      }
      await endSession(notice);
    },

    async refreshMe(): Promise<Me | null> {
      try {
        const me = await api.get<Me>("/me");
        await setMe(me);
        if (store.get().gate?.kind === "paused") store.set({ gate: null });
        return me;
      } catch (e) {
        if (e instanceof ApiFailure && e.code === "network") return store.get().me;
        return store.get().me;
      }
    },

    /** Save a fresh copy of /me (the Me query calls this). */
    setMe,
    /** Lock now (the lock screen shows; used by the dev screenshots and tests). */
    lock() {
      if (store.get().phase === "ready") void pin.triesLeft().then((triesLeft) => store.set({ phase: "locked", triesLeft }));
    },

    clearNotice() {
      store.set({ notice: null });
    },
    clearGate() {
      store.set({ gate: null });
    },

    /** The app went to the background. */
    onBackground() {
      if (backgroundedAt === null) backgroundedAt = now();
    },
    /** The app came back. Locks if it was away for 5 minutes or more. */
    onForeground() {
      const away = backgroundedAt;
      backgroundedAt = null;
      if (store.get().phase === "ready" && shouldLock(away, now(), lockAfterMs)) {
        void pin.triesLeft().then((triesLeft) => store.set({ phase: "locked", triesLeft }));
      }
    },
  };
}

export type Session = ReturnType<typeof createSession>;
