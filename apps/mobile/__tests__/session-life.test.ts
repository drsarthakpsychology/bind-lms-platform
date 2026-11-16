/**
 * The whole life of a sign-in on one phone, against a scripted server:
 * cold start with tokens that ran out, renewal refused, phone replaced,
 * account ended, app too old, offline and back.
 */
import type { RawRequest, RawResponse } from "@/api/client";
import { ApiFailure } from "@/api/errors";
import { mock, mockTransport } from "@/api/mock/server";
import { createSession } from "@/auth/session";
import { memoryStore } from "@/lib/storage";

type Script = (req: RawRequest) => RawResponse | Promise<RawResponse> | null;
const fail = (status: number, code: string, message = "x", details?: Record<string, unknown>): RawResponse => ({ status, json: { ok: false, error: { code, message, details } } });
const ok = (data: unknown): RawResponse => ({ status: 200, json: { ok: true, data } });

function make(script: Script = () => null) {
  let n = 0;
  const secure = memoryStore();
  const prefs = memoryStore();
  const log: RawRequest[] = [];
  const transport = async (req: RawRequest) => {
    log.push(req);
    return (await script(req)) ?? mockTransport(req);
  };
  const s = createSession({ secure, prefs, transport, hash: async (t) => `h(${t})`, randomId: () => `id-${String(++n).padStart(16, "0")}`, pinMaxTries: 5, lockAfterMs: 300_000 });
  return { s, secure, prefs, log };
}

beforeEach(() => mock.reset());

async function signedIn(script?: Script) {
  const m = make(script);
  await m.s.boot();
  await m.s.signIn("ananya@example.com", "pw");
  await m.s.choosePin("2580");
  return m;
}

describe("a sign-in's life", () => {
  it("a cold start with tokens that ran out yesterday renews first, with the phone's id, then loads", async () => {
    const first = await signedIn();
    const saved = JSON.parse((await first.secure.get("vibha.tokens.v1"))!);
    await first.secure.set("vibha.tokens.v1", JSON.stringify({ ...saved, expiresAt: "2026-11-15T00:00:00.000Z" }));
    // The same keystore on the next start.
    const log: RawRequest[] = [];
    const s = createSession({ secure: first.secure, prefs: first.prefs, transport: async (r) => (log.push(r), mockTransport(r)), hash: async (t) => `h(${t})`, randomId: () => "id-0000000000000099", pinMaxTries: 5, lockAfterMs: 300_000 });
    await s.boot();
    expect(s.store.get().phase).toBe("locked");
    expect(await s.unlock("2580")).toBe(true);
    await s.api.get("/me");
    expect(log.map((r) => r.path)).toEqual(["/auth/refresh", "/me"]);
    expect(log[0]!.headers["X-App-Device-Id"]).toBe(first.s.deviceId());
  });

  it("a renewal the server refuses goes back to Sign in", async () => {
    let refuse = false;
    const { s } = await signedIn((r) => (refuse && r.path === "/me" ? fail(401, "token_expired") : refuse && r.path === "/auth/refresh" ? fail(401, "unauthenticated") : null));
    refuse = true;
    await expect(s.api.get("/me")).rejects.toBeInstanceOf(ApiFailure);
    await new Promise((r) => setTimeout(r, 0));
    expect(s.store.get().phase).toBe("visitor");
    expect(s.hasTokens()).toBe(false);
  });

  it("no internet keeps the sign-in; back online it works again", async () => {
    let offline = false;
    const { s } = await signedIn(() => (offline ? Promise.reject(new ApiFailure("network", "No internet.")) : null));
    offline = true;
    await expect(s.api.get("/home")).rejects.toMatchObject({ code: "network" });
    expect(s.store.get().phase).toBe("ready");
    offline = false;
    await expect(s.api.get("/home")).resolves.toBeTruthy();
  });

  it("the account ended: signed out with the reason", async () => {
    let ended = false;
    const { s } = await signedIn((r) => (ended && r.path === "/me" ? fail(403, "account_expired", "Your access has ended.") : null));
    ended = true;
    await s.api.get("/me").catch(() => undefined);
    await new Promise((r) => setTimeout(r, 0));
    expect(s.store.get()).toMatchObject({ phase: "visitor", notice: "account_expired" });
  });

  it("too old: the update screen, with where to get it", async () => {
    const { s } = await signedIn((r) => (r.path === "/home" ? fail(426, "upgrade_required", "Update", { minVersion: "2.0.0", storeUrl: "https://play.google.com/x" }) : null));
    await s.api.get("/home").catch(() => undefined);
    expect(s.store.get().gate).toEqual({ kind: "update", minVersion: "2.0.0", storeUrl: "https://play.google.com/x" });
  });

  it("a call made while the keystore is still being read never signs the account out", async () => {
    const m = make();
    await m.s.boot();
    await m.s.signIn("ananya@example.com", "pw");
    await m.s.choosePin("2580");
    const s2 = createSession({ secure: m.secure, prefs: m.prefs, transport: mockTransport, hash: async (t) => `h(${t})`, randomId: () => "id-0000000000000098", pinMaxTries: 5, lockAfterMs: 300_000 });
    // Before boot(): no tokens in memory yet.
    await s2.api.get("/home").catch(() => undefined);
    await new Promise((r) => setTimeout(r, 0));
    await s2.boot();
    expect(s2.store.get().phase).toBe("locked");
    expect(await m.secure.get("vibha.tokens.v1")).toBeTruthy();
  });

  it("a sign-in answer without tokens is refused in plain words, not saved", async () => {
    const { s, secure } = (() => {
      const m = make((r) => (r.path === "/auth/sign-in" ? ok({ me: null }) : null));
      return m;
    })();
    await s.boot();
    await expect(s.signIn("ananya@example.com", "pw")).rejects.toMatchObject({ code: "server_error" });
    expect(await secure.get("vibha.tokens.v1")).toBeNull();
    expect(s.store.get().phase).toBe("visitor");
  });

  it("an error answer without its error part is a plain failure, not a crash", async () => {
    const { s } = await signedIn((r) => (r.path === "/home" ? { status: 500, json: { ok: false } } : null));
    await expect(s.api.get("/home")).rejects.toBeInstanceOf(ApiFailure);
  });
});
