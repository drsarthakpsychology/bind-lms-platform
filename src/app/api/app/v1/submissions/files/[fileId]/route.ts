import { signSubmissionFile } from "@/lib/media/submission-file";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

/** GET /api/app/v1/submissions/files/:fileId: a 15-minute address of the student's own file (same check as the website). */
export const GET = appRoute<{ fileId: string }>({ auth: "bearer" }, async ({ user, params, limitFast }) => {
  if (!uuid.safeParse(params.fileId).success) throw new ApiFail("not_found");
  limitFast(`subfile:${user.profile.id}`, 120);
  const link = await signSubmissionFile(user.profile, params.fileId);
  if (!link.ok) throw new ApiFail(link.status === 404 ? "not_found" : link.status === 403 ? "forbidden" : "server_error", link.error);
  return { url: link.url, expiresIn: link.expiresIn };
});
