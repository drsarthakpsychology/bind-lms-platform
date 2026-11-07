import type { Difficulty, PrepExam, PrepQuestion, Subject } from "@/lib/prep/types";

/**
 * Compact builders for the x1 question parts (psychopathology, biological,
 * clinical-therapies, counselling). Every question is still a plain PrepQuestion.
 *
 * Exam codes: C cuet-pg, N ugc-net, M mcp-entrance, S ma-semester, D md-psychiatry.
 * Ids are `${prefix}-${n padded to 4}`; never renumber.
 */

type Opts = [string, string, string, string];
type Ans = 0 | 1 | 2 | 3;
export type X = { module?: string; ref?: string };

const EXAM: Record<string, PrepExam> = { C: "cuet-pg", N: "ugc-net", M: "mcp-entrance", S: "ma-semester", D: "md-psychiatry" };

/** The standard NTA assertion-reason options, in the fixed exam order. */
export const AR4: Opts = [
  "Both A and R are true, and R is the correct explanation of A",
  "Both A and R are true, but R is NOT the correct explanation of A",
  "A is true, but R is false",
  "A is false, but R is true",
];

const AR_STEM = "Read the Assertion (A) and the Reason (R) and choose the correct option.";

export function qx(subject: Subject, prefix: string, defaultModule?: string) {
  const exams = (codes: string): PrepExam[] =>
    [...codes].map((c) => {
      const e = EXAM[c];
      if (!e) throw new Error(`${prefix}: unknown exam code ${c}`);
      return e;
    });
  const base = (n: number, topic: string, difficulty: Difficulty, e: string, x?: X) => {
    const m = x?.module ?? defaultModule;
    return {
      id: `${prefix}-${String(n).padStart(4, "0")}`,
      subject,
      topic,
      exams: exams(e),
      difficulty,
      ...(m ? { module: m } : {}),
      ...(x?.ref ? { ref: x.ref } : {}),
    };
  };
  return {
    mcq: (n: number, topic: string, d: Difficulty, e: string, stem: string, options: Opts, answer: Ans, explanation: string, x?: X): PrepQuestion => ({
      ...base(n, topic, d, e, x),
      type: "mcq",
      stem,
      options,
      answer,
      explanation,
    }),
    num: (n: number, topic: string, d: Difficulty, e: string, stem: string, options: Opts, answer: Ans, explanation: string, x?: X): PrepQuestion => ({
      ...base(n, topic, d, e, x),
      type: "numerical",
      stem,
      options,
      answer,
      explanation,
    }),
    ps: (n: number, topic: string, d: Difficulty, e: string, passage: string, stem: string, options: Opts, answer: Ans, explanation: string, x?: X): PrepQuestion => ({
      ...base(n, topic, d, e, x),
      type: "passage",
      passage,
      stem,
      options,
      answer,
      explanation,
    }),
    ar: (n: number, topic: string, d: Difficulty, e: string, a: string, r: string, answer: Ans, explanation: string, x?: X): PrepQuestion => ({
      ...base(n, topic, d, e, x),
      type: "assertion-reason",
      stem: AR_STEM,
      statements: [a, r],
      options: AR4,
      answer,
      explanation,
    }),
    /** Statements are numbered 1 to n by the UI; do not number them in the text. */
    st: (n: number, topic: string, d: Difficulty, e: string, stem: string, statements: string[], options: Opts, answer: Ans, explanation: string, x?: X): PrepQuestion => ({
      ...base(n, topic, d, e, x),
      type: "statement",
      stem,
      statements,
      options,
      answer,
      explanation,
    }),
    /** List I is labelled A to D and List II I to IV by the UI. */
    mt: (n: number, topic: string, d: Difficulty, e: string, stem: string, left: string[], right: string[], options: Opts, answer: Ans, explanation: string, x?: X): PrepQuestion => ({
      ...base(n, topic, d, e, x),
      type: "match",
      stem,
      lists: { left, right },
      options,
      answer,
      explanation,
    }),
  };
}
