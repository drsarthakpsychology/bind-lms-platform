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

describe("notes read tracking and DSM coverage", () => {
  it("marks a note read once and keeps the first day", async () => {
    const { emptyState, markNoteRead, normalise } = await import("../engine");
    const a = markNoteRead(emptyState(), "dsm-anxiety", "2026-11-01");
    expect(a.notesRead["dsm-anxiety"]).toBe("2026-11-01");
    expect(markNoteRead(a, "dsm-anxiety", "2026-11-02")).toBe(a);
    expect(normalise({ notesRead: { x: "2026-11-01", y: 5 } }).notesRead).toEqual({ x: "2026-11-01" });
    expect(normalise({}).notesRead).toEqual({});
  });
  it("covers every DSM-5-TR chapter, plus neuroscience and patient language", () => {
    const ids = new Set(NOTES.map((n) => n.id));
    for (const id of ["neuroscience", "how-patients-talk", "dsm-neurodev", "dsm-psychosis", "dsm-bipolar", "dsm-depressive", "dsm-anxiety", "dsm-ocd", "dsm-trauma", "dsm-dissociative", "dsm-somatic", "dsm-feeding", "dsm-elimination-sleep", "dsm-sex-gender", "dsm-disruptive", "dsm-substance", "dsm-ncd", "dsm-personality", "dsm-paraphilic", "dsm-medication"])
      expect(ids.has(id), id).toBe(true);
  });
  it("uses words, not maths symbols, in student-facing text", () => {
    for (const n of NOTES) expect(/[≥≤≠↑↓]|<\d|>\d|~\d/.test(JSON.stringify(n)), n.id).toBe(false);
  });
});
