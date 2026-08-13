import type { SctResponse } from "./sct";

/**
 * SCT attempt persistence (Part 6.3) — mirror the osce/mse pattern.
 *
 * A completed judgment call is shaped client-side into an SctAttemptPayload
 * and POSTed to /api/practice/sct/attempt. Pure, tested, no network or auth.
 * One row per (item, user) — the table's unique constraint upserts.
 */

/** Shape of an SCT attempt payload sent to /api/practice/sct/attempt. */
export interface SctAttemptPayload {
  /** Seed item slug, e.g. "sct-1". */
  item_id: string;
  /** The student's rating, -2..2. */
  response: SctResponse;
  /** Panel-aligned score 0..1 (deterministic from the simulated panel). */
  scored: number;
  /** Seconds spent on the item. */
  seconds_spent: number;
}

/**
 * Build a persistence payload for a completed judgment call.
 * Pure, tested, no network or auth.
 */
export function buildSctAttemptPayload(
  itemId: string,
  response: SctResponse,
  scored: number,
  secondsSpent: number,
): SctAttemptPayload {
  return {
    item_id: itemId,
    response,
    scored,
    seconds_spent: secondsSpent,
  };
}
