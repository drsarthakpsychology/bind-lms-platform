/**
 * Legal identity — single source of truth for every value the policy pages
 * render. A move, a new phone number, or a new grievance officer is a one-file
 * edit. Mirrors the `src/lib/brand.ts` pattern (frozen const + helpers).
 *
 * One value is STILL OUTSTANDING (never invented — see the brief):
 *   - REGISTERED_ADDRESS  (legally mandatory; the Ahmedabad clinic address)
 * EFFECTIVE_DATE was resolved to the go-live date (2026-08-26) — it binds the
 * policy version recorded at enrolment. Change it here if the publish date
 * differs.
 */
export const LEGAL = {
  /** Operating name on all policies. */
  operatingName: "VIBHA School of Psychology",
  /** Entity structure (per Kavya: sole proprietorship, unregistered). */
  entityType: "sole proprietorship",
  /** Official contact / grievance / data-protection email. */
  contactEmail: "drsarthakpsychology@gmail.com",
  phone: "+91 78770 49920",
  /** Grievance Officer and data-protection contact. */
  grievanceOfficer: "Kavya Bothra, Program Manager & Head",
  /** GST: not registered — GSTIN deliberately absent everywhere. */
  gstin: null as string | null,
  /** Course duration used across policies. */
  courseDuration: "three months",
  /** Live-attendance requirement for certification. */
  liveAttendanceRequirement: "50%",
  /**
   * TODO (Kavya): full business address with PIN code — the Ahmedabad clinic
   * address is fine. Legally mandatory under the Consumer Protection
   * (E-Commerce) Rules, 2020. Do not invent.
   */
  registeredAddress: "[REGISTERED_ADDRESS]",
  /**
   * The date the policies took effect — set to the go-live date (2026-08-26).
   * Binds the policy version shown in enrolment records. ISO form so it is
   * valid in JSON-LD (dateModified) and as a version string.
   */
  effectiveDate: "2026-08-26",
} as const;

/** True while any policy placeholder is still unresolved (drives flags/tests). */
export function hasUnresolvedPlaceholders(): boolean {
  return (
    LEGAL.registeredAddress.startsWith("[") ||
    LEGAL.effectiveDate.startsWith("[")
  );
}

/**
 * A single stable version string for the accepted-terms record. Uses the
 * effective date when set, else an explicit "draft" marker — never a fake date.
 */
export function policyVersion(): string {
  return LEGAL.effectiveDate.startsWith("[")
    ? "draft"
    : LEGAL.effectiveDate;
}
