/**
 * Blitz rules: a 60-second fast-fact round, the only timed game. Pure (no
 * clock, no I/O) so the server can score a run from a signed state and the
 * rules are unit-tested.
 *
 * - 10 points per right answer, times the combo multiplier.
 * - The combo is the run of right answers in a row. A wrong answer resets it.
 * - Multiplier: x1 for combos 0 to 2, x2 from 3, x3 from 6, x4 from 10.
 * - The clock is the server's. Answers after the end (plus a small grace for
 *   the network) don't count, and answers faster than MIN_ANSWER_MS after the
 *   last one are refused.
 */

export const BLITZ_MS = 60_000;
/** Network allowance after the clock runs out. */
export const GRACE_MS = 1_500;
/** Faster than this is not a person reading a question. */
export const MIN_ANSWER_MS = 250;
export const BASE_POINTS = 10;
/** Upper bound on answers in one round (one every MIN_ANSWER_MS). */
export const MAX_ANSWERS = Math.ceil((BLITZ_MS + GRACE_MS) / MIN_ANSWER_MS);

export type RunState = {
  /** Questions answered so far (also the index of the current question). */
  answered: number;
  correct: number;
  score: number;
  combo: number;
  best: number;
};

export function emptyRun(): RunState {
  return { answered: 0, correct: 0, score: 0, combo: 0, best: 0 };
}

/** Combo steps where the multiplier goes up (and the big burst plays). */
export const COMBO_STEPS = [3, 6, 10] as const;

export function multiplier(combo: number): 1 | 2 | 3 | 4 {
  if (combo >= 10) return 4;
  if (combo >= 6) return 3;
  if (combo >= 3) return 2;
  return 1;
}

/** Apply one answer. Points use the multiplier the new combo reaches. */
export function step(s: RunState, right: boolean): { state: RunState; gained: number; levelUp: boolean } {
  if (!right) return { state: { ...s, answered: s.answered + 1, combo: 0 }, gained: 0, levelUp: false };
  const combo = s.combo + 1;
  const gained = BASE_POINTS * multiplier(combo);
  return {
    state: { answered: s.answered + 1, correct: s.correct + 1, score: s.score + gained, combo, best: Math.max(s.best, combo) },
    gained,
    levelUp: multiplier(combo) > multiplier(s.combo),
  };
}

export type Timing = { ok: true } | { ok: false; reason: "over" | "fast" };

/** Can an answer that reached the server at `now` count? */
export function timing(start: number, last: number, now: number): Timing {
  if (now > start + BLITZ_MS + GRACE_MS) return { ok: false, reason: "over" };
  if (now - last < MIN_ANSWER_MS) return { ok: false, reason: "fast" };
  return { ok: true };
}

/** XP for a finished round: effort first (one per right answer), a little for the score, capped. */
export function blitzXp(s: Pick<RunState, "correct" | "score">): number {
  if (s.correct <= 0) return 0;
  return Math.min(40, s.correct + Math.floor(s.score / 100));
}

/** Plausible-run check used before storing (belt and braces on top of the signed state). */
export function plausible(s: RunState): boolean {
  if (![s.answered, s.correct, s.score, s.combo, s.best].every((n) => Number.isInteger(n) && n >= 0)) return false;
  if (s.answered > MAX_ANSWERS || s.correct > s.answered || s.best > s.correct || s.combo > s.best) return false;
  return s.score <= s.correct * BASE_POINTS * 4;
}
