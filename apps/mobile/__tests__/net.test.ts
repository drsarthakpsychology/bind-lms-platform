import { onlineManager } from "@tanstack/react-query";

import { createClient, makeFetchTransport, type RawRequest, type RawResponse } from "@/api/client";
import type { AuthTokens } from "@/api/contract";
import { ApiFailure } from "@/api/errors";
import { configureOnline, isSlow, netStore, noteUnreached, probeDelay, resetOnline, watchTransport } from "@/api/online";

const flush = () => new Promise((r) => setTimeout(r, 0));
const unreached = () => new ApiFailure("network", "No internet.");

afterEach(() => resetOnline());

describe("online state", () => {
  it("one failed call is not offline when the server still answers the check", async () => {
    const probe = jest.fn(async () => ({}));
    configureOnline({ probe, onBack: () => undefined });
    noteUnreached();
    await flush();
    expect(probe).toHaveBeenCalledTimes(1);
    expect(netStore.get().offline).toBe(false);
  });

  it("offline only when the check cannot reach the server either", async () => {
    configureOnline({ probe: async () => Promise.reject(unreached()), onBack: () => undefined });
    noteUnreached();
    await flush();
    expect(netStore.get().offline).toBe(true);
    // React Query follows: its retries and queued writes wait.
    expect(onlineManager.isOnline()).toBe(false);
  });

  it("a server error from the check is still online (the phone reached us)", async () => {
    configureOnline({ probe: async () => Promise.reject(new ApiFailure("server_error", "x", 500)), onBack: () => undefined });
    noteUnreached();
    await flush();
    expect(netStore.get().offline).toBe(false);
  });

  it("any answer through the transport ends offline and runs the back-online step", async () => {
    const onBack = jest.fn();
    configureOnline({ probe: async () => Promise.reject(unreached()), onBack });
    noteUnreached();
    await flush();
    expect(netStore.get().offline).toBe(true);
    const t = watchTransport(async () => ({ status: 200, json: { ok: true, data: 1 } }));
    await t({ method: "GET", path: "/home", headers: {} });
    expect(netStore.get().offline).toBe(false);
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onlineManager.isOnline()).toBe(true);
  });

  it("a timeout marks the connection slow for a while", async () => {
    configureOnline({ probe: async () => ({}), onBack: () => undefined });
    const t = watchTransport(async () => Promise.reject(new ApiFailure("network", "slow", 0, { timeout: true })));
    await expect(t({ method: "GET", path: "/x", headers: {} })).rejects.toBeTruthy();
    await flush();
    expect(isSlow()).toBe(true);
    expect(netStore.get().offline).toBe(false);
  });

  it("checks less often the longer the phone stays offline", () => {
    expect([probeDelay(0), probeDelay(1), probeDelay(2), probeDelay(9)]).toEqual([15_000, 30_000, 60_000, 60_000]);
  });
});

describe("fetch transport", () => {
  it("says a stalled call ran out of time (not 'no internet')", async () => {
    const f = ((_u: string, init: { signal: AbortSignal }) =>
      new Promise((_r, reject) => {
        init.signal.addEventListener("abort", () => reject(new Error("aborted")));
      })) as unknown as typeof fetch;
    const t = makeFetchTransport(f, 10, 10);
    await expect(t({ method: "GET", path: "/x", headers: {} })).rejects.toMatchObject({ code: "network", details: { timeout: true } });
  });

  it("gives a slow body its own time once the server has answered", async () => {
    const f = (async () => ({ status: 200, headers: { get: () => null }, json: () => new Promise((r) => setTimeout(() => r({ ok: true, data: 7 }), 30)) })) as unknown as typeof fetch;
    // 20ms for the server to start, 200ms for the body: a 30ms body arrives.
    const t = makeFetchTransport(f, 20, 200);
    await expect(t({ method: "GET", path: "/x", headers: {} })).resolves.toMatchObject({ status: 200, json: { ok: true, data: 7 } });
  });
});

describe("token renewal and the phone's clock", () => {
  const HOUR = 3600_000;

  it("a phone clock set hours ahead does not renew the sign-in before every call", async () => {
    const real = Date.now;
    const serverTime = real();
    // The phone thinks it is three hours later than it is.
    Date.now = () => real() + 3 * HOUR;
    try {
      const tokens: AuthTokens = { accessToken: "A", refreshToken: "R", expiresIn: 3600, expiresAt: new Date(serverTime + HOUR).toISOString() };
      const calls: string[] = [];
      const transport = async (r: RawRequest): Promise<RawResponse> => {
        calls.push(r.path);
        if (r.path === "/auth/refresh") return { status: 200, json: { ok: true, data: { tokens } }, date: new Date(serverTime).toUTCString() };
        return { status: 200, json: { ok: true, data: 1 }, date: new Date(serverTime).toUTCString() };
      };
      const api = createClient({ transport, tokens: { get: () => tokens, set: () => undefined, deviceId: () => "d".repeat(16) } });
      // The first call learns the server's time (one renewal, as before, since the gap is not known yet).
      await api.get("/config", { auth: false });
      await api.get("/home");
      await api.get("/courses");
      expect(calls.filter((c) => c === "/auth/refresh")).toHaveLength(0);
    } finally {
      Date.now = real;
    }
  });

  it("when the early renewal cannot get through, a token that is still good is used", async () => {
    const tokens: AuthTokens = { accessToken: "A", refreshToken: "R", expiresIn: 3600, expiresAt: new Date(Date.now() + 10_000).toISOString() };
    const transport = async (r: RawRequest): Promise<RawResponse> => {
      if (r.path === "/auth/refresh") throw new ApiFailure("network", "No internet.");
      return { status: 200, json: { ok: true, data: r.headers.Authorization } };
    };
    const api = createClient({ transport, tokens: { get: () => tokens, set: () => undefined, deviceId: () => "d".repeat(16) } });
    await expect(api.get("/home")).resolves.toBe("Bearer A");
  });
});
