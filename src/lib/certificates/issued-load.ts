import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadRoster } from "@/lib/people/roster-data";
import { isStudioRecord, LEGACY_COLS, recordKind, recordTitle, STUDIO_COLS, type CredentialRecord } from "./server";
import type { IssuedRow } from "./issued";

/**
 * Everything given (certificates and badges) as Issued rows, newest first,
 * with the cohorts for the filter and how many certificate emails wait.
 * One read for the website's Issued page and the app's admin list.
 * `error` is true when the credentials table could not be read.
 */
export async function loadIssued(admin: SupabaseClient): Promise<{
  error: boolean;
  rows: IssuedRow[];
  cohorts: { id: string; name: string }[];
  people: Map<string, { id: string; name: string }>;
  waiting: number;
}> {
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
  return {
    error: Boolean(read.error),
    rows,
    cohorts: roster.cohorts.map((c) => ({ id: c.id, name: c.name })),
    people: new Map(roster.rows.map((r) => [r.id, { id: r.id, name: r.name }])),
    waiting: queueRes.error ? 0 : (queueRes.count ?? 0),
  };
}
