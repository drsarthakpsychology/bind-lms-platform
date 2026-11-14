"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/guards";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getExtension, SUBMISSION_ATTACH_EXTENSIONS } from "@/lib/media/registry";
import { verifyObjectExists } from "@/lib/storage-verify";
import { clampProgress } from "./progress-clamp";
import { isOwnSubmissionPath } from "@/lib/media/submission-paths";

export type PlaybackResult =
  | { ok: true; url: string; resumeSeconds: number }
  | { ok: false; error: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Called every 10 seconds during playback. The client's numbers are not
 * trusted (progress-clamp.ts): the position is bounded by the lecture length
 * from media_assets (when known) and, when the optional `progress.updated_at`
 * column exists, by the wall time since the last ping; completion is decided
 * here and never undone by a later ping. The lesson must be visible to the
 * caller (lessons RLS), so progress cannot be written for lessons they cannot
 * open. Every lookup degrades gracefully when a table or column is missing.
 */
export async function pingProgress(
  lessonId: string,
  watchedSeconds: number,
  durationSeconds: number,
): Promise<{ ok: boolean }> {
  const profile = await requireSession();
  if (!profile) return { ok: false };
  if (typeof lessonId !== "string" || !UUID_RE.test(lessonId)) return { ok: false };

  const supabase = await createClient();

  const readPrev = async () => {
    const withTime = await supabase
      .from("progress")
      .select("watched_seconds, is_completed, updated_at")
      .eq("user_id", profile.id)
      .eq("lesson_id", lessonId)
      .maybeSingle();
    if (!withTime.error) {
      const r = withTime.data as { watched_seconds: number; is_completed: boolean; updated_at: string | null } | null;
      return { hasUpdatedAt: true, prev: r ? { watchedSeconds: Number(r.watched_seconds) || 0, isCompleted: Boolean(r.is_completed), updatedAt: r.updated_at } : null };
    }
    // progress.updated_at not migrated yet: read without it.
    const plain = await supabase
      .from("progress")
      .select("watched_seconds, is_completed")
      .eq("user_id", profile.id)
      .eq("lesson_id", lessonId)
      .maybeSingle();
    const r = plain.data as { watched_seconds: number; is_completed: boolean } | null;
    return { hasUpdatedAt: false, prev: r ? { watchedSeconds: Number(r.watched_seconds) || 0, isCompleted: Boolean(r.is_completed), updatedAt: null } : null };
  };

  const readDuration = async (): Promise<number | null> => {
    try {
      const { data } = await createAdminClient().from("media_assets").select("duration_seconds").eq("lesson_id", lessonId).maybeSingle();
      const d = Number(data?.duration_seconds);
      return Number.isFinite(d) && d > 0 ? d : null;
    } catch {
      return null;
    }
  };

  const [{ data: lesson }, { hasUpdatedAt, prev }, serverDuration] = await Promise.all([
    supabase.from("lessons").select("id").eq("id", lessonId).maybeSingle(),
    readPrev(),
    readDuration(),
  ]);
  if (!lesson) return { ok: false };

  const next = clampProgress({
    watchedSeconds: Number(watchedSeconds),
    clientDuration: Number(durationSeconds),
    serverDuration,
    prev,
    now: Date.now(),
  });

  const { error } = await supabase.from("progress").upsert(
    {
      user_id: profile.id,
      lesson_id: lessonId,
      watched_seconds: next.watchedSeconds,
      is_completed: next.isCompleted,
      ...(hasUpdatedAt ? { updated_at: new Date().toISOString() } : {}),
    },
    { onConflict: "user_id,lesson_id" },
  );
  if (error) console.warn("pingProgress: progress write failed:", error.message);

  return { ok: !error };
}

/**
 * The explicit "Complete and Continue" button. Distinct from the automatic
 * 90%-watched completion in pingProgress: this respects the student's own
 * judgment that they're done, rather than requiring a watch-time threshold,
 * and does the mark-complete + advance in a single click.
 */
export async function completeAndAdvance(
  lessonId: string,
  courseId: string,
  redirectTo: string,
): Promise<void> {
  const profile = await requireSession();
  if (!profile) redirect("/login");

  const supabase = await createClient();
  const ownLessonUrl = `/courses/${courseId}/lessons/${lessonId}`;

  // Server-side enforcement, not just a hidden button. Matches the
  // student-facing copy: a submission must exist to proceed, grading
  // (approval) is a separate, asynchronous admin workflow that shouldn't
  // stall the whole cohort's progress on review turnaround.
  const { data: lesson } = await supabase
    .from("lessons")
    .select("requires_assignment")
    .eq("id", lessonId)
    .single();

  if (lesson?.requires_assignment) {
    const { data: assignment } = await supabase
      .from("assignments")
      .select("id")
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (assignment) {
      const { data: submission } = await supabase
        .from("submissions")
        .select("id")
        .eq("assignment_id", assignment.id)
        .eq("user_id", profile.id)
        .maybeSingle();

      if (!submission) {
        redirect(ownLessonUrl);
      }
    }
  }

  await supabase.from("progress").upsert(
    { user_id: profile.id, lesson_id: lessonId, is_completed: true },
    { onConflict: "user_id,lesson_id" },
  );
  // Only ever on to a page of this site.
  redirect(/^\/(?![/\\])/.test(redirectTo) ? redirectTo : `/courses/${courseId}`);
}

export type SubmissionResult = { error: string | null };


/**
 * Verifies the caller can legitimately submit to this assignment before
 * doing anything else: signed in, and the assignment's lesson belongs to a
 * course they can actually see (published, or they're an admin previewing).
 * Returns the assignment row on success so callers don't re-fetch it.
 */
async function assertCanSubmit(assignmentId: string) {
  const profile = await requireSession();
  if (!profile) return { profile: null, assignment: null } as const;

  const supabase = await createClient();
  const { data: assignment } = await supabase
    .from("assignments")
    .select("id, submission_type, due_at, lessons(id, courses(is_published))")
    .eq("id", assignmentId)
    .single();

  if (!assignment) return { profile, assignment: null } as const;

  const lesson = Array.isArray(assignment.lessons) ? assignment.lessons[0] : assignment.lessons;
  const course = lesson ? (Array.isArray(lesson.courses) ? lesson.courses[0] : lesson.courses) : null;

  if (!course?.is_published && profile.role !== "admin") {
    return { profile, assignment: null } as const;
  }

  return { profile, assignment } as const;
}

export async function submitTextAssignment(
  assignmentId: string,
  _prevState: SubmissionResult,
  formData: FormData,
): Promise<SubmissionResult> {
  const { profile, assignment } = await assertCanSubmit(assignmentId);
  if (!profile || !assignment) return { error: "Not authorized." };

  const textContent = String(formData.get("textContent") ?? "").trim();
  if (!textContent) return { error: "Write a response before submitting." };

  const supabase = await createClient();

  // A student can only ever have one submission per assignment: check for
  // an existing one first so this is an update (resubmission) rather than
  // a duplicate row, and so an already-approved submission can't be edited.
  const { data: existing } = await supabase
    .from("submissions")
    .select("id, status")
    .eq("assignment_id", assignmentId)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (existing?.status === "approved") {
    return { error: "This assignment has already been approved and can't be edited." };
  }

  const { error } = existing
    ? await supabase
        .from("submissions")
        .update({ text_content: textContent, status: "pending_review" })
        .eq("id", existing.id)
    : await supabase.from("submissions").insert({
        assignment_id: assignmentId,
        user_id: profile.id,
        text_content: textContent,
        status: "pending_review",
      });

  if (error) return { error: "Could not save your submission. Try again." };
  return { error: null };
}

export type SignedSubmissionUploadResult =
  | { ok: true; path: string; token: string }
  | { ok: false; error: string };

export async function prepareSubmissionUpload(
  assignmentId: string,
  fileName: string,
): Promise<SignedSubmissionUploadResult> {
  const { profile, assignment } = await assertCanSubmit(assignmentId);
  if (!profile || !assignment) return { ok: false, error: "Not authorized." };

  // Only formats with a working student path are accepted (registry).
  const ext = getExtension(fileName);
  if (!SUBMISSION_ATTACH_EXTENSIONS[ext]) {
    return {
      ok: false,
      error: `"${fileName}" isn't an accepted file type for this submission.`,
    };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return {
      ok: false,
      error: "SUPABASE_SERVICE_ROLE_KEY isn't set in this deployment yet, so uploads can't be authorized.",
    };
  }

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${assignmentId}/${profile.id}/${Date.now()}-${safeName}`;

  const { data, error } = await admin.storage.from("submissions").createSignedUploadUrl(path);
  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not prepare the upload." };
  }

  return { ok: true, path: data.path, token: data.token };
}

export type SubmissionWithFilesResult = { error: string | null };

/**
 * Submit an assignment with an optional note and a set of uploaded files.
 * One submission per student per assignment; editing is allowed while status
 * is pending_review (unsubmit + resubmit). Returns the created/updated
 * submission id so the caller can attach files to it.
 */
export async function submitWithFiles(
  assignmentId: string,
  note: string,
  filePaths: { path: string; name: string }[],
): Promise<SubmissionWithFilesResult & { submissionId?: string }> {
  const { profile, assignment } = await assertCanSubmit(assignmentId);
  if (!profile || !assignment) return { error: "Not authorized." };

  // Only files this student uploaded for this assignment (prepareSubmissionUpload
  // builds `<assignmentId>/<userId>/...`). Checked before anything is written.
  if (!Array.isArray(filePaths) || filePaths.length > 50) return { error: "Too many files." };
  const files: { path: string; name: string }[] = [];
  for (const f of filePaths) {
    if (!f || !isOwnSubmissionPath(f.path, assignmentId, profile.id)) {
      return { error: "One of the files isn't part of your upload. Remove it and try again." };
    }
    files.push({ path: f.path, name: String(f.name ?? "").slice(0, 255) || "file" });
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("submissions")
    .select("id, status")
    .eq("assignment_id", assignmentId)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (existing?.status !== "pending_review" && existing?.status !== undefined) {
    // returned / approved: locked.
    return { error: "This assignment has already been graded and can't be edited." };
  }

  const submittedAt = new Date().toISOString();
  const isLate = Boolean(
    assignment.due_at && new Date(assignment.due_at).getTime() < new Date(submittedAt).getTime(),
  );

  const { data: submission, error } = existing
    ? await supabase
        .from("submissions")
        .update({
          note: note || null,
          status: "pending_review",
          submitted_at: submittedAt,
          is_late: isLate,
        })
        .eq("id", existing.id)
        .select("id")
        .single()
    : await supabase
        .from("submissions")
        .insert({
          assignment_id: assignmentId,
          user_id: profile.id,
          note: note || null,
          status: "pending_review",
          submitted_at: submittedAt,
          is_late: isLate,
        })
        .select("id")
        .single();

  if (error || !submission) return { error: "Could not save your submission." };

  // Record the uploaded files against this submission, but only after the
  // server verifies each object actually landed (size > 0). A file whose bytes
  // never reached storage is marked failed, never shown as a real attachment.
  const admin = createAdminClient();
  for (const f of files) {
    const size = await verifyObjectExists("submissions", f.path);
    const status = size === null ? "failed" : "ready";
    await admin.from("submission_files").insert({
      submission_id: submission.id,
      storage_path: f.path,
      original_name: f.name,
      format: f.name.split(".").pop()?.toLowerCase() ?? null,
      provider: "supabase",
      bucket: "submissions",
      status,
      ...(size !== null ? { size_bytes: size } : {}),
    });
  }

  return { error: null, submissionId: submission.id };
}

/**
 * Unsubmit: clears the student's own pending submission back to a blank state
 * so they can resubmit. Only allowed while status = pending_review.
 */
export async function unsubmitAssignment(
  assignmentId: string,
): Promise<{ error: string | null }> {
  const { profile, assignment } = await assertCanSubmit(assignmentId);
  if (!profile || !assignment) return { error: "Not authorized." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("submissions")
    .select("id, status")
    .eq("assignment_id", assignmentId)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (!existing) return { error: "No submission to unsubmit." };
  if (existing.status !== "pending_review") {
    return { error: "This submission has been graded and can't be unsubmitted." };
  }

  const admin = createAdminClient();
  // Delete attached files + the submission row.
  const { data: files } = await admin
    .from("submission_files")
    .select("storage_path")
    .eq("submission_id", existing.id);
  // Only delete objects under this student's own prefix: an older row could
  // point at someone else's file.
  const ownPaths = (files ?? []).map((f) => f.storage_path as string).filter((p) => isOwnSubmissionPath(p, assignmentId, profile.id));
  if (ownPaths.length) {
    await admin.storage.from("submissions").remove(ownPaths);
  }
  await admin.from("submission_files").delete().eq("submission_id", existing.id);
  await admin.from("submissions").delete().eq("id", existing.id);

  return { error: null };
}

export async function submitAudioAssignment(
  assignmentId: string,
  audioPath: string,
): Promise<SubmissionResult> {
  const { profile, assignment } = await assertCanSubmit(assignmentId);
  if (!profile || !assignment) return { error: "Not authorized." };
  if (!isOwnSubmissionPath(audioPath, assignmentId, profile.id)) return { error: "That recording isn't part of your upload." };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("submissions")
    .select("id, status")
    .eq("assignment_id", assignmentId)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (existing?.status === "approved") {
    return { error: "This assignment has already been approved and can't be edited." };
  }

  const { error } = existing
    ? await supabase
        .from("submissions")
        .update({ audio_storage_path: audioPath, status: "pending_review" })
        .eq("id", existing.id)
    : await supabase.from("submissions").insert({
        assignment_id: assignmentId,
        user_id: profile.id,
        audio_storage_path: audioPath,
        status: "pending_review",
      });

  if (error) return { error: "Upload succeeded, but saving the submission failed." };
  return { error: null };
}

/**
 * For playing back a submitted recording: either the student listening to
 * their own submission, or an admin grading it. Uses the admin client
 * rather than relying on storage-path RLS, matching prepareSubmissionUpload
 * above: simpler to reason about than keeping a path convention and an RLS
 * policy in sync with each other.
 */
export async function getSubmissionAudioUrl(
  assignmentId: string,
  path: string,
): Promise<PlaybackResult> {
  const profile = await requireSession();
  if (!profile) return { ok: false, error: "Not signed in." };

  const supabase = await createClient();
  const { data: submission } = await supabase
    .from("submissions")
    .select("user_id")
    .eq("assignment_id", assignmentId)
    .eq("audio_storage_path", path)
    .single();

  if (!submission || (submission.user_id !== profile.id && profile.role !== "admin")) {
    return { ok: false, error: "Not authorized." };
  }
  // The path must sit under the submission owner's own prefix (rows written
  // before the prefix check could point anywhere in the bucket).
  if (!isOwnSubmissionPath(path, assignmentId, submission.user_id as string)) {
    return { ok: false, error: "Not authorized." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return {
      ok: false,
      error: "SUPABASE_SERVICE_ROLE_KEY isn't set in this deployment yet.",
    };
  }

  const { data, error } = await admin.storage.from("submissions").createSignedUrl(path, 60 * 15);
  if (error || !data) return { ok: false, error: "Could not load the recording." };

  return { ok: true, url: data.signedUrl, resumeSeconds: 0 };
}
