import "server-only";
import type { Profile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { loadStudentAccess, visibleCourseIds } from "@/lib/cohorts/access";

export type MyCourse = { id: string; title: string; is_published: boolean };

/**
 * The published courses this person can open, in title order.
 *
 * A student sees the courses they are enrolled in; a lectures-only roster
 * student sees every published course; cohort members see the courses that
 * hold a lecture shared with their cohort. `courseScope` lets an admin
 * previewing the student side see every published course ("lectures_only").
 */
export async function loadMyCourses(profile: Pick<Profile, "id" | "role">, courseScope: "full" | "lectures_only"): Promise<MyCourse[]> {
  const supabase = await createClient();
  // Start the cohort read with the course reads (visibleCourseIds below reuses it).
  if (profile.role !== "admin") void loadStudentAccess(profile.id).catch(() => undefined);
  const [{ data: courses }, { data: enrollments }] = await Promise.all([
    supabase.from("courses").select("id, title, is_published").eq("is_published", true).order("title", { ascending: true }),
    supabase.from("course_enrollments").select("course_id").eq("user_id", profile.id),
  ]);
  const all = (courses ?? []) as MyCourse[];
  const enrolledIds = new Set((enrollments ?? []).map((e) => e.course_id));
  const legacy = courseScope === "lectures_only" ? all : all.filter((c) => enrolledIds.has(c.id));
  const visible = new Set(
    await visibleCourseIds(
      profile.id,
      profile.role === "admin",
      all.map((c) => c.id),
      legacy.map((c) => c.id),
    ),
  );
  return all.filter((c) => visible.has(c.id));
}
