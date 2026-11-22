/**
 * Clinic detective's numbers and shapes, with no case data in this file, so
 * the browser can import it without carrying the answers or the clues.
 */
export const POINTS = [40, 30, 20, 10] as const;
export const WRONG_PENALTY = 5;
export const ROUNDS = 8;
export const CLUES = 4;

export type Family = "drug" | "disorder" | "mixed";
/** What the browser holds for one round. */
export type DealtRound = { options: string[]; clue: string; /** Free starting picture, shown before clue 1. */ picture?: string; /** The options as names (the app shows these; `options` are ids). */ names?: string[] };
/** Up to three guided hints a case: the first is free, the next two cost HINT_COST points each. */
export const HINTS = 3;
export const HINT_COST = [0, 5, 5] as const;
/** Points lost to the first `n` hints. */
export function hintLoss(n: number): number {
  let t = 0;
  for (let i = 0; i < Math.min(Math.max(0, Math.floor(n)), HINTS); i++) t += HINT_COST[i];
  return t;
}
