/**
 * Quick Notes: what the website and the app draw. PLAIN FILE ON PURPOSE: no
 * imports, no runtime code, so the phone app keeps an exact copy at
 * apps/mobile/src/library/quick-notes-types.ts (a test checks they match).
 *
 *   GET /api/app/v1/study/quick-notes             QuickLibrary
 *   GET /api/app/v1/study/quick-notes/search?q=   QuickSearch
 *   GET /api/app/v1/study/quick-notes/{id}        QuickNoteView
 */

export type QuickType = "criteria" | "summary" | "differential" | "distinction" | "theory" | "therapy" | "pharm" | "assessment" | "term" | "exam";

/** Where a link goes in the app. Same shape as the app's AppTarget, so the app can open it directly. */
export type QuickTarget =
  | { screen: "studyModule"; moduleId: string; web: string }
  | { screen: "studyNote"; noteId: string; web: string }
  | { screen: "practice"; tool: string | null; web: string }
  | { screen: "unknown"; web: string };

/** One row of the library. */
export type QuickItem = {
  /** Unique in the library: a typed note id, or note:<id>, ref:<slug>, med:<id>. */
  key: string;
  type: QuickType;
  title: string;
  /** One short line under the title. */
  line: string;
  topic: string;
  topicLabel: string;
  aka: string[];
  /** Website address. */
  href: string;
  /** App address (expo-router path). */
  app: string;
  /** Typed notes: the study module and the one-page summary they belong to (for "Quick Notes" rows on those pages). */
  moduleId?: string;
  summaryId?: string;
};

export type QuickLibrary = {
  items: QuickItem[];
  /** Type filter chips in order, with labels; types with no items are left out. */
  types: { id: QuickType; label: string }[];
  /** Topic groups in order. */
  topics: { id: string; label: string }[];
};

/** Search inside every note: keys best first, with the line that matched. */
export type QuickSearch = { q: string; hits: { key: string; snippet: string | null }[] };

export type QuickTable = { head: string[]; rows: string[][] };

export type QuickSection = {
  id: string;
  title: string;
  bullets?: string[];
  steps?: string[];
  table?: QuickTable;
  /** Label above value; `noteId` makes the row open that Quick Note. */
  pairs?: { label: string; value: string; noteId?: string }[];
};

export type QuickLink = { label: string; meta?: string; href: string; target: QuickTarget };

export type QuickNoteView = {
  id: string;
  type: QuickType;
  typeLabel: string;
  title: string;
  aka: string[];
  oneLine: string;
  topic: string;
  topicLabel: string;
  /** The strip at the top (threshold, duration ...). */
  facts: { label: string; value: string }[];
  sections: QuickSection[];
  /** The one warm block ("Never skip"), if any. */
  alert: { title: string; points: string[] } | null;
  /** Study module and related notes. */
  deeper: QuickLink[];
  /** Quiz, patient scenarios, games, medicine pages. */
  practise: QuickLink[];
  /** The fixed source line (criteria notes only). */
  sourceLine: string | null;
  /** "For learning. Real treatment is decided by the treating clinician." when the note has treatment. */
  careLine: string | null;
};
