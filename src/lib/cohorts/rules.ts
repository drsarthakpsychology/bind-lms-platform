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
  /** Lecture id -> which of this person's own cohorts it is shared with. */
  cohortsByLesson?: Map<string, string[]>;
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

/* ------------------------------------------------- recordings by cohort --- */

/** A cohort as the course page sees it. */
export type CourseCohortLite = { id: string; name: string; status: string };

/** The value the upload form sends for "All cohorts". */
export const ALL_COHORTS = "all";

/** The cohorts a new recording can go to: the course's cohorts that haven't ended. */
export function liveCohorts<T extends { status: string }>(cohorts: T[]): T[] {
  return cohorts.filter((c) => c.status !== "ended");
}

/**
 * Which choice the upload form starts on: the cohort in the link (?cohort=)
 * if it is one of the live cohorts, else the only live cohort, else nothing
 * (the admin must pick).
 */
export function defaultRecordingChoice(cohorts: CourseCohortLite[], fromLink?: string | null): string | null {
  const live = liveCohorts(cohorts);
  if (fromLink && live.some((c) => c.id === fromLink)) return fromLink;
  if (live.length === 1) return live[0].id;
  return null;
}

export type RecordingShare =
  | { ok: true; cohortIds: string[]; notice: string }
  | { ok: false; error: string };

/**
 * Check the upload form's "Which cohort is this recording for?" answer and
 * turn it into the cohorts to share with. `cohorts` are this course's cohorts.
 * - one cohort id: that cohort only (it must be a live cohort of this course)
 * - "all": every live cohort of this course
 * - no live cohorts: nothing to pick; shared with none (people in no cohort
 *   keep seeing it under the old rules)
 */
export function resolveRecordingShare(choice: string | null | undefined, cohorts: CourseCohortLite[]): RecordingShare {
  const live = liveCohorts(cohorts);
  if (!live.length) return { ok: true, cohortIds: [], notice: "Uploaded. This course has no running cohort yet." };
  const pick = (choice ?? "").trim();
  if (!pick) return { ok: false, error: "Pick which cohort this recording is for." };
  if (pick === ALL_COHORTS) {
    return { ok: true, cohortIds: live.map((c) => c.id), notice: live.length === 1 ? `Uploaded for ${live[0].name}.` : "Uploaded for all cohorts." };
  }
  const c = live.find((x) => x.id === pick);
  if (!c) return { ok: false, error: "That cohort isn't running in this course. Pick again." };
  return { ok: true, cohortIds: [c.id], notice: live.length === 1 ? `Uploaded for ${c.name}.` : `Uploaded for ${c.name} only.` };
}

export type ShareLabel = { kind: "none" } | { kind: "all" } | { kind: "some"; names: string[] };

/**
 * What the admin lecture list says a lecture is shared with.
 * "All cohorts" only when there are 2+ live cohorts and it is shared with
 * every one of them; otherwise the cohort names, or "none".
 */
export function shareLabel(sharedWith: string[], cohorts: CourseCohortLite[]): ShareLabel {
  const set = new Set(sharedWith);
  const known = cohorts.filter((c) => set.has(c.id));
  if (!known.length) return { kind: "none" };
  const live = liveCohorts(cohorts);
  if (live.length >= 2 && live.every((c) => set.has(c.id))) return { kind: "all" };
  return { kind: "some", names: known.map((c) => c.name) };
}

/**
 * The course-page lecture filter. `filter` is a cohort id, "none" (shared with
 * no cohort) or empty (everything).
 */
export function filterByCohort<T extends { id: string }>(lessons: T[], links: Map<string, string[]>, filter: string | null | undefined): T[] {
  if (!filter) return lessons;
  if (filter === "none") return lessons.filter((l) => !(links.get(l.id) ?? []).length);
  return lessons.filter((l) => (links.get(l.id) ?? []).includes(filter));
}

/**
 * The student's own cohorts a lecture is shared with (for the chip on each
 * lecture). Only ever names the student's own cohorts.
 */
export function myCohortsFor(lessonId: string, links: Map<string, string[]> | undefined, mine: { id: string; name: string }[]): { id: string; name: string }[] {
  const ids = new Set(links?.get(lessonId) ?? []);
  return mine.filter((c) => ids.has(c.id));
}

/**
 * Check one explicit change to one person's cohorts from the course page:
 * add them to one cohort, or take them out of one. Their other cohorts are
 * never touched.
 */
export function checkMembershipChange(
  op: "add" | "remove",
  cohortId: string,
  current: string[],
  cohorts: CourseCohortLite[],
): { ok: true; cohort: CourseCohortLite } | { ok: false; error: string } {
  const cohort = cohorts.find((c) => c.id === cohortId);
  if (!cohort) return { ok: false, error: "That cohort isn't in this course." };
  const isIn = current.includes(cohortId);
  if (op === "add") {
    if (cohort.status === "ended") return { ok: false, error: `${cohort.name} has ended. Pick a running cohort.` };
    if (isIn) return { ok: false, error: `Already in ${cohort.name}.` };
  } else if (!isIn) {
    return { ok: false, error: `Not in ${cohort.name}.` };
  }
  return { ok: true, cohort };
}
