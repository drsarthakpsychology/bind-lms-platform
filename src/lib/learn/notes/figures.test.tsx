// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Figure } from "@/components/study/figures/figure";
import { FIGURES } from "@/components/study/figures/registry";
import { NOTE_FIGURES } from "./figures";
import { NOTES } from "./index";

afterEach(cleanup);

describe("diagrams in the one-page notes", () => {
  const entries = Object.entries(NOTE_FIGURES).flatMap(([noteId, list]) => list.map((f) => ({ noteId, ...f })));

  it("point at real notes, real sections and real figures", () => {
    for (const e of entries) {
      const note = NOTES.find((n) => n.id === e.noteId);
      expect(note, e.noteId).toBeDefined();
      expect(e.after, `${e.noteId} ${e.id}`).toBeLessThan(note!.sections.length);
      expect(FIGURES[e.id], `${e.noteId} ${e.id}`).toBeDefined();
    }
  });

  it("never repeat a figure within one note", () => {
    for (const [noteId, list] of Object.entries(NOTE_FIGURES)) {
      expect(new Set(list.map((f) => f.id)).size, noteId).toBe(list.length);
    }
  });

  it("render every placed figure", () => {
    for (const id of new Set(entries.map((e) => e.id))) {
      render(<Figure d={{ id }} />);
      expect(screen.getByRole("img", { name: FIGURES[id].summary })).toBeInTheDocument();
      cleanup();
    }
  });
});
