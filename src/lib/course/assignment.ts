import "server-only";
import type { Profile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { loadStudentAccess } from "@/lib/cohorts/access";
import { canWatch } from "@/lib/cohorts/rules";

/**
 * A student's own submission, shaped for screens outside the website (the
 * mobile app). The rules for who may submit live in the website's assignment
 * actions (src/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions.ts);
 * this file only reads.
 */
export type SubmissionView = {
  id: string;
  status: "pending_review" | "returned" | "approved";
  submittedAt: string | null;
  isLate: boolean;
  text: string | null;
  note: string | null;
  hasAudio: boolean;
  files: { id: string; name: string; format: string | null; sizeBytes: number | null; status: string }[];
  score: number | null;
  feedback: string | null;
  /** Same rule as submitWithFiles: only a pending submission can be changed. */
  editable: boolean;
};

type SubRow = {
  id: string;
  status: string | null;
  text_content?: string | null;
  audio_storage_path?: string | null;
  note?: string | null;
  submitted_at?: string | null;
  is_late?: boolean | null;
  score?: number | string | null;
  feedback?: string | null;
  submission_files?: { id: string; original_name: string | null; format?: string | null; size_bytes?: number | null; status?: string | null }[] | null;
};

export function submissionView(row: SubRow): SubmissionView {
  const status = row.status === "returned" || row.status === "approved" ? row.status : "pending_review";
  const score = row.score === null || row.score === undefined || row.score === "" ? null : Number(row.score);
  return {
    id: row.id,
    status,
    submittedAt: row.submitted_at ?? null,
    isLate: Boolean(row.is_late),
    text: row.text_content ?? null,
    note: row.note ?? null,
    hasAudio: Boolean(row.audio_storage_path),
    files: (row.submission_files ?? []).map((f) => ({ id: f.id, name: f.original_name ?? "file", format: f.format ?? null, sizeBytes: f.size_bytes ?? null, status: f.status ?? "ready" })),
    score: Number.isFinite(score) ? score : null,
    feedback: row.feedback ?? null,
    editable: status === "pending_review",
  };
}

export type AssignmentView = {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  instructions: string | null;
  submissionType: string;
  dueAt: string | null;
  allowLate: boolean;
  maxFiles: number;
  maxFileMb: number;
  acceptedFormats: string[];
  submission: SubmissionView | null;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * One published assignment the student may open: the course is published and
 * they may watch its lecture (the lecture rules of canAccessLesson are applied
 * by the caller's lecture check; here: row level security, published, cohort).
 */
export async function loadAssignment(profile: Profile, assignmentId: string): Promise<AssignmentView | null> {
  if (!UUID_RE.test(assignmentId)) return null;
  const supabase = await createClient();
  const { data: a } = await supabase
    .from("assignments")
    .select("id, lesson_id, title, instructions, prompt_text, submission_type, due_at, allow_late, is_published, max_files, max_file_mb, accepted_formats, lessons!inner(course_id, status, courses(is_published))")
    .eq("id", assignmentId)
    .maybeSingle();
  if (!a) return null;
  const lesson = (Array.isArray(a.lessons) ? a.lessons[0] : a.lessons) as { course_id: string; status?: string | null; courses?: { is_published?: boolean } | { is_published?: boolean }[] | null } | null;
  const course = lesson ? (Array.isArray(lesson.courses) ? lesson.courses[0] : lesson.courses) : null;
  if (profile.role !== "admin") {
    if (!a.is_published || !course?.is_published || lesson?.status === "hidden") return null;
    if (!canWatch(await loadStudentAccess(profile.id), a.lesson_id, true)) return null;
  }
  const { data: sub } = await supabase
    .from("submissions")
    .select("id, status, text_content, audio_storage_path, note, submitted_at, is_late, score, feedback, submission_files(id, original_name, format, size_bytes, status)")
    .eq("assignment_id", a.id)
    .eq("user_id", profile.id)
    .maybeSingle();
  return {
    id: a.id,
    lessonId: a.lesson_id,
    courseId: lesson?.course_id ?? "",
    title: a.title ?? "Assignment",
    instructions: a.instructions ?? a.prompt_text ?? null,
    submissionType: a.submission_type ?? "file",
    dueAt: a.due_at ?? null,
    allowLate: Boolean(a.allow_late),
    maxFiles: a.max_files ?? 3,
    maxFileMb: a.max_file_mb ?? 25,
    acceptedFormats: Array.isArray(a.accepted_formats) ? (a.accepted_formats as string[]) : [],
    submission: sub ? submissionView(sub as SubRow) : null,
  };
}
