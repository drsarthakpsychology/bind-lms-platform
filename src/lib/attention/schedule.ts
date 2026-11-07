/**
 * "Still watching?" checks during lectures (owner decision 2026-11-06):
 * a check appears at a random moment every 12 to 20 minutes of actual playback;
 * if nobody taps "Yes" within 60 seconds the video pauses and goes back to
 * where the check appeared, so the unattended minutes don't count as watched.
 * Pure timing rules, so they are tested.
 */
export const CHECK_MIN_S = 12 * 60;
export const CHECK_MAX_S = 20 * 60;
export const ANSWER_WINDOW_MS = 60 * 1000;
/** Don't ask in the last half-minute of a lecture. */
export const NO_CHECK_NEAR_END_S = 30;

/** Seconds of playback until the next check, from a random number in [0, 1). */
export function nextCheckAfter(rand: number): number {
  const r = Math.min(Math.max(rand, 0), 0.999999);
  return Math.round(CHECK_MIN_S + r * (CHECK_MAX_S - CHECK_MIN_S));
}

export function shouldAsk(playedS: number, targetS: number, currentTime: number, duration: number): boolean {
  return targetS > 0 && playedS >= targetS && duration - currentTime > NO_CHECK_NEAR_END_S;
}

export function isMissed(askedAtMs: number, nowMs: number): boolean {
  return nowMs - askedAtMs >= ANSWER_WINDOW_MS;
}
