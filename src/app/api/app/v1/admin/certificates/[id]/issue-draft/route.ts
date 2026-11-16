import { issueCertificate } from "@/app/(dashboard)/admin/achievements/actions";
import { normaliseCertificateId } from "@/lib/certificates/id";
import { failFrom } from "@/lib/app-api/admin-extras";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { IssueDraftResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

/** POST /api/app/v1/admin/certificates/:id/issue-draft: issue a course certificate draft (the website's issueCertificate; super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, limitWrite }): Promise<IssueDraftResult> => {
  const id = normaliseCertificateId(params.id);
  if (!id) throw new ApiFail("not_found");
  await limitWrite(`app:certwrite:${user.profile.id}`, 30);
  const r = await issueCertificate(id);
  if (r.error) failFrom(r.error);
  return { issued: true };
});
