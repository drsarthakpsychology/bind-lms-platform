import { describe, expect, it } from "vitest";
import { normalizeIndianMobile } from "./phone";

describe("normalizeIndianMobile", () => {
  it("accepts the shapes people type", () => {
    expect(normalizeIndianMobile("9876543210")).toBe("9876543210");
    expect(normalizeIndianMobile("98765 43210")).toBe("9876543210");
    expect(normalizeIndianMobile("+91 98765 43210")).toBe("9876543210");
    expect(normalizeIndianMobile("0091-98765-43210")).toBe("9876543210");
    expect(normalizeIndianMobile("098765 43210")).toBe("9876543210");
    expect(normalizeIndianMobile("91 98765 43210")).toBe("9876543210");
  });
  it("keeps a real number that starts with 9 then 1 (the old bug)", () => {
    expect(normalizeIndianMobile("9123456789")).toBe("9123456789");
    expect(normalizeIndianMobile("+91 91234 56789")).toBe("9123456789");
  });
  it("rejects what isn't a 10-digit Indian mobile", () => {
    expect(normalizeIndianMobile("12345")).toBeNull();
    expect(normalizeIndianMobile("5876543210")).toBeNull(); // starts 5
    expect(normalizeIndianMobile("")).toBeNull();
  });
});
