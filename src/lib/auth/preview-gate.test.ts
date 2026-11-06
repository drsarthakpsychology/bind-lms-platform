import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { previewBlocks } from "./roster";

describe("previewBlocks", () => {
  it("production always sends", () => expect(previewBlocks("a@b.com", { VERCEL_ENV: "production" })).toBe(false));
  it("local (no VERCEL_ENV) sends", () => expect(previewBlocks("a@b.com", {})).toBe(false));
  it("preview sends only to the allowed address(es)", () => {
    expect(previewBlocks("a@b.com", { VERCEL_ENV: "preview" })).toBe(true);
    expect(previewBlocks("A@b.com", { VERCEL_ENV: "preview", ALLOWED_TEST_RECIPIENT: "x@y.com, a@b.com" })).toBe(false);
    expect(previewBlocks("c@b.com", { VERCEL_ENV: "preview", ALLOWED_TEST_RECIPIENT: "a@b.com" })).toBe(true);
  });
});
