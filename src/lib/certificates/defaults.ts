import { DEFAULT_SIGNATORIES } from "./kinds";
import { cleanText } from "./text";

/**
 * The signatories every new certificate starts with. Saved by the Super
 * Admin in Certificates, Settings (admin_settings, key below); until then the
 * owner's default list in kinds.ts. Pure parts here; the read and write live
 * in the settings page and its action.
 */
export const SIGNATORIES_KEY = "certificate_signatories";

export type DefaultSignatory = { name: string; role: string; signatureFrom: string | null };

/** Keep up to three rows with a name; trim and cap every field. */
export function cleanDefaultSignatories(raw: unknown): DefaultSignatory[] {
  const list = Array.isArray(raw) ? raw : [];
  return list
    .map((s) => {
      const o = (s ?? {}) as Record<string, unknown>;
      return {
        name: cleanText(typeof o.name === "string" ? o.name : "").slice(0, 60),
        role: cleanText(typeof o.role === "string" ? o.role : "").slice(0, 60),
        signatureFrom: typeof o.signatureFrom === "string" && o.signatureFrom ? o.signatureFrom : null,
      };
    })
    .filter((s) => s.name)
    .slice(0, 3);
}

/** What the studio starts with: the saved list, or the owner's default. */
export function startingSignatories(saved: unknown): DefaultSignatory[] {
  const clean = cleanDefaultSignatories(saved);
  return clean.length ? clean : DEFAULT_SIGNATORIES.map((s) => ({ ...s, signatureFrom: null }));
}
