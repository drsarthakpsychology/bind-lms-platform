import { describe, expect, it } from "vitest";
import { CLINICS } from "./clinic";
import { EXAMS, MODULE_IDS, textProblems } from "@/lib/library/checks";

/** Library standard (plan section 9): 500+ checked, tagged, explained cases. */
describe("Clinic detective library", () => {
  it("has at least 500 cases with unique ids", () => {
    expect(CLINICS.length).toBeGreaterThanOrEqual(500);
    expect(new Set(CLINICS.map((c) => c.id)).size).toBe(CLINICS.length);
  });

  it("every case is tagged and complete", () => {
    const bad: string[] = [];
    for (const c of CLINICS) {
      if (!MODULE_IDS.has(c.moduleId)) bad.push(`${c.id}: module ${c.moduleId}`);
      if (!c.topic || !c.objective || c.objective.length > 120) bad.push(`${c.id}: topic or objective`);
      if (![1, 2, 3, 4, 5].includes(c.difficulty)) bad.push(`${c.id}: difficulty`);
      if (!c.exams.length || c.exams.some((e) => !EXAMS.has(e))) bad.push(`${c.id}: exams`);
      if (c.clues.length < 3) bad.push(`${c.id}: clue trail`);
      if (!c.diagnosis || c.expertDifferential.length < 2) bad.push(`${c.id}: diagnosis`);
      if (c.expertNext.length < 15 || c.lesson.length < 20) bad.push(`${c.id}: next or lesson`);
    }
    expect(bad).toEqual([]);
  });

  it("spreads across the five difficulty levels", () => {
    for (const d of [1, 2, 3, 4, 5]) {
      expect(CLINICS.filter((c) => c.difficulty === d).length / CLINICS.length).toBeGreaterThan(0.08);
    }
  });

  it("has no dashes or citations in student text", () => {
    expect(CLINICS.flatMap((c) => textProblems(c.id, c))).toEqual([]);
  });

  it("has no repeated one-liners", () => {
    expect(new Set(CLINICS.map((c) => c.line)).size).toBe(CLINICS.length);
  });
});
