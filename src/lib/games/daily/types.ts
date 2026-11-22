import type { Chapter } from "../diagnoses";
import type { Exam } from "../tags";

export type InvestigationKind = "mse" | "collateral" | "scale" | "lab";

/** Something the player can order instead of waiting for the next clue. Costs one clue point. */
export type Investigation = {
  kind: InvestigationKind;
  /** What the button says. Must not give the answer away (say "Mood and affect", not "HAM-D"). */
  label: string;
  result: string;
};

/**
 * The free starting picture a case opens with, so a student never guesses
 * from one line: who, the complaint in the patient's or family's words, how
 * long, and 2 or 3 things anyone in the room would notice. It never gives the
 * deciding detail; that stays in the clues and tests.
 */
export type Opening = {
  /** Name, age, work or school ("Meera, 34, a school teacher"). */
  who: string;
  /** The complaint in the patient's or family's own words. */
  says: string;
  /** How long ("About six weeks"). */
  since: string;
  /** 2 or 3 key observations. */
  seen: string[];
};

/**
 * Three guided hints, in order: 1 the area to think in, 2 the key detail and
 * why it matters, 3 narrow the choice to two or three names. The first two
 * never name the answer.
 */
export type GuideHints = [string, string, string];

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
  /** One short line: what the student should take away. Filled for every case (older cases via tags.ts). */
  objective?: string;
  /** Free starting picture (src/lib/games/daily/openings.ts). */
  opening?: Opening;
  /** Three guided hints (src/lib/games/daily/openings.ts). Built from the chapter and pointer when missing. */
  guide?: GuideHints;
  /** Exams the case is honestly useful for. */
  exams?: Exam[];
};
