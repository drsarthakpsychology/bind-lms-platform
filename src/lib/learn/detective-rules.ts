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
export type DealtRound = { options: string[]; clue: string };
