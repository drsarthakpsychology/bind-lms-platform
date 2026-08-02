"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/guards";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getMediaProvider } from "@/lib/media/provider";

export type PlaybackResult =
  | { ok: true; url: string; resumeSeconds: number }
  | { ok: false; error: string };

export async function getPlaybackUrl(lessonId: string): Promise<PlaybackResult> {
  const profile = await requireSession();
  if (!profile) return { ok: false, error: "Not signed in." };

  // Enrollment + publish re-check at request time (admin bypasses). A
  // non-enrolled student gets no video URL even with a valid session.
  const { canAccessLesson } = await import("@/lib/enrollment");
  const access = await canAccessLesson(lessonId);
  if (!access.ok) {
    return { ok: false, error: "This course isn't available to you." };
  }

  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, video_storage_path, media_assets(master_playlist, key_prefix)")
    .eq("id", lessonId)
    .single();

  if (!lesson) {
    return { ok: false, error: "This lesson has no video yet." };
  }

  // Prefer the HLS master playlist (R2 migration done); fall back to the
  // legacy raw video path (still on Supabase Storage).
  const media = Array.isArray(lesson.media_assets)
    ? lesson.media_assets[0]
    : lesson.media_assets;
  const key = media?.master_playlist ?? media?.key_prefix ?? lesson.video_storage_path;

  if (!key) {
    return { ok: false, error: "This lesson has no video yet." };
  }

  const provider = getMediaProvider();
  const result = await provider.getPlaybackUrl(key, 60 * 60); // 60 minutes

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  const { data: progress } = await supabase
    .from("progress")
    .select("watched_seconds")
    .eq("user_id", profile.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  return { ok: true, url: result.url, resumeSeconds: progress?.watched_seconds ?? 0 };
}

/**
 * Called every 10 seconds during playback, so this stays as light as
 * possible: one auth+profile check (which also enforces expiry and the
 * concurrent-session rule) and one upsert. It intentionally does not
 * re-verify the lesson/course on every tick — RLS still restricts the
 * upsert to the caller's own row, and this is a progress log, not a
 * playback-authorization decision (that's getPlaybackUrl's job, above).
 */
export async function pingProgress(
  lessonId: string,
  watchedSeconds: number,
  durationSeconds: number,
): Promise<{ ok: boolean }> {
  const profile = await requireSession();
  if (!profile) return { ok: false };

  const supabase = await createClient();
  const isCompleted = durationSeconds > 0 && watchedSeconds / durationSeconds >= 0.9;

  const { error } = await supabase.from("progress").upsert(
    {
      user_id: profile.id,
      lesson_id: lessonId,
      watched_seconds: Math.floor(watchedSeconds),
      is_completed: isCompleted,
    },
    { onConflict: "user_id,lesson_id" },
  );

  return { ok: !error };
}

/**
 * The explicit "Complete and Continue" button. Distinct from the automatic
 * 90%-watched completion in pingProgress — this respects the student's own
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
  // student-facing copy: a submission must exist to proceed — grading
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
  redirect(redirectTo);
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

  // A student can only ever have one submission per assignment — check for
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

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("submissions")
    .select("id, status")
    .eq("assignment_id", assignmentId)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (existing?.status !== "pending_review" && existing?.status !== undefined) {
    // returned / approved — locked.
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

  // Record the uploaded files against this submission (admin client — the
  // caller owns the submission and the files were uploaded to the bucket).
  const admin = createAdminClient();
  for (const f of filePaths) {
    await admin.from("submission_files").insert({
      submission_id: submission.id,
      storage_path: f.path,
      original_name: f.name,
      format: f.name.split(".").pop()?.toLowerCase() ?? null,
    });
  }

  return { error: null, submissionId: submission.id };
}

/**
 * Unsubmit — clears the student's own pending submission back to a blank state
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
  if (files?.length) {
    await admin.storage
      .from("submissions")
      .remove(files.map((f) => f.storage_path));
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
 * For playing back a submitted recording — either the student listening to
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
