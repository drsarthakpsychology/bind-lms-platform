import { describe, expect, it } from "vitest";
import { toPoints } from "./points";

describe("toPoints", () => {
  it("splits sentences and semicolons into bullets", () => {
    expect(toPoints("Nausea; headache; insomnia")).toEqual(["Nausea", "headache", "insomnia"]);
    expect(toPoints("Start low. Increase slowly. Check sodium in older adults.")).toEqual(["Start low", "Increase slowly", "Check sodium in older adults"]);
  });
  it("removes citation fragments", () => {
    expect(toPoints("Sedation is common (p. 412). Weight gain [Stahl 5e p.33].")).toEqual(["Sedation is common", "Weight gain"]);
  });
  it("treats line breaks before capitals as new points", () => {
    expect(toPoints("(bold for FDA approved) Major depressive disorder\nPanic disorder\nSocial anxiety\ndisorder")).toEqual([
      "Major depressive disorder",
      "Panic disorder",
      "Social anxiety disorder",
    ]);
    expect(toPoints("Some feel better early; the sources suggest allowing 6–8 weeks")).toEqual(["Some feel better early", "allowing 6–8 weeks"]);
  });
  it("handles empty input", () => {
    expect(toPoints(undefined)).toEqual([]);
  });
});
