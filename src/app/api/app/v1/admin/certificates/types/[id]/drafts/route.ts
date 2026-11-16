import { z } from "zod";
import { createCertificateDraft } from "@/app/(dashboard)/admin/achievements/actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { CertDraftsResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";
export const maxDuration = 120;

/** POST /api/app/v1/admin/certificates/types/:id/drafts { userIds }: course certificate drafts, issued later from Issued (createCertificateDraft for each; super admin, 10 a minute). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<CertDraftsResult> => {
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) throw new ApiFail("not_found");
  const { userIds } = await body(z.object({ userIds: z.array(z.string().uuid()).min(1).max(100) }));
  await limitWrite(`app:certdrafts:${user.profile.id}`, 10);
  const out: CertDraftsResult = { made: [], failed: [] };
  for (const userId of [...new Set(userIds)]) {
    const r = await createCertificateDraft(userId, params.id);
    if (r.error || !r.credentialId) out.failed.push({ userId, reason: r.error ?? "Couldn't make it." });
    else out.made.push({ userId, credentialId: r.credentialId });
  }
  return out;
});
