import { describe, expect, it } from "vitest";
import { differentialMatch } from "./clinic";

describe("two-minute clinic reaction check", () => {
  const expert = ["Major depressive disorder (somatic presentation)", "Adjustment disorder", "Chronic medical illness"];
  it("names the top diagnosis", () => expect(differentialMatch("depression, anaemia", expert)).toBe("top"));
  it("names another listed one", () => expect(differentialMatch("adjustment problems", expert)).toBe("listed"));
  it("stays quiet on blank or unmatched text", () => {
    expect(differentialMatch("", expert)).toBe("none");
    expect(differentialMatch("disorder", expert)).toBe("none");
    expect(differentialMatch("hypothyroid", expert)).toBe("none");
  });
});
