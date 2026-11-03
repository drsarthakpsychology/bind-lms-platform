import { describe, expect, it } from "vitest";
import { FIVE_P } from "./formulation";
import { FORMULATION_CASES } from "./formulation-cases";

describe("formulation cases", () => {
  it("are complete and distinct", () => {
    expect(FORMULATION_CASES.length).toBeGreaterThanOrEqual(6);
    expect(new Set(FORMULATION_CASES.map((c) => c.id)).size).toBe(FORMULATION_CASES.length);
    for (const c of FORMULATION_CASES) {
      expect(c.factors.length, c.id).toBeGreaterThanOrEqual(10);
      for (const p of FIVE_P) expect(c.factors.some((f) => f.bucket === p), `${c.id} ${p}`).toBe(true);
      expect(c.factors.some((f) => f.bucket === "distractor"), c.id).toBe(true);
      expect(new Set(c.factors.map((f) => f.id)).size).toBe(c.factors.length);
      expect(c.modelNarrative.length, c.id).toBeGreaterThan(300);
    }
  });
});
