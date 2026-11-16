import { createClient, makeFetchTransport, type RawRequest, type RawResponse } from "@/api/client";

const later = () => new Date(Date.now() + 3600_000).toISOString();
const tokens = { get: () => ({ accessToken: "A", refreshToken: "R", expiresIn: 3600, expiresAt: later() }), set: () => undefined, deviceId: () => "d".repeat(16) };

describe("ETag and 304", () => {
  it("sends the held ETag back and uses the held copy on 304", async () => {
    const seen: RawRequest[] = [];
    let n = 0;
    const transport = async (r: RawRequest): Promise<RawResponse> => {
      seen.push(r);
      n += 1;
      if (r.headers["If-None-Match"] === '"v1"') return { status: 304, json: null, etag: '"v1"' };
      return { status: 200, json: { ok: true, data: { n } }, etag: '"v1"' };
    };
    const api = createClient({ transport, tokens });
    await expect(api.get("/home")).resolves.toEqual({ n: 1 });
    expect(seen[0]!.headers["If-None-Match"]).toBeUndefined();
    await expect(api.get("/home")).resolves.toEqual({ n: 1 });
    expect(seen[1]!.headers["If-None-Match"]).toBe('"v1"');
    // Another address has its own copy; a POST never sends the header.
    await api.get("/home", { query: { limit: 5 } });
    expect(seen[2]!.headers["If-None-Match"]).toBeUndefined();
    await api.post("/home", {});
    expect(seen[3]!.headers["If-None-Match"]).toBeUndefined();
    // Signed out: nothing is held any more.
    api.forgetHeld();
    await api.get("/home");
    expect(seen[4]!.headers["If-None-Match"]).toBeUndefined();
  });

  it("asks again in full when a 304 comes for a copy it does not hold", async () => {
    const seen: RawRequest[] = [];
    const transport = async (r: RawRequest): Promise<RawResponse> => {
      seen.push(r);
      return seen.length === 1 ? { status: 304, json: null } : { status: 200, json: { ok: true, data: "full" } };
    };
    const api = createClient({ transport, tokens });
    await expect(api.get("/x")).resolves.toBe("full");
    expect(seen).toHaveLength(2);
  });

  it("an answer without an ETag drops the held copy", async () => {
    const seen: RawRequest[] = [];
    const transport = async (r: RawRequest): Promise<RawResponse> => {
      seen.push(r);
      return seen.length === 1 ? { status: 200, json: { ok: true, data: 1 }, etag: '"a"' } : { status: 200, json: { ok: true, data: 2 } };
    };
    const api = createClient({ transport, tokens });
    await api.get("/x");
    await api.get("/x");
    await api.get("/x");
    expect(seen.map((r) => r.headers["If-None-Match"] ?? "-")).toEqual(["-", '"a"', "-"]);
  });

  it("the fetch transport reads the ETag header and survives an empty 304", async () => {
    const f = (async () => ({ status: 304, headers: { get: (k: string) => (k === "ETag" ? '"e"' : null) }, json: async () => { throw new Error("empty"); } })) as unknown as typeof fetch;
    await expect(makeFetchTransport(f)({ method: "GET", path: "/x", headers: {} })).resolves.toEqual({ status: 304, json: null, etag: '"e"' });
  });
});
