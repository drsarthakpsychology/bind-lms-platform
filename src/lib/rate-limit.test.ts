import { describe, it, expect } from "vitest";
import { rateLimitFast } from "./rate-limit-fast";

describe("rateLimitFast (in-memory)", () => {
  it("allows requests within the limit", () => {
    expect(rateLimitFast("unit-a", 3)).toBe(true);
    expect(rateLimitFast("unit-a", 3)).toBe(true);
    expect(rateLimitFast("unit-a", 3)).toBe(true);
  });

  it("blocks once the limit is exceeded", () => {
    rateLimitFast("unit-b", 2);
    rateLimitFast("unit-b", 2);
    expect(rateLimitFast("unit-b", 2)).toBe(false);
  });

  it("tracks different keys independently", () => {
    rateLimitFast("unit-c", 1);
    expect(rateLimitFast("unit-c", 1)).toBe(false);
    expect(rateLimitFast("unit-d", 1)).toBe(true);
  });
});
