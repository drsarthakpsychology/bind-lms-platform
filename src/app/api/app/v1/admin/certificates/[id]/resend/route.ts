import { z } from "zod";
import { resendStudioCertificate } from "@/app/(dashboard)/admin/credentials/studio/actions";
import { normaliseCertificateId } from "@/lib/certificates/id";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { ResendResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

const schema = z.object({ email: z.boolean() });

/** POST /api/app/v1/admin/certificates/:id/resend: the notice again, and the email if asked (the studio's resendStudioCertificate; super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<ResendResult> => {
  const id = normaliseCertificateId(params.id);
  if (!id) throw new ApiFail("not_found");
  const { email } = await body(schema, 512);
  await limitWrite(`app:certwrite:${user.profile.id}`, 30);
  const r = await resendStudioCertificate(id, email);
  if (r.error) throw new ApiFail(/Super Admin/.test(r.error) ? "forbidden" : /not found|no such/i.test(r.error) ? "not_found" : "bad_request", r.error);
  return { notified: r.notified, delivery: (r.delivery as unknown as Record<string, unknown>) ?? null };
});
