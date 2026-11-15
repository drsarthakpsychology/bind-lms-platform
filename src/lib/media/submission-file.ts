import "server-only";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isOwnSubmissionPath } from "@/lib/media/submission-paths";

/**
 * A short-lived address for a student's OWN submission file (an admin may
 * fetch any). Shared by the website's GET /api/media/submissions/:fileId and
 * the mobile app's GET /api/app/v1/submissions/files/:fileId. Ownership of the
 * row and of the storage path are both checked.
 */
export type SubmissionFileLink = { ok: true; url: string; expiresIn: number } | { ok: false; status: number; error: string };

export async function signSubmissionFile(profile: { id: string; role: string }, id: string): Promise<SubmissionFileLink> {
  const supabase = await createClient();
  const { data: file } = await supabase
    .from("submission_files")
    .select("id, submission_id, storage_path, original_name")
    .eq("id", id)
    .maybeSingle();

  if (!file?.storage_path) {
    return { ok: false, status: 404, error: "File not found." };
  }

  // Ownership: the file must belong to a submission owned by the caller (or
  // the caller is an admin). Fetch the submission's user_id.
  const { data: submission } = await supabase
    .from("submissions")
    .select("user_id, assignment_id")
    .eq("id", file.submission_id)
    .maybeSingle();

  if (!submission || (submission.user_id !== profile.id && profile.role !== "admin")) {
    return { ok: false, status: 403, error: "Not authorized." };
  }

  // The row is theirs, but the PATH must be too: it has to sit under the
  // submission owner's own upload prefix (`<assignmentId>/<userId>/`). Rows
  // recorded before the server checked paths could point at another
  // student's file; those are never signed.
  if (!isOwnSubmissionPath(file.storage_path, String(submission.assignment_id), String(submission.user_id))) {
    console.warn(`submission file ${file.id} has a storage path outside its owner's prefix; refusing to sign`);
    return { ok: false, status: 403, error: "Not authorized." };
  }

  // Mint a short-lived signed URL for the student's own file.
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("submissions")
    .createSignedUrl(file.storage_path, 60 * 15);

  if (error || !data) {
    return { ok: false, status: 500, error: "Couldn't load this file." };
  }

  return { ok: true, url: data.signedUrl, expiresIn: 60 * 15 };
}
