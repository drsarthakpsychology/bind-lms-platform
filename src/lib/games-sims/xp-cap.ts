/**
 * A day's XP from one game has a ceiling. Each finished run pays once (its
 * ref is unique), but the run id comes from the browser, so without a ceiling
 * a script could finish "new" runs forever. Pure, so it is unit-tested.
 */

/** Most XP one game can pay a student in one India day. */
export const GAME_XP_DAY_CAP = 400;
/** Most XP one run can pay. */
export const GAME_XP_RUN_CAP = 200;

/** What this run may still pay, given what the same game already paid today. */
export function cappedPay(paidToday: number, want: number): number {
  const w = Math.max(0, Math.min(GAME_XP_RUN_CAP, Math.round(Number.isFinite(want) ? want : 0)));
  const left = Math.max(0, GAME_XP_DAY_CAP - Math.max(0, Number.isFinite(paidToday) ? paidToday : 0));
  return Math.min(w, left);
}
