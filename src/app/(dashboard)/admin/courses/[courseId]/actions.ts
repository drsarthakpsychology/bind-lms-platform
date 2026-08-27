"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { signR2UploadUrl, headR2Object } from "@/lib/media/r2";
import { policyVersion } from "@/lib/legal-constants";

export type SignedUploadResult =
  | { ok: true; url: string; key: string }
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

/**
 * Enroll MANY students in one course (bulk). Idempotent; one upsert call.
 * The terms acceptance (timestamp + policy version) is only written for
 * students who don't already have it (first acceptance wins).
 */
export async function enrollStudents(
  courseId: string,
  userIds: string[],
): Promise<{ error: string | null; enrolled: number }> {
  try {
    if (!(await requireAdmin())) return { error: "Not authorized.", enrolled: 0 };

    const ids = Array.from(new Set(userIds)).filter(Boolean);
    if (!ids.length) return { error: null, enrolled: 0 };

    const supabase = await createClient();
    const { data: existing } = await supabase
      .from("course_enrollments")
      .select("user_id")
      .eq("course_id", courseId)
      .in("user_id", ids);
    const alreadyAccepted = new Set((existing ?? []).map((e) => e.user_id));
    const now = new Date().toISOString();
    const version = policyVersion();
    const rows = ids.map((userId) => ({
      course_id: courseId,
      user_id: userId,
      ...(alreadyAccepted.has(userId) ? {} : { policy_acceptance_at: now, policy_version: version }),
    }));

    const { error } = await supabase
      .from("course_enrollments")
      .upsert(rows, { onConflict: "user_id,course_id" });

    if (error) return { error: "Could not enroll the students.", enrolled: 0 };
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}`);
    return { error: null, enrolled: ids.length };
  } catch {
    return { error: "Could not enroll the students.", enrolled: 0 };
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

  // Upload target is Cloudflare R2 (a pre-signed PUT), NOT Supabase Storage —
  // the Supabase Free-plan global 50MB file cap made large source uploads fail.
  // R2 has no such per-file cap, and R2 is the canonical video store anyway.
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) return { ok: false, error: "R2 bucket isn't configured on this deployment." };

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `lessons/${courseId}/source/${crypto.randomUUID()}-${safeName}`;

  try {
    const url = await signR2UploadUrl(bucket, key);
    return { ok: true, url, key };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not prepare the upload." };
  }
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
  const weekRaw = Number(formData.get("week") ?? 1);
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
  // path, and never create a row that points at nothing. The source now lives
  // in R2 (pre-signed PUT), so we HEAD the R2 object.
  const bucket = process.env.R2_BUCKET_NAME ?? "";
  const size = await headR2Object(bucket, videoPath);
  if (size === null) {
    return { error: "Upload didn't reach R2. Re-upload the video." };
  }

  const supabase = await createClient();

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .insert({
      course_id: courseId,
      title,
      description: description || null,
      order_index: Number.isFinite(orderIndexRaw) ? orderIndexRaw : 0,
      week: Number.isFinite(weekRaw) && weekRaw >= 1 ? Math.round(weekRaw) : 1,
      requires_assignment: requiresAssignment,
      video_storage_path: videoPath,
      video_provider: "r2",
      video_bucket: bucket,
      video_status: "ready", // object verified above
    })
    .select("id")
    .single();

  if (lessonError || !lesson) return { error: "Could not create the lesson." };

  // Record the source object on media_assets so the stream proxy resolves it
  // as an R2 legacy single-file (provider=r2, master_playlist=null). publish-lecture
  // later upserts over this same row to promote it to HLS.
  const admin = createAdminClient();
  await admin
    .from("media_assets")
    .upsert(
      { lesson_id: lesson.id, provider: "r2", bucket, key_prefix: videoPath, master_playlist: null },
      { onConflict: "lesson_id" },
    );

  if (requiresAssignment) {
    const { error: assignmentError } = await supabase.from("assignments").insert({
      lesson_id: lesson.id,
      title,
      prompt_text: assignmentPrompt,
      instructions: assignmentPrompt,
      // The admin just wrote instructions and toggled the switch on — they
      // obviously want students to see it. Default PUBLISHED so the assignment
      // isn't silently invisible (the old lifecycle created drafts that never
      // surfaced, with no way to publish them from the builder).
      is_published: true,
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

  // Verify the bytes actually landed (the source now lives in R2) before
  // marking the lesson playable.
  const bucket = process.env.R2_BUCKET_NAME ?? "";
  const size = await headR2Object(bucket, path);
  const supabase = await createClient();
  if (size === null) {
    await supabase
      .from("lessons")
      .update({ video_status: "failed" })
      .eq("id", lessonId);
    revalidatePath(`/admin/courses/${courseId}`);
    return { error: "Upload didn't reach R2. Re-upload the video." };
  }

  const { error } = await supabase
    .from("lessons")
    .update({
      video_storage_path: path,
      video_provider: "r2",
      video_bucket: bucket,
      video_status: "ready",
    })
    .eq("id", lessonId);

  if (error) return { error: "Upload succeeded, but saving the video path failed." };

  // Record the source object on media_assets (R2 legacy single-file) so the
  // stream proxy resolves it correctly; publish-lecture promotes it to HLS.
  const admin = createAdminClient();
  await admin
    .from("media_assets")
    .upsert(
      { lesson_id: lessonId, provider: "r2", bucket, key_prefix: path, master_playlist: null },
      { onConflict: "lesson_id" },
    );

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

/**
 * Edit a lesson's metadata (title / notes / week / assignment requirement)
 * without touching its video. The assignment lifecycle follows the switch:
 *   - switched ON  → an existing assignment is updated + re-published; if none
 *     exists it is created PUBLISHED (the admin just wrote the prompt — it
 *     must not silently vanish).
 *   - switched OFF → the existing assignment is UNpublished, never deleted
 *     (submissions + grading history survive; flipping back is one tap).
 */
export async function updateLesson(
  lessonId: string,
  courseId: string,
  fields: {
    title: string;
    description: string;
    week: number;
    requiresAssignment: boolean;
    assignmentPrompt: string;
  },
): Promise<{ error: string | null }> {
  try {
    if (!(await requireAdmin())) return { error: "Not authorized." };

    const title = fields.title.trim();
    if (!title) return { error: "Title is required." };
    const week = Number.isFinite(fields.week) && fields.week >= 1 ? Math.round(fields.week) : 1;
    const prompt = fields.assignmentPrompt.trim();

    const supabase = await createClient();

    const { error: lessonError } = await supabase
      .from("lessons")
      .update({
        title,
        description: fields.description.trim() || null,
        week,
        requires_assignment: fields.requiresAssignment,
      })
      .eq("id", lessonId);
    if (lessonError) return { error: "Could not update the lesson." };

    const { data: assignment } = await supabase
      .from("assignments")
      .select("id")
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (fields.requiresAssignment) {
      if (!prompt) return { error: "Add assignment instructions, or switch off Requires assignment." };
      const payload = {
        title,
        prompt_text: prompt,
        instructions: prompt,
        is_published: true,
      };
      const { error: assignmentError } = assignment
        ? await supabase.from("assignments").update(payload).eq("id", assignment.id)
        : await supabase.from("assignments").insert({ lesson_id: lessonId, ...payload, submission_type: "text" });
      if (assignmentError) return { error: "Lesson saved, but the assignment couldn't be updated." };
    } else if (assignment) {
      // Switching the requirement OFF keeps the row + submissions, just stops
      // showing it to students.
      const { error: unpublishError } = await supabase
        .from("assignments")
        .update({ is_published: false })
        .eq("id", assignment.id);
      if (unpublishError) return { error: "Lesson saved, but the assignment couldn't be unpublished." };
    }

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}`);
    return { error: null };
  } catch {
    return { error: "Could not update the lesson." };
  }
}

