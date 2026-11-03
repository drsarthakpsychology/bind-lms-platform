import { describe, expect, it } from "vitest";
import {
  NOTE_MAX,
  emptyMarks,
  isBookmarked,
  markKey,
  markedSections,
  mergeMarks,
  normaliseMarks,
  notePreview,
  noteText,
  setNote,
  splitKey,
  storageKey,
  toggleBookmark,
} from "./marks";

const K = markKey("interview-mse", "2-3");

describe("study marks", () => {
  it("builds and splits keys", () => {
    expect(K).toBe("interview-mse/2-3");
    expect(splitKey(K)).toEqual({ moduleId: "interview-mse", sectionId: "2-3" });
    expect(splitKey("nope")).toBeNull();
    expect(splitKey("/x")).toBeNull();
    expect(splitKey("x/")).toBeNull();
  });

  it("normalises junk to empty marks", () => {
    for (const junk of [null, undefined, 5, "x", [], { bookmarks: [], notes: 3 }]) {
      expect(normaliseMarks(junk)).toEqual(emptyMarks());
    }
  });

  it("normalises old and partial shapes, drops bad keys and trims long notes", () => {
    const m = normaliseMarks({
      bookmarks: { [K]: 100, "bad-key": { on: true, at: 1 }, "a/b": { at: -5 }, "c/d": { on: false, at: 9 } },
      notes: { [K]: "hello", "a/b": { text: "x".repeat(NOTE_MAX + 50), at: 3 }, "e/f": { text: 7 } },
    });
    expect(m.bookmarks[K]).toEqual({ on: true, at: 100 });
    expect(m.bookmarks["bad-key"]).toBeUndefined();
    expect(m.bookmarks["a/b"]).toEqual({ on: true, at: 0 });
    expect(m.bookmarks["c/d"]).toEqual({ on: false, at: 9 });
    expect(m.notes[K]).toEqual({ text: "hello", at: 0 });
    expect(m.notes["a/b"].text.length).toBe(NOTE_MAX);
    expect(m.notes["e/f"]).toBeUndefined();
  });

  it("toggles bookmarks and keeps a removal", () => {
    let m = toggleBookmark(emptyMarks(), K, 10);
    expect(isBookmarked(m, K)).toBe(true);
    m = toggleBookmark(m, K, 20);
    expect(isBookmarked(m, K)).toBe(false);
    expect(m.bookmarks[K]).toEqual({ on: false, at: 20 });
    expect(toggleBookmark(m, "bad", 30)).toBe(m);
  });

  it("sets notes, returns the same object when nothing changed", () => {
    const m = setNote(emptyMarks(), K, "Remember: orientation first", 5);
    expect(noteText(m, K)).toBe("Remember: orientation first");
    expect(setNote(m, K, "Remember: orientation first", 9)).toBe(m);
    expect(noteText(emptyMarks(), K)).toBe("");
  });

  it("merges by newest change per section, in any order", () => {
    const a = setNote(toggleBookmark(emptyMarks(), K, 10), K, "old", 10);
    const b = setNote(toggleBookmark(toggleBookmark(emptyMarks(), K, 5), K, 20), K, "new", 30);
    const ab = mergeMarks(a, b);
    const ba = mergeMarks(b, a);
    expect(ab).toEqual(ba);
    expect(isBookmarked(ab, K)).toBe(false);
    expect(noteText(ab, K)).toBe("new");
    // Entries only on one side survive.
    const c = toggleBookmark(emptyMarks(), "x/y", 1);
    expect(isBookmarked(mergeMarks(a, c), "x/y")).toBe(true);
    expect(isBookmarked(mergeMarks(a, c), K)).toBe(true);
  });

  it("lists bookmarked or noted sections, newest first, skipping cleared ones", () => {
    let m = emptyMarks();
    m = toggleBookmark(m, "a/1", 10);
    m = setNote(m, "b/2", "a note", 30);
    m = setNote(m, "c/3", "   ", 40);
    m = toggleBookmark(toggleBookmark(m, "d/4", 50), "d/4", 60);
    m = setNote(m, "a/1", "and a note", 20);
    const list = markedSections(m);
    expect(list.map((x) => x.key)).toEqual(["b/2", "a/1"]);
    expect(list[0]).toMatchObject({ moduleId: "b", sectionId: "2", bookmarked: false, note: "a note", at: 30 });
    expect(list[1]).toMatchObject({ bookmarked: true, note: "and a note", at: 20 });
  });

  it("previews notes on one line, cut at a word", () => {
    expect(notePreview("  two\n lines  ")).toBe("two lines");
    const p = notePreview("word ".repeat(40), 30);
    expect(p.endsWith("…")).toBe(true);
    expect(p.length).toBeLessThanOrEqual(31);
    expect(p).not.toMatch(/\s…$/);
  });

  it("keeps one storage key per student", () => {
    expect(storageKey("u1")).not.toBe(storageKey("u2"));
    expect(storageKey("")).toBe(storageKey("anon"));
  });
});
