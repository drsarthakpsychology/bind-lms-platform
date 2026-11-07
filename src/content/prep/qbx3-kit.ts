import type { Difficulty, PrepExam, PrepQuestion, Subject } from "@/lib/prep/types";

/**
 * Compact builders for the x-series part files (cognitive, perception-attention,
 * learning-motivation-emotion, developmental, social, personality-theories,
 * history-systems, indian-psychology). Every item is still a plain PrepQuestion.
 */

type O = [string, string, string, string];
type A = 0 | 1 | 2 | 3;
export type X = { exams?: PrepExam[]; module?: string; ref?: string };

/** Exam tag sets. CUET-PG is BA level; MCP entrances lean clinical; MD Psychiatry only for clinician-depth items. */
export const ALL: PrepExam[] = ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"];
export const NMS: PrepExam[] = ["ugc-net", "mcp-entrance", "ma-semester"];
export const NM: PrepExam[] = ["ugc-net", "mcp-entrance"];
export const NS: PrepExam[] = ["ugc-net", "ma-semester"];
export const CNS: PrepExam[] = ["cuet-pg", "ugc-net", "ma-semester"];
export const MCP: PrepExam[] = ["mcp-entrance", "ugc-net"];
export const MD: PrepExam[] = ["mcp-entrance", "md-psychiatry"];

/** The standard assertion-reason options, in the fixed exam order. */
export const AR_OPTS: O = [
  "Both A and R are true, and R is the correct explanation of A",
  "Both A and R are true, but R is not the correct explanation of A",
  "A is true, but R is false",
  "A is false, but R is true",
];
const AR_STEM = "Read the Assertion (A) and Reason (R) and choose the correct option.";

export function qx(subject: Subject, exams: PrepExam[], module?: string) {
  const base = (id: string, topic: string, difficulty: Difficulty, x?: X) => {
    const m = x?.module ?? module;
    return { id, subject, topic, difficulty, exams: x?.exams ?? exams, ...(m ? { module: m } : {}), ...(x?.ref ? { ref: x.ref } : {}) };
  };
  return {
    mcq: (id: string, topic: string, d: Difficulty, stem: string, options: O, answer: A, explanation: string, x?: X): PrepQuestion => ({
      ...base(id, topic, d, x), type: "mcq", stem, options, answer, explanation,
    }),
    num: (id: string, topic: string, d: Difficulty, stem: string, options: O, answer: A, explanation: string, x?: X): PrepQuestion => ({
      ...base(id, topic, d, x), type: "numerical", stem, options, answer, explanation,
    }),
    /** Statements are the bare Assertion and Reason; the UI adds the labels. */
    ar: (id: string, topic: string, d: Difficulty, a: string, r: string, answer: A, explanation: string, x?: X): PrepQuestion => ({
      ...base(id, topic, d, x), type: "assertion-reason", stem: AR_STEM, statements: [a, r], options: AR_OPTS, answer, explanation,
    }),
    /** Statements are numbered 1 to n by the UI; options use codes such as "1 and 3 only". */
    st: (id: string, topic: string, d: Difficulty, stem: string, statements: string[], options: O, answer: A, explanation: string, x?: X): PrepQuestion => ({
      ...base(id, topic, d, x), type: "statement", stem, statements, options, answer, explanation,
    }),
    /** List I is labelled A to D and List II I to IV by the UI. */
    mt: (id: string, topic: string, d: Difficulty, stem: string, left: string[], right: string[], options: O, answer: A, explanation: string, x?: X): PrepQuestion => ({
      ...base(id, topic, d, x), type: "match", stem, lists: { left, right }, options, answer, explanation,
    }),
    ps: (id: string, topic: string, d: Difficulty, passage: string, stem: string, options: O, answer: A, explanation: string, x?: X): PrepQuestion => ({
      ...base(id, topic, d, x), type: "passage", passage, stem, options, answer, explanation,
    }),
  };
}
