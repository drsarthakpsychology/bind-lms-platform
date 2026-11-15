import { NOTES, WEEK_BLOCKS, noteById, type Note } from "@/lib/learn/notes";
import { NOTE_FIGURES } from "@/lib/learn/notes/figures";
import type { LearnState as WebLearnState } from "@/lib/learn/engine";
import type { RevisionNote, RevisionNoteList, RevisionNoteSummary } from "./contract";

/** The one-page revision notes (src/lib/learn/notes) as contract data. Pure. */
const summary = (n: Note, s: WebLearnState): RevisionNoteSummary => ({
  id: n.id,
  block: n.block,
  blockTitle: WEEK_BLOCKS[n.block] ?? "",
  title: n.title,
  emoji: n.emoji,
  tagline: n.tagline,
  readOn: s.notesRead?.[n.id] ?? null,
});

export function noteList(s: WebLearnState): RevisionNoteList {
  return { blocks: [...WEEK_BLOCKS], notes: NOTES.map((n) => summary(n, s)) };
}

export function noteDetail(id: string, s: WebLearnState): RevisionNote | null {
  const n = noteById(id);
  if (!n) return null;
  // Figures placed between sections on the website are listed in order here.
  const placed = (NOTE_FIGURES[n.id] ?? []).map((f) => ({ id: f.id, ...(f.quiz ? { quiz: true } : {}), after: f.after }));
  return {
    ...summary(n, s),
    tldr: n.tldr,
    sections: n.sections,
    terms: n.terms ?? [],
    figures: [...(n.figures ?? []), ...placed.map(({ after: _a, ...f }) => (void _a, f))],
  };
}
