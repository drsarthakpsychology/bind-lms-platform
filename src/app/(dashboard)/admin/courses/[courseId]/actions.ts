"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export type SignedUploadResult =
  | { ok: true; path: string; token: string }
  | { ok: false; error: string };

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

  const supabase = await createClient();
  const { error } = await supabase
    .from("lessons")
    .update({ video_storage_path: path })
    .eq("id", lessonId);

  if (error) return { error: "Upload succeeded, but saving the video path failed." };

  revalidatePath(`/admin/courses/${courseId}`);
  return { error: null };
}

export async function deleteLesson(
  lessonId: string,
  courseId: string,
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const supabase = await createClient();
  const { error } = await supabase.from("lessons").delete().eq("id", lessonId);

  if (error) return { error: "Could not delete the lesson." };

  revalidatePath(`/admin/courses/${courseId}`);
  return { error: null };
}
