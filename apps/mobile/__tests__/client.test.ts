import { createClient, type RawRequest, type RawResponse } from "@/api/client";
import type { AuthTokens } from "@/api/contract";
import { ApiFailure } from "@/api/errors";

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
  it("renewal sends the phone's id (the live server refuses it without one)", async () => {
    let tokens: AuthTokens = { accessToken: "old", refreshToken: "R1", expiresIn: 3600, expiresAt: new Date(Date.now() + 5_000).toISOString() };
    const seen: RawRequest[] = [];
    const transport = async (r: RawRequest): Promise<RawResponse> => {
      seen.push(r);
      if (r.path === "/auth/refresh") {
        if (!r.headers["X-App-Device-Id"]) return { status: 400, json: { ok: false, error: { code: "device_required", message: "This request is missing the device id." } } };
        return { status: 200, json: { ok: true, data: { tokens: { accessToken: "new", refreshToken: "R2", expiresIn: 3600, expiresAt: later() } } } };
      }
      return { status: 200, json: { ok: true, data: "fine" } };
    };
    const api = createClient({ transport, tokens: { get: () => tokens, set: (t) => void (tokens = t), deviceId: () => "d".repeat(16) } });
    await expect(api.get("/home")).resolves.toBe("fine");
    expect(seen[0]!.path).toBe("/auth/refresh");
    expect(seen[0]!.headers["X-App-Device-Id"]).toBe("d".repeat(16));
  });

  it("a renewal the server refuses signs out instead of leaving every screen failing", async () => {
    const onSessionEvent = jest.fn();
    const transport = async (r: RawRequest): Promise<RawResponse> =>
      r.path === "/auth/refresh" ? { status: 401, json: { ok: false, error: { code: "bad_request", message: "no" } } } : { status: 200, json: { ok: true, data: "fine" } };
    const api = createClient({ transport, tokens: { get: () => ({ accessToken: "A", refreshToken: "R", expiresIn: 1, expiresAt: new Date(Date.now() - 1000).toISOString() }), set: () => undefined, deviceId: () => "d".repeat(16) }, onSessionEvent });
    await expect(api.get("/home")).rejects.toMatchObject({ code: "unauthenticated" });
    expect(onSessionEvent).toHaveBeenCalledWith(expect.objectContaining({ code: "unauthenticated" }));
  });

  it("no internet during renewal keeps the session", async () => {
    const onSessionEvent = jest.fn();
    const transport = async (): Promise<RawResponse> => {
      throw new ApiFailure("network", "No internet.");
    };
    const api = createClient({ transport, tokens: { get: () => ({ accessToken: "A", refreshToken: "R", expiresIn: 1, expiresAt: new Date(Date.now() - 1000).toISOString() }), set: () => undefined, deviceId: () => "d".repeat(16) }, onSessionEvent });
    await expect(api.get("/home")).rejects.toMatchObject({ code: "network" });
    expect(onSessionEvent).not.toHaveBeenCalled();
  });
});
