/**
 * Bookmarks and personal notes for the Notes reader.
 *
 * Pure data functions only (no browser APIs), so they can be unit tested and
 * later reused on the server. The browser copy lives in localStorage, one key
 * per student (see marks-store.ts).
 *
 * TODO(server sync): marks are saved on this device only. To sync across
 * devices, add a `study_marks` JSON column (or table) keyed by student, load it
 * in the /study pages next to loadLearnState, and on start-up combine the two
 * copies with `mergeMarks(server, local)`. Every entry carries its own `at`
 * time and removals are kept as `on: false` / empty text, so the merge is
 * safe in any order. Do not store these inside learn_progress (engine.ts).
 */

export const NOTE_MAX = 4000;

/** Key for one section, e.g. "interview-mse/2-3". Matches studyKey() in the learn engine. */
export function markKey(moduleId: string, sectionId: string): string {
  return `${moduleId}/${sectionId}`;
}

export function splitKey(key: string): { moduleId: string; sectionId: string } | null {
  const i = key.indexOf("/");
  if (i <= 0 || i === key.length - 1) return null;
  return { moduleId: key.slice(0, i), sectionId: key.slice(i + 1) };
}

/** `on: false` keeps a removal, so a merge does not bring an old bookmark back. */
export type BookmarkEntry = { on: boolean; at: number };
/** Empty `text` is a cleared note, kept for the same reason. */
export type NoteEntry = { text: string; at: number };

export type Marks = {
  v: 1;
  bookmarks: Record<string, BookmarkEntry>;
  notes: Record<string, NoteEntry>;
};

export function emptyMarks(): Marks {
  return { v: 1, bookmarks: {}, notes: {} };
}

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);
const validKey = (k: string) => splitKey(k) !== null && k.length <= 200;
const time = (x: unknown) => (typeof x === "number" && Number.isFinite(x) && x >= 0 ? x : 0);

/** Accepts anything (old, broken or hand-edited JSON) and returns clean marks. */
export function normaliseMarks(raw: unknown): Marks {
  const out = emptyMarks();
  if (!isObj(raw)) return out;
  if (isObj(raw.bookmarks)) {
    for (const [k, v] of Object.entries(raw.bookmarks)) {
      if (!validKey(k)) continue;
      // Older shape: { key: number } meaning "bookmarked at".
      if (typeof v === "number") out.bookmarks[k] = { on: true, at: time(v) };
      else if (isObj(v)) out.bookmarks[k] = { on: v.on !== false, at: time(v.at) };
    }
  }
  if (isObj(raw.notes)) {
    for (const [k, v] of Object.entries(raw.notes)) {
      if (!validKey(k)) continue;
      if (typeof v === "string") out.notes[k] = { text: v.slice(0, NOTE_MAX), at: 0 };
      else if (isObj(v) && typeof v.text === "string") out.notes[k] = { text: v.text.slice(0, NOTE_MAX), at: time(v.at) };
    }
  }
  return out;
}

function newer<T extends { at: number }>(a: Record<string, T>, b: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = { ...a };
  for (const [k, v] of Object.entries(b)) {
    const cur = out[k];
    if (!cur || v.at > cur.at) out[k] = v;
  }
  return out;
}

/** Combines two copies: for each section the newest change wins. Ties keep `a`. */
export function mergeMarks(a: Marks, b: Marks): Marks {
  return { v: 1, bookmarks: newer(a.bookmarks, b.bookmarks), notes: newer(a.notes, b.notes) };
}

export function isBookmarked(m: Marks, key: string): boolean {
  return m.bookmarks[key]?.on === true;
}

export function setBookmark(m: Marks, key: string, on: boolean, now: number): Marks {
  if (!validKey(key)) return m;
  return { ...m, bookmarks: { ...m.bookmarks, [key]: { on, at: now } } };
}

export function toggleBookmark(m: Marks, key: string, now: number): Marks {
  return setBookmark(m, key, !isBookmarked(m, key), now);
}

export function noteText(m: Marks, key: string): string {
  return m.notes[key]?.text ?? "";
}

export function setNote(m: Marks, key: string, text: string, now: number): Marks {
  if (!validKey(key)) return m;
  const clean = text.slice(0, NOTE_MAX);
  if (noteText(m, key) === clean) return m;
  return { ...m, notes: { ...m.notes, [key]: { text: clean, at: now } } };
}

export type MarkItem = { key: string; moduleId: string; sectionId: string; at: number; bookmarked: boolean; note: string };

/** Sections with a bookmark or a note, newest first. */
export function markedSections(m: Marks): MarkItem[] {
  const keys = new Set<string>();
  for (const [k, v] of Object.entries(m.bookmarks)) if (v.on) keys.add(k);
  for (const [k, v] of Object.entries(m.notes)) if (v.text.trim()) keys.add(k);
  const items: MarkItem[] = [];
  for (const key of keys) {
    const p = splitKey(key);
    if (!p) continue;
    const b = m.bookmarks[key];
    const n = m.notes[key];
    const note = n?.text.trim() ? n.text : "";
    items.push({ key, ...p, bookmarked: b?.on === true, note, at: Math.max(b?.on ? b.at : 0, note ? n!.at : 0) });
  }
  return items.sort((x, y) => y.at - x.at || x.key.localeCompare(y.key));
}

/** One line of a note for a list, cut at a word. */
export function notePreview(text: string, max = 90): string {
  const one = text.replace(/\s+/g, " ").trim();
  if (one.length <= max) return one;
  const cut = one.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).trimEnd()}…`;
}

/** localStorage key for one student. Each student on a shared computer gets their own. */
export function storageKey(owner: string): string {
  return `vibha-study-marks-v1:${owner || "anon"}`;
}
