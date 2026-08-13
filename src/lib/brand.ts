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
} as const;
