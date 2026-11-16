import { listCertificateEligible } from "@/app/(dashboard)/admin/achievements/actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { CertEligible } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";
// Checks every student against the rule, as the website's Types page does.
export const maxDuration = 120;

/** GET /api/app/v1/admin/certificates/types/:id/eligible: students who meet a course certificate's rule and have none yet (listCertificateEligible; super admin, 6 a minute). */
export const GET = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, limitWrite }): Promise<CertEligible> => {
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) throw new ApiFail("not_found");
  await limitWrite(`app:certeligible:${user.profile.id}`, 6);
  return { items: await listCertificateEligible(params.id) };
});
