import { describe, expect, it } from "vitest";
import { ALL_TERMS, NOTES, WEEK_BLOCKS } from "./index";
import { ALL_LESSONS } from "../content";
import { SCENARIOS, WORDS } from "../scenarios";

describe("notes, scenarios and terms", () => {
  it("notes are unique, placed in a week block and link to a real quiz", () => {
    expect(new Set(NOTES.map((n) => n.id)).size).toBe(NOTES.length);
    for (const n of NOTES) {
      expect(n.block, n.id).toBeLessThan(WEEK_BLOCKS.length);
      expect(n.sections.length, n.id).toBeGreaterThanOrEqual(3);
      if (n.quiz.lessonId) expect(ALL_LESSONS.some((l) => l.id === n.quiz.lessonId), n.id).toBe(true);
      expect(n.quiz.lessonId || n.quiz.domain, n.id).toBeTruthy();
      const text = JSON.stringify(n);
      expect(/stahl|kaplan|sadock|ahuja|page \d/i.test(text), n.id).toBe(false);
    }
    expect(ALL_TERMS.length).toBeGreaterThan(30);
  });
  it("every scenario beat has exactly one best choice and links to a note", () => {
    for (const s of SCENARIOS) {
      expect(NOTES.some((n) => n.id === s.noteId), s.id).toBe(true);
      for (const b of s.beats) expect(b.choices.filter((c) => c.outcome === "best")).toHaveLength(1);
    }
    expect(WORDS.length).toBeGreaterThanOrEqual(8);
  });
});
