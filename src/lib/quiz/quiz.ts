/**
 * Quiz engine (v5 Part 4.1 / I) — quizzes as CHECKS, not tests.
 *
 * Five item types, each with a one-line rationale citing its source. No item
 * ships without a source. Draft on free tiers, admin-approve, never auto-
 * publish.
 */

export type QuizType =
  | "best_response"          // "what would you say next?"
  | "spot_the_error"         // transcript excerpt with one bad move
  | "standard_vs_common"     // what's taught in India vs what evidence supports
  | "order_steps"            // risk assessment / intake sequence
  | "would_you_report";      // MHA 2017 / POCSO applied

export interface QuizItem {
  id: string;
  type: QuizType;
  prompt: string;
  /** For spot_the_error: the excerpt with the bad move. */
  excerpt?: string;
  options: string[];
  correct: number;
  /** One-line rationale citing the source. Required. */
  rationale: string;
  source: string;
  /** For standard_vs_common: which option is which. */
  isStandardCare?: boolean;
}

/** Score a set of answers. No negative marking — checks, not tests. */
export function scoreQuiz(items: QuizItem[], answers: Record<string, number>): { correct: number; total: number } {
  let correct = 0;
  for (const i of items) if (answers[i.id] === i.correct) correct++;
  return { correct, total: items.length };
}

/** A generic best-response item factory with plausible distractors. */
export function bestResponse(
  id: string,
  scenario: string,
  good: string,
  distractors: [string, string, string],
  rationale: string,
  source: string,
): QuizItem {
  return {
    id,
    type: "best_response",
    prompt: scenario,
    options: [good, ...distractors],
    correct: 0,
    rationale,
    source,
  };
}

/** Spot-the-error: the student identifies the single bad clinician move. */
export function spotTheError(
  id: string,
  excerpt: string,
  goodIndex: number,
  options: string[],
  rationale: string,
  source: string,
): QuizItem {
  return {
    id,
    type: "spot_the_error",
    excerpt,
    prompt: "Which line is the error?",
    options,
    correct: goodIndex,
    rationale,
    source,
  };
}
