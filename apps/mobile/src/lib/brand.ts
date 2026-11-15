/**
 * Words the visitor screens show before anyone signs in. Kept in one place so
 * the owner can change them without hunting through screens. (The cohort line
 * should come from GET /config one day: see docs/app/CONTRACT_REQUESTS.md.)
 */
export const BRAND = {
  school: "School of Psychology",
  cohortLine: "Cohort Two · by invitation · starts December 2026",
  headline: ["Don't just study", "psychology.", "Practise it."] as const,
  lede: "A 16-week clinical training programme where you see real patients, write real treatment plans, and get corrected by psychiatrists. Led by Dr. Sarthak Dave, MBBS, MD (Psychiatry).",
  whatsapp: "https://wa.me/917877049920",
  privacyUrl: "https://vibhapsychology.com/policies/privacy",
} as const;
