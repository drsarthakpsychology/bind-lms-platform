/**
 * Quick Reference links. Tiny and dependency-free so games (client or server)
 * can add a "Learn this" link after an answer without pulling in the library.
 *
 *   referenceHref("Bipolar II disorder") → "/study/reference/bipolar-ii-disorder"
 *   referenceHref("OCD")                 → "/study/reference/ocd" (the page resolves
 *                                           aliases and redirects to the right entry)
 *
 * Unknown words still work: the page falls back to a search for them.
 */
export const REFERENCE_BASE = "/study/reference";

/** Lower-case, accents and apostrophes dropped, everything else to single dashes. */
export function referenceSlug(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Link to the Quick Reference entry for a topic, diagnosis, medicine or term. */
export function referenceHref(topicOrDiagnosis: string): string {
  const s = referenceSlug(topicOrDiagnosis);
  return s ? `${REFERENCE_BASE}/${s}` : REFERENCE_BASE;
}
