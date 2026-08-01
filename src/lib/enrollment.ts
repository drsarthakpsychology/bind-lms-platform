import "server-only";

import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

/**
 * Enrollment + access checks for the Phase 4/5 surfaces.
 *
 * Every material / assignment / submission-file read re-checks, at request
 * time, that the caller is signed in and either an admin or an enrolled
 * student of the parent course. Nothing relies on hidden UI alone — these are
 * the server-side gates.
 *
 * The enrollment model: a student is "enrolled" in a course if a row exists in
 * course_enrollments. Course/lesson visibility stays "published = visible to
 * all" for the video experience; materials/assignments additionally require
 * enrollment (per the Phase 6 brief).
 */

export type EnrolledCheck = {
  ok: boolean;
  reason?: "unauthenticated" | "not_enrolled" | "not_found";
};

/**
 * Is the caller (a) signed in and (b) admin, or enrolled in the course that
 * owns the given lesson? Returns the profile when ok, plus the course id.
 */
export async function canAccessLesson(
  lessonId: string,
): Promise<{ ok: boolean; profile: Awaited<ReturnType<typeof requireSession>>; courseId?: string }> {
  const profile = await requireSession();
  if (!profile) return { ok: false, profile: null };

  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("course_id, courses(is_published)")
    .eq("id", lessonId)
    .single();

  if (!lesson) return { ok: false, profile };

  const course = Array.isArray(lesson.courses) ? lesson.courses[0] : lesson.courses;
  const courseId = lesson.course_id;

  // Admin can do anything.
  if (profile.role === "admin") return { ok: true, profile, courseId };

  // Student: course must be published AND they must be enrolled.
  if (!course?.is_published) return { ok: false, profile, courseId };

  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("course_id")
    .eq("user_id", profile.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (!enrollment) return { ok: false, profile, courseId };

  return { ok: true, profile, courseId };
}

/**
 * Check access to a course directly (for materials attached at course level,
 * or when the caller already has the course id).
 */
export async function canAccessCourse(
  courseId: string,
): Promise<{ ok: boolean; profile: Awaited<ReturnType<typeof requireSession>> }> {
  const profile = await requireSession();
  if (!profile) return { ok: false, profile: null };

  if (profile.role === "admin") return { ok: true, profile };

  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("is_published")
    .eq("id", courseId)
    .single();

  if (!course?.is_published) return { ok: false, profile };

  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("course_id")
    .eq("user_id", profile.id)
    .eq("course_id", courseId)
    .maybeSingle();

  return { ok: Boolean(enrollment), profile };
}

/**
 * Whether the current user is enrolled in a course (no authz implication —
 * just "am I on the roster"). Used to render the admin enroll control and the
 * student's "you're enrolled" state.
 */
export async function isEnrolled(courseId: string): Promise<boolean> {
  const profile = await requireSession();
  if (!profile || profile.role === "admin") return true;

  const supabase = await createClient();
  const { data } = await supabase
    .from("course_enrollments")
    .select("course_id")
    .eq("user_id", profile.id)
    .eq("course_id", courseId)
    .maybeSingle();

  return Boolean(data);
}

export type MaterialAccess =
  | { ok: true; material: { storage_path: string | null; kind: string } }
  | { ok: false; reason: string };

/**
 * Check the caller can access a specific material (used by the signed-URL
 * route). Enforces: signed in, and (admin OR the material's course is
 * published AND the caller is enrolled).
 */
export async function canAccessMaterial(materialId: string): Promise<MaterialAccess> {
  const profile = await requireSession();
  if (!profile) return { ok: false, reason: "Not signed in." };

  const supabase = await createClient();
  // Material + its course's published state in one embed.
  const { data: material } = await supabase
    .from("materials")
    .select("storage_path, kind, course_id, courses!inner(is_published)")
    .eq("id", materialId)
    .single();

  if (!material) return { ok: false, reason: "Material not found." };

  if (profile.role === "admin") {
    return { ok: true, material: { storage_path: material.storage_path, kind: material.kind } };
  }

  const course = Array.isArray(material.courses) ? material.courses[0] : material.courses;
  if (!course?.is_published) return { ok: false, reason: "This course isn't published." };

  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("course_id")
    .eq("user_id", profile.id)
    .eq("course_id", material.course_id)
    .maybeSingle();

  if (!enrollment) return { ok: false, reason: "You aren't enrolled in this course." };

  return { ok: true, material: { storage_path: material.storage_path, kind: material.kind } };
}
