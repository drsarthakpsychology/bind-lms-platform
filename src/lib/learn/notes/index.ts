import { NOTES_A } from "./notes-a";
import { NOTES_B } from "./notes-b";
import { DSM_NOTES } from "./dsm";
import type { Note } from "./types";

export * from "./types";
// Brain basics and "how patients talk" open week 1; DSM chapters close the list.
const [neuro, talk, ...chapters] = DSM_NOTES;
export const NOTES: Note[] = [neuro, talk, ...NOTES_A, ...NOTES_B, ...chapters];
export function noteById(id: string): Note | undefined {
  return NOTES.find((n) => n.id === id);
}
/** Every "lay phrase → clinical term" pair, tagged with its note. */
export const ALL_TERMS = NOTES.flatMap((n) => (n.terms ?? []).map(([lay, term]) => ({ lay, term, noteId: n.id, topic: n.title })));
