/**
 * Elo / 1-parameter IRT ratings for the student model.
 *
 * - Every skill a student has gets an ability `theta`; every question gets a
 *   difficulty `b`. Both are on the logit scale, starting at 0.
 * - Chance of a right answer: P = 1 / (1 + e^-(theta - b)).
 * - After an answer with outcome o in [0, 1] (partial credit allowed):
 *     theta += K(n_student) * (o - P),   b -= K(n_item) * (o - P)
 *   with shrinking steps (student 0.9/(1+0.08n), item 0.4/(1+0.05n)), so early answers move a
 *   rating a lot and later ones settle it.
 * - Ability fades toward the prior when a skill isn't practised (forgetting).
 * Pure functions only.
 */

export const PRIOR_THETA = 0;
/** Ratings and percentiles stay hidden until this many graded answers. */
export const CALIBRATION_ANSWERS = 30;
/** Abilities are kept inside this range so one lucky streak can't run away. */
export const THETA_LIMIT = 4;

/** No decay for this many days after the last practice. */
export const DECAY_GRACE_DAYS = 3;
/** After the grace period, the gain above the prior halves every this many days. */
export const DECAY_HALF_LIFE_DAYS = 45;

const DAY_MS = 86_400_000;

export function clampTheta(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.max(-THETA_LIMIT, Math.min(THETA_LIMIT, x));
}

export function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

/** Chance of a right answer for ability `theta` on a question of difficulty `b`. */
export function prob(theta: number, b = 0): number {
  return 1 / (1 + Math.exp(-(theta - b)));
}

/** Step size after `n` earlier answers (same rule for students and questions). */
export function kFactor(n: number): number {
  return 0.4 / (1 + 0.05 * Math.max(0, n));
}

/**
 * Student step: larger at first so a new learner can reach mastery in a
 * handful of right answers (about 7 from scratch) instead of ~23, then settling.
 * Items keep the smaller kFactor so one student can't swing a question's difficulty.
 */
export function studentK(n: number): number {
  return 0.9 / (1 + 0.08 * Math.max(0, n));
}

export type Rated = { theta: number; n: number };
export type ItemRating = { b: number; n: number };

/** One answer: move the student's ability and the question's difficulty. */
export function eloUpdate(student: Rated, item: ItemRating, outcome: number): { student: Rated; item: ItemRating; p: number } {
  const o = clamp01(outcome);
  const p = prob(student.theta, item.b);
  const err = o - p;
  return {
    p,
    student: { theta: clampTheta(student.theta + studentK(student.n) * err), n: student.n + 1 },
    item: { b: clampTheta(item.b - kFactor(item.n) * err), n: item.n + 1 },
  };
}

export function daysBetween(from: Date | string | null | undefined, to: Date): number {
  if (!from) return 0;
  const t = typeof from === "string" ? Date.parse(from) : from.getTime();
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, (to.getTime() - t) / DAY_MS);
}

/**
 * Ability after time away. Only the gain above the prior fades: a weak skill
 * does not get better by being left alone, so a theta below the prior stays.
 */
export function decayedTheta(theta: number, lastAt: Date | string | null | undefined, now: Date, prior = PRIOR_THETA): number {
  if (theta <= prior) return theta;
  const idle = daysBetween(lastAt, now) - DECAY_GRACE_DAYS;
  if (idle <= 0) return theta;
  return prior + (theta - prior) * Math.pow(0.5, idle / DECAY_HALF_LIFE_DAYS);
}

/**
 * Best guess of ability from a handful of answers (placement): the most likely
 * theta under the 1PL model with a gentle normal prior (sd 1.5), found with a
 * few Newton steps. Few answers → stays near the prior.
 */
export function estimateTheta(answers: { b: number; outcome: number }[], prior = PRIOR_THETA, sd = 1.5): number {
  let t = prior;
  const inv = 1 / (sd * sd);
  for (let k = 0; k < 25; k++) {
    let g = -(t - prior) * inv;
    let h = -inv;
    for (const a of answers) {
      const p = prob(t, a.b);
      g += clamp01(a.outcome) - p;
      h -= p * (1 - p);
    }
    const step = g / h;
    t = clampTheta(t - step);
    if (Math.abs(step) < 1e-6) break;
  }
  return t;
}

/** Enough graded answers to show ratings and percentiles? (~30, owner decision 41) */
export function isCalibrated(n: number): boolean {
  return n >= CALIBRATION_ANSWERS;
}

/** Answers still needed before ratings show. */
export function answersToCalibrate(n: number): number {
  return Math.max(0, CALIBRATION_ANSWERS - n);
}
