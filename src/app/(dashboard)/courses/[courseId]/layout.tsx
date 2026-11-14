import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { visibleCourseIds } from "@/lib/cohorts/access";

/**
 * Course layout: full width, no persistent course column (Round 5 drill-down).
 * The course and lesson pages own their back header + lesson picker, so the
 * content is the whole width of the screen. One navigation surface at a time.
 */
export default async function CourseLayout({
  params,
  children,
}: {
  params: Promise<{ courseId: string }>;
  children: React.ReactNode;
}) {
  const { courseId } = await params;
  // Malformed id → PostgREST 400 before the page's guard can run; validate at
  // the layout (the entry point) so a crafted URL 404s cleanly.
  if (!/^[0-9a-f-]{36}$/i.test(courseId)) {
    notFound();
  }
  const session = await getSession();
  if (session.status !== "ok") return null;
  const { profile } = session;

  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, is_published")
    .eq("id", courseId)
    .single();

  // A student must be enrolled AND the course published to see any of it.
  // Admins (and the admin previewing as student) bypass the enrollment gate.
  // Lecture-only roster accounts are NOT enrolled (no course_enrollments row by
  // design), for them, every PUBLISHED course is the whole surface, mirroring
  // the carve-out in canAccessLesson/canAccessCourse (src/lib/enrollment.ts).
  const isAdmin = profile.role === "admin";
  const bypassEnrollment = isAdmin || profile.scope === "lectures_only";
  const { data: enrollment } = bypassEnrollment
    ? { data: true }
    : await supabase
        .from("course_enrollments")
        .select("course_id")
        .eq("user_id", profile.id)
        .eq("course_id", courseId)
        .maybeSingle();

  if (
    !course ||
    (!course.is_published && !isAdmin)
  ) {
    notFound();
  }
  // Cohort members may open a course only if it holds a lecture shared with
  // their cohort (or given to them); everyone else keeps the enrolment rule.
  const legacyOk = bypassEnrollment || Boolean(enrollment);
  const allowed = await visibleCourseIds(profile.id, isAdmin, [courseId], legacyOk ? [courseId] : []);
  if (!allowed.includes(courseId)) notFound();

  return (
    <div className="min-h-[calc(100svh-3.5rem)]">
      <div className="w-full overflow-x-hidden">{children}</div>
    </div>
  );
}
