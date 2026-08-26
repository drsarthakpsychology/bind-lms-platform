"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { verifyObjectExists } from "@/lib/storage-verify";
import { policyVersion } from "@/lib/legal-constants";

export type SignedUploadResult =
  | { ok: true; path: string; token: string }
  | { ok: false; error: string };

/** Enroll one student (by user id) in a course. Idempotent. */
export async function enrollStudent(
  courseId: string,
  userId: string,
): Promise<{ error: string | null }> {
  try {
    if (!(await requireAdmin())) return { error: "Not authorized." };

    const supabase = await createClient();
    // The enrolment record carries the terms acceptance (timestamp + policy
    // version) — the audit trail that makes the no-refund term defensible. On a
    // re-enrol it is only written once (first acceptance wins).
    const { data: existing } = await supabase
      .from("course_enrollments")
      .select("policy_acceptance_at")
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .maybeSingle();
    const { error } = await supabase
      .from("course_enrollments")
      .upsert(
        {
          course_id: courseId,
          user_id: userId,
          ...(existing?.policy_acceptance_at
            ? {}
            : { policy_acceptance_at: new Date().toISOString(), policy_version: policyVersion() }),
        },
        { onConflict: "user_id,course_id" },
      );

    if (error) return { error: "Could not enroll the student." };
    revalidatePath(`/admin/courses/${courseId}`);
    return { error: null };
  } catch {
    return { error: "Could not enroll the student." };
  }
}

/** Remove one student from a course. */
export async function unenrollStudent(
  courseId: string,
  userId: string,
): Promise<{ error: string | null }> {
  try {
    if (!(await requireAdmin())) return { error: "Not authorized." };

    // Admin deletes use the service-role client — the anon client's DELETE is
    // RLS-filtered to 0 rows while still returning 204 (no error), so the
    // change silently doesn't happen.
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("course_enrollments")
      .delete()
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .select("id");

    if (error || !data?.length) return { error: "Could not unenroll the student." };
    revalidatePath(`/admin/courses/${courseId}`);
    return { error: null };
  } catch {
    return { error: "Could not unenroll the student." };
  }
}

/**
 * Called the moment a file is picked, before any lesson row exists — the
 * YouTube-style flow uploads first and fills in details while that
 * upload runs in the background. The path is keyed on a fresh random id
 * rather than a lesson id, since there is no lesson yet.
 */
export async function prepareVideoUpload(
  courseId: string,
  fileName: string,
): Promise<SignedUploadResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorized." };

  const supabase = await createClient();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${courseId}/${crypto.randomUUID()}-${safeName}`;

  const { data, error } = await supabase.storage.from("videos").createSignedUploadUrl(path);
  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not prepare the upload." };
  }

  return { ok: true, path: data.path, token: data.token };
}

export type CreateLessonState = { error: string | null };

export async function createLessonWithVideo(
  courseId: string,
  _prevState: CreateLessonState,
  formData: FormData,
): Promise<CreateLessonState> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const orderIndexRaw = Number(formData.get("orderIndex") ?? 0);
  const requiresAssignment = formData.get("requiresAssignment") === "on";
  const videoPath = String(formData.get("videoPath") ?? "").trim();
  const assignmentPrompt = String(formData.get("assignmentPrompt") ?? "").trim();

  // Multi-select submission types. The checkbox inputs all use the same
  // name, so getAll() returns each checked value. Stored comma-separated,
  // deduplicated, in canonical order (see SUBMISSION_TYPES in lesson-form).
  const allowedTypes = formData.getAll("assignmentType").map((v) => String(v).trim()).filter(Boolean);
  const assignmentTypes = Array.from(new Set(allowedTypes)).join(",") || "text";

  if (!title) return { error: "Title is required." };
  if (!videoPath) return { error: "Upload a video before creating the lesson." };
  if (requiresAssignment && !assignmentPrompt) {
    return { error: "Add assignment instructions, or uncheck \u201cRequires assignment.\u201d" };
  }

  // Verify the bytes actually landed before saving a lesson that points at
  // them. The client's upload success callback is never trusted — a dropped or
  // network-failed upload leaves a path with no object, and a lesson pointing
  // at it can never play. Mirrors attachVideoToLesson: only write a playable
  // path, and never create a row that points at nothing.
  const size = await verifyObjectExists("videos", videoPath);
  if (size === null) {
    return { error: "Upload didn't reach storage. Re-upload the video." };
  }

  const supabase = await createClient();

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .insert({
      course_id: courseId,
      title,
      description: description || null,
      order_index: Number.isFinite(orderIndexRaw) ? orderIndexRaw : 0,
      requires_assignment: requiresAssignment,
      video_storage_path: videoPath,
      video_provider: "supabase",
      video_bucket: "videos",
      video_status: "ready", // object verified above
    })
    .select("id")
    .single();

  if (lessonError || !lesson) return { error: "Could not create the lesson." };

  if (requiresAssignment) {
    const { error: assignmentError } = await supabase.from("assignments").insert({
      lesson_id: lesson.id,
      prompt_text: assignmentPrompt,
      submission_type: assignmentTypes,
    });

    if (assignmentError) {
      return {
        error:
          "Lesson and video were saved, but the assignment couldn't be created. Add it separately.",
      };
    }
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return { error: null };
}

export async function attachVideoToLesson(
  lessonId: string,
  courseId: string,
  path: string,
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  // Verify the bytes actually landed before marking the lesson playable.
  const size = await verifyObjectExists("videos", path);
  const supabase = await createClient();
  if (size === null) {
    await supabase
      .from("lessons")
      .update({ video_status: "failed" })
      .eq("id", lessonId);
    revalidatePath(`/admin/courses/${courseId}`);
    return { error: "Upload didn't reach storage. Re-upload the video." };
  }

  const { error } = await supabase
    .from("lessons")
    .update({ video_storage_path: path, video_status: "ready" })
    .eq("id", lessonId);

  if (error) return { error: "Upload succeeded, but saving the video path failed." };

  revalidatePath(`/admin/courses/${courseId}`);
  return { error: null };
}

export async function deleteLesson(
  lessonId: string,
  courseId: string,
): Promise<{ error: string | null }> {
  try {
    if (!(await requireAdmin())) return { error: "Not authorized." };

    // Admin deletes go through the service-role client. The anon client's
    // DELETE was RLS-filtered to 0 rows while still returning 204 (no error),
    // so the lesson silently "came back" on refresh. The admin client bypasses
    // RLS and actually deletes — the same pattern deleteMaterial uses.
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("lessons")
      .delete()
      .eq("id", lessonId)
      .select("id");

    if (error || !data?.length) return { error: "Could not delete the lesson." };

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}`);
    return { error: null };
  } catch {
    return { error: "Could not delete the lesson." };
  }
}

/**
 * Set a lesson's go-live status (hidden | live | unlocked):
 *   - hidden   → students don't see the lesson row.
 *   - live     → students see the row but it's "yet to be live" (locked).
 *   - unlocked → students see + play it.
 */
export async function setLessonStatus(
  lessonId: string,
  courseId: string,
  status: "hidden" | "live" | "unlocked",
): Promise<{ error: string | null }> {
  try {
    if (!(await requireAdmin())) return { error: "Not authorized." };

    const supabase = await createClient();
    const { error } = await supabase.from("lessons").update({ status }).eq("id", lessonId);

    if (error) return { error: "Could not update the lesson." };

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}`);
    return { error: null };
  } catch {
    return { error: "Could not update the lesson." };
  }
}
