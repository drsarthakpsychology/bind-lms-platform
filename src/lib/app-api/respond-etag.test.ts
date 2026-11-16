import { describe, expect, it } from "vitest";
import { okTagged } from "./respond";

const req = (etag?: string) => new Request("http://test.local/api/app/v1/home", { headers: etag ? { "if-none-match": etag } : {} });

describe("GET answers carry an ETag", () => {
  it("answers the body with an ETag, kept private and unstored", async () => {
    const res = okTagged(req(), { a: 1 });
    expect(res.status).toBe(200);
    expect(res.headers.get("etag")).toMatch(/^W\/".+"$/);
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(await res.json()).toEqual({ ok: true, data: { a: 1 } });
  });

  it("answers an empty 304 when the app already has this copy", async () => {
    const tag = okTagged(req(), { a: 1 }).headers.get("etag")!;
    const res = okTagged(req(`W/"other", ${tag}`), { a: 1 });
    expect(res.status).toBe(304);
    expect(await res.text()).toBe("");
  });

  it("sends the body again once it changed", () => {
    const tag = okTagged(req(), { a: 1 }).headers.get("etag")!;
    expect(okTagged(req(tag), { a: 2 }).status).toBe(200);
  });
});
