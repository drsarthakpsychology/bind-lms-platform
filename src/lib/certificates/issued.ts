import { certStatus, istDay, KIND_DEFAULTS, longDate, statusLine, type CertKind, type CertStatus } from "./kinds";

/**
 * One line of Certificates, Issued: every certificate and every badge, in one
 * list. Pure, so the filters are tested; the page builds these from the
 * credentials rows and the roster.
 */
export type IssuedRow = {
  credentialId: string;
  userId: string | null;
  type: "certificate" | "badge";
  /** Certificate kind (completion, provisional...), or "badge". */
  kind: CertKind | "badge";
  name: string;
  title: string;
  /** Raw record status: draft, approved, issued, revoked. */
  status: string;
  revokedAt: string | null;
  revokeReason: string | null;
  expiresAt: string | null;
  issuedAt: string | null;
  createdAt: string | null;
  emailStatus: string | null;
  email: string | null;
  roll: string | null;
  cohortIds: string[];
  /** Made in the studio (can be corrected there). */
  studio: boolean;
  hasPdf: boolean;
};

/** "Draft" sits next to the live statuses: a course certificate waiting to be issued. */
export type IssuedStatus = Exclude<CertStatus, "not_issued"> | "draft";
export const ISSUED_STATUSES: IssuedStatus[] = ["valid", "provisional", "expired", "revoked", "draft"];
export const ISSUED_STATUS_LABEL: Record<IssuedStatus, string> = { valid: "Valid", provisional: "Provisional", expired: "Expired", revoked: "Revoked", draft: "Draft" };

/** What the Type filter can be: everything, a whole family, or one certificate kind. */
export const TYPE_FILTERS = ["certificate", "badge", "completion", "provisional", "recognition", "custom"] as const;
export type TypeFilter = (typeof TYPE_FILTERS)[number];
export const TYPE_FILTER_LABEL: Record<TypeFilter, string> = {
  certificate: "All certificates",
  badge: "Badges",
  completion: KIND_DEFAULTS.completion.label,
  provisional: KIND_DEFAULTS.provisional.label,
  recognition: KIND_DEFAULTS.recognition.label,
  custom: KIND_DEFAULTS.custom.label,
};

export type IssuedFilters = {
  q?: string | null;
  type?: string | null;
  status?: string | null;
  cohortId?: string | null;
  /** One person's things only (from a student profile). */
  userId?: string | null;
};

export function issuedStatus(r: Pick<IssuedRow, "status" | "revokedAt" | "expiresAt" | "kind">, now: Date = new Date()): IssuedStatus {
  const s = certStatus({ status: r.status, revoked_at: r.revokedAt, expires_at: r.expiresAt, kind: r.kind === "badge" ? null : r.kind }, now);
  return s === "not_issued" ? "draft" : s;
}

/** The status in words for the list ("Provisional until 31 Dec 2026"). */
export function issuedStatusLine(r: IssuedRow, now: Date = new Date()): string {
  const s = issuedStatus(r, now);
  if (s === "draft") return "Draft";
  const line = statusLine(s, { expiresOn: r.expiresAt ? istDay(r.expiresAt) : null, revokedOn: r.revokedAt ? istDay(r.revokedAt) : null });
  return shortMonths(line);
}

/** "31 December 2026" to "31 Dec 2026": the list is scanned, not read. */
export const shortMonths = (text: string) => text.replace(/\b(January|February|March|April|June|July|August|September|October|November|December)\b/g, (m) => m.slice(0, 3));

export const issuedDay = (r: Pick<IssuedRow, "issuedAt">) => (r.issuedAt ? shortMonths(longDate(istDay(r.issuedAt))) : "Not issued");

export function typeLabel(r: Pick<IssuedRow, "type" | "kind">): string {
  if (r.type === "badge") return "Badge";
  return KIND_DEFAULTS[r.kind as CertKind]?.label ?? "Certificate";
}

export function matchesType(r: Pick<IssuedRow, "type" | "kind">, type: string | null | undefined): boolean {
  if (!type || !(TYPE_FILTERS as readonly string[]).includes(type)) return true;
  if (type === "certificate") return r.type === "certificate";
  if (type === "badge") return r.type === "badge";
  return r.type === "certificate" && r.kind === type;
}

export function filterIssued(rows: IssuedRow[], f: IssuedFilters, now: Date = new Date()): IssuedRow[] {
  const q = (f.q ?? "").trim().toLowerCase();
  const status = (ISSUED_STATUSES as string[]).includes(f.status ?? "") ? (f.status as IssuedStatus) : null;
  return rows.filter((r) => {
    if (f.userId && r.userId !== f.userId) return false;
    if (!matchesType(r, f.type)) return false;
    if (status && issuedStatus(r, now) !== status) return false;
    if (f.cohortId && !r.cohortIds.includes(f.cohortId)) return false;
    if (q && !`${r.name} ${r.title} ${r.credentialId} ${r.email ?? ""} ${r.roll ?? ""}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

/** Counts for the type filter, so the admin sees how many of each before choosing. */
export function countByType(rows: IssuedRow[]): Record<TypeFilter, number> {
  const out = Object.fromEntries(TYPE_FILTERS.map((t) => [t, 0])) as Record<TypeFilter, number>;
  for (const r of rows) for (const t of TYPE_FILTERS) if (matchesType(r, t)) out[t]++;
  return out;
}
