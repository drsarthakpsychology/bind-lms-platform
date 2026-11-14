/**
 * Daily ceiling on the server XP one game can pay a student. A finished run
 * is re-graded on the server, but its run id or seed comes from the browser,
 * so without a ceiling a script could replay a solved run under new ids and
 * farm unlimited league points. The ceiling is far above honest play (about
 * ten full-mark runs of one game in a day).
 */
export const GAME_XP_PER_DAY = 400;

/** What may still be paid today, given what this game already paid today. */
export function cappedGameXp(paidToday: number, amount: number, cap = GAME_XP_PER_DAY): number {
  const room = Math.max(0, cap - Math.max(0, Number.isFinite(paidToday) ? paidToday : cap));
  return Math.max(0, Math.min(Math.round(amount), room));
}
