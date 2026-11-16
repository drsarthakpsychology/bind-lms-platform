import { z } from "zod";
import { saveSignatureAsset } from "@/app/(dashboard)/admin/achievements/actions";
import { failFrom } from "@/lib/app-api/admin-extras";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

const MAX = 3 * 1024 * 1024;

/** POST /api/app/v1/admin/certificates/types/:id/signature { label, dataUrl }: the signature image on a certificate type (saveSignatureAsset; super admin, 10 a minute). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<{ saved: true }> => {
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) throw new ApiFail("not_found");
  const b = await body(z.object({ label: z.string().max(120), dataUrl: z.string().max(MAX) }), MAX + 1024);
  await limitWrite(`app:signature:${user.profile.id}`, 10);
  const r = await saveSignatureAsset(params.id, b.dataUrl, b.label);
  if (r.error) failFrom(r.error);
  return { saved: true };
});
