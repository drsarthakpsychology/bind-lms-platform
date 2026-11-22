import { describe, expect, it } from "vitest";
import { SCENARIOS } from "./scenarios";
import { RICH_SCENARIOS } from "./scenario-rich";
import { NOTES } from "./notes";
import { EXAMS, MODULE_IDS, lengthBias, textProblems } from "@/lib/library/checks";

const AREAS = ["assessment", "risk", "emergency", "crisis", "treatment", "liaison", "child-family", "boundaries"] as const;

/** Library standard (plan section 9): 500+ checked, tagged, explained scenarios. */
describe("What would you do library", () => {
  it("has at least 500 scenarios with unique ids", () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(500);
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(SCENARIOS.length);
  });

  it("every scenario is tagged, and every beat has one best choice with explained consequences", () => {
    const notes = new Set(NOTES.map((n) => n.id));
    const bad: string[] = [];
    for (const s of SCENARIOS) {
      if (!notes.has(s.noteId)) bad.push(`${s.id}: note ${s.noteId}`);
      if (!MODULE_IDS.has(s.moduleId)) bad.push(`${s.id}: module ${s.moduleId}`);
      if (!AREAS.includes(s.area)) bad.push(`${s.id}: area`);
      if (![1, 2, 3, 4, 5].includes(s.difficulty)) bad.push(`${s.id}: difficulty`);
      if (!s.exams.length || s.exams.some((e) => !EXAMS.has(e))) bad.push(`${s.id}: exams`);
      if (!s.objective || s.objective.length > 120) bad.push(`${s.id}: objective`);
      for (const beat of s.beats) {
        if (beat.choices.filter((c) => c.outcome === "best").length !== 1) bad.push(`${s.id}: best count`);
        if (beat.choices.length < 3) bad.push(`${s.id}: choices`);
        if (new Set(beat.choices.map((c) => c.text)).size !== beat.choices.length) bad.push(`${s.id}: duplicate choice`);
        for (const c of beat.choices) if (c.consequence.length < 30) bad.push(`${s.id}: thin consequence`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("a choice that leads to death, abuse or a missed emergency is never marked 'Okay, but'", () => {
    const DANGER = /\b(can kill|kills|may die|might die|not live|fatal|shakes the baby|brain damage|collapses|unconscious|overdoses|tries again|hurt again|breaks? (his|her|their) confidentiality|break the law|not allowed)\b/i;
    const bad = SCENARIOS.flatMap((s) => s.beats.flatMap((b) => b.choices.filter((c) => c.outcome === "ok" && DANGER.test(c.consequence)).map((c) => `${s.id}: ${c.text}`)));
    expect(bad).toEqual([]);
  });

  it("every case opens with a starting picture and every step has three hints", () => {
    for (const s of SCENARIOS) {
      expect(s.opening?.setting.length, s.id).toBeGreaterThan(10);
      expect(s.opening?.lines.length, s.id).toBeGreaterThan(0);
      for (const b of s.beats) expect(b.hints, s.id).toHaveLength(3);
    }
  });

  it("rich cases have 4 or more graded choices, their own hints and a take-away", () => {
    const rich = [...RICH_SCENARIOS.values()];
    expect(rich.length).toBeGreaterThanOrEqual(60);
    for (const s of rich) {
      expect(s.learn?.errors.length, s.id).toBeGreaterThan(0);
      expect(s.opening!.lines.length, s.id).toBeGreaterThanOrEqual(2);
      for (const b of s.beats) {
        expect(b.choices.length, s.id).toBeGreaterThanOrEqual(4);
        expect(b.choices.filter((c) => c.outcome === "best"), s.id).toHaveLength(1);
        // Hints 1 and 2 never quote the best choice.
        const best = b.choices.find((c) => c.outcome === "best")!.text.toLowerCase();
        for (const h of b.hints!.slice(0, 2)) expect(best.includes(h.toLowerCase().slice(0, 40)), s.id).toBe(false);
      }
      expect(JSON.stringify(s), s.id).not.toMatch(/[\u2013\u2014]/);
    }
  });

  it("covers every area and spreads across difficulty", () => {
    for (const a of AREAS) expect(SCENARIOS.filter((s) => s.area === a).length, a).toBeGreaterThanOrEqual(40);
    for (const d of [1, 2, 3, 4, 5]) expect(SCENARIOS.filter((s) => s.difficulty === d).length / SCENARIOS.length).toBeGreaterThan(0.08);
  });

  it("the best choice is not given away by length", () => {
    const sets = SCENARIOS.flatMap((s) => s.beats.map((beat) => ({
      correct: beat.choices.find((c) => c.outcome === "best")!.text,
      others: beat.choices.filter((c) => c.outcome !== "best").map((c) => c.text),
    })));
    const bias = lengthBias(sets);
    expect(bias.longest).toBeLessThan(0.4);
    expect(bias.shortest).toBeLessThan(0.4);
  });

  it("has no dashes or citations in student text", () => {
    expect(SCENARIOS.flatMap((s) => textProblems(s.id, s))).toEqual([]);
  });
});
