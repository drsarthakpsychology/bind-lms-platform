import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin, isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadRoster } from "@/lib/people/roster-data";
import { isStudioRecord, LEGACY_COLS, recordKind, recordTitle, STUDIO_COLS, emailConfigured, type CredentialRecord } from "@/lib/certificates/server";
import type { IssuedRow } from "@/lib/certificates/issued";
import { AdminPage, LoadError } from "../../_v2/kit";
import { IssuedList } from "./issued-ui";

export const metadata: Metadata = { title: "Issued" };
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Certificates, Issued: everything given, certificates and badges, in one
 * list. Filters by type, status, cohort and person; download, verify page,
 * send again, correct and reissue, issue a draft, revoke with a reason.
 * Nothing here deletes anything.
 */
export default async function IssuedPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; kind?: string; status?: string; cohort?: string; student?: string }> }) {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const canWrite = isSuperAdmin(me);
  const sp = await searchParams;
  const admin = createAdminClient();

  const full = await admin.from("credentials").select(STUDIO_COLS).order("created_at", { ascending: false }).limit(3000);
  const read = full.error ? await admin.from("credentials").select(LEGACY_COLS).order("created_at", { ascending: false }).limit(3000) : full;
  const [roster, queueRes] = await Promise.all([loadRoster(), admin.from("certificate_email_queue").select("id", { count: "exact", head: true }).eq("status", "queued")]);

  const people = new Map(roster.rows.map((r) => [r.id, r]));
  const records = (read.data ?? []) as unknown as CredentialRecord[];
  const rows: IssuedRow[] = records.map((r) => {
    const p = r.user_id ? people.get(r.user_id) : undefined;
    const badge = r.type === "badge";
    return {
      credentialId: r.credential_id,
      userId: r.user_id,
      type: badge ? "badge" : "certificate",
      kind: badge ? "badge" : recordKind(r),
      name: r.student_name,
      title: recordTitle(r),
      status: r.status,
      revokedAt: r.revoked_at,
      revokeReason: r.revoke_reason,
      expiresAt: r.expires_at ?? null,
      issuedAt: r.issued_at,
      createdAt: r.created_at,
      emailStatus: badge ? null : (r.email_status ?? null),
      email: p?.email ?? r.recipient_email ?? null,
      roll: p?.roll ?? null,
      cohortIds: p ? p.cohorts.map((c) => c.id) : [],
      studio: !badge && isStudioRecord(r),
      hasPdf: !badge,
    };
  });
  const person = sp.student ? people.get(sp.student) : undefined;

  return (
    <AdminPage title="Issued">
      {read.error ? (
        <LoadError what="what was issued" href="/admin/credentials/issued" />
      ) : (
        <IssuedList
          rows={rows}
          cohorts={roster.cohorts.map((c) => ({ id: c.id, name: c.name }))}
          canWrite={canWrite}
          waiting={queueRes.error ? 0 : (queueRes.count ?? 0)}
          emailOn={emailConfigured()}
          initial={{ q: sp.q ?? "", type: sp.type ?? sp.kind ?? "", status: sp.status ?? "", cohortId: sp.cohort ?? "", userId: person ? person.id : "" }}
          person={person ? { id: person.id, name: person.name } : null}
        />
      )}
    </AdminPage>
  );
}
