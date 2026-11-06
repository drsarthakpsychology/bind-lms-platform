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
  | { t: "viva"; items: Card[] }
  /** Shown only in one reading view (the Student / Clinician switch). */
  | { t: "view"; view: "student" | "clinician"; blocks: Block[] }
  /** An interactive piece (guess, decide, sort, build, moodline, worked, synapse). Data is JSON in the source. */
  | { t: "widget"; kind: WidgetKind; data: WidgetData };

/** Starting → Beginner → Advanced. Each level opens when the previous level check is passed. */
export type Level = "starting" | "beginner" | "advanced";
export const LEVELS: Level[] = ["starting", "beginner", "advanced"];

export type WidgetKind = "guess" | "decide" | "sort" | "build" | "moodline" | "worked" | "synapse" | "reveal";

export type GuessData = { prompt: Inline; min: number; max: number; step?: number; unit: string; answer: [number, number]; reveal: Inline; clinician?: Inline };
export type DecideData = {
  scene: Inline;
  ask: Inline;
  choices: { label: Inline; verdict: "best" | "ok" | "harm"; outcome: Inline; why: Inline }[];
};
export type SortData = { prompt: Inline; buckets: Inline[]; items: { text: Inline; bucket: number; why?: Inline }[] };
export type BuildData = {
  vignette: Inline;
  rule: Inline;
  symptoms: { label: Inline; present: boolean; core?: boolean; why?: Inline }[];
  need: number;
  needCore: boolean;
  verdict: Inline;
};
export type MoodlineData = { prompt: Inline; series: number[]; labels?: string[]; options: Inline[]; answer: number; why: Inline };
export type WorkedData = { title: Inline; steps: { q: Inline; a: Inline }[]; yourTurn?: { q: Inline; a: Inline }[] };
export type SynapseData = { drug: "ssri" | "snri" | "maoi" | "none"; caption: Inline };
export type RevealData = { prompt: Inline; answer: Inline };
export type WidgetData = GuessData | DecideData | SortData | BuildData | MoodlineData | WorkedData | SynapseData | RevealData;

export type Section = {
  /** Stable id, e.g. "2-3" for "2.3". */
  id: string;
  /** Display number, e.g. "2.3". */
  num: string;
  title: string;
  /** core = expected in every exam; extra = depth for distinction answers. */
  tag?: "core" | "extra";
  /** Level within the module (interactive modules). */
  level?: Level;
  /** This section is the check that opens the next level. */
  levelCheck?: Level;
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
