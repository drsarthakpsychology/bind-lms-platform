/**
 * Reflection text checks shared by the server and the website form (no
 * server-only imports). The app keeps a copy in apps/mobile/src/clinic/logic.ts.
 *
 * A reflection must not name a patient. We cannot catch a name, so the form
 * shows a reminder; what we can catch for sure (phone numbers, emails) the
 * server takes out before saving.
 */

/** Longest each part may be (a few lines). */
export const REFLECTION_MAX = 600;
export const REPLY_MAX = 1000;

export const REFLECTION_PARTS = [
  { key: "saw", label: "What I saw" },
  { key: "learned", label: "What I learned" },
  { key: "ask", label: "What I want to ask" },
] as const;
export type ReflectionPart = (typeof REFLECTION_PARTS)[number]["key"];

export const NO_NAMES = "Leave out names, phone numbers, addresses and anything else that could tell who the patient is.";

// 10 to 14 digits, with spaces, dots, dashes or brackets between them, an
// optional + in front (Indian mobiles, landlines with code, +91 numbers).
// Dates (8 digits) and counts stay.
const PHONE = /(^|[^\w+])(\+?\(?\d(?:[ ().-]{0,2}\d){9,13})(?!\w)/g;
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g;

export const NUMBER_REMOVED = "[number removed]";
export const EMAIL_REMOVED = "[email removed]";

/** The text with phone numbers and emails taken out, and how many were. */
export function scrub(text: string): { text: string; removed: number } {
  let removed = 0;
  const out = text
    .replace(EMAIL, () => {
      removed++;
      return EMAIL_REMOVED;
    })
    .replace(PHONE, (_m, lead: string) => {
      removed++;
      return `${lead}${NUMBER_REMOVED}`;
    });
  return { text: out, removed };
}

/** True when the text holds something scrub() would take out (for a live hint in the form). */
export function hasContactDetails(text: string): boolean {
  return scrub(text).removed > 0;
}

/** Trims, collapses runs of blank lines, scrubs. Empty becomes null. */
export function cleanPart(text: string | null | undefined): { text: string | null; removed: number } {
  const t = (text ?? "").replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!t) return { text: null, removed: 0 };
  const s = scrub(t);
  return { text: s.text.slice(0, REFLECTION_MAX), removed: s.removed };
}
