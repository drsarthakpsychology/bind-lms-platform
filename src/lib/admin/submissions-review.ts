import "server-only";
import { loadHiddenIds } from "@/lib/people/hidden-ids";
import { createClient } from "@/lib/supabase/server";

/**
 * The admin Submissions review list (moved out of
 * src/app/(dashboard)/admin/submissions/page.tsx so the mobile app's review
 * screen reads the same list): the latest 200 submissions with their
 * assignment, lecture, course, student email and files, test accounts left
 * out, then the page's filters. Call it only after the admin check.
 */
export type ReviewFilters = { courseFilter?: string | null; assignmentFilter?: string | null; statusFilter?: string | null };

export async function loadSubmissionReview({ courseFilter, assignmentFilter, statusFilter }: ReviewFilters = {}) {
  const supabase = await createClient();

  const [{ data: submissions }, { data: assignments }, { data: lessons }, { data: courses }, { data: profiles }, { data: files }] =
    await Promise.all([
      supabase
        .from("submissions")
        .select("id, assignment_id, user_id, text_content, audio_storage_path, status, note, submitted_at, is_late, score, feedback")
        .order("submitted_at", { ascending: false })
        .limit(200),
      supabase.from("assignments").select("id, lesson_id, title, prompt_text"),
      supabase.from("lessons").select("id, title, course_id"),
      supabase.from("courses").select("id, title"),
      supabase.from("profiles").select("id, email").eq("role", "student"),
      supabase.from("submission_files").select("id, submission_id, original_name, storage_path, format").limit(1000),
    ]);

  const assignmentsById = new Map((assignments ?? []).map((a) => [a.id, a]));
  const lessonsById = new Map((lessons ?? []).map((l) => [l.id, l]));
  const coursesById = new Map((courses ?? []).map((c) => [c.id, c]));
  const emailsById = new Map((profiles ?? []).map((p) => [p.id, p.email]));
  const filesBySubmission = new Map<string, typeof files>();
  for (const f of files ?? []) {
    const list = filesBySubmission.get(f.submission_id) ?? [];
    list.push(f);
    filesBySubmission.set(f.submission_id, list);
  }

  const hidden = await loadHiddenIds();
  const enriched = (submissions ?? [])
    .filter((s) => !hidden.has(s.user_id as string))
    .map((s) => {
      const assignment = assignmentsById.get(s.assignment_id);
      const lesson = assignment ? lessonsById.get(assignment.lesson_id) : undefined;
      const course = lesson ? coursesById.get(lesson.course_id) : undefined;
      return {
        ...s,
        assignmentTitle: assignment?.title ?? assignment?.prompt_text ?? "Untitled assignment",
        assignmentId: s.assignment_id,
        lessonTitle: lesson?.title ?? "Unknown lesson",
        courseId: course?.id ?? "",
        courseTitle: course?.title ?? "Unknown course",
        studentEmail: emailsById.get(s.user_id) ?? s.user_id,
        files: filesBySubmission.get(s.id) ?? [],
      };
    })
    .filter((s) => {
      if (courseFilter && s.courseId !== courseFilter) return false;
      if (assignmentFilter && s.assignmentId !== assignmentFilter) return false;
      if (statusFilter === "pending" && s.status !== "pending_review") return false;
      if (statusFilter === "graded" && !["returned", "approved"].includes(s.status)) return false;
      return true;
    });

  const pendingCount = (submissions ?? []).filter((s) => s.status === "pending_review").length;
  return { enriched, pendingCount, courses: courses ?? [], assignments: assignments ?? [], lessons: lessons ?? [] };
}
