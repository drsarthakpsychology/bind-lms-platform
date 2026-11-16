import { previewCertificateToAnyone } from "@/app/(dashboard)/admin/credentials/actions";
import { failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import type { AnyonePreview } from "@/lib/app-api/contract-practise-admin";
import { anyoneInput, anyoneSchema } from "../schema";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/certificates/anyone/preview: the no-account certificate's PDF, nothing saved or sent (the website's previewCertificateToAnyone; super admin, 60 a minute). */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitFast }): Promise<AnyonePreview> => {
  limitFast(`app:certanyonepreview:${user.profile.id}`, 60);
  const b = await body(anyoneSchema, 16_000);
  const r = await previewCertificateToAnyone(anyoneInput(b));
  if (r.error || !r.dataUrl) failFrom(r.error ?? "No preview.");
  return { pdfBase64: r.dataUrl.replace(/^data:application\/pdf;base64,/, ""), fileName: "certificate-preview.pdf" };
});
