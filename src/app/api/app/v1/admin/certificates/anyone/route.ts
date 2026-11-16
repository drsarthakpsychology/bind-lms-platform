import { issueCertificateToAnyone } from "@/app/(dashboard)/admin/credentials/actions";
import { siteBase } from "@/lib/certificates/server";
import { failFrom } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import type { AnyoneIssueResult } from "@/lib/app-api/contract-practise-admin";
import { anyoneInput, anyoneSchema } from "./schema";

export const runtime = "nodejs";
export const maxDuration = 60;

/** POST /api/app/v1/admin/certificates/anyone: a certificate for someone without an account (the website's issueCertificateToAnyone; super admin, 10 a minute). */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<AnyoneIssueResult> => {
  const b = await body(anyoneSchema, 16_000);
  await limitWrite(`app:certanyone:${user.profile.id}`, 10);
  const r = await issueCertificateToAnyone({ ...anyoneInput(b), email_it: b.emailIt !== false });
  if (r.error || !r.credentialId) failFrom(r.error ?? "Couldn't issue it. Try again.");
  return { credentialId: r.credentialId, verifyUrl: `${siteBase()}/verify/${r.credentialId}`, linkedStudent: r.linkedStudent ?? null, emailNote: r.emailNote ?? null };
});
