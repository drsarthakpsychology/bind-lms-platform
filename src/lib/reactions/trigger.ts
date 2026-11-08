import type { Mood } from "./stickers";

/**
 * When a reaction fires (pure, so it is tested without a browser).
 *
 * Always fires (unless throttled, timed or switched off):
 * - the first right answer of a session,
 * - a streak of 3, 5 or 10 right,
 * - 2 wrong in a row,
 * - a right answer straight after 2 or more wrong ("surprise").
 * Otherwise about 1 answer in 4.
 *
 * Never more than one every THROTTLE_MS, never while a clock runs (mock exam,
 * live Duel, timed Blitz: those show one on the end screen instead), and
 * never with the switch off. The run counters still move in every case, so a
 * streak keeps counting while a reaction is held back.
 */

export const THROTTLE_MS = 15_000;
export const STREAK_MARKS: readonly number[] = [3, 5, 10];
export const RANDOM_RATE = 0.25;

export type Run = {
  /** Right answers in a row. */
  streak: number;
  /** Wrong answers in a row. */
  wrongRun: number;
  /** Has a right answer happened yet this session? */
  hadRight: boolean;
  answered: number;
};

export type AnswerCtx = {
  /** A clock is running (mock exam, live Duel, timed Blitz). */
  timed?: boolean;
  /** Partly right (a near miss, or right only after a hint or a wrong try). */
  partial?: boolean;
};

export type Env = {
  now: number;
  /** When the last reaction showed (0 if never). */
  lastShownAt: number;
  /** 0 to 1. */
  rand: () => number;
  enabled: boolean;
};

export type Why = "first-right" | "streak" | "surprise" | "wrong-run" | "random";

export type Decision = { run: Run; mood: Mood | null; why: Why | null };

export function newRun(): Run {
  return { streak: 0, wrongRun: 0, hadRight: false, answered: 0 };
}

/** Move the run on by one answer and say which reaction (if any) to show. */
export function decide(run: Run, correct: boolean, ctx: AnswerCtx, env: Env): Decision {
  const next: Run = correct
    ? { streak: run.streak + 1, wrongRun: 0, hadRight: true, answered: run.answered + 1 }
    : { streak: 0, wrongRun: run.wrongRun + 1, hadRight: run.hadRight, answered: run.answered + 1 };

  let want: { mood: Mood; why: Why } | null = null;
  if (correct && run.wrongRun >= 2) want = { mood: "surprise", why: "surprise" };
  else if (correct && STREAK_MARKS.includes(next.streak)) want = { mood: "streak", why: "streak" };
  else if (correct && !run.hadRight) want = { mood: ctx.partial ? "near" : "right", why: "first-right" };
  else if (!correct && next.wrongRun === 2) want = { mood: ctx.partial ? "near" : "wrong", why: "wrong-run" };
  else if (env.rand() < RANDOM_RATE) want = { mood: ctx.partial ? "near" : correct ? "right" : "wrong", why: "random" };

  const blocked = !env.enabled || ctx.timed === true || (env.lastShownAt > 0 && env.now - env.lastShownAt < THROTTLE_MS);
  if (!want || blocked) return { run: next, mood: null, why: null };
  return { run: next, mood: want.mood, why: want.why };
}
