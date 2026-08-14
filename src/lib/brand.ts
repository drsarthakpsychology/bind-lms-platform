/**
 * Brand identity — single source of truth for the product name and copy.
 * Every user-facing brand string reads from here; a rename is a one-file edit.
 */
export const BRAND = {
  name: "VIBHA School of Psychology",
  /** The full name in the display case used on the public site. */
  nameUppercase: "VIBHA SCHOOL OF PSYCHOLOGY",
  shortName: "VIBHA",
  /** One-line product description, used in metadata and auth screens. */
  tagline: "Psychology you can practise.",
  description:
    "A practical training programme in clinical psychology. Theory gives you the language; practice teaches you how to use it. In the room, not just in the exam.",
  /** The parent organisation the school belongs to. */
  parent: "VIBHA Healing Centre",
  /** The clinical lead. */
  lead: "Dr. Sarthak Dave, MBBS, MD (Psychiatry)",
  /** The programme builder. */
  builder: "Kavya Bothra",
  /** Cohort One start date — single source for the public-site deadline. */
  cohortStart: "20 August",
} as const;

/** Cohort One start date as ISO — drives the deadline copy everywhere. */
export const COHORT = {
  name: "Cohort One",
  startDate: "2026-08-20",
} as const;

/** True once the cohort start date has passed (by end of day, local). */
export function hasCohortStarted(now: Date = new Date()): boolean {
  return now.getTime() >= new Date(`${COHORT.startDate}T23:59:59`).getTime();
}

/**
 * Honest deadline copy. Before the start date it names the date; after, it
 * drops the stale date rather than asserting a past one (PFD L1/L4 — a past
 * "begins X" contradicts what the visitor can verify).
 */
export function cohortDeadlineText(now: Date = new Date()): string {
  return hasCohortStarted(now)
    ? "Cohort One is by invitation"
    : `Cohort One begins ${BRAND.cohortStart}`;
}
