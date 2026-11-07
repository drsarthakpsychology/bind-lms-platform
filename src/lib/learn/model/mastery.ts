/**
 * Mastery states for one skill, shown on the map as icon + word.
 *
 * - new       → no graded answers yet ("Not started")
 * - learning  → practising, not there yet
 * - shaky     → practised, but getting it wrong more often than not
 * - mastered  → P(right on this skill's own questions) ≥ 0.85, judged at
 *               the median difficulty of the skill's questions in use (b = 0
 *               when none are known yet), without the guessing floor: mastery
 *               is about knowing, not about lucky picks
 *               AND ≥ 3 correct first attempts
 *               AND those correct first attempts span ≥ 2 different days
 * - decaying  → it was mastered, but hasn't been practised for a while, so it
 *               "needs review" (time away fades the ability, see elo.ts)
 * Pure functions only.
 */
import { decayedTheta, daysBetween, prob } from "./elo";

export const MASTERY_STATES = ["new", "learning", "shaky", "mastered", "decaying"] as const;
export type Mastery = (typeof MASTERY_STATES)[number];

export const MASTERY_P = 0.85;
export const MASTERY_CORRECT = 3;
export const MASTERY_DAYS = 2;
/** A mastered skill not practised for this long needs review. */
export const REVIEW_AFTER_DAYS = 21;
/** At least this many answers before we call a skill "shaky". */
export const SHAKY_MIN_ANSWERS = 3;
export const SHAKY_P = 0.5;
/** correct_days keeps only the most recent entries. */
export const CORRECT_DAYS_KEEP = 10;

export type SkillSnapshot = {
  theta: number;
  n: number;
  lastAt: string | null;
  /** One IST date (YYYY-MM-DD) per correct first attempt, newest last. */
  correctDays: string[];
};

export const MASTERY_LABEL: Record<Mastery, string> = {
  new: "Not started",
  learning: "Learning",
  shaky: "Shaky",
  mastered: "Mastered",
  decaying: "Needs review",
};

/** Lower = needs work sooner. Used to sort weak spots. */
export const MASTERY_RANK: Record<Mastery, number> = { shaky: 0, decaying: 1, learning: 2, new: 3, mastered: 4 };

/** Record one more correct first attempt (dates may repeat; capped). */
export function addCorrectDay(days: string[], day: string): string[] {
  return [...days, day].slice(-CORRECT_DAYS_KEEP);
}

export function meetsMasteryEvidence(correctDays: string[]): boolean {
  return correctDays.length >= MASTERY_CORRECT && new Set(correctDays).size >= MASTERY_DAYS;
}

/** `refB`: the difficulty mastery is judged at (the median of the skill's own questions). */
export function masteryOf(s: SkillSnapshot, now: Date, refB = 0): Mastery {
  if (s.n <= 0) return "new";
  const b = Number.isFinite(refB) ? refB : 0;
  const raw = prob(s.theta, b);
  const evidence = meetsMasteryEvidence(s.correctDays);
  if (raw >= MASTERY_P && evidence) {
    const faded = prob(decayedTheta(s.theta, s.lastAt, now), b);
    if (daysBetween(s.lastAt, now) >= REVIEW_AFTER_DAYS || faded < MASTERY_P) return "decaying";
    return "mastered";
  }
  const p = prob(decayedTheta(s.theta, s.lastAt, now), b);
  if (s.n >= SHAKY_MIN_ANSWERS && p < SHAKY_P) return "shaky";
  return "learning";
}
