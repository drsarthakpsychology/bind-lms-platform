import { z } from "zod";
import { revokeStudioCertificate } from "@/app/(dashboard)/admin/credentials/studio/actions";
import { normaliseCertificateId } from "@/lib/certificates/id";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

const schema = z.object({ reason: z.string().trim().min(1).max(500) });

/** POST /api/app/v1/admin/certificates/:id/revoke (the studio's revokeStudioCertificate; super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }) => {
  const id = normaliseCertificateId(params.id);
  if (!id) throw new ApiFail("not_found");
  const { reason } = await body(schema, 4096);
  await limitWrite(`app:certwrite:${user.profile.id}`, 30);
  const r = await revokeStudioCertificate(id, reason);
  if (r.error) throw new ApiFail(/Super Admin/.test(r.error) ? "forbidden" : /not found|no such/i.test(r.error) ? "not_found" : "bad_request", r.error);
  return { revoked: true };
});
