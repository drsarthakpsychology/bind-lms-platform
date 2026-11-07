/**
 * Clean-up for every piece of model text a student will read.
 *
 * Owner rules (2026-11-06):
 *   - no em dashes or en dashes (they read as AI-written): replaced with
 *     commas, colons or "to" for number ranges;
 *   - no stock AI phrases ("delve into", "it's important to note that" …);
 *   - no book, journal or citation references in student text.
 *
 * The prompts ask the model for all of this too; this is the safety net that
 * runs on every output regardless. Pure, so it is unit-tested and safe to use
 * on the server or in the browser.
 */

const DASH = /[\u2014\u2013\u2012\u2015]/;

/** Replace em/en dashes (and spaced hyphens used as dashes) with plain punctuation. */
export function stripDashes(input: string): string {
  let s = input;
  if (!DASH.test(s) && !/\s-\s/.test(s)) return s;
  // Number ranges: "2\u20133 weeks", "10 \u2014 12" → "2 to 3 weeks".
  s = s.replace(/(\d)\s*[\u2014\u2013\u2012\u2015]\s*(\d)/g, "$1 to $2");
  // A dash at the start of a line (a bullet) just goes.
  s = s.replace(/(^|\n)[ \t]*[\u2014\u2013\u2012\u2015][ \t]*/g, "$1");
  // "Label \u2014 explanation" at the very start of a short lead-in reads best as a colon.
  s = s.replace(/^([A-Z][A-Za-z']*(?: [A-Za-z']+){0,2})\s*[\u2014\u2013\u2012\u2015]\s+(?!(?:and|but|or|so|then|which|who|because)\b)/, "$1: ");
  // Everything else between words becomes a comma.
  s = s.replace(/\s*[\u2014\u2013\u2012\u2015]+\s*/g, ", ");
  // A spaced ASCII hyphen between words is a dash too ("tired - and low").
  s = s.replace(/([A-Za-z)\]'"])\s+-\s+(?=[A-Za-z(])/g, "$1, ");
  return tidy(s);
}

/** Stock phrases that make text sound machine-written. Removed or swapped. */
const AI_PHRASES: [RegExp, string][] = [
  [/\b(it'?s|it is) (important|crucial|essential|worth) (to note|noting|to remember|remembering) that\s*/gi, ""],
  [/\bit should be noted that\s*/gi, ""],
  [/\bnotably,\s*/gi, ""],
  [/\bin conclusion,\s*/gi, ""],
  [/\bin summary,\s*/gi, ""],
  [/\bultimately,\s*/gi, ""],
  [/\b(certainly|absolutely|of course)!\s*/gi, ""],
  [/\bgreat question[.!]?\s*/gi, ""],
  [/\bas an ai( language model)?,?\s*/gi, ""],
  [/\bdelv(e|es|ed|ing) (into|deeper into)\b/gi, "look at"],
  [/\b(a |the )?(rich |complex |intricate )?tapestry of\b/gi, "a mix of"],
  [/\bnavigat(e|es|ing) the complexities of\b/gi, "handle"],
  [/\bin today'?s (fast-paced )?world,?\s*/gi, ""],
  [/\bplays? a (crucial|pivotal|vital) role in\b/gi, "matters for"],
  [/\bembark(s|ed|ing)? on (a|the|this|your) journey( of| to)?\b/gi, "start"],
  [/\bunlock(s|ing)? (the|your) (full )?potential\b/gi, "do well"],
  [/\b(holistic|multifaceted|nuanced) (understanding|approach|picture)\b/gi, "full picture"],
  [/\bfoster(s|ing)? a sense of\b/gi, "build"],
  [/\bseamless(ly)?\b/gi, "smooth$1"],
  [/\bleverag(e|es|ing)\b/gi, "us$1"],
];

const CAP = "\u0000";

export function stripAiPhrases(input: string): string {
  let s = input;
  for (const [re, to] of AI_PHRASES) {
    if (to) {
      s = s.replace(re, to);
      continue;
    }
    // A phrase removed at the start of a sentence leaves the next word to capitalise.
    s = s.replace(re, (...args) => {
      const off = args[args.length - 2] as number;
      const whole = args[args.length - 1] as string;
      return /(^|[.!?]\s*)$/.test(whole.slice(0, off)) ? CAP : "";
    });
  }
  s = s.replace(new RegExp(`${CAP}\\s*([a-z])`, "g"), (_m, c: string) => c.toUpperCase()).replaceAll(CAP, "");
  return tidy(s);
}

/**
 * Book, journal and citation patterns that must not appear in student text
 * (the same list the study-content guard uses, plus the main manuals by
 * author). DSM-5-TR and ICD-11 as diagnostic systems are fine.
 */
export const REFERENCE_PATTERNS: RegExp[] = [
  /\b(Kaplan|Sadock|Stahl'?s|Maudsley|Fish'?s|Ahuja|Hilgard|Bear,? Connors|Prescriber'?s Guide|Synopsis of Psychiatry|Essential Psychopharmacology|Oxford Handbook|Shorter Oxford|Lishman)\b/,
  /\bet al\.?/,
  /https?:\/\//,
  /\bwww\./i,
  /\bdoi\b/i,
  /\bpp?\.\s?\d+/,
  /\b(Lancet|JAMA|NEJM|New England Journal|Psychological Bulletin|American Journal of Psychiatry|Am J Psychiatry|World Psychiatry|Nature Mental Health|BMJ|Cochrane)\b/,
  /\b\d+(st|nd|rd|th) (ed\.|edition)\b/i,
  /\((19|20)\d{2}\)/,
  /\b[A-Z][a-z]+ (and|&) [A-Z][a-z]+,? (19|20)\d{2}\b/,
];

/** The first reference-like text found, or null. */
export function findReference(text: string): string | null {
  for (const re of REFERENCE_PATTERNS) {
    const m = text.match(re);
    if (m) return m[0];
  }
  return null;
}

function tidy(s: string): string {
  return s
    .replace(/,\s*,+/g, ",")
    .replace(/\s+,/g, ",")
    .replace(/,\s*([.;:!?])/g, "$1")
    .replace(/:\s*,/g, ":")
    .replace(/^,\s*/gm, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/,(?=[A-Za-z(])/g, ", ")
    .trim();
}

/** Dashes and AI phrases out. Use on every model string a student will see. */
export function cleanStudentText(input: string): string {
  if (typeof input !== "string" || !input) return input;
  return stripAiPhrases(stripDashes(input));
}

/** cleanStudentText on every string inside a JSON-like value (keys untouched). */
export function cleanDeep<T>(value: T): T {
  if (typeof value === "string") return cleanStudentText(value) as T;
  if (Array.isArray(value)) return value.map((v) => cleanDeep(v)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = cleanDeep(v);
    return out as T;
  }
  return value;
}

/** Plain-words rules every student-facing prompt includes. */
export const STUDENT_STYLE_RULES = [
  "Write in plain, simple English a student understands on first read.",
  "Never use em dashes or en dashes. Use commas, colons or full stops instead.",
  "No stock phrases such as \"delve into\", \"it's important to note\", \"in conclusion\" or \"tapestry\".",
  "No book titles, authors, journals, citations, page numbers or links.",
].join("\n");
