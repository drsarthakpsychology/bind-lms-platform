/**
 * Shared tags for the game libraries (Daily Case, Duel, Blitz, Criteria Sort):
 * which exams an item is honestly useful for, and the 5-step learning ladder.
 * Pure data, safe to import anywhere.
 */

export type Exam = "cuet-pg" | "ugc-net" | "mcp-entrance" | "md-psychiatry" | "ma-semester";

export const EXAMS: Exam[] = ["cuet-pg", "ugc-net", "mcp-entrance", "md-psychiatry", "ma-semester"];

/**
 * Short presets so item files stay readable.
 * all: core facts every exam asks. core: clinical psychopathology for the
 * postgraduate and entrance papers. clin: applied clinical detail for the
 * clinical psychology entrance and MD psychiatry. md: specialist medical
 * detail (drug toxicity, rare neurology). basic: the undergraduate-level papers.
 */
export const EXAM_SETS = {
  all: ["cuet-pg", "ugc-net", "mcp-entrance", "md-psychiatry", "ma-semester"],
  core: ["ugc-net", "mcp-entrance", "md-psychiatry", "ma-semester"],
  clin: ["mcp-entrance", "md-psychiatry"],
  md: ["md-psychiatry"],
  basic: ["cuet-pg", "ugc-net", "ma-semester"],
} as const satisfies Record<string, readonly Exam[]>;

export type ExamSet = keyof typeof EXAM_SETS;

export function exams(set: ExamSet): Exam[] {
  return [...EXAM_SETS[set]];
}

/** The learning ladder used where a section has no older scale. */
export type Level = 1 | 2 | 3 | 4 | 5;
export const LADDER: Record<Level, string> = { 1: "Recognise", 2: "Recall", 3: "Apply", 4: "Tell look-alikes apart", 5: "Full case" };

/** Study modules a "Learn this" link may open (/study/<id>). */
export const STUDY_MODULES = [
  "antidepressants", "antipsychotics", "anxiety", "applied", "assessment", "bipolar", "brain", "case-sheet", "child", "defences",
  "depression", "ethics-law", "exam-prep", "foundations", "frontiers", "interview-mse", "learning-memory", "lifespan", "medicine-profiles",
  "more-disorders", "motivation-emotion", "mse-deep", "net-paper1", "neurocognitive", "ocd", "personality", "personality-theories",
  "pharmacokinetics", "psychodynamics", "psychosis", "research-methods", "sensation-perception", "social", "stabilisers", "statistics",
  "substance", "suicide", "therapies", "thinking-language", "trauma",
] as const;

/** Things that must never reach a student: book names, page numbers, citations, em or en dashes. */
const CITATION = /\b(kaplan|sadock|stahl|maudsley|fish's|ahuja|atkinson|hilgard|bear,? connors|paradiso|et al)\b|\bp{1,2}\.\s?\d|\(\s?(19|20)\d\d\s?\)|\u2013|\u2014/i;

export function citationOrDash(text: string): boolean {
  return CITATION.test(text);
}
