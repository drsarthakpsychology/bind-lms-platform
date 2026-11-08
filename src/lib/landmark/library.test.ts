import { describe, expect, it } from "vitest";
import { LANDMARK_CASES } from "./cases";
import { EXAMS, MODULE_IDS, lengthBias, textProblems } from "@/lib/library/checks";

/**
 * Landmark library standard (plan section 9). The target is 500 verified
 * cases; every case must be a real, checkable event, so the floor below is
 * the honest current count and rises only as verified cases are added.
 */
const FLOOR = 200;

describe("Landmark cases library", () => {
  it("has at least the verified floor of cases, with unique ids and titles", () => {
    expect(LANDMARK_CASES.length).toBeGreaterThanOrEqual(FLOOR);
    expect(new Set(LANDMARK_CASES.map((c) => c.id)).size).toBe(LANDMARK_CASES.length);
    expect(new Set(LANDMARK_CASES.map((c) => c.title.toLowerCase())).size).toBe(LANDMARK_CASES.length);
  });

  it("every case is tagged with topic, difficulty, objective, exams and a Study module", () => {
    const bad: string[] = [];
    for (const c of LANDMARK_CASES) {
      const t = c.tags;
      if (!t) { bad.push(`${c.id}: no tags`); continue; }
      if (!t.topic) bad.push(`${c.id}: topic`);
      if (![1, 2, 3, 4, 5].includes(t.difficulty)) bad.push(`${c.id}: difficulty`);
      if (!t.objective || t.objective.length > 120) bad.push(`${c.id}: objective`);
      if (!t.exams.length || t.exams.some((e) => !EXAMS.has(e))) bad.push(`${c.id}: exams`);
      if (!MODULE_IDS.has(t.module)) bad.push(`${c.id}: module ${t.module}`);
    }
    expect(bad).toEqual([]);
  });

  it("every quiz item has distinct options and an explained answer", () => {
    const bad: string[] = [];
    for (const c of LANDMARK_CASES) {
      if (c.quiz.length < 2) bad.push(`${c.id}: fewer than 2 questions`);
      for (const q of c.quiz) {
        if (new Set(q.options).size !== q.options.length) bad.push(`${c.id}: duplicate option`);
        if (q.rationale.length < 40) bad.push(`${c.id}: thin rationale`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("spreads difficulty across the ladder", () => {
    for (const d of [1, 2, 3, 4] as const) {
      expect(LANDMARK_CASES.filter((c) => c.tags?.difficulty === d).length / LANDMARK_CASES.length, `level ${d}`).toBeGreaterThan(0.05);
    }
  });

  it("does not give answers away by position or length in the library cases", () => {
    const lib = LANDMARK_CASES.slice(25).flatMap((c) => c.quiz);
    const counts = [0, 0, 0, 0];
    for (const q of lib) counts[q.correct]++;
    for (const n of counts) expect(n / lib.length).toBeLessThan(0.35);
    const bias = lengthBias(lib.map((q) => ({ correct: q.options[q.correct], others: q.options.filter((_, i) => i !== q.correct) })));
    expect(bias.longest).toBeLessThan(0.34);
    expect(bias.shortest).toBeLessThan(0.34);
  });

  it("has no dashes or citations in student text", () => {
    expect(LANDMARK_CASES.slice(25).flatMap((c) => textProblems(c.id, { ...c, tags: undefined }))).toEqual([]);
  });
});
