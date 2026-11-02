/**
 * Turn a paragraph into short bullet points: split on new lines, bullets,
 * semicolons and sentence ends. Removes leftover citation fragments such as
 * "(p. 123)" or "[Stahl]" so students only see the clinical content.
 */
const CITATION = /\s*(\((?:p|pp|page)\.?\s*\d+[^)]*\)|\[[^\]]*\d[^\]]*\]|\((?:Stahl|Kaplan|Sadock|Ahuja|Fish|DSM|Maudsley|BNF|FDA)[^)]*\))/gi;

const SOURCE_TALK = /(?:\(bold for FDA approved\)|\baccording to (?:our|the) sources,?|the sources suggest|our sources (?:say|suggest)|\bthe source recommends|\bbold for FDA approved)\s*/gi;

/** Remove citation fragments and "the sources say" wording from any text. */
export function cleanClinicalText(text: string): string {
  return text.replace(CITATION, "").replace(SOURCE_TALK, "").replace(/[✽*]+/g, "").replace(/[ \t]+/g, " ").trim();
}

export function toPoints(text: string | undefined | null, max = 12): string[] {
  if (!text) return [];
  const clean = cleanClinicalText(text)
    // A line break before a capital letter starts a new point (list-style data);
    // a break before a lowercase word is just a wrapped line.
    .replace(/\s*\n\s*(?=[A-Z(])/g, "\n")
    .replace(/\s*\n\s*/g, (m, off, str) => (/[A-Z(]/.test(str[off + m.length] ?? "") ? "\n" : " "));
  const parts = clean
    .split(/\n|•|;\s+|(?<=[a-z0-9)%])\.\s+(?=[A-Z])|(?<=\))\s+(?=[A-Z][a-z])/)
    .map((p) => p.replace(/\s+/g, " ").replace(/^[-–—*\s]+/, "").replace(/[.\s]+$/, "").trim())
    .filter((p) => p.length > 1);
  return parts.slice(0, max);
}
