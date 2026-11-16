import { isBehind } from "@/lib/people/attention";

/**
 * A cohort's headline numbers, as the cohort page shows them: active this
 * week, lectures finished, falling behind, not signed in yet. Pure: it takes
 * each member's roster row (or nothing when the roster has no row for them).
 * Shared by the website's cohort page and the app's GET /admin/cohorts/:id.
 */
export type FigureRow = { presence: string; account: string; lecturesDone: number; lecturesAvailable: number } | undefined;

export function cohortFigures(rows: readonly FigureRow[]): { n: number; week: number; never: number; behind: number; done: number; avail: number; pct: number } {
  const n = rows.length;
  const week = rows.filter((r) => r && (r.presence === "now" || r.presence === "today" || r.presence === "week")).length;
  const never = rows.filter((r) => r && r.account !== "active" && r.account !== "locked").length;
  const behind = rows.filter((r) => r && r.account === "active" && isBehind(r.lecturesDone, r.lecturesAvailable)).length;
  const done = rows.reduce((a, r) => a + (r?.lecturesDone ?? 0), 0);
  const avail = rows.reduce((a, r) => a + (r?.lecturesAvailable ?? 0), 0);
  return { n, week, never, behind, done, avail, pct: avail ? Math.round((done / avail) * 100) : 0 };
}

/** Least finished first (the Progress tab's order). */
export function byProgress<T extends { r?: FigureRow }>(people: readonly T[]): T[] {
  const share = (x: T) => (x.r ? x.r.lecturesDone / Math.max(1, x.r.lecturesAvailable) : 0);
  return [...people].sort((a, b) => share(a) - share(b));
}
