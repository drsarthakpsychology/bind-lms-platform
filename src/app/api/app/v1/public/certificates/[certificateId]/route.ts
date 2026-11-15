import { verifyCertificate } from "@/lib/app-api/achievements";
import { appRoute } from "@/lib/app-api/route";
import type { CertificateVerification } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/public/certificates/:certificateId: the public check behind /verify/:id. */
export const GET = appRoute<{ certificateId: string }>({ auth: "public" }, async ({ params, ip, limitFast }): Promise<CertificateVerification> => {
  limitFast(`app:verify:${ip}`, 60);
  return verifyCertificate(params.certificateId);
});
