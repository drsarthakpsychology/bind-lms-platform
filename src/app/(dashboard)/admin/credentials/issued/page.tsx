import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin, isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { FilterBar } from "@/components/admin/filter-bar";
import { Button } from "@/components/ui/button";
import { CERT_KINDS, KIND_DEFAULTS, STATUS_LABEL, istDay, longDate, statusLine, type CertStatus } from "@/lib/certificates/kinds";
import { filterCertificates, liveStatus, type ListRow } from "@/lib/certificates/list";
import { emailConfigured, isStudioRecord, LEGACY_COLS, recordKind, recordTitle, STUDIO_COLS, type CredentialRecord } from "@/lib/certificates/server";
import { RowActions, SendWaiting } from "./issued-ui";

export const metadata: Metadata = { title: "Issued certificates" };
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const STATUSES: CertStatus[] = ["valid", "provisional", "expired", "revoked"];
/** "31 December 2026" to "31 Dec 2026": the list is scanned, not read. */
const short = (text: string) => text.replace(/\b(January|February|March|April|June|July|August|September|October|November|December)\b/g, (m) => m.slice(0, 3));
const EMAIL_LABEL: Record<string, string> = { sent: "Emailed", queued: "Email waiting", failed: "Email failed", none: "App only" };
const TONE: Record<CertStatus, string> = {
  valid: "text-foreground",
  provisional: "text-link",
  expired: "text-muted-foreground",
  revoked: "text-status-alert-fg",
  not_issued: "text-muted-foreground",
};

/**
 * Admin → Credentials → Issued certificates: every certificate, with filters
 * by type, cohort and status, and download, revoke, correct and resend.
 * Nothing here deletes a certificate.
 */
