/**
 * LinkedIn "Add to profile" link for a certificate. Opens the person's
 * LinkedIn with the Licenses & certifications form already filled in.
 * Pure (no server imports) so it can be tested and used anywhere.
 */
export const ISSUING_ORG = "VIBHA School of Psychology";

export type LinkedInCertInput = {
  /** Certificate title, e.g. "Volunteer, Cohort 1 launch". */
  title: string;
  /** Issue date, yyyy-mm-dd (or any ISO string). */
  issuedOn: string;
  /** Public verify page URL. */
  verifyUrl: string;
  credentialId: string;
};

export function linkedInAddToProfileUrl(input: LinkedInCertInput): string {
  const m = /^(\d{4})-(\d{2})/.exec(input.issuedOn);
  const year = m ? Number(m[1]) : new Date(input.issuedOn).getUTCFullYear();
  const month = m ? Number(m[2]) : new Date(input.issuedOn).getUTCMonth() + 1;
  const q = [
    "startTask=CERTIFICATION_NAME",
    `name=${encodeURIComponent(input.title)}`,
    `organizationName=${encodeURIComponent(ISSUING_ORG)}`,
    `issueYear=${year}`,
    `issueMonth=${month}`,
    `certUrl=${encodeURIComponent(input.verifyUrl)}`,
    `certId=${encodeURIComponent(input.credentialId)}`,
  ].join("&");
  return `https://www.linkedin.com/profile/add?${q}`;
}

/** Signatory printed on every custom certificate (owner decision 57). */
export const CUSTOM_SIGNATORY = { name: "Kavya Bothra", role: "COO" } as const;

/** Lower-case + trim an email; null when it doesn't look like one. */
export function cleanEmail(raw: string | null | undefined): string | null {
  const e = (raw ?? "").trim().toLowerCase();
  return /^[^\s@,()"]+@[^\s@,()"]+\.[^\s@,()"]+$/.test(e) ? e : null;
}

/** Keep digits, spaces, + - ( ); null when there are fewer than 7 digits. */
export function cleanPhone(raw: string | null | undefined): string | null {
  const p = (raw ?? "").replace(/[^\d+\-() ]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
  return (p.match(/\d/g)?.length ?? 0) >= 7 ? p : null;
}
