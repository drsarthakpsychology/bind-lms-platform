import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { NO_ACCESS_DATA, type StudentAccess } from "./rules";

export type CohortRow = {
  id: string;
  name: string;
  course_id: string | null;
  starts_on: string | null;
  ends_on: string | null;
  status: "upcoming" | "active" | "ended";
  created_at: string;
};

/**
 * One person's lecture access: their cohorts, the lectures those cohorts can
 * watch, and any lecture given to them directly. Cached for the request.
 *
 * Read with the server key (the rules are enforced here, in server code).
 * If the cohort tables don't exist yet (the database file hasn't been run),
 * this returns "no cohorts", so the old rules keep working.
 */
export const loadStudentAccess = cache(async (userId: string): Promise<StudentAccess> => {
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NO_ACCESS_DATA;
  }
  const [{ data: members, error: mErr }, { data: grants, error: gErr }] = await Promise.all([
    admin.from("cohort_members").select("cohort_id").eq("user_id", userId),
    admin.from("lesson_grants").select("lesson_id").eq("user_id", userId),
  ]);
  if (mErr || gErr) return NO_ACCESS_DATA;
  const cohortIds = (members ?? []).map((m) => m.cohort_id as string);
  const cohortsByLesson = new Map<string, string[]>();
  if (cohortIds.length) {
    const { data: links } = await admin.from("lesson_cohorts").select("lesson_id, cohort_id").in("cohort_id", cohortIds).limit(20000);
    for (const l of links ?? []) {
      const k = l.lesson_id as string;
      cohortsByLesson.set(k, [...(cohortsByLesson.get(k) ?? []), l.cohort_id as string]);
    }
  }
  return {
    cohortIds,
    cohortLessonIds: new Set(cohortsByLesson.keys()),
    grantedLessonIds: new Set((grants ?? []).map((g) => g.lesson_id as string)),
    cohortsByLesson,
  };
});

/** The names of a person's cohorts, for "You're in Cohort 2" on their screens. */
export const loadMyCohorts = cache(async (userId: string): Promise<{ id: string; name: string }[]> => {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.from("cohort_members").select("cohort_id, cohorts(id, name)").eq("user_id", userId);
    if (error) return [];
    return (data ?? [])
      .map((r) => (Array.isArray(r.cohorts) ? r.cohorts[0] : r.cohorts) as { id: string; name: string } | null)
      .filter((c): c is { id: string; name: string } => Boolean(c));
  } catch {
    return [];
  }
});

/**
 * Which of the given courses this person can open.
 * `legacyIds` are the courses the old rules allow (enrolled, or every
 * published course for lectures-only accounts). Cohort members instead see
 * the courses that hold at least one lecture they can watch.
 */
export async function visibleCourseIds(userId: string, isAdmin: boolean, publishedIds: string[], legacyIds: string[]): Promise<string[]> {
  if (isAdmin) return publishedIds;
  const a = await loadStudentAccess(userId);
  const allowed = new Set([...a.cohortLessonIds, ...a.grantedLessonIds]);
  if (!a.cohortIds.length && !a.grantedLessonIds.size) return legacyIds;
  const fromLessons = new Set<string>();
  if (allowed.size) {
    const admin = createAdminClient();
    const { data } = await admin.from("lessons").select("course_id").in("id", [...allowed]);
    for (const r of data ?? []) fromLessons.add(r.course_id as string);
  }
  const base = a.cohortIds.length ? [] : legacyIds;
  return publishedIds.filter((id) => fromLessons.has(id) || base.includes(id));
}

/**
 * Everyone who shares a cohort with this person (them included), for boards
 * that must only show a student their own cohort. Null = they are in no
 * cohort (or the tables are missing): the caller keeps its old "everyone" list.
 */
export const loadCohortPeerIds = cache(async (userId: string): Promise<Set<string> | null> => {
  const a = await loadStudentAccess(userId);
  if (!a.cohortIds.length) return null;
  try {
    const { data, error } = await createAdminClient().from("cohort_members").select("user_id").in("cohort_id", a.cohortIds).limit(20000);
    if (error) return null;
    return new Set([userId, ...(data ?? []).map((m) => m.user_id as string)]);
  } catch {
    return null;
  }
});
