import type { PrepExam, PrepVisual, Subject } from "./types";

/**
 * A long-answer (descriptive) exam question with a model answer, for theory
 * papers: clinical psychology entrances, MD Psychiatry, MA/MSc semester exams
 * and interviews. Written in plain text with light structure:
 * lines starting "## " are headings, "- " bullets, "| a | b |" table rows.
 */
export type LongQA = {
  id: string;
  subject: Subject;
  topic: string;
  /** Marks the question would carry in a theory paper. */
  marks: 5 | 10 | 15 | 20;
  /** 1 easy to 4 very hard. */
  difficulty: 1 | 2 | 3 | 4;
  exams: PrepExam[];
  question: string;
  /** How to plan the answer: 3 to 6 short steps. */
  plan: string[];
  /** The full model answer. */
  answer: string;
  /** What an examiner looks for: 4 to 8 points a student can tick. */
  keyPoints: string[];
  /** Frequent ways students lose marks. */
  pitfalls?: string[];
  /** Study module id (optionally "module/section") for "Learn this". */
  module?: string;
  /** Diagrams shown inside the model answer, in order (any Study widget kind). */
  visuals?: PrepVisual[];
  /** Admin-only source note. */
  ref?: string;
};
