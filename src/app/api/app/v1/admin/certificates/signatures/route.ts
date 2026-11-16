import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { uploadSignatureImage } from "@/app/(dashboard)/admin/credentials/settings/actions";
import { certificateSettings } from "@/lib/app-api/admin-round2";
import { failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import type { CertificateSettings } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

// A 2 MB image as base64 is about 2.7 MB of text.
const MAX = 3 * 1024 * 1024;
const schema = z.object({ label: z.string().max(120), dataUrl: z.string().max(MAX) });

/** POST /api/app/v1/admin/certificates/signatures: save a signature image any certificate can use (the website's uploadSignatureImage; super admin, 10 a minute). */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<CertificateSettings> => {
  const b = await body(schema, MAX + 1024);
  await limitWrite(`app:signature:${user.profile.id}`, 10);
  const r = await uploadSignatureImage(b.label, b.dataUrl);
  if (r.error) failFrom(r.error);
  return certificateSettings(createAdminClient(), true);
});
