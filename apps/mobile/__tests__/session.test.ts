import type { RawRequest, RawResponse } from "@/api/client";
import { mock, mockTransport } from "@/api/mock/server";
import { createSession } from "@/auth/session";
import { memoryStore } from "@/lib/storage";

function make(opts: { now?: () => number; transport?: (r: RawRequest) => Promise<RawResponse> } = {}) {
  let n = 0;
  const secure = memoryStore();
  const prefs = memoryStore();
  const signedOut = jest.fn();
  const s = createSession({ secure, prefs, transport: opts.transport ?? mockTransport, hash: async (t) => `h(${t})`, randomId: () => `id-${String(++n).padStart(16, "0")}`, now: opts.now, pinMaxTries: 5, lockAfterMs: 300_000, onSignedOut: signedOut });
  return { s, secure, prefs, signedOut };
}

beforeEach(() => mock.reset());

describe("session", () => {
  it("starts as a visitor and makes a device id once", async () => {
    const { s, secure } = make();
    await s.boot();
    expect(s.store.get().phase).toBe("visitor");
    const id = s.deviceId();
    expect(id).toMatch(/^[A-Za-z0-9._-]{16,80}$/);
    expect(await secure.get("vibha.device.v1")).toBe(id);
  });

  it("signs in once, asks for a PIN, then opens; a cold start asks for the PIN", async () => {
    const { s, secure, prefs } = make();
    await s.boot();
    await s.signIn("Ananya@Example.com ", "secret-password");
    expect(s.store.get().phase).toBe("setPin");
    expect(JSON.parse((await secure.get("vibha.tokens.v1"))!).accessToken).toBe("mock.student.access");
    await s.choosePin("2580");
    expect(s.store.get().phase).toBe("ready");

    // Same keystore, new start: locked.
    const s2 = createSession({ secure, prefs, transport: mockTransport, hash: async (t) => `h(${t})`, randomId: () => "x".repeat(16), pinMaxTries: 5, lockAfterMs: 300_000 });
    await s2.boot();
    expect(s2.store.get().phase).toBe("locked");
    expect(s2.store.get().me?.name).toBe("Ananya Mehta");
    expect(await s2.unlock("2580")).toBe(true);
    expect(s2.store.get().phase).toBe("ready");
  });

  it("shows the server's message for a wrong password", async () => {
    const { s } = make();
    await s.boot();
    await expect(s.signIn("a@b.co", "wrong")).rejects.toMatchObject({ code: "invalid_credentials" });
    expect(s.store.get().phase).toBe("visitor");
  });

  it("five wrong PINs sign the phone out and say why", async () => {
    const { s, secure, signedOut } = make();
    await s.boot();
    await s.signIn("a@b.co", "pw");
    await s.choosePin("2580");
    s.lock();
    await new Promise((r) => setTimeout(r, 0));
    expect(s.store.get().phase).toBe("locked");
    for (let i = 0; i < 4; i++) expect(await s.unlock("0000")).toBe(false);
    expect(s.store.get().triesLeft).toBe(1);
    expect(await s.unlock("0000")).toBe(false);
    expect(s.store.get()).toMatchObject({ phase: "visitor", notice: "pin_tries" });
    expect(await secure.get("vibha.tokens.v1")).toBeNull();
    expect(signedOut).toHaveBeenCalled();
  });

  it("locks after five minutes away, not after one", async () => {
    let t = 0;
    const { s } = make({ now: () => t });
    await s.boot();
    await s.signIn("a@b.co", "pw");
    await s.choosePin("2580");
    s.onBackground();
    t = 60_000;
    s.onForeground();
    await new Promise((r) => setTimeout(r, 0));
    expect(s.store.get().phase).toBe("ready");
    s.onBackground();
    t = 60_000 + 300_000;
    s.onForeground();
    await new Promise((r) => setTimeout(r, 0));
    expect(s.store.get().phase).toBe("locked");
  });

  it("'opened on another device' signs this phone out", async () => {
    const { s } = make();
    await s.boot();
    await s.signIn("a@b.co", "pw");
    await s.choosePin("2580");
    mock.replaceDevice();
    await expect(s.api.get("/me")).rejects.toMatchObject({ code: "device_replaced" });
    await new Promise((r) => setTimeout(r, 0));
    expect(s.store.get()).toMatchObject({ phase: "visitor", notice: "device_replaced" });
  });

  it("a paused account keeps its tokens and shows the paused screen", async () => {
    const { s, secure } = make();
    await s.boot();
    await s.signIn("a@b.co", "pw");
    await s.choosePin("2580");
    mock.setScenario("paused");
    await expect(s.api.get("/home")).rejects.toMatchObject({ code: "account_blocked" });
    expect(s.store.get().gate).toMatchObject({ kind: "paused" });
    expect(await secure.get("vibha.tokens.v1")).not.toBeNull();
  });

  it("an app that is too old gets the update screen", async () => {
    const { s } = make();
    await s.boot();
    mock.setScenario("update");
    await expect(s.api.get("/config", { auth: false })).rejects.toMatchObject({ code: "upgrade_required" });
    expect(s.store.get().gate).toMatchObject({ kind: "update", minVersion: "2.0.0" });
  });

  it("changes the PIN after the current one; wrong current PINs count like the lock's", async () => {
    const { s, signedOut } = make();
    await s.boot();
    await s.signIn("a@b.co", "pw");
    await s.choosePin("2580");
    expect(await s.checkPin("1397")).toEqual({ ok: false, triesLeft: 4 });
    expect(await s.checkPin("2580")).toEqual({ ok: true, triesLeft: 5 });
    await s.changePin("1397");
    s.lock();
    await new Promise((r) => setTimeout(r, 0));
    expect(await s.unlock("2580")).toBe(false);
    expect(await s.unlock("1397")).toBe(true);
    for (let i = 0; i < 5; i++) await s.checkPin("0000");
    expect(s.store.get().phase).toBe("visitor");
    expect(s.store.get().notice).toBe("pin_tries");
    expect(signedOut).toHaveBeenCalled();
  });

  it("the fingerprint or face check opens only a locked app", async () => {
    const { s } = make();
    await s.boot();
    s.openWithBiometric();
    expect(s.store.get().phase).toBe("visitor");
    await s.signIn("a@b.co", "pw");
    await s.choosePin("2580");
    s.lock();
    await new Promise((r) => setTimeout(r, 0));
    s.openWithBiometric();
    expect(s.store.get().phase).toBe("ready");
  });

  it("forgot PIN signs out so a new PIN can be chosen after the password", async () => {
    const { s } = make();
    await s.boot();
    await s.signIn("a@b.co", "pw");
    await s.choosePin("2580");
    await s.forgotPin();
    expect(s.store.get()).toMatchObject({ phase: "visitor", notice: "forgot_pin" });
  });
});
