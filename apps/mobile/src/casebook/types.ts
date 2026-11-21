/**
 * Casebook: short clinical games built from the course textbooks.
 *
 * Each activity is data (src/content/casebook/*.ts), played by one generic
 * player per format. All wording is original; `bookRef` points the educator
 * (and the curious student) to the chapter and pages it was built from.
 * Every activity carries `reviewFlags` and stays behind the "lab" switch
 * until an educator has reviewed it.
 */

export type BookRef = { book: string; chapter: string; pages: string };

export type Level = "Foundation" | "Intermediate" | "Advanced";

/** Display order: Foundation first, then Intermediate, then Advanced. */
export const LEVEL_ORDER: Record<Level, number> = { Foundation: 0, Intermediate: 1, Advanced: 2 };

/** Item difficulty for adaptive rounds: 1 = warm-up, 2 = standard, 3 = hard. */
export type Difficulty = 1 | 2 | 3;

type Base = {
  id: string;
  title: string;
  /** One plain line for the card. */
  hook: string;
  module: string;
  level: Level;
  objective: string;
  bookRef: BookRef;
  reviewFlags: string[];
  /** Shown after the score: the teaching point that ties the items together. */
  debrief?: string;
};

/** Read a patient's words, name the phenomenon. */
export type SpotterItem = { id: string; quote: string; answer: string; distractors: string[]; explain: string; ref?: string; difficulty?: Difficulty };
export type Spotter = Base & { format: "spotter"; categories: { id: string; label: string }[]; items: SpotterItem[] };

/** Vignette + single best answer. */
export type McqItem = { id: string; vignette: string; question?: string; options: string[]; answer: number; explain: string; ref?: string; difficulty?: Difficulty };
export type Differential = Base & { format: "differential"; items: McqItem[] };

/** How urgent? */
export type Urgency = "routine" | "soon" | "urgent";
export type TriageItem = { id: string; vignette: string; answer: Urgency; explain: string; ref?: string; difficulty?: Difficulty };
export type Triage = Base & { format: "triage"; items: TriageItem[] };

/** Put each item in the right group. */
export type SortItem = { id: string; text: string; category: string; explain?: string; difficulty?: Difficulty };
export type Sort = Base & { format: "sort"; categories: { id: string; label: string }[]; items: SortItem[] };

/** Match left to right (one-to-one). */
export type Matching = Base & { format: "matching"; pairs: { id: string; left: string; right: string }[] };

/** Choose the best response; every response is graded with a reason. */
export type SkillItem = { id: string; prompt: string; responses: { text: string; grade: "best" | "ok" | "poor"; why: string }[]; difficulty?: Difficulty };
export type Skill = Base & { format: "skill"; items: SkillItem[] };

/** Choose-your-path case. */
export type BranchNode = { id: string; text: string; choices: { text: string; next: string | null; feedback: string; good: boolean }[] };
export type Branching = Base & { format: "branching"; start: string; nodes: BranchNode[] };

/** Put events in order. */
export type Timeline = Base & { format: "timeline"; events: { id: string; when: string; text: string }[] };

export type CaseActivity = Spotter | Differential | Triage | Sort | Matching | Skill | Branching | Timeline;
export type CaseFormat = CaseActivity["format"];

export const FORMAT_LABEL: Record<CaseFormat, string> = {
  spotter: "Name it",
  differential: "Diagnose",
  triage: "How urgent?",
  sort: "Sort it",
  matching: "Match",
  skill: "Best response",
  branching: "Case path",
  timeline: "In order",
};

export const URGENCY_LABEL: Record<Urgency, string> = {
  routine: "Routine: note and mention",
  soon: "Soon: tell the prescriber this week",
  urgent: "Urgent: same-day medical help",
};
