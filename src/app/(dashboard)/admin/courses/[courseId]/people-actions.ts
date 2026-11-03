"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { isHiddenAccount } from "@/lib/people/hidden";
import { enrollStudents } from "./actions";
import { loadCourseCohorts } from "@/lib/cohorts/admin-data";
import { checkMembershipChange } from "@/lib/cohorts/rules";

export type CoursePerson = { id: string; email: string; name: string | null; cohortIds: string[]; enrolled: boolean };
export type CourseCohort = { id: string; name: string; status: string; members: number };
export type CoursePeople = { people: CoursePerson[]; cohorts: CourseCohort[]; cohortsReady: boolean };

/** Everyone who could take this course, who is in it, and its cohorts. */
export async function loadCoursePeople(courseId: string): Promise<CoursePeople> {
  if (!(await requireAdmin())) return { people: [], cohorts: [], cohortsReady: false };
  const admin = createAdminClient();
  const [{ data: profiles }, { data: enrolled }, course] = await Promise.all([
    admin.from("profiles").select("id, email, name, is_test").eq("role", "student").order("email").limit(5000),
    admin.from("course_enrollments").select("user_id").eq("course_id", courseId).limit(10000),
    loadCourseCohorts(courseId),
  ]);
  const cohortsReady = course.ready;
  const ids = course.cohorts.map((c) => c.id);
  const { data: members } = ids.length ? await admin.from("cohort_members").select("cohort_id, user_id").in("cohort_id", ids).limit(20000) : { data: [] };
  const inCohorts = new Map<string, string[]>();
  for (const m of members ?? []) inCohorts.set(m.user_id as string, [...(inCohorts.get(m.user_id as string) ?? []), m.cohort_id as string]);
  const enrolledSet = new Set((enrolled ?? []).map((e) => e.user_id as string));
  const people = (profiles ?? [])
    .filter((p) => !isHiddenAccount(p))
    .map((p) => {
      const cohortIds = inCohorts.get(p.id as string) ?? [];
      return { id: p.id as string, email: String(p.email ?? ""), name: (p.name as string | null) ?? null, cohortIds, enrolled: enrolledSet.has(p.id as string) || cohortIds.length > 0 };
    });
  const realIds = new Set(people.map((p) => p.id));
  return {
    cohortsReady,
    people,
    cohorts: course.cohorts.map((c) => ({
      ...c,
      members: (members ?? []).filter((m) => m.cohort_id === c.id && realIds.has(m.user_id as string)).length,
    })),
  };
}

function refresh(courseId: string) {
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/admin/cohorts");
}

/** Enrol students in the course and, if picked, put them in one of its cohorts. */
export async function addToCourse(courseId: string, userIds: string[], cohortId: string | null): Promise<{ error: string | null; added: number }> {
  if (!(await requireAdmin())) return { error: "Not authorized.", added: 0 };
  const ids = [...new Set(userIds)].filter(Boolean).slice(0, 1000);
  if (!ids.length) return { error: "Tick at least one student.", added: 0 };
  const res = await enrollStudents(courseId, ids);
  if (res.error) return { error: res.error, added: 0 };
  if (cohortId) {
    const { error } = await createAdminClient()
      .from("cohort_members")
      .upsert(ids.map((user_id) => ({ cohort_id: cohortId, user_id })), { onConflict: "cohort_id,user_id", ignoreDuplicates: true });
    if (error) return { error: "Enrolled, but couldn't add them to the cohort.", added: ids.length };
  }
  refresh(courseId);
  return { error: null, added: ids.length };
}

/** Take a student out of the course and out of this course's cohorts. */
export async function removeFromCourse(courseId: string, userId: string, cohortIds: string[]): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };
  const admin = createAdminClient();
  const { error } = await admin.from("course_enrollments").delete().eq("course_id", courseId).eq("user_id", userId);
  if (error) return { error: "Could not remove them." };
  if (cohortIds.length) await admin.from("cohort_members").delete().eq("user_id", userId).in("cohort_id", cohortIds);
  refresh(courseId);
  return { error: null };
}

/**
 * Add one student to one cohort of this course, or take them out of one.
 * Only that one membership changes; their other cohorts stay as they are.
 */
export async function changeCohortMembership(courseId: string, userId: string, cohortId: string, op: "add" | "remove"): Promise<{ error: string | null }> {
  const me = await requireAdmin();
  if (!me) return { error: "Not authorized." };
  if (op !== "add" && op !== "remove") return { error: "Unknown change." };
  const course = await loadCourseCohorts(courseId);
  if (!course.ready) return { error: "Run the cohorts database step first." };
  const admin = createAdminClient();
  const { data: cur, error: readErr } = await admin.from("cohort_members").select("cohort_id").eq("user_id", userId);
  if (readErr) return { error: "Could not read their cohorts." };
  const check = checkMembershipChange(op, cohortId, (cur ?? []).map((c) => c.cohort_id as string), course.cohorts);
  if (!check.ok) return { error: check.error };
  if (op === "add") {
    const { error } = await admin.from("cohort_members").insert({ cohort_id: cohortId, user_id: userId, added_by: me.id });
    if (error) return { error: `Could not add them to ${check.cohort.name}.` };
    await admin.from("course_enrollments").upsert({ user_id: userId, course_id: courseId }, { onConflict: "user_id,course_id", ignoreDuplicates: true });
  } else {
    const { error } = await admin.from("cohort_members").delete().eq("cohort_id", cohortId).eq("user_id", userId);
    if (error) return { error: `Could not take them out of ${check.cohort.name}.` };
  }
  refresh(courseId);
  revalidatePath(`/admin/cohorts/${cohortId}`);
  revalidatePath(`/admin/cohorts/student/${userId}`);
  return { error: null };
}

/** New cohort for this course. Lectures already in the course are shared only if asked. */
export async function newCohortForCourse(courseId: string, name: string, shareExisting: boolean): Promise<{ error: string | null; id?: string }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };
  const n = name.trim();
  if (!n) return { error: "Give the cohort a name." };
  const admin = createAdminClient();
  const { data, error } = await admin.from("cohorts").insert({ name: n, course_id: courseId, status: "upcoming" }).select("id").single();
  if (error || !data) return { error: error?.code === "23505" ? "That name is taken. Try another." : error?.code === "42P01" ? "Run the cohorts database step first." : "Could not make the cohort." };
  if (shareExisting) {
    const { data: lessons } = await admin.from("lessons").select("id").eq("course_id", courseId).limit(2000);
    if (lessons?.length) await admin.from("lesson_cohorts").upsert(lessons.map((l) => ({ lesson_id: l.id, cohort_id: data.id })), { onConflict: "lesson_id,cohort_id", ignoreDuplicates: true });
  }
  refresh(courseId);
  return { error: null, id: data.id as string };
}