/** Publish/unpublish the assignment attached to a lesson (the builder's toggle). */
export async function setAssignmentPublished(
  lessonId: string,
  courseId: string,
  published: boolean,
): Promise<{ error: string | null }> {
  try {
    if (!(await requireAdmin())) return { error: "Not authorized." };

    const supabase = await createClient();
    const { data: assignment, error: findError } = await supabase
      .from("assignments")
      .select("id")
      .eq("lesson_id", lessonId)
      .maybeSingle();
    if (findError || !assignment) return { error: "No assignment on this lesson." };

    const { error } = await supabase
      .from("assignments")
      .update({ is_published: published })
      .eq("id", assignment.id);
    if (error) return { error: "Could not update the assignment." };

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}`);
    return { error: null };
  } catch {
    return { error: "Could not update the assignment." };
  }
}

/** Move a lesson one slot up/down within its course (swaps order_index). */
export async function moveLesson(
  lessonId: string,
  courseId: string,
  direction: "up" | "down",
): Promise<{ error: string | null }> {
  try {
    if (!(await requireAdmin())) return { error: "Not authorized." };

    const supabase = await createClient();
    const { data: ordered } = await supabase
      .from("lessons")
      .select("id, order_index")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true })
      .order("id", { ascending: true });

    const rows = ordered ?? [];
    const idx = rows.findIndex((r) => r.id === lessonId);
    if (idx === -1) return { error: "Lesson not found." };
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= rows.length) return { error: null }; // already at edge

    const a = rows[idx];
    const b = rows[swapIdx];
    const { error } = await supabase.from("lessons").update({ order_index: b.order_index }).eq("id", a.id);
    if (!error) await supabase.from("lessons").update({ order_index: a.order_index }).eq("id", b.id);
    if (error) return { error: "Could not reorder the lesson." };

    revalidatePath(`/admin/courses/${courseId}`);
    return { error: null };
  } catch {
    return { error: "Could not reorder the lesson." };
  }
}

export type RosterForCourse = {
  students: Array<{ id: string; email: string | null }>;
  enrolledIds: string[];
};

/**
 * Load the full student roster + this course's enrollments on demand. The
 * builder page no longer drags the entire roster into every page load — the
 * enrolled-students section fetches only when it's first opened.
 */
export async function loadRoster(courseId: string): Promise<RosterForCourse> {
  if (!(await requireAdmin())) return { students: [], enrolledIds: [] };

  const supabase = await createClient();
  const [{ data: students }, { data: enrollments }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email")
      .eq("role", "student")
      .eq("is_test", false)
      .order("email", { ascending: true }),
    supabase.from("course_enrollments").select("user_id").eq("course_id", courseId),
  ]);

  return {
    students: (students ?? []).map((s) => ({ id: s.id, email: s.email })),
    enrolledIds: (enrollments ?? []).map((e) => e.user_id),
  };
}
