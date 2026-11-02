/**
 * Study: the course. Every module is a deep, textbook-style chapter written in
 * a small Markdown dialect (see parse.ts) and read one section at a time.
 */

export type Inline = string; // **bold**, *italic* and `term` are handled by the renderer

export type ListItem = { text: Inline; children?: ListItem[] };

export type BoxKind =
  | "define" // the formal definition, learn verbatim
  | "word" // how to word it in a case sheet
  | "trap" // exam trap / common error
  | "mnemonic" // memory hook
  | "example" // clinical example / vignette
  | "sounds" // how patients actually say it
  | "analogy" // the picture that makes it stick
  | "note" // side note
  | "safety"; // red-flag / safety

export type Mcq = { q: Inline; options: Inline[]; answer: number; why?: Inline };
export type Card = { q: Inline; a: Inline };

export type Block =
  | { t: "h3"; text: Inline }
  | { t: "p"; text: Inline }
  | { t: "ul"; items: ListItem[] }
  | { t: "ol"; items: ListItem[] }
  | { t: "table"; head: Inline[]; rows: Inline[][] }
  | { t: "box"; kind: BoxKind; title?: Inline; blocks: Block[] }
  | { t: "recall"; items: Card[] }
  | { t: "mcq"; items: Mcq[] }
  | { t: "viva"; items: Card[] };

export type Section = {
  /** Stable id, e.g. "2-3" for "2.3". */
  id: string;
  /** Display number, e.g. "2.3". */
  num: string;
  title: string;
  /** core = expected in every exam; extra = depth for distinction answers. */
  tag?: "core" | "extra";
  /** The part of the module this section belongs to (e.g. "Part II · The MSE"). */
  part?: string;
  blocks: Block[];
  words: number;
  /** Section is the module test (has MCQs). */
  isTest: boolean;
};

export type Activity = {
  id: string;
  title: string;
  why: string;
  href: string;
  kind: "coach" | "lesson" | "detective" | "scenarios" | "terms" | "consult" | "notes";
};

export type ModuleMeta = {
  id: string;
  num: number;
  title: string;
  emoji: string;
  tagline: string;
  /** Curriculum place, e.g. "Weeks 1 to 2". */
  when: string;
  /** What you should be able to do by the end. */
  outcomes: string[];
  /** Write-it-out task for pass 3 (done on paper). */
  writeTask: string;
  activities: Activity[];
  /** Id of the one-page revision note, if any. */
  noteId?: string;
};

export type StudyModule = ModuleMeta & {
  sections: Section[];
  /** Estimated focused study time, in minutes (reading + recall). */
  minutes: number;
};