export default async function IssuedCertificatesPage({ searchParams }: { searchParams: Promise<{ q?: string; kind?: string; status?: string; cohort?: string }> }) {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const canWrite = isSuperAdmin(me);
  const sp = await searchParams;
  const admin = createAdminClient();

  const full = await admin.from("credentials").select(STUDIO_COLS).eq("type", "certificate").order("created_at", { ascending: false }).limit(1000);
  const read = full.error ? await admin.from("credentials").select(LEGACY_COLS).eq("type", "certificate").order("created_at", { ascending: false }).limit(1000) : full;
  const [cohortsRes, membersRes, queueRes] = await Promise.all([
    admin.from("cohorts").select("id, name").order("created_at", { ascending: true }),
    sp.cohort ? admin.from("cohort_members").select("user_id").eq("cohort_id", sp.cohort).limit(5000) : Promise.resolve({ data: null }),
    admin.from("certificate_email_queue").select("id", { count: "exact", head: true }).eq("status", "queued"),
  ]);

  const records = (read.data ?? []) as unknown as CredentialRecord[];
  const all: ListRow[] = records.map((r) => ({
    credentialId: r.credential_id,
    userId: r.user_id,
    name: r.student_name,
    title: recordTitle(r),
    kind: recordKind(r),
    studio: isStudioRecord(r),
    status: r.status,
    revokedAt: r.revoked_at,
    revokeReason: r.revoke_reason,
    expiresAt: r.expires_at ?? null,
    issuedAt: r.issued_at,
    emailStatus: r.email_status ?? null,
    recipientEmail: r.recipient_email,
    replacedBy: r.replaced_by ?? null,
  }));
  const now = new Date();
  const rows = filterCertificates(
    all,
    {
      q: sp.q,
      kind: (CERT_KINDS as readonly string[]).includes(sp.kind ?? "") ? sp.kind : null,
      status: (STATUSES as string[]).includes(sp.status ?? "") ? sp.status : null,
      cohortUserIds: membersRes.data ? new Set(membersRes.data.map((m) => m.user_id as string)) : null,
    },
    now,
  );
  const filtering = Boolean(sp.q || sp.kind || sp.status || sp.cohort);
  const waiting = queueRes.error ? 0 : (queueRes.count ?? 0);

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1">Issued certificates</h1>
          {read.error ? <p className="mt-2 text-small text-muted-foreground">Certificates aren&apos;t set up in the database yet.</p> : null}
        </div>
        {canWrite ? (
          <Button asChild>
            <Link href="/admin/credentials/studio">New certificate</Link>
          </Button>
        ) : null}
      </header>

      {waiting > 0 ? <SendWaiting waiting={waiting} canWrite={canWrite} emailOn={emailConfigured()} /> : null}

      <FilterBar
        className="mb-4"
        search={{ label: "Name, title or certificate ID", placeholder: "Name, title or certificate ID" }}
        selects={[
          { param: "kind", label: "Type", allLabel: "Every type", options: CERT_KINDS.map((k) => ({ value: k, label: KIND_DEFAULTS[k].label })) },
          { param: "cohort", label: "Cohort", allLabel: "Every cohort", options: (cohortsRes.data ?? []).map((c) => ({ value: c.id as string, label: c.name as string })) },
          { param: "status", label: "Status", allLabel: "Any status", options: STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })) },
        ]}
      />

      {rows.length ? (
        <>
          <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)_13rem_6.5rem_8.5rem] gap-4 border-b border-foreground/20 pb-2 text-caption font-semibold text-muted-foreground lg:grid" aria-hidden>
            <span>Name</span>
            <span>Certificate</span>
            <span>Status</span>
            <span>Issued</span>
            <span />
          </div>
          <ul className="divide-y divide-foreground/10 border-b border-foreground/10">
            {rows.slice(0, 300).map((r) => {
              const st = liveStatus(r, now);
              const line = statusLine(st, { expiresOn: r.expiresAt ? istDay(r.expiresAt) : null, revokedOn: r.revokedAt ? istDay(r.revokedAt) : null });
              return (
                <li key={r.credentialId} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)_13rem_6.5rem_8.5rem]">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{r.name}</p>
                    <p className="truncate font-mono text-caption text-muted-foreground">{r.credentialId.length > 24 ? `${r.credentialId.slice(0, 12)}...` : r.credentialId}</p>
                  </div>
                  <div className="col-start-1 min-w-0 lg:col-start-2">
                    <p className="truncate text-small">{r.title}</p>
                    <p className="truncate text-caption text-muted-foreground">
                      {KIND_DEFAULTS[r.kind as keyof typeof KIND_DEFAULTS]?.label ?? "Certificate"}
                      {r.emailStatus && EMAIL_LABEL[r.emailStatus] ? ` · ${EMAIL_LABEL[r.emailStatus]}` : ""}
                    </p>
                  </div>
                  <div className="col-start-1 min-w-0 lg:col-start-3">
                    <p className={`text-small font-semibold ${TONE[st]}`}>{short(line)}</p>
                    {st === "revoked" && r.revokeReason ? <p className="truncate text-caption text-muted-foreground" title={r.revokeReason}>{r.revokeReason}</p> : null}
                  </div>
                  <p className="col-start-1 text-small tabular-nums text-muted-foreground lg:col-start-4">{r.issuedAt ? short(longDate(istDay(r.issuedAt))) : "Not issued"}</p>
                  <div className="col-start-2 row-span-4 row-start-1 self-start lg:col-start-5 lg:row-span-1 lg:self-center">
                    <RowActions credentialId={r.credentialId} name={r.name} status={st} canWrite={canWrite} canCorrect={Boolean(r.userId)} />
                  </div>
                </li>
              );
            })}
          </ul>
          {rows.length > 300 ? <p className="mt-3 text-small text-muted-foreground">Showing the newest 300. Search or filter to find older ones.</p> : null}
        </>
      ) : (
        <div className="border-y border-foreground/10 py-12">
          <p className="font-semibold">{filtering ? "Nothing matches these filters." : "No certificates yet."}</p>
          {!filtering && canWrite ? (
            <p className="mt-1 text-small text-muted-foreground">
              <Link href="/admin/credentials/studio" className="font-semibold text-link underline underline-offset-4">Make the first one</Link> in the studio.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
