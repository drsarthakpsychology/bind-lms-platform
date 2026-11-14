import { type CertKind, isCertKind, isDay, KIND_DEFAULTS } from "./kinds";
import { cleanText } from "./text";

/**
 * What the studio sends to the server when it issues, and the check that runs
 * before anything is written. Pure, so it is tested.
 */
export type StudioSignatory = { name: string; role: string; /** Achievement id whose saved signature image to use. */ signatureFrom?: string | null };

export type StudioRecipient = { userId: string; /** Name printed on this person's certificate. */ name: string };

export type StudioIssueInput = {
  kind: CertKind;
  title: string;
  heading?: string;
  lead?: string;
  connector?: string;
  citation?: string;
  courseId?: string | null;
  courseLabel?: string;
  moduleLabel?: string;
  /** yyyy-mm-dd */
  issuedOn: string;
  /** yyyy-mm-dd; required for provisional. */
  expiresOn?: string | null;
  signatories: StudioSignatory[];
  recipients: StudioRecipient[];
  /** Set when the whole cohort was picked: kept for filtering. */
  cohortId?: string | null;
  /** Also email (the in-app notice always goes). */
  email: boolean;
};

export const MAX_RECIPIENTS = 300;

export type CleanIssue = Omit<StudioIssueInput, "recipients" | "signatories"> & {
  recipients: StudioRecipient[];
  signatories: StudioSignatory[];
  heading: string;
  lead: string;
  connector: string;
  citation: string;
  courseLabel: string;
  moduleLabel: string;
  expiresOn: string | null;
};

const cut = (s: string | null | undefined, n: number) => cleanText(s).slice(0, n);

export function checkIssue(input: StudioIssueInput, today: string): { error: string } | { ok: CleanIssue } {
  if (!isCertKind(input.kind)) return { error: "Pick a certificate type." };
  const def = KIND_DEFAULTS[input.kind];
  const title = cut(input.title, 120);
  if (!title) return { error: "Give the certificate a title." };
  if (!isDay(input.issuedOn)) return { error: "Pick the issue date." };
  const expiresOn = input.expiresOn ? (isDay(input.expiresOn) ? input.expiresOn : "bad") : null;
  if (expiresOn === "bad") return { error: "The expiry date doesn't look right." };
  if (def.needsExpiry && !expiresOn) return { error: "A provisional certificate needs a date it runs out." };
  if (expiresOn && expiresOn < input.issuedOn) return { error: "The expiry date is before the issue date." };
  if (expiresOn && expiresOn < today) return { error: "The expiry date has already passed." };

  const signatories = (input.signatories ?? [])
    .map((s) => ({ name: cut(s.name, 60), role: cut(s.role, 60), signatureFrom: s.signatureFrom || null }))
    .filter((s) => s.name);
  if (!signatories.length) return { error: "Add at least one signatory." };
  if (signatories.length > 3) return { error: "Three signatories at most." };

  const seen = new Set<string>();
  const recipients: StudioRecipient[] = [];
  for (const r of input.recipients ?? []) {
    if (!r?.userId || seen.has(r.userId)) continue;
    seen.add(r.userId);
    const name = cut(r.name, 80);
    if (!name) return { error: "Every certificate needs a name to print." };
    recipients.push({ userId: r.userId, name });
  }
  if (!recipients.length) return { error: "Pick at least one student." };
  if (recipients.length > MAX_RECIPIENTS) return { error: `${MAX_RECIPIENTS} students at a time at most.` };

  return {
    ok: {
      ...input,
      title,
      heading: cut(input.heading, 60) || def.heading,
      lead: cut(input.lead, 80) || def.lead,
      connector: cut(input.connector, 80) || def.connector,
      citation: cut(input.citation, 700),
      courseId: input.courseId || null,
      courseLabel: cut(input.courseLabel, 90),
      moduleLabel: cut(input.moduleLabel, 90),
      expiresOn,
      signatories,
      recipients,
      cohortId: input.cohortId || null,
      email: Boolean(input.email),
    },
  };
}
