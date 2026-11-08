/** Formulation library contract: count, unique ids, tags, the 5 Ps, no dashes or citations. */
import { describe, expect, it } from "vitest";
import { FIVE_P } from "@/lib/practice/formulation";
import { FORMULATION_CASES } from "@/lib/practice/formulation-cases";

/** Raise as batches land; the section target is 500. */
const MIN_CASES = 106;
const DASH = /[–—]/;
const CITATION = /\b(et al\.|Kaplan|Stahl|Maudsley|Fish's|Ahuja|doi:|ISBN)\b/;
const EXAMS = new Set(["cuet-pg", "ugc-net", "mcp-entrance", "md-psychiatry", "ma-semester"]);

describe("formulation library", () => {
  it("has enough cases with unique ids and titles", () => {
    expect(FORMULATION_CASES.length).toBeGreaterThanOrEqual(MIN_CASES);
    expect(new Set(FORMULATION_CASES.map((c) => c.id)).size).toBe(FORMULATION_CASES.length);
    expect(new Set(FORMULATION_CASES.map((c) => c.title)).size).toBe(FORMULATION_CASES.length);
  });

  it("every case is tagged", () => {
    for (const c of FORMULATION_CASES) {
      expect(c.tags, c.id).toBeTruthy();
      const t = c.tags!;
      expect(t.difficulty).toBeGreaterThanOrEqual(1);
      expect(t.difficulty).toBeLessThanOrEqual(5);
      expect(t.objective.length, c.id).toBeGreaterThan(15);
      expect(t.module.length, c.id).toBeGreaterThan(2);
      expect(t.diagnosis.length, c.id).toBeGreaterThan(5);
      for (const e of t.exams) expect(EXAMS.has(e), `${c.id} ${e}`).toBe(true);
    }
    expect(new Set(FORMULATION_CASES.map((c) => c.tags!.difficulty))).toEqual(new Set([1, 2, 3, 4, 5]));
  });

  it("every case fills all five Ps plus a distractor, with unique factor ids", () => {
    for (const c of FORMULATION_CASES) {
      for (const p of FIVE_P) expect(c.factors.some((f) => f.bucket === p), `${c.id} ${p}`).toBe(true);
      expect(c.factors.some((f) => f.bucket === "distractor"), c.id).toBe(true);
      expect(new Set(c.factors.map((f) => f.id)).size, c.id).toBe(c.factors.length);
      expect(c.modelNarrative.length, c.id).toBeGreaterThan(300);
    }
  });

  it("library cards are not grouped by bucket (the order never gives the answer away)", () => {
    for (const c of FORMULATION_CASES.slice(6)) {
      const first4 = c.factors.slice(0, 4).map((f) => f.bucket);
      expect(new Set(first4).size, c.id).toBeGreaterThan(1);
    }
  });

  it("no dashes and no citation text in library cases", () => {
    for (const c of FORMULATION_CASES.slice(6)) {
      const s = JSON.stringify(c);
      expect(DASH.test(s), c.id).toBe(false);
      expect(CITATION.test(s), c.id).toBe(false);
    }
  });
});
