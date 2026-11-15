import { downloadMyCertificate } from "@/app/(dashboard)/achievements/actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { CertificatePdfLink } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/achievements/:credentialId/pdf: a 15-minute address of the student's own certificate PDF. */
export const GET = appRoute<{ credentialId: string }>({ auth: "bearer", gates: GATES.achievements }, async ({ user, params, limitFast }): Promise<CertificatePdfLink> => {
  limitFast(`app:certpdf:${user.profile.id}`, 30);
  if (!/^[A-Za-z0-9-]{4,80}$/.test(params.credentialId)) throw new ApiFail("not_found");
  const r = await downloadMyCertificate(params.credentialId);
  if (!r.url) throw new ApiFail(r.error === "Certificate not yet issued." ? "conflict" : "not_found", r.error ?? undefined);
  return { url: r.url, expiresIn: 15 * 60 };
});
