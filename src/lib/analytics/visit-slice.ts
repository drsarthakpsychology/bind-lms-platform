/**
 * One slice of time on a page, made honest before it is stored.
 *
 * - It may not end in the future (a wrong clock cannot add hours).
 * - It may not cover time already stored for the same student: two tabs, or a
 *   replayed post, would otherwise count the same minutes twice. The slice is
 *   trimmed to start where the latest overlapping stored slice ends.
 * - What is left must be at least MIN_SECONDS, or nothing is stored.
 */
export const MIN_SECONDS = 2;

export type Slice = { enteredMs: number; seconds: number };

export function clampToNow(s: Slice, nowMs: number): Slice | null {
  const end = Math.min(s.enteredMs + s.seconds * 1000, nowMs + 5_000);
  const seconds = Math.floor((end - s.enteredMs) / 1000);
  return seconds >= MIN_SECONDS ? { enteredMs: s.enteredMs, seconds } : null;
}

/** `overlapEnds`: left_at (ms) of every stored slice that overlaps this one. */
export function trimOverlap(s: Slice, overlapEnds: number[]): Slice | null {
  const end = s.enteredMs + s.seconds * 1000;
  const start = Math.max(s.enteredMs, ...overlapEnds);
  const seconds = Math.floor((end - start) / 1000);
  return seconds >= MIN_SECONDS ? { enteredMs: start, seconds } : null;
}
