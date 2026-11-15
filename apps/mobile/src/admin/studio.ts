/**
 * The certificate studio's draft and its checks, ported from the website's
 * checkIssue (src/lib/certificates/issue-input.ts) so the app says what is
 * wrong before the server does. Pure, so it is tested.
 */
import { KIND_DEFAULTS, type CertKind, type StudioIssueInput, type StudioRecipient, type StudioSignatory } from "./extra";

export const MAX_RECIPIENTS = 300;
export const STEPS = ["Type", "People", "Wording", "Preview", "Send"] as const;

export type Draft = {
  kind: CertKind | null;
  recipients: StudioRecipient[];
  cohortId: string | null;
  title: string;
  heading: string;
  lead: string;
  connector: string;
  issuedOn: string;
  expiresOn: string;
  signatories: StudioSignatory[];
  email: boolean;
};

export function emptyDraft(today: string, signatories: StudioSignatory[] = []): Draft {
  return { kind: null, recipients: [], cohortId: null, title: "", heading: "", lead: "", connector: "", issuedOn: today, expiresOn: "", signatories: signatories.length ? signatories : [{ name: "", role: "" }], email: true };
}

/** Picking a type fills in its wording (only the parts the admin has not changed). */
export function withKind(d: Draft, kind: CertKind): Draft {
  const prev = d.kind ? KIND_DEFAULTS[d.kind] : null;
  const def = KIND_DEFAULTS[kind];
  const keep = (cur: string, old: string | undefined, next: string) => (!cur || cur === old ? next : cur);
  return { ...d, kind, heading: keep(d.heading, prev?.heading, def.heading), lead: keep(d.lead, prev?.lead, def.lead), connector: keep(d.connector, prev?.connector, def.connector) };
}

const isDay = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));

/** What stops this step, or null. */
export function stepError(step: number, d: Draft, today: string): string | null {
  if (step === 0) return d.kind ? null : "Pick a certificate type.";
  if (step === 1) {
    if (!d.recipients.length) return "Pick at least one student.";
    if (d.recipients.length > MAX_RECIPIENTS) return `${MAX_RECIPIENTS} students at a time at most.`;
    if (d.recipients.some((r) => !r.name.trim())) return "Every certificate needs a name to print.";
    return null;
  }
  if (step === 2) {
    if (!d.title.trim()) return "Give the certificate a title.";
    if (d.title.trim().length > 120) return "Keep the title under 120 characters.";
    if (!isDay(d.issuedOn)) return "Write the issue date as yyyy-mm-dd.";
    const needs = d.kind ? KIND_DEFAULTS[d.kind].needsExpiry : false;
    if (needs && !d.expiresOn) return "A provisional certificate needs a date it runs out.";
    if (d.expiresOn) {
      if (!isDay(d.expiresOn)) return "Write the end date as yyyy-mm-dd.";
      if (d.expiresOn < d.issuedOn) return "The end date is before the issue date.";
      if (d.expiresOn < today) return "The end date has already passed.";
    }
    const signed = d.signatories.filter((s) => s.name.trim());
    if (!signed.length) return "Add at least one person who signs.";
    if (signed.length > 3) return "Three people sign at most.";
    return null;
  }
  return null;
}

/** The first problem anywhere, or null. */
export function draftError(d: Draft, today: string): { step: number; error: string } | null {
  for (let s = 0; s < 3; s++) {
    const e = stepError(s, d, today);
    if (e) return { step: s, error: e };
  }
  return null;
}

/** What goes to POST /admin/certificates. */
export function toIssueInput(d: Draft): StudioIssueInput {
  const kind = d.kind ?? "completion";
  const def = KIND_DEFAULTS[kind];
  const cut = (s: string, n: number) => s.replace(/\s+/g, " ").trim().slice(0, n);
  return {
    kind,
    title: cut(d.title, 120),
    heading: cut(d.heading || def.heading, 80),
    lead: cut(d.lead || def.lead, 80),
    connector: cut(d.connector || def.connector, 80),
    issuedOn: d.issuedOn,
    expiresOn: d.expiresOn || null,
    signatories: d.signatories.map((s) => ({ name: cut(s.name, 60), role: cut(s.role, 60), signatureFrom: s.signatureFrom ?? null })).filter((s) => s.name),
    recipients: d.recipients.map((r) => ({ userId: r.userId, name: cut(r.name, 80) })),
    cohortId: d.cohortId,
    email: d.email,
  };
}
