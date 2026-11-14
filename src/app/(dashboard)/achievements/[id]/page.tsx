import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, Share2 } from "lucide-react";
import { isAdminLike, requireSession } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { ownsCredential } from "@/lib/achievements/owned";
import { linkedInAddToProfileUrl } from "@/lib/achievements/linkedin";
import { Button } from "@/components/ui/button";
import { RefreshShell } from "@/components/navigation/refresh-shell";
import { normaliseCertificateId } from "@/lib/certificates/id";
import { certStatus, istDay, statusLine } from "@/lib/certificates/kinds";
import { layoutCertificate } from "@/lib/certificates/layout";
import { docFromRecord, isStudioRecord, loadCredential, recordKind, recordSignatories, recordTitle, signatureUrls, verifyUrlFor } from "@/lib/certificates/server";
import { CertificateSvg } from "@/lib/certificates/svg";
import { CopyLink } from "./copy-link";

export const metadata: Metadata = { title: "Certificate" };
export const dynamic = "force-dynamic";

/**
 * One certificate, as the student sees it: the certificate itself, its
 * status, download and share. The bell notice opens this page, and opening
 * it marks that notice read.
 */
export default async function MyCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireSession();
  if (!me) redirect("/login");
  const { id } = await params;
  const admin = createAdminClient();
  const row = await loadCredential(admin, normaliseCertificateId(id));
  if (!row || row.type !== "certificate") notFound();
  if (!ownsCredential(row, me.id, me.email) && !isAdminLike(me)) notFound();

  let seen = 0;
  try {
    const { data } = await admin.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", me.id).eq("credential_id", row.credential_id).is("read_at", null).select("id");
    seen = data?.length ?? 0;
  } catch {
    /* the notice stays unread; nothing else depends on it */
  }

  const kind = recordKind(row);
  const status = certStatus({ status: row.status, revoked_at: row.revoked_at, expires_at: row.expires_at, kind });
  const line = statusLine(status, { expiresOn: row.expires_at ? istDay(row.expires_at) : null, revokedOn: row.revoked_at ? istDay(row.revoked_at) : null });
  const title = recordTitle(row);
  const verifyUrl = verifyUrlFor(row.credential_id);
  const usable = status === "valid" || status === "provisional" || status === "expired";
  const drawn = isStudioRecord(row) && usable;
  const images = drawn ? await signatureUrls(admin, recordSignatories(row)).catch(() => ({})) : {};
  const tone = status === "revoked" ? "text-status-alert-fg" : status === "provisional" ? "text-link" : status === "expired" ? "text-muted-foreground" : "text-foreground";

  return (
    <div className="mx-auto w-full max-w-4xl">
      <RefreshShell when={seen > 0} />
      <Link href="/achievements" className="inline-flex min-h-11 items-center gap-1.5 text-small font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> My Achievements
      </Link>
      <h1 className="mt-2 text-h1 [overflow-wrap:anywhere]">{title}</h1>
      <p className={`mt-2 text-small font-semibold ${tone}`}>{line}</p>
      {status === "revoked" ? <p className="mt-3 max-w-[60ch] text-small text-muted-foreground">This certificate was withdrawn and can no longer be downloaded or shared. Ask your admin if you think this is a mistake.</p> : null}
      {status === "not_issued" ? <p className="mt-3 max-w-[60ch] text-small text-muted-foreground">This certificate has not been issued yet.</p> : null}

      {drawn ? (
        <div className="mt-6 overflow-hidden rounded-xl border-[1.5px] border-foreground/25 bg-white">
          <CertificateSvg layout={layoutCertificate(docFromRecord(row))} images={images} />
        </div>
      ) : null}

      {usable ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href={`/api/certificates/${encodeURIComponent(row.credential_id)}/pdf`}>
              <Download className="size-4" aria-hidden /> Download PDF
            </a>
          </Button>
          {status !== "expired" ? (
            <>
              <Button asChild variant="outline" size="lg">
                <a href={linkedInAddToProfileUrl({ title, issuedOn: istDay(row.issued_at ?? row.created_at), verifyUrl, credentialId: row.credential_id })} target="_blank" rel="noreferrer">
                  <Share2 className="size-4" aria-hidden /> Add to LinkedIn
                </a>
              </Button>
              <CopyLink url={verifyUrl} />
            </>
          ) : null}
        </div>
      ) : null}

      <dl className="mt-8 divide-y divide-foreground/10 border-y border-foreground/10 text-small">
        <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-4 py-3">
          <dt className="text-muted-foreground">Name</dt>
          <dd className="min-w-0 font-medium [overflow-wrap:anywhere]">{row.student_name}</dd>
        </div>
        <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-4 py-3">
          <dt className="text-muted-foreground">Certificate ID</dt>
          <dd className="min-w-0 font-mono [overflow-wrap:anywhere]">{row.credential_id}</dd>
        </div>
        <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-4 py-3">
          <dt className="text-muted-foreground">Check it is real</dt>
          <dd className="min-w-0">
            <a href={verifyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-link underline underline-offset-4 [overflow-wrap:anywhere]">
              {verifyUrl.replace(/^https?:\/\//, "")} <ExternalLink className="size-3.5 shrink-0" aria-hidden />
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
