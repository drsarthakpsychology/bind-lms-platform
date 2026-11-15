import { isSuperAdmin } from "@/lib/auth/guards";
import { loadSubmissionReview } from "@/lib/admin/submissions-review";
import { appRoute } from "@/lib/app-api/route";
import { pageParams } from "@/lib/app-api/schemas";
import type { AdminSubmission, AdminSubmissions } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

const id = (v: string | null) => (v && /^[0-9a-f-]{36}$/i.test(v) ? v : null);

/** GET /api/app/v1/admin/submissions?status=pending|graded&course=&assignment=: the website's Submissions review list, paged. */
export const GET = appRoute({ auth: "admin" }, async ({ user, query }): Promise<AdminSubmissions> => {
  const status = query.get("status");
  const r = await loadSubmissionReview({ courseFilter: id(query.get("course")), assignmentFilter: id(query.get("assignment")), statusFilter: status === "pending" || status === "graded" ? status : null });
  const lessonCourse = new Map(r.lessons.map((l) => [l.id as string, l.course_id as string]));
  const all: AdminSubmission[] = r.enriched.map((s) => ({
    id: s.id,
    studentId: s.user_id,
    studentEmail: s.studentEmail ?? null,
    assignmentId: s.assignmentId,
    assignmentTitle: s.assignmentTitle,
    lessonTitle: s.lessonTitle,
    courseId: s.courseId || null,
    courseTitle: s.courseTitle,
    status: s.status,
    submittedAt: s.submitted_at,
    late: Boolean(s.is_late),
    text: s.text_content ?? null,
    hasAudio: Boolean(s.audio_storage_path),
    files: (s.files ?? []).map((f) => ({ id: f.id, name: f.original_name, format: f.format ?? null })),
    score: s.score ?? null,
    feedback: s.feedback ?? null,
    note: s.note ?? null,
  }));
  const { limit, cursor } = pageParams(query, 30, 100);
  const start = cursor && /^\d{1,5}$/.test(cursor) ? Number(cursor) : 0;
  return {
    v: 1,
    items: all.slice(start, start + limit),
    nextCursor: start + limit < all.length ? String(start + limit) : null,
    pending: r.pendingCount,
    courses: r.courses.map((c) => ({ id: c.id as string, title: c.title as string })),
    assignments: r.assignments.map((a) => ({ id: a.id as string, title: (a.title ?? a.prompt_text ?? "Untitled assignment") as string, courseId: lessonCourse.get(a.lesson_id as string) ?? null })),
    canWrite: isSuperAdmin(user.profile),
  };
});
