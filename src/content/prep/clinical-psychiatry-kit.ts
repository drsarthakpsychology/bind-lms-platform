import type { Difficulty, PrepExam, PrepQuestion } from "@/lib/prep/types";
import { AR } from "./_qb4";

/**
 * Small builders for the clinical-psychiatry part files. Statements and
 * assertion-reason pairs are written without numbers or "Assertion (A):"
 * labels because the question view adds them.
 */

type Opts = [string, string, string, string];
type Ans = 0 | 1 | 2 | 3;
type Extra = { exams?: PrepExam[]; module?: string; ref?: string };

/** MD Psychiatry only. */
export const MD: PrepExam[] = ["md-psychiatry"];
/** MD Psychiatry and clinical psychology entrances. */
export const MDC: PrepExam[] = ["md-psychiatry", "mcp-entrance"];
/** MD Psychiatry, clinical psychology entrances and UGC NET. */
export const MDCN: PrepExam[] = ["md-psychiatry", "mcp-entrance", "ugc-net"];

const AR_STEM = "Read the Assertion (A) and Reason (R) and choose the correct option.";

export function cpKit(defaultModule: string, defaultExams: PrepExam[] = MD) {
  const base = (id: string, topic: string, difficulty: Difficulty, x?: Extra) => ({
    id,
    subject: "clinical-psychiatry" as const,
    topic,
    difficulty,
    exams: x?.exams ?? defaultExams,
    module: x?.module ?? defaultModule,
    ...(x?.ref ? { ref: x.ref } : {}),
  });
  return {
    mcq: (id: string, topic: string, d: Difficulty, stem: string, options: Opts, answer: Ans, explanation: string, x?: Extra): PrepQuestion => ({
      ...base(id, topic, d, x),
      type: "mcq",
      stem,
      options,
      answer,
      explanation,
    }),
    num: (id: string, topic: string, d: Difficulty, stem: string, options: Opts, answer: Ans, explanation: string, x?: Extra): PrepQuestion => ({
      ...base(id, topic, d, x),
      type: "numerical",
      stem,
      options,
      answer,
      explanation,
    }),
    ar: (id: string, topic: string, d: Difficulty, a: string, r: string, answer: Ans, explanation: string, x?: Extra): PrepQuestion => ({
      ...base(id, topic, d, x),
      type: "assertion-reason",
      stem: AR_STEM,
      statements: [a, r],
      options: AR,
      answer,
      explanation,
    }),
    st: (id: string, topic: string, d: Difficulty, stem: string, statements: string[], options: Opts, answer: Ans, explanation: string, x?: Extra): PrepQuestion => ({
      ...base(id, topic, d, x),
      type: "statement",
      stem,
      statements,
      options,
      answer,
      explanation,
    }),
    mt: (id: string, topic: string, d: Difficulty, stem: string, left: string[], right: string[], options: Opts, answer: Ans, explanation: string, x?: Extra): PrepQuestion => ({
      ...base(id, topic, d, x),
      type: "match",
      stem,
      lists: { left, right },
      options,
      answer,
      explanation,
    }),
    ps: (id: string, topic: string, d: Difficulty, passage: string, stem: string, options: Opts, answer: Ans, explanation: string, x?: Extra): PrepQuestion => ({
      ...base(id, topic, d, x),
      type: "passage",
      passage,
      stem,
      options,
      answer,
      explanation,
    }),
  };
}
