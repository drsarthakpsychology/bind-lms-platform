import { getCredentialDownload } from "@/app/(dashboard)/admin/achievements/actions";
import { normaliseCertificateId } from "@/lib/certificates/id";
import { failFrom } from "@/lib/app-api/admin-extras";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { AdminFileLink } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/certificates/:id/pdf: a 15 minute address for the certificate's PDF (the website's getCredentialDownload). */
export const GET = appRoute<{ id: string }>({ auth: "admin" }, async ({ user, params, limitFast }): Promise<AdminFileLink> => {
  const id = normaliseCertificateId(params.id);
  if (!id) throw new ApiFail("not_found");
  limitFast(`app:certpdf:${user.profile.id}`, 120);
  const r = await getCredentialDownload(id);
  if (r.error || !r.url) failFrom(r.error ?? "No certificate file.");
  return { url: r.url, expiresInSeconds: 900 };
});
