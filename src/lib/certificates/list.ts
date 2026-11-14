import { certStatus, type CertStatus } from "./kinds";

/** One line of the Issued certificates list. Pure, so the filters are tested. */
export type ListRow = {
  credentialId: string;
  userId: string | null;
  name: string;
  title: string;
  kind: string;
  /** Made in the studio (new design, can be corrected there). */
  studio: boolean;
  status: string;
  revokedAt: string | null;
  revokeReason: string | null;
  expiresAt: string | null;
  issuedAt: string | null;
  emailStatus: string | null;
  recipientEmail: string | null;
  replacedBy: string | null;
};

export type ListFilters = { kind?: string | null; status?: string | null; q?: string | null; cohortUserIds?: Set<string> | null };

export const liveStatus = (r: Pick<ListRow, "status" | "revokedAt" | "expiresAt" | "kind">, now: Date = new Date()): CertStatus =>
  certStatus({ status: r.status, revoked_at: r.revokedAt, expires_at: r.expiresAt, kind: r.kind }, now);

export function filterCertificates(rows: ListRow[], f: ListFilters, now: Date = new Date()): ListRow[] {
  const q = (f.q ?? "").trim().toLowerCase();
  return rows.filter((r) => {
    if (f.kind && r.kind !== f.kind) return false;
    if (f.status && liveStatus(r, now) !== f.status) return false;
    if (f.cohortUserIds && !(r.userId && f.cohortUserIds.has(r.userId))) return false;
    if (q && !`${r.name} ${r.title} ${r.credentialId} ${r.recipientEmail ?? ""}`.toLowerCase().includes(q)) return false;
    return true;
  });
}
