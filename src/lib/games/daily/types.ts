import type { Chapter } from "../diagnoses";

export type InvestigationKind = "mse" | "collateral" | "scale" | "lab";

/** Something the player can order instead of waiting for the next clue. Costs one clue point. */
export type Investigation = {
  kind: InvestigationKind;
  /** What the button says. Must not give the answer away (say "Mood and affect", not "HAM-D"). */
  label: string;
  result: string;
};

export type DailyCase = {
  /** Neutral id (never hints at the answer). */
  id: string;
  difficulty: 1 | 2 | 3;
  chapter: Chapter;
  /** Diagnosis id from DIAGNOSES. */
  answer: string;
  /** Other diagnosis ids or names accepted as the same answer. */
  synonyms: string[];
  /** One line: who and where (e.g. "Surat · outpatient clinic"). */
  setting: string;
  clues: [string, string, string, string, string, string];
  investigations: Investigation[];
  /** Look-alikes and the criterion that rules each one out. */
  differentials: { dx: string; whyNot: string }[];
  /** Second hint: where to look, without naming the answer. */
  pointer: string;
  /** Short teaching summary shown after the case. */
  overview: string;
  /** /study/<module> */
  module: string;
  /** Admin-only: book + page used to check the facts. */
  refs: string[];
};
