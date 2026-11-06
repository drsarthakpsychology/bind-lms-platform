/**
 * AI-made practice cases ("AI case"). Shapes only, no runtime code, so both
 * the server and the browser can import them.
 *
 * The case shape reuses the Daily Case game's types (src/lib/games/daily),
 * and `toDailyCase()` in ./adapter.ts turns an AI case into a playable one.
 */

export type Setting = "indian" | "global";
export type Difficulty = 1 | 2 | 3;
export type AiCaseStatus = "live" | "flagged" | "removed";

export type { Chapter } from "@/lib/games/diagnoses";
export type { Investigation, InvestigationKind } from "@/lib/games/daily/types";
import type { Chapter } from "@/lib/games/diagnoses";
import type { DailyCase, Investigation } from "@/lib/games/daily/types";

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

/** The Daily Case game's case type: an AI case plays through the same engine. */
export type DailyCaseShape = DailyCase;

/** The one line every AI case carries for students. */
export const AI_CASE_LABEL = "AI case";
export const AI_CASE_NOTE = "Made by AI and checked by rules, not yet by a clinician";
