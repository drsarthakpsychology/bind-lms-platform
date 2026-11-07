/**
 * Bookmarks and personal notes for the Notes reader.
 *
 * Pure data functions only (no browser APIs), so they can be unit tested and
 * later reused on the server. The browser copy lives in localStorage, one key
 * per student (see marks-store.ts).
 *
 * Server copy: table study_marks (supabase/migrations_pending/2026_11_notes.sql),
 * one row per student per section, read and written through
 * marks-actions.ts. Every entry carries its own `at` time and removals are
 * kept as `on: false` / empty text, so `mergeMarks` is safe in any order and
 * the browser copy and the server copy can each be ahead of the other.
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

/* ------------------------------------------------------- server rows */

/** One row of study_marks. A null pair means "never set on any device". */
export type MarkRow = { key: string; bookmark_on: boolean | null; bookmark_at: number | null; note: string | null; note_at: number | null };

const num = (x: unknown): number | null => {
  const n = typeof x === "string" ? Number(x) : x;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : null;
};

/** Rows from the database (bigint may arrive as a string) into marks. */
export function rowsToMarks(rows: unknown[]): Marks {
  const out = emptyMarks();
  for (const r of rows) {
    if (!isObj(r) || typeof r.key !== "string" || !validKey(r.key)) continue;
    const bAt = num(r.bookmark_at);
    if (typeof r.bookmark_on === "boolean" && bAt !== null) out.bookmarks[r.key] = { on: r.bookmark_on, at: bAt };
    const nAt = num(r.note_at);
    if (typeof r.note === "string" && nAt !== null) out.notes[r.key] = { text: r.note.slice(0, NOTE_MAX), at: nAt };
  }
  return out;
}

/** Marks into rows, one per section key (bookmark and note side by side). */
export function marksToRows(m: Marks): MarkRow[] {
  const keys = new Set([...Object.keys(m.bookmarks), ...Object.keys(m.notes)]);
  return [...keys].sort().map((key) => {
    const b = m.bookmarks[key];
    const n = m.notes[key];
    return { key, bookmark_on: b ? b.on : null, bookmark_at: b ? b.at : null, note: n ? n.text : null, note_at: n ? n.at : null };
  });
}

/**
 * The entries of `local` that `remote` does not have yet, or has an older
 * version of: what one side still needs to send the other.
 */
export function newerThan(local: Marks, remote: Marks): Marks {
  const out = emptyMarks();
  for (const [k, v] of Object.entries(local.bookmarks)) {
    const r = remote.bookmarks[k];
    if (!r || v.at > r.at) out.bookmarks[k] = v;
  }
  for (const [k, v] of Object.entries(local.notes)) {
    const r = remote.notes[k];
    if (!r || v.at > r.at) out.notes[k] = v;
  }
  return out;
}

export function isEmptyMarks(m: Marks): boolean {
  return !Object.keys(m.bookmarks).length && !Object.keys(m.notes).length;
}

/** Most entries one save may carry (a student has at most a few hundred sections). */
export const PUSH_MAX = 1500;
/** Device clocks can run ahead; no change may claim to be more than a day in the future. */
export const FUTURE_SLACK_MS = 24 * 60 * 60 * 1000;

/**
 * What the server writes for one save: the incoming entries cleaned and
 * clamped, merged with the stored rows for the same sections (newest change
 * wins per field), keeping only rows that actually change.
 */
export function rowsToWrite(stored: Marks, incoming: unknown, now: number): MarkRow[] {
  const inc = normaliseMarks(incoming);
  const cap = now + FUTURE_SLACK_MS;
  const clamp = <T extends { at: number }>(r: Record<string, T>) => Object.fromEntries(Object.entries(r).slice(0, PUSH_MAX).map(([k, v]) => [k, { ...v, at: Math.min(v.at, cap) }]));
  const clean: Marks = { v: 1, bookmarks: clamp(inc.bookmarks), notes: clamp(inc.notes) };
  const fresh = newerThan(clean, stored);
  if (isEmptyMarks(fresh)) return [];
  // Each changed row is written whole, so keep the stored half of a row too.
  const merged = mergeMarks(stored, fresh);
  const keys = new Set([...Object.keys(fresh.bookmarks), ...Object.keys(fresh.notes)]);
  return marksToRows(merged).filter((r) => keys.has(r.key));
}
