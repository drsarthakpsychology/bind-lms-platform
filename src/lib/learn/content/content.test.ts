import { describe, expect, it } from "vitest";
import { ALL_ITEMS, ALL_LESSONS, UNITS } from "./index";

describe("learn content", () => {
  it("has unique ids", () => {
    const ids = ALL_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    const lessonIds = ALL_LESSONS.map((l) => l.id);
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
    expect(new Set(UNITS.map((u) => u.id)).size).toBe(UNITS.length);
  });

  it("every item is well formed and has both explanations", () => {
    for (const i of ALL_ITEMS) {
      expect(i.student.length, i.id).toBeGreaterThan(8);
      expect(i.clinician.length, i.id).toBeGreaterThan(8);
      if (i.kind === "mcq") {
        expect(i.options.length, i.id).toBeGreaterThanOrEqual(3);
        expect(i.answer, i.id).toBeLessThan(i.options.length);
        expect(new Set(i.options).size, i.id).toBe(i.options.length);
      }
      if (i.kind === "match") {
        expect(i.pairs.length, i.id).toBeGreaterThanOrEqual(3);
        expect(new Set(i.pairs.map((p) => p[0])).size, i.id).toBe(i.pairs.length);
      }
      if (i.kind === "order") expect(i.steps.length, i.id).toBeGreaterThanOrEqual(3);
      if (i.kind === "sort") {
        expect(i.items.some((x) => x[1] === 0), i.id).toBe(true);
        expect(i.items.some((x) => x[1] === 1), i.id).toBe(true);
      }
    }
  });

  it("every lesson has enough questions", () => {
    for (const l of ALL_LESSONS) expect(l.items.length, l.id).toBeGreaterThanOrEqual(3);
  });

  it("never cites a book in student-facing text", () => {
    const banned = /kaplan|sadock|stahl|ahuja|fish's|prescriber's guide|page \d+/i;
    for (const i of ALL_ITEMS) expect(banned.test(`${i.student} ${i.clinician}`), i.id).toBe(false);
  });
});
