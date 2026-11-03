/**
 * Who can watch which lecture, as plain rules (no database here, so it can be
 * tested). The loader in ./access.ts fills these shapes from Supabase.
 *
 * - Admins see everything.
 * - A lecture given to one person (a "grant") is always visible to them.
 * - A student in one or more cohorts sees the lectures shared with any of
 *   their cohorts, and nothing else.
 * - A student in no cohort keeps the old rules (decided by the caller), so
 *   nobody loses access before they are placed in a cohort.
 */
export type StudentAccess = {
  /** The student's cohorts. Empty = not placed in a cohort yet. */
  cohortIds: string[];
  /** Lecture ids shared with any of those cohorts. */
  cohortLessonIds: Set<string>;
  /** Lecture ids given to this person directly. */
  grantedLessonIds: Set<string>;
};

export const NO_ACCESS_DATA: StudentAccess = { cohortIds: [], cohortLessonIds: new Set(), grantedLessonIds: new Set() };

/** True when cohort rules decide, false when the caller's old rules apply. */
export function usesCohorts(a: StudentAccess): boolean {
  return a.cohortIds.length > 0;
}

/**
 * Can this person watch this lecture?
 * `legacy` is the old answer (course enrolment or lectures-only scope) and is
 * used only when the person is in no cohort.
 */
export function canWatch(a: StudentAccess, lessonId: string, legacy: boolean, isAdmin = false): boolean {
  if (isAdmin) return true;
  if (a.grantedLessonIds.has(lessonId)) return true;
  if (usesCohorts(a)) return a.cohortLessonIds.has(lessonId);
  return legacy;
}

/** Filter a lecture list down to what this person can see. */
export function filterLessons<T extends { id: string }>(a: StudentAccess, lessons: T[], legacy: boolean, isAdmin = false): T[] {
  if (isAdmin) return lessons;
  if (!usesCohorts(a) && a.grantedLessonIds.size === 0) return legacy ? lessons : [];
  return lessons.filter((l) => canWatch(a, l.id, legacy, isAdmin));
}

/** Split a pasted list of emails (commas, spaces, new lines, semicolons). */
export function parseEmails(text: string): { valid: string[]; invalid: string[] } {
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const raw of text.split(/[\s,;]+/)) {
    const e = raw.trim().replace(/^<|>$/g, "").toLowerCase();
    if (!e) continue;
    if (seen.has(e)) continue;
    seen.add(e);
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) valid.push(e);
    else invalid.push(raw.trim());
  }
  return { valid, invalid };
}
