import "server-only";
import type { OverviewModel } from "@/components/course/course-overview-view";
import type { Profile } from "@/lib/auth/session";
import { loadAssignment } from "@/lib/course/assignment";
import { createClient } from "@/lib/supabase/server";
import type { AssignmentRow, PrepareUploadResult, SubmitResult } from "./contract";
import { ApiFail } from "./respond";
import { toAppTarget } from "./target";
import { submissionOut } from "./views/courses";

/** The assignment must be one the student can open (published, their lecture), or the write is refused as not found. */
export async function openAssignment(profile: Profile, assignmentId: string) {
  const a = await loadAssignment(profile, assignmentId);
  if (!a) throw new ApiFail("not_found");
  return a;
}

/** The website actions answer `{ error }` in plain words; turn that into the app's error codes. */
export function submitError(error: string): ApiFail {
  if (error === "Not authorized.") return new ApiFail("forbidden", error);
  if (/already (been )?(approved|graded)|can't be edited/i.test(error)) return new ApiFail("conflict", error);
  if (/^Could not save|saving the submission failed/i.test(error)) return new ApiFail("server_error", error);
  return new ApiFail("bad_request", error);
}

export async function afterSubmit(profile: Profile, assignmentId: string, error: string | null): Promise<SubmitResult> {
  if (error) throw submitError(error);
  const a = await loadAssignment(profile, assignmentId);
  if (!a?.submission) throw new ApiFail("server_error", "Saved, but it couldn't be read back. Pull to refresh.");
  return { submission: submissionOut(a.submission) };
}

const CONTENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  heic: "image/heic",
  m4a: "audio/mp4",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  webm: "audio/webm",
  aac: "audio/aac",
  ogg: "audio/ogg",
};

/**
 * Where the app PUTs the bytes: Supabase Storage's signed upload address for
 * the path prepareSubmissionUpload made (the same one the website's
 * uploadToSignedUrl uses). Nothing secret: the token works once, for one path.
 */
export function signedUploadTarget(path: string, token: string, fileName: string, base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""): PrepareUploadResult {
  const ext = (fileName.split(".").pop() ?? "").toLowerCase();
  const enc = path.split("/").map(encodeURIComponent).join("/");
  return {
    path,
    uploadUrl: `${base.replace(/\/$/, "")}/storage/v1/object/upload/sign/submissions/${enc}?token=${encodeURIComponent(token)}`,
    headers: { "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream", "x-upsert": "false" },
  };
}

/** Every published assignment of these course models, in week order, with due date and score. */
export async function assignmentRows(models: OverviewModel[], userId: string): Promise<AssignmentRow[]> {
  const base: AssignmentRow[] = [];
  for (const m of models) {
    for (const w of m.weeks) {
      for (const a of w.assignments) {
        const t = a.href ? toAppTarget(a.href) : null;
        base.push({
          id: a.id,
          lessonId: t && t.screen === "lecture" ? t.lessonId : "",
          courseId: m.courseId,
          title: a.title,
          lessonTitle: a.lessonTitle,
          week: w.num,
          dueAt: null,
          status: a.status,
          score: null,
        });
      }
    }
  }
  if (!base.length) return base;
  const supabase = await createClient();
  const ids = base.map((r) => r.id);
  const [{ data: rows }, { data: subs }] = await Promise.all([
    supabase.from("assignments").select("id, lesson_id, due_at").in("id", ids),
    supabase.from("submissions").select("assignment_id, score").eq("user_id", userId).in("assignment_id", ids),
  ]);
  const byId = new Map((rows ?? []).map((r) => [r.id as string, r]));
  const scoreBy = new Map((subs ?? []).map((s) => [s.assignment_id as string, s.score]));
  return base.map((r) => {
    const row = byId.get(r.id);
    const score = scoreBy.get(r.id);
    return { ...r, lessonId: r.lessonId || ((row?.lesson_id as string) ?? ""), dueAt: (row?.due_at as string | null) ?? null, score: score === null || score === undefined ? null : Number(score) };
  });
}
