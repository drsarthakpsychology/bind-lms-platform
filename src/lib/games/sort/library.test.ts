import { describe, expect, it } from "vitest";
import { diagnosisById } from "../diagnoses";
import { citationOrDash, EXAMS, STUDY_MODULES } from "../tags";
import { BOARDS } from "./boards";

const tiles = BOARDS.flatMap((b) => b.groups.flatMap((g) => g.items.map((i) => ({ b, g, i }))));

describe("criteria sort library", () => {
  it("has at least 500 sortable tiles with unique ids", () => {
    expect(tiles.length).toBeGreaterThanOrEqual(500);
    expect(new Set(tiles.map((t) => t.i.id)).size).toBe(tiles.length);
    expect(new Set(BOARDS.map((b) => b.id)).size).toBe(BOARDS.length);
  });

  it("every board carries its tags", () => {
    for (const b of BOARDS) {
      expect(b.topic.length, b.id).toBeGreaterThan(1);
      expect([1, 2, 3]).toContain(b.difficulty);
      expect(b.objective && b.objective.length > 15, b.id).toBe(true);
      expect(b.exams && b.exams.length > 0 && b.exams.every((e) => EXAMS.includes(e)), b.id).toBe(true);
      expect(STUDY_MODULES as readonly string[], b.id).toContain(b.module);
      for (const g of b.groups) expect(diagnosisById(g.dx), `${b.id} ${g.dx}`).toBeTruthy();
    }
  });

  it("difficulty is spread", () => {
    for (const d of [1, 2, 3]) expect(BOARDS.filter((b) => b.difficulty === d).length / BOARDS.length).toBeGreaterThan(0.2);
  });

  it("student text has no dashes, book names or page citations", () => {
    for (const { b, g, i } of tiles) {
      expect(citationOrDash([b.title, b.objective ?? "", i.text, i.why, g.threshold ?? "", ...(b.thresholds ?? [])].join(" ")), `${b.id} ${i.text}`).toBe(false);
      expect(i.why.length, i.id).toBeGreaterThan(5);
    }
  });
});
