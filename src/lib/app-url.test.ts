import { describe, expect, it } from "vitest";
import { cleanAppUrl, LIVE_SITE } from "./app-url";

describe("app url", () => {
  it("never sends students to localhost", () => {
    for (const v of ["http://localhost:3000", "http://127.0.0.1:3000/", "", undefined, "localhost:3000", "  "]) expect(cleanAppUrl(v)).toBe(LIVE_SITE);
  });
  it("keeps a real address", () => {
    expect(cleanAppUrl("https://vibhapsychology.com/")).toBe("https://vibhapsychology.com");
    expect(cleanAppUrl("https://preview.vercel.app")).toBe("https://preview.vercel.app");
  });
});
