/**
 * Certificate studio: the four kinds of certificate, their default wording,
 * and the live status rule shared by /verify, My Achievements and the admin
 * list. Pure (no server imports) so it runs on the server, in the browser
 * preview and in tests.
 */

export const CERT_KINDS = ["completion", "provisional", "recognition", "custom"] as const;
export type CertKind = (typeof CERT_KINDS)[number];

export const isCertKind = (v: unknown): v is CertKind => typeof v === "string" && (CERT_KINDS as readonly string[]).includes(v);

export type KindDefaults = {
  label: string;
  /** Small line at the top of the certificate. */
  heading: string;
  /** Line above the name. */
  lead: string;
  /** Line between the name and the title. */
  connector: string;
  /** Suggested title when the admin has not typed one. */
  titleHint: string;
  /** Expiry date is required (provisional) or optional. */
  needsExpiry: boolean;
};

export const KIND_DEFAULTS: Record<CertKind, KindDefaults> = {
  completion: {
    label: "Completion",
    heading: "Certificate of Completion",
    lead: "This is to certify that",
    connector: "has successfully completed",
    titleHint: "Foundations of Clinical Psychology",
    needsExpiry: false,
  },
  provisional: {
    label: "Provisional",
    heading: "Provisional Certificate",
    lead: "This is to certify that",
    connector: "has provisionally completed",
    titleHint: "Foundations of Clinical Psychology",
    needsExpiry: true,
  },
  recognition: {
    label: "Special recognition",
    heading: "Special Recognition",
    lead: "This recognises",
    connector: "for",
    titleHint: "Outstanding contribution to the cohort",
    needsExpiry: false,
  },
  custom: {
    label: "Custom",
    heading: "Certificate",
    lead: "This is presented to",
    connector: "for",
    titleHint: "Certificate title",
    needsExpiry: false,
  },
};

export type CertStatus = "valid" | "provisional" | "expired" | "revoked" | "not_issued";

export type StatusInput = {
  status: string | null | undefined;
  revoked_at?: string | null;
  expires_at?: string | null;
  kind?: string | null;
};

/**
 * The live status of a certificate at `now`:
 * revoked beats everything; a draft is "not issued"; past its expiry it is
 * "expired" (provisional or not); a provisional one inside its window is
 * "provisional"; everything else is "valid".
 */
export function certStatus(row: StatusInput, now: Date = new Date()): CertStatus {
  if (row.status === "revoked" || row.revoked_at) return "revoked";
  if (row.status !== "issued") return "not_issued";
  if (row.expires_at) {
    const t = Date.parse(row.expires_at);
    if (Number.isFinite(t) && now.getTime() > t) return "expired";
  }
  if (row.kind === "provisional") return "provisional";
  return "valid";
}

export const STATUS_LABEL: Record<CertStatus, string> = {
  valid: "Valid",
  provisional: "Provisional",
  expired: "Expired",
  revoked: "Revoked",
  not_issued: "Not issued",
};

/** A yyyy-mm-dd day ends at 23:59:59 India time: that is when an expiry date runs out. */
export function expiryInstant(day: string): string {
  return `${day}T23:59:59+05:30`;
}

/** The India-time calendar day of an instant, yyyy-mm-dd. */
export function istDay(iso: string | Date): string {
  const t = typeof iso === "string" ? Date.parse(iso) : iso.getTime();
  return new Date(t + 5.5 * 3600000).toISOString().slice(0, 10);
}

export const isDay = (d: unknown): d is string => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d) && Number.isFinite(Date.parse(`${d}T00:00:00Z`));

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "14 November 2026" from yyyy-mm-dd (no time zone shifts). */
export function longDate(day: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!m) return day;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

/** One line a person reads about the status, e.g. "Provisional until 30 December 2026". */
export function statusLine(s: CertStatus, opts: { expiresOn?: string | null; revokedOn?: string | null } = {}): string {
  switch (s) {
    case "valid":
      return opts.expiresOn ? `Valid until ${longDate(opts.expiresOn)}` : "Valid";
    case "provisional":
      return opts.expiresOn ? `Provisional until ${longDate(opts.expiresOn)}` : "Provisional";
    case "expired":
      return opts.expiresOn ? `Expired on ${longDate(opts.expiresOn)}` : "Expired";
    case "revoked":
      return opts.revokedOn ? `Revoked on ${longDate(opts.revokedOn)}` : "Revoked";
    default:
      return "Not issued";
  }
}

/**
 * Signatories the studio starts with (owner default, 14 Nov 2026). Both are
 * editable on every certificate; change this list to change the default.
 */
export const DEFAULT_SIGNATORIES: ReadonlyArray<{ name: string; role: string }> = [
  { name: "Kavya Bothra", role: "COO" },
  { name: "Dr. Sarthak Dave", role: "MBBS, MD (Psychiatry)" },
];
