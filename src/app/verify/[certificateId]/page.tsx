import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/server";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { normaliseCertificateId } from "@/lib/certificates/id";
import { certStatus, istDay } from "@/lib/certificates/kinds";
import { layoutCertificate } from "@/lib/certificates/layout";
import { docFromRecord, isStudioRecord, loadCredential, recordKind, recordSignatories, recordTitle, signatureUrls } from "@/lib/certificates/server";
import { CertificateSvg } from "@/lib/certificates/svg";
import { VerifyNotFound, VerifyView, type VerifyFacts } from "./verify-view";

// Public verification, never indexed, no auth required.
export const metadata: Metadata = { title: "Verify a certificate", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/**
 * Public credential verification. Reads the record server-side (service
 * role) by its public ID and shows only public fields: name, title,
 * institution, dates, ID, status, and (certificates only) the paragraph.
 * Never the email, the phone or why it was revoked. The status is worked out
 * when the page loads, so a provisional certificate shows as expired the
 * moment its date passes. Revoked certificates keep their address.
 */
export default async function VerifyCertificatePage({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params;
  const admin = createAdminClient();
  const cred = await loadCredential(admin, normaliseCertificateId(certificateId));

  let body: React.ReactNode = <VerifyNotFound />;
  if (cred) {
    const isCert = cred.type === "certificate";
    const kind = recordKind(cred);
    const status = certStatus({ status: cred.status, revoked_at: cred.revoked_at, expires_at: cred.expires_at, kind: isCert ? kind : null });
    const facts: VerifyFacts = {
      status,
      name: cred.student_name,
      title: recordTitle(cred),
      what: !isCert ? "Badge" : kind === "provisional" ? "Provisional certificate" : kind === "recognition" ? "Special recognition" : "Certificate",
      // Badges keep a rule snapshot in `reason`; only certificates show it.
      paragraph: isCert && cred.reason?.trim() ? cred.reason.trim() : null,
      credentialId: cred.credential_id,
      issuedOn: cred.issued_at ? istDay(cred.issued_at) : null,
      expiresOn: cred.expires_at ? istDay(cred.expires_at) : null,
      revokedOn: cred.revoked_at ? istDay(cred.revoked_at) : null,
      replacedBy: cred.replaced_by ?? null,
    };
    // The certificate itself, for the ones made in the studio (never a revoked one).
    const show = isCert && isStudioRecord(cred) && status !== "revoked" && status !== "not_issued";
    const images = show ? await signatureUrls(admin, recordSignatories(cred)).catch(() => ({})) : {};
    body = <VerifyView facts={facts} certificate={show ? <CertificateSvg layout={layoutCertificate(docFromRecord(cred))} images={images} /> : undefined} />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{body}</main>
      <SiteFooter />
    </div>
  );
}
