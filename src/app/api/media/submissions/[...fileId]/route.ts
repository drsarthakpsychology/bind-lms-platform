import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { isSameOrigin } from "@/lib/media/same-origin";
import { signSubmissionFile } from "@/lib/media/submission-file";

/**
 * GET /api/media/submissions/:fileId
 *
 * Serves a student's OWN submission file back to them. This is the deliberate
 * exception to proxy-locking: a student's submission is their own work, so
 * they may download/re-open it (the round-13 decision). Ownership is still
 * enforced server-side: a student can only fetch files on THEIR submission;
 * an admin can fetch any.
 *
 * Delivery: a short-lived signed URL from the private `submissions` bucket.
 * No stream token, no proxy: the student's own file is not protected content.
 *
 * The signed URL only works for ~15 min; if a student needs it again they
 * re-request it. No bucket path or storage key is ever exposed directly:
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

  const link = await signSubmissionFile(profile, id);
  if (!link.ok) return NextResponse.json({ error: link.error }, { status: link.status });
  return NextResponse.json({ url: link.url, expiresIn: link.expiresIn });
}
