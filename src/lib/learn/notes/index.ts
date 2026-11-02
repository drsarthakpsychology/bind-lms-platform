import { NOTES_A } from "./notes-a";
import { NOTES_B } from "./notes-b";
import type { Note } from "./types";

export * from "./types";
export const NOTES: Note[] = [...NOTES_A, ...NOTES_B];
export function noteById(id: string): Note | undefined {
  return NOTES.find((n) => n.id === id);
}
/** Every "lay phrase → clinical term" pair, tagged with its note. */
export const ALL_TERMS = NOTES.flatMap((n) => (n.terms ?? []).map(([lay, term]) => ({ lay, term, noteId: n.id, topic: n.title })));
