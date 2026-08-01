"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { validateMaterialFile } from "@/lib/materials";

export type MaterialUploadState = { error: string | null };

export type PrepareMaterialUploadResult =
  | { ok: true; path: string; token: string; materialId: string }
  | { ok: false; error: string };

/**
 * Phase 1 of a material upload: validate the file, create the materials row
 * (kind, format, size) and a signed upload slot. The client uploads the bytes
 * directly to the private bucket, then calls confirmMaterialUpload.
 */
export async function prepareMaterialUpload(
  courseId: string,
  lessonId: string | null,
  fileName: string,
  sizeBytes: number,
): Promise<PrepareMaterialUploadResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorized." };

  const validation = validateMaterialFile(fileName, sizeBytes);
  if (!validation.ok || !validation.kind || !validation.format) {
    return { ok: false, error: validation.error ?? "Unsupported file type." };
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
  const path = `${courseId}/${crypto.randomUUID()}-${safeName}`;

  // Insert the materials row (admin client — RLS lets admins write).
  const { data: material, error: insertError } = await admin
    .from("materials")
    .insert({
      course_id: courseId,
      lesson_id: lessonId ?? null,
      title: fileName.replace(/\.[^.]+$/, ""), // default title = filename minus ext
      kind: validation.kind,
      format: validation.format,
      size_bytes: sizeBytes,
      storage_path: path,
    })
    .select("id")
    .single();

  if (insertError || !material) {
    return { ok: false, error: "Could not create the material row." };
  }

  const { data, error } = await admin.storage.from("materials").createSignedUploadUrl(path);
  if (error || !data) {
    // Roll back the row we just created.
    await admin.from("materials").delete().eq("id", material.id);
    return { ok: false, error: error?.message ?? "Could not prepare the upload." };
  }

  return { ok: true, path: data.path, token: data.token, materialId: material.id };
}

/**
 * Called after the bytes are uploaded. The row already exists (created in
 * prepareMaterialUpload), so this is mainly a safety confirmation + revalidate.
 */
export async function confirmMaterialUpload(
  courseId: string,
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  revalidatePath(`/admin/courses/${courseId}`);
  return { error: null };
}

/** Delete a material (and its stored file). */
export async function deleteMaterial(
  courseId: string,
  materialId: string,
  storagePath: string | null,
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const admin = createAdminClient();

  if (storagePath) {
    const { error: fileError } = await admin.storage
      .from("materials")
      .remove([storagePath]);
    if (fileError) {
      return { error: "The file couldn't be removed." };
    }
  }

  const { error } = await admin.from("materials").delete().eq("id", materialId);
  if (error) return { error: "Could not delete the material." };

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/admin/courses/${courseId}/lessons/[lessonId]`);
  return { error: null };
}

/** Rename a material. */
export async function renameMaterial(
  courseId: string,
  materialId: string,
  title: string,
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };
  const clean = title.trim();
  if (!clean) return { error: "Title can't be empty." };

  const supabase = await createClient();
  const { error } = await supabase.from("materials").update({ title: clean }).eq("id", materialId);
  if (error) return { error: "Could not rename the material." };

  revalidatePath(`/admin/courses/${courseId}`);
  return { error: null };
}

/** Reorder materials (admin) — persists the new sort order. */
export async function reorderMaterials(
  courseId: string,
  orderedIds: string[],
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const admin = createAdminClient();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await admin
      .from("materials")
      .update({ sort_order: i + 1 })
      .eq("id", orderedIds[i]);
    if (error) return { error: "Could not reorder materials." };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return { error: null };
}

/** Replace a material's file (new bytes over the same row). */
export async function replaceMaterialFile(
  courseId: string,
  materialId: string,
  fileName: string,
  sizeBytes: number,
): Promise<PrepareMaterialUploadResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Not authorized." };

  const validation = validateMaterialFile(fileName, sizeBytes);
  if (!validation.ok || !validation.kind || !validation.format) {
    return { ok: false, error: validation.error ?? "Unsupported file type." };
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("materials")
    .select("storage_path")
    .eq("id", materialId)
    .single();

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${courseId}/${crypto.randomUUID()}-${safeName}`;

  const { data, error } = await admin.storage.from("materials").createSignedUploadUrl(path);
  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not prepare the upload." };
  }

  // Update the row to point at the new file, and clear the old one.
  await admin
    .from("materials")
    .update({
      storage_path: path,
      title: fileName.replace(/\.[^.]+$/, ""),
      format: validation.format,
      size_bytes: sizeBytes,
    })
    .eq("id", materialId);

  if (existing?.storage_path) {
    await admin.storage.from("materials").remove([existing.storage_path]);
  }

  return { ok: true, path: data.path, token: data.token, materialId };
}

/** Create a link-type material (no upload). */
export async function createLinkMaterial(
  courseId: string,
  lessonId: string | null,
  title: string,
  url: string,
): Promise<{ error: string | null; id?: string }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const cleanUrl = url.trim();
  if (!/^https?:\/\//i.test(cleanUrl)) {
    return { error: "Link must start with http:// or https://." };
  }
  const cleanTitle = title.trim();
  if (!cleanTitle) return { error: "Title is required." };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("materials")
    .insert({
      course_id: courseId,
      lesson_id: lessonId ?? null,
      title: cleanTitle,
      kind: "link",
      url: cleanUrl,
    })
    .select("id")
    .single();

  if (error || !data) return { error: "Could not create the link." };

  revalidatePath(`/admin/courses/${courseId}`);
  return { error: null, id: data.id };
}
