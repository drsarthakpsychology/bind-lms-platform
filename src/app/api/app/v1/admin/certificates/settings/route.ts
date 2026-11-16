import { z } from "zod";
import { isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { saveDefaultSignatories } from "@/app/(dashboard)/admin/credentials/settings/actions";
import { certificateSettings } from "@/lib/app-api/admin-round2";
import { failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import type { CertificateSettings } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/certificates/settings: default signatories, signature images, today's email allowance and the waiting queue. */
export const GET = appRoute({ auth: "admin" }, async ({ user }): Promise<CertificateSettings> => certificateSettings(createAdminClient(), isSuperAdmin(user.profile)));

const schema = z.object({ signatories: z.array(z.object({ name: z.string().max(120), role: z.string().max(120), signatureFrom: z.string().max(120).nullable().optional() })).min(1).max(3) });

/** PUT /api/app/v1/admin/certificates/settings: the default signatories (the website's saveDefaultSignatories; super admin, 30 a minute). */
export const PUT = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<CertificateSettings> => {
  const b = await body(schema, 16_000);
  await limitWrite(`app:certsettings:${user.profile.id}`, 30);
  const r = await saveDefaultSignatories(b.signatories.map((s) => ({ name: s.name, role: s.role, signatureFrom: s.signatureFrom ?? null })));
  if (r.error) failFrom(r.error);
  return certificateSettings(createAdminClient(), true);
});
