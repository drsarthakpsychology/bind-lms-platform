import { createClient, type RawRequest, type RawResponse } from "@/api/client";
import type { AuthTokens } from "@/api/contract";

const later = () => new Date(Date.now() + 3600_000).toISOString();

describe("API client", () => {
  it("sends the bearer token, device id, version and platform", async () => {
    const seen: RawRequest[] = [];
    const api = createClient({
      transport: async (r) => {
        seen.push(r);
        return { status: 200, json: { ok: true, data: { hi: 1 } } };
      },
      tokens: { get: () => ({ accessToken: "A", refreshToken: "R", expiresIn: 3600, expiresAt: later() }), set: () => undefined, deviceId: () => "device-0000000000001" },
      version: "1.2.3",
      platform: "android",
    });
    await expect(api.get("/me", { query: { limit: 5, empty: "" } })).resolves.toEqual({ hi: 1 });
    expect(seen[0]!.path).toBe("/me?limit=5");
    expect(seen[0]!.headers).toMatchObject({ Authorization: "Bearer A", "X-App-Device-Id": "device-0000000000001", "X-App-Version": "1.2.3", "X-App-Platform": "android" });
  });

  it("refreshes once on token_expired and repeats the request", async () => {
    let tokens: AuthTokens = { accessToken: "old", refreshToken: "R1", expiresIn: 3600, expiresAt: later() };
    const calls: string[] = [];
    const transport = async (r: RawRequest): Promise<RawResponse> => {
      calls.push(`${r.path} ${r.headers.Authorization ?? "-"}`);
      if (r.path === "/auth/refresh") return { status: 200, json: { ok: true, data: { tokens: { accessToken: "new", refreshToken: "R2", expiresIn: 3600, expiresAt: later() } } } };
      if (r.headers.Authorization === "Bearer old") return { status: 401, json: { ok: false, error: { code: "token_expired", message: "expired" } } };
      return { status: 200, json: { ok: true, data: "fine" } };
    };
    const api = createClient({ transport, tokens: { get: () => tokens, set: (t) => void (tokens = t), deviceId: () => "d".repeat(16) } });
    await expect(api.get("/home")).resolves.toBe("fine");
    expect(calls).toEqual(["/home Bearer old", "/auth/refresh -", "/home Bearer new"]);
    expect(tokens.refreshToken).toBe("R2");
  });

  it("reports session-ending codes to the session", async () => {
    const onSessionEvent = jest.fn();
    const api = createClient({
      transport: async () => ({ status: 401, json: { ok: false, error: { code: "device_replaced", message: "Signed out: opened on another device." } } }),
      tokens: { get: () => ({ accessToken: "A", refreshToken: "R", expiresIn: 1, expiresAt: later() }), set: () => undefined, deviceId: () => "d".repeat(16) },
      onSessionEvent,
    });
    await expect(api.get("/me")).rejects.toMatchObject({ code: "device_replaced", status: 401 });
    expect(onSessionEvent).toHaveBeenCalledWith(expect.objectContaining({ code: "device_replaced" }));
  });

  it("does not treat a wrong password on a public route as a session event", async () => {
    const onSessionEvent = jest.fn();
    const api = createClient({ transport: async () => ({ status: 401, json: { ok: false, error: { code: "unauthenticated", message: "no" } } }), tokens: { get: () => null, set: () => undefined, deviceId: () => "d".repeat(16) }, onSessionEvent });
    await expect(api.post("/auth/sign-in", {}, { auth: false })).rejects.toBeTruthy();
    expect(onSessionEvent).not.toHaveBeenCalled();
  });

  it("turns an answer it does not understand into a plain error", async () => {
    const api = createClient({ transport: async () => ({ status: 502, json: null }), tokens: { get: () => null, set: () => undefined, deviceId: () => "d".repeat(16) } });
    await expect(api.get("/config", { auth: false })).rejects.toMatchObject({ code: "server_error" });
  });
});
