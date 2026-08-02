import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { isSameOrigin } from "@/lib/media/same-origin";
import { createClient, createAdminClient } from "@/lib/supabase/server";

/**
 * GET /api/media/submissions/:fileId
 *
 * Serves a student's OWN submission file back to them. This is the deliberate
 * exception to proxy-locking: a student's submission is their own work, so
 * they may download/re-open it (the round-13 decision). Ownership is still
 * enforced server-side — a student can only fetch files on THEIR submission;
 * an admin can fetch any.
 *
 * Delivery: a short-lived signed URL from the private `submissions` bucket.
 * No stream token, no proxy — the student's own file is not protected content.
 *
 * The signed URL only works for ~15 min; if a student needs it again they
 * re-request it. No bucket path or storage key is ever exposed directly —
 * the route returns a signed URL, and ownership is checked per request.
 */
export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ fileId: string[] }> },
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  const profile = await requireSession();
  if (!profile) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { fileId } = await ctx.params;
  const id = fileId[0];
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid file id." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: file } = await supabase
    .from("submission_files")
    .select("id, submission_id, storage_path, original_name")
    .eq("id", id)
    .maybeSingle();

  if (!file?.storage_path) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  // Ownership: the file must belong to a submission owned by the caller (or
  // the caller is an admin). Fetch the submission's user_id.
  const { data: submission } = await supabase
    .from("submissions")
    .select("user_id")
    .eq("id", file.submission_id)
    .maybeSingle();

  if (!submission || (submission.user_id !== profile.id && profile.role !== "admin")) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  // Mint a short-lived signed URL for the student's own file.
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("submissions")
    .createSignedUrl(file.storage_path, 60 * 15);

  if (error || !data) {
    return NextResponse.json({ error: "Couldn't load this file." }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl, expiresIn: 60 * 15 });
}
