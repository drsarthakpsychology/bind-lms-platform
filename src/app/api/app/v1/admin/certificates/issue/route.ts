import { issueStudioCertificates } from "@/app/(dashboard)/admin/credentials/studio/actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { StudioIssueResult } from "@/lib/app-api/contract-practise-admin";
import { studioSchema } from "../schema";

export const runtime = "nodejs";
// A whole cohort is one request: PDFs, notices and paced emails (as the studio page).
export const maxDuration = 300;

/** POST /api/app/v1/admin/certificates/issue: issue to one student, several, or a cohort (the studio's issueStudioCertificates; super admin only, 10 a minute). */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<StudioIssueResult> => {
  const { replaces, ...input } = await body(studioSchema, 128_000);
  await limitWrite(`app:certissue:${user.profile.id}`, 10);
  const r = await issueStudioCertificates({ ...input, expiresOn: input.expiresOn || null }, replaces ?? null);
  if (r.error) throw new ApiFail(/Super Admin/.test(r.error) ? "forbidden" : "bad_request", r.error);
  return { issued: r.issued, skipped: r.skipped, batchId: r.batchId, delivery: (r.delivery as unknown as Record<string, unknown>) ?? null };
});
