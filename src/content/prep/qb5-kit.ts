import type { Difficulty, PrepExam, PrepQuestion, Subject } from "@/lib/prep/types";

/**
 * Small builders for the indian-psychology, ethics-law and ugc-paper1 banks.
 * They only fill in the shared fields; every question is still a plain PrepQuestion.
 */

type Opts = [string, string, string, string];
type Ans = 0 | 1 | 2 | 3;
export type Extra = { exams?: PrepExam[]; module?: string; ref?: string };

/** The standard NTA assertion-reason options. */
export const AR_OPTIONS: Opts = [
  "Both A and R are true, and R is the correct explanation of A",
  "Both A and R are true, but R is not the correct explanation of A",
  "A is true, but R is false",
  "A is false, but R is true",
];

const AR_STEM = "Given below are two statements, Assertion (A) and Reason (R). Choose the correct answer.";

export function kit(subject: Subject, exams: PrepExam[], module?: string) {
  const base = (id: string, topic: string, difficulty: Difficulty, x?: Extra) => {
    const m = x?.module ?? module;
    return {
      id,
      subject,
      topic,
      difficulty,
      exams: x?.exams ?? exams,
      ...(m ? { module: m } : {}),
      ...(x?.ref ? { ref: x.ref } : {}),
    };
  };
  return {
    /** Single best answer. */
    mcq: (id: string, topic: string, d: Difficulty, stem: string, options: Opts, answer: Ans, explanation: string, x?: Extra): PrepQuestion => ({
      ...base(id, topic, d, x),
      type: "mcq",
      stem,
      options,
      answer,
      explanation,
    }),
    /** Calculation with four options. */
    num: (id: string, topic: string, d: Difficulty, stem: string, options: Opts, answer: Ans, explanation: string, x?: Extra): PrepQuestion => ({
      ...base(id, topic, d, x),
      type: "numerical",
      stem,
      options,
      answer,
      explanation,
    }),
    /** Assertion (A) and Reason (R). */
    ar: (id: string, topic: string, d: Difficulty, a: string, r: string, answer: Ans, explanation: string, x?: Extra): PrepQuestion => ({
      ...base(id, topic, d, x),
      type: "assertion-reason",
      stem: AR_STEM,
      statements: [`Assertion (A): ${a}`, `Reason (R): ${r}`],
      options: AR_OPTIONS,
      answer,
      explanation,
    }),
    /** "Which of the statements are correct?" Statements are labelled A, B, C… in the text. */
    st: (id: string, topic: string, d: Difficulty, stem: string, statements: string[], options: Opts, answer: Ans, explanation: string, x?: Extra): PrepQuestion => ({
      ...base(id, topic, d, x),
      type: "statement",
      stem,
      statements,
      options,
      answer,
      explanation,
    }),
    /** Match List I (A, B, C, D) with List II (I, II, III, IV). */
    mt: (id: string, topic: string, d: Difficulty, stem: string, left: string[], right: string[], options: Opts, answer: Ans, explanation: string, x?: Extra): PrepQuestion => ({
      ...base(id, topic, d, x),
      type: "match",
      stem,
      lists: { left, right },
      options,
      answer,
      explanation,
    }),
    /** Passage or data set followed by a question. */
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
