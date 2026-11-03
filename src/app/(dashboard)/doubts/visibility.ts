/**
 * Who may see (and so act on) a doubt. Mirrors loadDoubt() in
 * src/lib/doubts/data.ts so the write actions enforce the same rule as the
 * page: admins see everything; a complaint is private to its writer; a hidden
 * post is visible only to its writer; a doubt is visible to its writer, to
 * everyone when it has no cohort, and otherwise to members of its cohort.
 */
export type DoubtRow = { user_id: string; kind: string; status: string; cohort_id: string | null };
export type Viewer = { id: string; isAdmin: boolean; cohortIds: string[] };

export function canSeeDoubt(d: DoubtRow, v: Viewer): boolean {
  if (v.isAdmin) return true;
  const mine = d.user_id === v.id;
  if (mine) return true;
  if (d.status === "hidden") return false;
  if (d.kind !== "doubt") return false;
  return d.cohort_id === null || v.cohortIds.includes(d.cohort_id);
}

/** Replying or voting also needs the thread to be live (not hidden) for non-admins. */
export function canParticipate(d: DoubtRow, v: Viewer): boolean {
  return canSeeDoubt(d, v) && (v.isAdmin || d.status !== "hidden");
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (x: unknown): x is string => typeof x === "string" && UUID_RE.test(x);
