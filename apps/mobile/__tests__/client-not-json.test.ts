import { createClient, type RawResponse } from "@/api/client";
import { ApiFailure } from "@/api/errors";

const later = () => new Date(Date.now() + 3600_000).toISOString();
const tokens = { get: () => ({ accessToken: "A", refreshToken: "R1234567890", expiresIn: 3600, expiresAt: later() }), set: () => undefined, deviceId: () => "d".repeat(16) };

async function failure(res: RawResponse): Promise<ApiFailure> {
  const onSessionEvent = jest.fn();
  const api = createClient({ transport: async () => res, tokens, onSessionEvent });
  try {
    await api.get("/study");
  } catch (e) {
    expect(onSessionEvent).not.toHaveBeenCalled();
    return e as ApiFailure;
  }
  throw new Error("expected a failure");
}

describe("API client: answers that are not JSON", () => {
  it("an HTML 404 page is not_found with a clear line, never 'check your internet'", async () => {
    const e = await failure({ status: 404, json: null });
    expect(e).toBeInstanceOf(ApiFailure);
    expect(e.code).toBe("not_found");
    expect(e.message).toMatch(/not on the server yet/);
    expect(e.message).not.toMatch(/internet/i);
  });

  it("an empty 405 (route without that method) is not_found too", async () => {
    expect((await failure({ status: 405, json: null })).code).toBe("not_found");
  });

  it("an HTML 5xx page is server_error", async () => {
    const e = await failure({ status: 502, json: null });
    expect(e.code).toBe("server_error");
    expect(e.message).not.toMatch(/internet/i);
  });

  it("a 200 that is not JSON (public Wi-Fi sign-in page) says what to do", async () => {
    const e = await failure({ status: 200, json: null });
    expect(e.code).toBe("bad_request");
    expect(e.message).toMatch(/Wi-Fi/);
  });

  it("JSON that is not the contract's shape is treated the same", async () => {
    expect((await failure({ status: 404, json: { message: "Not Found" } })).code).toBe("not_found");
  });

  it("a renewal that hits a missing route keeps the session (no sign-out)", async () => {
    const onSessionEvent = jest.fn();
    let n = 0;
    const api = createClient({
      transport: async (r) => {
        n++;
        if (r.path === "/auth/refresh") return { status: 404, json: null };
        return { status: 401, json: { ok: false, error: { code: "token_expired", message: "expired" } } };
      },
      tokens,
      onSessionEvent,
    });
    await expect(api.get("/home")).rejects.toMatchObject({ code: "not_found" });
    expect(n).toBe(2);
    expect(onSessionEvent).not.toHaveBeenCalled();
  });
});
