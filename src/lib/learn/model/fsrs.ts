/**
 * Spaced review: a small FSRS-style scheduler.
 *
 * Why FSRS (and not SM-2): FSRS models memory directly. Each card has a
 * `stability` S (days until the chance of remembering falls to 90 %) and a
 * `difficulty` D (1 easy … 10 hard). Because S is defined at 90 % recall, the
 * next review is simply due after about S days when we aim for ~90 %
 * retention, which is what the research report asks for. SM-2's fixed ease
 * factors drift and can't target a retention level.
 *
 * This is FSRS-4.5 with its published default weights (no per-student
 * optimiser yet: too little data). Forgetting curve:
 *   R(t) = (1 + FACTOR * t / S) ^ DECAY,  DECAY = -0.5, FACTOR = 19/81,
 * so R(S) = 0.9. Interval for a target retention r:
 *   I = S / FACTOR * (r^(1/DECAY) - 1)   (= S when r = 0.9)
 * Grades: 1 Again, 2 Hard, 3 Good, 4 Easy, mapped from the answer's outcome.
 * Intervals are clamped to 1 … 365 days. Pure functions only.
 */

export const TARGET_RETENTION = 0.9;
export const MAX_INTERVAL_DAYS = 365;
const DECAY = -0.5;
const FACTOR = 19 / 81;
const DAY_MS = 86_400_000;

/** FSRS-4.5 default weights. */
export const W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755] as const;

export type Grade = 1 | 2 | 3 | 4;
export type Card = { stability: number; difficulty: number; dueAt: string; lastAt: string | null; reps: number; lapses: number };

/** Outcome 0 to 1 → grade. Wrong = Again, partial = Hard, right = Good, right and fast = Easy. */
export function gradeFor(outcome: number, fast = false): Grade {
  if (!(outcome >= 0.5)) return 1;
  if (outcome < 0.8) return 2;
  return fast ? 4 : 3;
}

const clampD = (d: number) => Math.max(1, Math.min(10, d));

export function retrievability(elapsedDays: number, stability: number): number {
  if (stability <= 0) return 0;
  return Math.pow(1 + (FACTOR * Math.max(0, elapsedDays)) / stability, DECAY);
}

export function intervalDays(stability: number, retention = TARGET_RETENTION): number {
  const raw = (stability / FACTOR) * (Math.pow(retention, 1 / DECAY) - 1);
  return Math.max(1, Math.min(MAX_INTERVAL_DAYS, Math.round(raw)));
}

function initStability(g: Grade): number {
  return Math.max(0.1, W[g - 1]);
}
function initDifficulty(g: Grade): number {
  return clampD(W[4] - (g - 3) * W[5]);
}

function nextDifficulty(d: number, g: Grade): number {
  const dPrime = d - W[6] * (g - 3);
  return clampD(W[7] * initDifficulty(3) + (1 - W[7]) * dPrime);
}

function stabilityAfterRecall(d: number, s: number, r: number, g: Grade): number {
  const hard = g === 2 ? W[15] : 1;
  const easy = g === 4 ? W[16] : 1;
  return s * (Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hard * easy + 1);
}

function stabilityAfterLapse(d: number, s: number, r: number): number {
  const next = W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r));
  return Math.min(s, Math.max(0.1, next));
}

function addDaysIso(now: Date, days: number): string {
  return new Date(now.getTime() + days * DAY_MS).toISOString();
}

/** Schedule a card after one review. `prev` undefined = first time seen. */
export function review(prev: Card | undefined, g: Grade, now: Date): Card {
  if (!prev || prev.reps === 0) {
    const stability = initStability(g);
    const days = g === 1 ? 1 : intervalDays(stability);
    return { stability, difficulty: initDifficulty(g), dueAt: addDaysIso(now, days), lastAt: now.toISOString(), reps: 1, lapses: g === 1 ? 1 : 0 };
  }
  const elapsed = prev.lastAt ? Math.max(0, (now.getTime() - Date.parse(prev.lastAt)) / DAY_MS) : 0;
  const r = retrievability(elapsed, prev.stability);
  const difficulty = nextDifficulty(prev.difficulty, g);
  const stability = g === 1 ? stabilityAfterLapse(prev.difficulty, prev.stability, r) : stabilityAfterRecall(prev.difficulty, prev.stability, r, g);
  const days = g === 1 ? 1 : intervalDays(stability);
  return { stability, difficulty, dueAt: addDaysIso(now, days), lastAt: now.toISOString(), reps: prev.reps + 1, lapses: prev.lapses + (g === 1 ? 1 : 0) };
}

export function isDue(card: Pick<Card, "dueAt">, now: Date): boolean {
  const t = Date.parse(card.dueAt);
  return Number.isFinite(t) && t <= now.getTime();
}
