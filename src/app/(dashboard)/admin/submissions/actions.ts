"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function approveSubmission(submissionId: string): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("submissions")
    .update({ status: "approved" })
    .eq("id", submissionId);

  if (error) return { error: "Could not approve the submission." };

  revalidatePath("/admin/submissions");
  return { error: null };
}

export async function getSubmissionAudioUrl(
  audioPath: string,
): Promise<{ url: string | null; error: string | null }> {
  if (!(await requireAdmin())) return { url: null, error: "Not authorized." };

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { url: null, error: "SUPABASE_SERVICE_ROLE_KEY isn't set in this deployment yet." };
  }

  const { data, error } = await admin.storage.from("submissions").createSignedUrl(audioPath, 60 * 15);
  if (error || !data) return { url: null, error: "Could not prepare playback." };

  return { url: data.signedUrl, error: null };
}

/**
 * Grade a submission: feedback + optional score, flips status to 'returned'
 * (the student's badge becomes Graded). Admin only.
 */
export async function returnFeedback(
  submissionId: string,
  feedback: string,
  score: number | null,
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("submissions")
    .update({
      feedback: feedback.trim() || null,
      score,
      status: "returned",
      returned_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) return { error: "Could not return the feedback." };

  revalidatePath("/admin/submissions");
  return { error: null };
}

/** Mint a signed URL for a submission file (PDF/image preview, or download). */
export async function getSubmissionFileUrl(
  storagePath: string,
): Promise<{ url: string | null; error: string | null }> {
  if (!(await requireAdmin())) return { url: null, error: "Not authorized." };

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("submissions").createSignedUrl(storagePath, 60 * 15);
  if (error || !data) return { url: null, error: "Could not prepare the file." };

  return { url: data.signedUrl, error: null };
}
