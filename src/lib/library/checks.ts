/**
 * Shared checks for the hand-written practice libraries (Clinic detective,
 * What would you do, Ethics dilemmas). Used by their validator tests.
 */
export const DASH = /[\u2013\u2014]/;

/** Formal references are not allowed in student text (owner rule 2026-11-06). */
export const CITATION = [
  /\b(Kaplan|Sadock|Stahl'?s|Maudsley|Fish'?s|Ahuja|Hilgard|Bear,? Connors|Prescriber'?s Guide|Synopsis of Psychiatry|Essential Psychopharmacology)\b/,
  /\bet al\.?/,
  /https?:\/\//,
  /\bdoi\b/i,
  /\bpp?\.\s?\d+/,
  /\b(Lancet|JAMA|NEJM|New England Journal|Psychological Bulletin|American Journal of Psychiatry|Am J Psychiatry|World Psychiatry|Nature Mental Health|BMJ|Cochrane)\b/,
  /\b\d+(st|nd|rd|th) (ed\.|edition)\b/i,
  /\bWeek \d+/,
];

export const MODULE_IDS = new Set([
  "antidepressants", "antipsychotics", "anxiety", "applied", "assessment", "bipolar", "brain", "case-sheet", "child",
  "defences", "depression", "ethics-law", "exam-prep", "foundations", "frontiers", "interview-mse", "learning-memory",
  "lifespan", "medicine-profiles", "more-disorders", "motivation-emotion", "mse-deep", "net-paper1", "neurocognitive",
  "ocd", "personality-theories", "personality", "pharmacokinetics", "psychodynamics", "psychosis", "research-methods",
  "sensation-perception", "social", "stabilisers", "statistics", "substance", "suicide", "therapies", "thinking-language", "trauma",
]);

export const EXAMS = new Set(["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester", "md-psychiatry"]);

/** Every string inside a value, flattened. */
export function strings(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.flatMap(strings);
  if (v && typeof v === "object") return Object.values(v).flatMap(strings);
  return [];
}

export function textProblems(id: string, v: unknown): string[] {
  const out: string[] = [];
  for (const s of strings(v)) {
    if (DASH.test(s)) out.push(`${id}: dash in "${s.slice(0, 60)}"`);
    for (const re of CITATION) if (re.test(s)) out.push(`${id}: citation ${re} in "${s.slice(0, 60)}"`);
  }
  return out;
}

/** Share of items whose correct option is strictly the longest / shortest. */
export function lengthBias(sets: { correct: string; others: string[] }[]) {
  let longest = 0;
  let shortest = 0;
  for (const s of sets) {
    const others = s.others.map((o) => o.length);
    if (s.correct.length > Math.max(...others)) longest++;
    if (s.correct.length < Math.min(...others)) shortest++;
  }
  return { longest: longest / sets.length, shortest: shortest / sets.length };
}
