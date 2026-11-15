import "server-only";
import type { MyCredential } from "@/app/(dashboard)/achievements/actions";
import { createAdminClient } from "@/lib/supabase/server";
import { normaliseCertificateId } from "@/lib/certificates/id";
import { certStatus } from "@/lib/certificates/kinds";
import { loadCredential, recordKind, recordTitle, verifyUrlFor } from "@/lib/certificates/server";
import type { CertificateVerification, Credential } from "./contract";

export function credentialOut(c: MyCredential): Credential {
  return {
    credentialId: c.credential_id,
    type: c.type,
    status: c.status,
    title: c.title,
    description: c.description,
    icon: c.icon,
    tone: c.tone,
    issuedAt: c.issued_at,
    revokedAt: c.revoked_at,
    revokeReason: c.revoke_reason,
    kind: c.kind ?? null,
    expiresAt: c.expires_at ?? null,
    verifyUrl: c.type === "certificate" ? verifyUrlFor(c.credential_id) : null,
  };
}

/** The same facts the public /verify/:id page shows, as data. */
export async function verifyCertificate(rawId: string): Promise<CertificateVerification> {
  const certificateId = normaliseCertificateId(String(rawId ?? "").slice(0, 80));
  const verifyUrl = verifyUrlFor(certificateId);
  const empty: CertificateVerification = { found: false, certificateId, status: "unknown", what: null, recipientName: null, title: null, paragraph: null, issuedAt: null, expiresAt: null, revokedAt: null, replacedBy: null, issuer: "VIBHA School of Psychology", verifyUrl };
  if (!certificateId) return empty;
  const cred = await loadCredential(createAdminClient(), certificateId).catch(() => null);
  if (!cred) return empty;
  const isCert = cred.type === "certificate";
  const kind = recordKind(cred);
  return {
    ...empty,
    found: true,
    certificateId: cred.credential_id,
    status: certStatus({ status: cred.status, revoked_at: cred.revoked_at, expires_at: cred.expires_at ?? null, kind: isCert ? kind : null }),
    what: !isCert ? "Badge" : kind === "provisional" ? "Provisional certificate" : kind === "recognition" ? "Special recognition" : "Certificate",
    recipientName: cred.student_name ?? null,
    title: recordTitle(cred),
    // Badges keep a rule snapshot in `reason`; only certificates show it.
    paragraph: isCert && cred.reason?.trim() ? cred.reason.trim() : null,
    issuedAt: cred.issued_at,
    expiresAt: cred.expires_at ?? null,
    revokedAt: cred.revoked_at,
    replacedBy: cred.replaced_by ?? null,
    verifyUrl: verifyUrlFor(cred.credential_id),
  };
}
