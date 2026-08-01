"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export type AssignmentEditorState = { error: string | null; savedAt?: string };

/**
 * Create an assignment for a lesson. Admin only.
 */
export async function createAssignment(
  courseId: string,
  lessonId: string,
  _prev: AssignmentEditorState,
  formData: FormData,
): Promise<AssignmentEditorState> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const title = String(formData.get("title") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const dueAtRaw = String(formData.get("dueAt") ?? "").trim();
  const allowLate = formData.get("allowLate") === "on";
  const isPublished = formData.get("isPublished") === "on";
  const maxFiles = Number(formData.get("maxFiles") ?? 3);
  const maxFileMb = Number(formData.get("maxFileMb") ?? 25);
  const acceptedFormats = formData.getAll("acceptedFormat").map((v) => String(v));

  if (!title) return { error: "Title is required." };

  const dueAt = dueAtRaw ? new Date(dueAtRaw).toISOString() : null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("assignments")
    .insert({
      lesson_id: lessonId,
      title,
      instructions: instructions || null,
      prompt_text: instructions || null, // keep the legacy prompt in sync
      due_at: dueAt,
      allow_late: allowLate,
      is_published: isPublished,
      max_files: maxFiles || 3,
      max_file_mb: maxFileMb || 25,
      accepted_formats: acceptedFormats.length ? acceptedFormats : ["pdf", "docx", "image"],
      submission_type: "text,audio,pdf,docx,image",
    })
    .select("id")
    .single();

  if (error || !data) return { error: "Couldn't create the assignment. Check the title and try again." };

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}/lessons/${lessonId}`);
  return { error: null };
}

/**
 * Save an assignment's editable fields (used by the in-place editor + autosave).
 * Admin only. Students' submissions are untouched — only metadata changes.
 */
export async function saveAssignment(
  courseId: string,
  lessonId: string,
  assignmentId: string,
  _prev: AssignmentEditorState,
  formData: FormData,
): Promise<AssignmentEditorState> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const title = String(formData.get("title") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const dueAtRaw = String(formData.get("dueAt") ?? "").trim();
  const allowLate = formData.get("allowLate") === "on";
  const isPublished = formData.get("isPublished") === "on";
  const maxFiles = Number(formData.get("maxFiles") ?? 3);
  const maxFileMb = Number(formData.get("maxFileMb") ?? 25);
  const acceptedFormats = formData.getAll("acceptedFormat").map((v) => String(v));

  if (!title) return { error: "Title is required." };

  const dueAt = dueAtRaw ? new Date(dueAtRaw).toISOString() : null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("assignments")
    .update({
      title,
      instructions: instructions || null,
      prompt_text: instructions || null,
      due_at: dueAt,
      allow_late: allowLate,
      is_published: isPublished,
      max_files: maxFiles || 3,
      max_file_mb: maxFileMb || 25,
      accepted_formats: acceptedFormats.length ? acceptedFormats : ["pdf", "docx", "image"],
    })
    .eq("id", assignmentId);

  if (error) return { error: "Couldn't save the assignment. Try again." };

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}/lessons/${lessonId}`);
  return { error: null, savedAt: new Date().toISOString() };
}

/**
 * Autosave helper — saves the assignment without any explicit "save" click.
 * Admin only. Used by the editor's debounced autosave.
 */
export async function autosaveAssignment(
  courseId: string,
  lessonId: string,
  assignmentId: string,
  fields: {
    title?: string;
    instructions?: string;
    dueAt?: string | null;
    allowLate?: boolean;
    isPublished?: boolean;
    maxFiles?: number;
    maxFileMb?: number;
    acceptedFormats?: string[];
  },
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const supabase = await createClient();
  const patch: Record<string, unknown> = {};

  if (fields.title !== undefined) patch.title = fields.title;
  if (fields.instructions !== undefined) {
    patch.instructions = fields.instructions || null;
    patch.prompt_text = fields.instructions || null;
  }
  if (fields.dueAt !== undefined) patch.due_at = fields.dueAt || null;
  if (fields.allowLate !== undefined) patch.allow_late = fields.allowLate;
  if (fields.isPublished !== undefined) patch.is_published = fields.isPublished;
  if (fields.maxFiles !== undefined) patch.max_files = fields.maxFiles;
  if (fields.maxFileMb !== undefined) patch.max_file_mb = fields.maxFileMb;
  if (fields.acceptedFormats !== undefined) {
    patch.accepted_formats = fields.acceptedFormats.length
      ? fields.acceptedFormats
      : ["pdf", "docx", "image"];
  }

  if (Object.keys(patch).length === 0) return { error: null };

  const { error } = await supabase.from("assignments").update(patch).eq("id", assignmentId);
  if (error) return { error: "Could not autosave the assignment." };

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}/lessons/${lessonId}`);
  return { error: null };
}

/** Publish / unpublish an assignment. */
export async function setAssignmentPublished(
  courseId: string,
  lessonId: string,
  assignmentId: string,
  isPublished: boolean,
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("assignments")
    .update({ is_published: isPublished })
    .eq("id", assignmentId);

  if (error) return { error: "Could not update the assignment." };

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}/lessons/${lessonId}`);
  return { error: null };
}

/** Delete an assignment. */
export async function deleteAssignment(
  courseId: string,
  lessonId: string,
  assignmentId: string,
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const supabase = await createClient();
  const { error } = await supabase.from("assignments").delete().eq("id", assignmentId);
  if (error) return { error: "Could not delete the assignment." };

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}/lessons/${lessonId}`);
  return { error: null };
}
