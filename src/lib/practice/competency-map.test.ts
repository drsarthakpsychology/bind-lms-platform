import { describe, expect, it } from "vitest";
import { rubricToCompetencyKeys } from "./competency-map";

describe("rubric → competency mapping", () => {
  it("maps a risk-focused case to risk_assessment + interviewing", () => {
    const keys = rubricToCompetencyKeys([
      "risk assessment",
      "somatic-first recognition",
      "validation",
      "cultural attunement",
    ]);
    expect(keys).toContain("risk_assessment");
    expect(keys).toContain("therapeutic_alliance"); // validation
    expect(keys).toContain("cultural_attunement");
  });

  it("maps psychoeducation and confidentiality", () => {
    const keys = rubricToCompetencyKeys([
      "psychoeducation (thought ≠ action)",
      "confidentiality with minor",
    ]);
    expect(keys).toContain("psychoeducation");
    expect(keys).toContain("ethics");
  });

  it("dedupes — a target matching multiple aliases yields one key", () => {
    const keys = rubricToCompetencyKeys(["risk assessment", "safety assessment", "suicide risk"]);
    expect(keys.filter((k) => k === "risk_assessment").length).toBe(1);
  });

  it("empty targets map to nothing", () => {
    expect(rubricToCompetencyKeys([])).toEqual([]);
  });
});
