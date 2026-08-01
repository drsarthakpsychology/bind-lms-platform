import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit } from "./rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    // Reset module state between tests by re-importing fresh isn't trivial
    // for a module-level Map; instead we use distinct keys per test.
  });

  it("allows requests within the limit", () => {
    expect(rateLimit("unit-a", 3)).toBe(true);
    expect(rateLimit("unit-a", 3)).toBe(true);
    expect(rateLimit("unit-a", 3)).toBe(true);
  });

  it("blocks once the limit is exceeded", () => {
    rateLimit("unit-b", 2);
    rateLimit("unit-b", 2);
    expect(rateLimit("unit-b", 2)).toBe(false);
  });

  it("tracks different keys independently", () => {
    rateLimit("unit-c", 1);
    expect(rateLimit("unit-c", 1)).toBe(false);
    expect(rateLimit("unit-d", 1)).toBe(true);
  });
});
