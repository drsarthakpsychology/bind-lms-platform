/**
 * AI-made practice cases ("AI case"). Shapes only, no runtime code, so both
 * the server and the browser can import them.
 *
 * `DailyCaseShape` mirrors the Daily Case game's case type field for field
 * (src/lib/games/daily/types.ts on the games branch). If that type exists at
 * merge time, `toDailyCase()` in ./adapter.ts is the one place to adapt.
 */

export type Setting = "indian" | "global";
export type Difficulty = 1 | 2 | 3;
export type AiCaseStatus = "live" | "flagged" | "removed";

export type InvestigationKind = "mse" | "collateral" | "scale" | "lab";

export type Investigation = {
  kind: InvestigationKind;
  /** Button text. Must not give the answer away. */
  label: string;
  result: string;
};

/** Diagnosis chapter (same ids as the games' diagnosis list). */
export type Chapter =
  | "neurodevelopmental"
  | "psychotic"
  | "bipolar"
  | "depressive"
  | "anxiety"
  | "ocd"
  | "trauma"
  | "dissociative"
  | "somatic"
  | "eating"
  | "sleep"
  | "disruptive"
  | "substance"
  | "neurocognitive"
  | "personality";

/** What the generator is asked for. */
export type AiCaseInput = {
  /** Diagnosis id from the criteria list (e.g. "mdd"). */
  dx: string;
  difficulty: Difficulty;
  setting: Setting;
};

/** Which clue or investigation proves a checklist item. */
export type EvidenceRef = { criterion: string; source: "clue" | "investigation"; index: number };

/** An accepted AI case, as stored in `ai_cases.case_data`. */
export type AiCase = {
  id: string;
  /** Always true: the UI must show the "AI case" badge. */
  ai: true;
  difficulty: Difficulty;
  setting: Setting;
  chapter: Chapter;
  /** Diagnosis id. */
  answer: string;
  /** Who and where, e.g. "Indore · district hospital OPD". */
  place: string;
  clues: [string, string, string, string, string, string];
  investigations: Investigation[];
  differentials: { dx: string; whyNot: string }[];
  /** Where to look, without naming the answer. */
  pointer: string;
  /** Teaching summary shown after the case. */
  overview: string;
  /** /study/<module> */
  module: string;
  /** Learner-model topic (e.g. "depression"). */
  topic: string;
  /** The checklist proof the validator accepted. */
  evidence: EvidenceRef[];
  /** Validator version that accepted this case. */
  checkedBy: string;
  createdAt: string;
};

/** A stored row plus moderation fields. */
export type AiCaseRecord = AiCase & {
  status: AiCaseStatus;
  flags: number;
};

/** Field-for-field copy of the Daily Case game's `DailyCase`. */
export type DailyCaseShape = {
  id: string;
  difficulty: 1 | 2 | 3;
  chapter: Chapter;
  answer: string;
  synonyms: string[];
  setting: string;
  clues: [string, string, string, string, string, string];
  investigations: Investigation[];
  differentials: { dx: string; whyNot: string }[];
  pointer: string;
  overview: string;
  module: string;
  refs: string[];
};

/** The one line every AI case carries for students. */
export const AI_CASE_LABEL = "AI case";
export const AI_CASE_NOTE = "Made by AI and checked by rules, not yet by a clinician";
