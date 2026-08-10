import { describe, expect, it } from "vitest";
import { analyzeWeakSpots, type Rubric } from "./weak-spots";

const GOOD: Rubric = {
  open_closed_ratio: 4.5,
  reflective_statements: 5,
  premature_reassurance: 0,
  domain_coverage: 0.9,
  risk_timing: "appropriate",
};

const PREMATURE: Rubric = {
  open_closed_ratio: 3,
  reflective_statements: 2,
  premature_reassurance: 3, // severe
  domain_coverage: 0.8,
  risk_timing: "appropriate",
};

const CLOSED: Rubric = {
  open_closed_ratio: 1.5, // very closed
  reflective_statements: 4,
  premature_reassurance: 0,
  domain_coverage: 0.6,
  risk_timing: "late",
};

describe("weak-spots analysis", () => {
  it("a consistently good student has no weak spots", () => {
    expect(analyzeWeakSpots([GOOD, GOOD, GOOD])).toEqual([]);
  });

  it("premature reassurance shows up as a top weak spot", () => {
    const spots = analyzeWeakSpots([GOOD, PREMATURE]);
    expect(spots.length).toBeGreaterThan(0);
    expect(spots[0].key).toBe("premature_reassurance");
  });

  it("closed questions + late risk timing surface from the closed session", () => {
    const spots = analyzeWeakSpots([CLOSED, CLOSED]);
    const keys = spots.map((s) => s.key);
    expect(keys).toContain("open_closed_ratio");
    expect(keys).toContain("risk_timing");
  });

  it("empty input returns empty", () => {
    expect(analyzeWeakSpots([])).toEqual([]);
  });

  it("severity is bounded 0..1", () => {
    for (const s of analyzeWeakSpots([CLOSED, PREMATURE])) {
      expect(s.severity).toBeGreaterThanOrEqual(0);
      expect(s.severity).toBeLessThanOrEqual(1);
    }
  });
});
