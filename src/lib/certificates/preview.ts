import { KIND_DEFAULTS, type CertKind } from "./kinds";
import type { StudioSignatory } from "./issue-input";
import type { CertificateDoc } from "./layout";

/**
 * The studio's preview: the certificate a recipient will get, with a
 * placeholder id, and what still stops it from being issued. The same as the
 * website studio screen (src/app/(dashboard)/admin/credentials/studio/studio.tsx,
 * which should switch to these once the certificates rework on branch
 * agent/admincert lands). Pure.
 */
export const PREVIEW_ID = "VIBHA-0000-0000-0000";

export type StudioFields = {
  kind: CertKind;
  heading: string;
  lead: string;
  connector: string;
  title: string;
  citation: string;
  courseLabel: string;
  moduleLabel: string;
  issuedOn: string;
  expiresOn: string;
  signatories: StudioSignatory[];
};

export function previewDoc(f: StudioFields, recipientName: string, siteUrl: string): CertificateDoc {
  return {
    kind: f.kind,
    heading: f.heading,
    lead: f.lead,
    connector: f.connector,
    recipientName,
    title: f.title,
    citation: f.citation,
    course: f.courseLabel,
    module: f.moduleLabel,
    issuedOn: f.issuedOn,
    expiresOn: f.expiresOn || null,
    signatories: f.signatories.map((s, i) => ({ name: s.name, role: s.role, signature: s.signatureFrom ? `sig${i}` : null })),
    credentialId: PREVIEW_ID,
    verifyUrl: `${siteUrl}/verify/${PREVIEW_ID}`,
  };
}

/** The signature images the preview needs, keyed as previewDoc names them. */
export function previewImages(signatories: StudioSignatory[], saved: { id: string; url: string | null }[]): Record<string, string | null> {
  const images: Record<string, string | null> = {};
  signatories.forEach((s, i) => {
    if (s.signatureFrom) images[`sig${i}`] = saved.find((x) => x.id === s.signatureFrom)?.url ?? null;
  });
  return images;
}

/** What still stops this from being issued, by studio step (0 type, 1 people, 2 wording). */
export function studioProblems(f: StudioFields & { picked: { name: string }[]; ready: boolean; today: string }): Array<{ step: number; text: string }> {
  const def = KIND_DEFAULTS[f.kind];
  const problems: Array<{ step: number; text: string }> = [];
  if (f.kind === "provisional" && !f.ready) problems.push({ step: 0, text: "Provisional certificates need the database step first (2026_11_14_certificate_studio.sql)." });
  if (!f.picked.length) problems.push({ step: 1, text: "Pick at least one student." });
  if (f.picked.some((p) => !p.name.trim())) problems.push({ step: 1, text: "Every certificate needs a name to print." });
  if (!f.title.trim()) problems.push({ step: 2, text: "Give the certificate a title." });
  if (def.needsExpiry && !f.expiresOn) problems.push({ step: 2, text: "Pick the date this provisional certificate runs out." });
  if (f.expiresOn && f.expiresOn < f.issuedOn) problems.push({ step: 2, text: "The expiry date is before the issue date." });
  else if (f.expiresOn && f.expiresOn < f.today) problems.push({ step: 2, text: "The expiry date has already passed." });
  if (!f.signatories.some((s) => s.name.trim())) problems.push({ step: 2, text: "Add at least one signatory." });
  return problems;
}
