import "server-only";
import type { Profile } from "@/lib/auth/session";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { canAccessLesson } from "@/lib/enrollment";
import { loadStudentAccess } from "@/lib/cohorts/access";
import { canWatch, filterLessons } from "@/lib/cohorts/rules";
import { lectureNeighbours } from "@/lib/course/lecture-order";
import { submissionView, type SubmissionView } from "@/lib/course/assignment";

/**
 * One lecture for a student screen outside the website (the mobile app's
 * lecture detail). The same rules as the website's lecture page:
 *  - canAccessLesson (published, enrolment or lectures-only, cohorts);
 *  - a `hidden` lecture does not exist for a student, a `live` one is locked;
 *  - the lecture list, Previous and Next only hold lectures this person can watch;
 *  - only published assignments are shown to a student.
 */
export type LectureMaterial = {
  id: string;
  title: string;
  kind: string;
  format: string | null;
  size_bytes: number | null;
  url: string | null;
  storage_path: string | null;
  lesson_id: string | null;
  week: number | null;
};

export type LectureView = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string | null;
  week: number;
  number: number | null;
  hasVideo: boolean;
  durationSeconds: number | null;
  watchedSeconds: number;
  completed: boolean;
  requiresAssignment: boolean;
  assignment: {
    id: string;
    title: string;
    instructions: string | null;
    submissionType: string;
    dueAt: string | null;
    allowLate: boolean;
    maxFiles: number;
    maxFileMb: number;
    maxScore: number | null;
    published: boolean;
    submission: SubmissionView | null;
  } | null;
  materials: LectureMaterial[];
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
};

export type LectureLoad = { ok: true; lecture: LectureView } | { ok: false; reason: "not_found" | "forbidden" | "locked" };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function loadLecture(profile: Profile, lessonId: string): Promise<LectureLoad> {
  if (!UUID_RE.test(lessonId)) return { ok: false, reason: "not_found" };
  const gate = await canAccessLesson(lessonId);
  if (!gate.ok || !gate.courseId) return { ok: false, reason: gate.courseId ? "forbidden" : "not_found" };
  const courseId = gate.courseId;
  const isAdmin = profile.role === "admin";

  const supabase = await createClient();
  const [{ data: lesson }, { data: course }, { data: courseLessonsAll }, { data: assignment }, { data: materialsAll }, { data: progress }] = await Promise.all([
    supabase.from("lessons").select("id, title, description, requires_assignment, course_id, video_storage_path, status, week").eq("id", lessonId).single(),
    supabase.from("courses").select("id, title").eq("id", courseId).single(),
    supabase.from("lessons").select("id, title, order_index, video_storage_path, week").eq("course_id", courseId).order("order_index", { ascending: true }),
    supabase
      .from("assignments")
      .select("id, prompt_text, submission_type, title, instructions, due_at, allow_late, is_published, max_files, max_file_mb")
      .eq("lesson_id", lessonId)
      .maybeSingle(),
    supabase
      .from("materials")
      .select("id, title, kind, format, size_bytes, url, storage_path, sort_order, lesson_id, week")
      .or(`lesson_id.eq.${lessonId},course_id.eq.${courseId}`)
      .order("sort_order", { ascending: true }),
    supabase.from("progress").select("watched_seconds, is_completed").eq("user_id", profile.id).eq("lesson_id", lessonId).maybeSingle(),
  ]);

  if (!lesson || lesson.course_id !== courseId) return { ok: false, reason: "not_found" };

  const access = await loadStudentAccess(profile.id);
  if (!isAdmin) {
    if (lesson.status === "hidden" || !canWatch(access, lessonId, true)) return { ok: false, reason: "not_found" };
    if (lesson.status === "live") return { ok: false, reason: "locked" };
  }

  const courseLessons = filterLessons(access, courseLessonsAll ?? [], true, isAdmin);
  const visibleLessonIds = new Set(courseLessons.map((l) => l.id));
  const materials = (materialsAll ?? []).filter((m) => !m.lesson_id || m.lesson_id === lessonId || visibleLessonIds.has(m.lesson_id));
  const { playable, index, prev, next } = lectureNeighbours(courseLessons, lessonId);

  let durationSeconds: number | null = null;
  try {
    const { data } = await createAdminClient().from("media_assets").select("duration_seconds").eq("lesson_id", lessonId).maybeSingle();
    const d = Number(data?.duration_seconds);
    durationSeconds = Number.isFinite(d) && d > 0 ? Math.round(d) : null;
  } catch {
    durationSeconds = null;
  }

  // A student sees only a published assignment.
  const shownAssignment = assignment && (assignment.is_published || isAdmin) ? assignment : null;
  let submission: SubmissionView | null = null;
  if (shownAssignment) {
    const { data: sub } = await supabase
      .from("submissions")
      .select("id, status, text_content, audio_storage_path, note, submitted_at, is_late, score, feedback, submission_files(id, original_name, format, size_bytes, status)")
      .eq("assignment_id", shownAssignment.id)
      .eq("user_id", profile.id)
      .maybeSingle();
    submission = sub ? submissionView(sub) : null;
  }

  return {
    ok: true,
    lecture: {
      id: lesson.id,
      courseId,
      courseTitle: course?.title ?? "Course",
      title: lesson.title ?? "Lecture",
      description: lesson.description ?? null,
      week: (lesson as { week?: number | null }).week ?? 1,
      number: index >= 0 && playable.length > 0 ? index + 1 : null,
      hasVideo: Boolean(lesson.video_storage_path),
      durationSeconds,
      watchedSeconds: Number(progress?.watched_seconds) || 0,
      completed: Boolean(progress?.is_completed),
      requiresAssignment: Boolean(lesson.requires_assignment),
      assignment: shownAssignment
        ? {
            id: shownAssignment.id,
            title: shownAssignment.title ?? "Assignment",
            instructions: shownAssignment.instructions ?? shownAssignment.prompt_text ?? null,
            submissionType: shownAssignment.submission_type ?? "file",
            dueAt: shownAssignment.due_at ?? null,
            allowLate: Boolean(shownAssignment.allow_late),
            maxFiles: shownAssignment.max_files ?? 3,
            maxFileMb: shownAssignment.max_file_mb ?? 25,
            maxScore: null,
            published: Boolean(shownAssignment.is_published),
            submission,
          }
        : null,
      materials: materials as LectureMaterial[],
      prev: prev ? { id: prev.id, title: prev.title } : null,
      next: next ? { id: next.id, title: next.title } : null,
    },
  };
}
