/**
 * Postgraduate prep: question bank, mock exams and mock interviews.
 * One shared format so many authors (and agents) can add content in parallel.
 * Content lives in src/content/prep/<subject>.ts and src/content/prep/interviews/<category>.ts.
 */

export type PrepExam = "cuet-pg" | "ugc-net" | "mcp-entrance" | "ma-semester";

export const SUBJECTS = [
  "research-methods",
  "statistics",
  "psychometrics-assessment",
  "cognitive",
  "perception-attention",
  "learning-motivation-emotion",
  "biological",
  "developmental",
  "social",
  "personality-theories",
  "history-systems",
  "psychopathology",
  "clinical-therapies",
  "counselling",
  "health",
  "positive",
  "organisational",
  "indian-psychology",
  "ethics-law",
  "ugc-paper1",
] as const;
export type Subject = (typeof SUBJECTS)[number];

/** 1 easy · 2 medium · 3 hard · 4 very hard (entrance-topper level). */
export type Difficulty = 1 | 2 | 3 | 4;

export type QuestionType =
  | "mcq" // single best answer
  | "assertion-reason" // A and R statements; options are the standard four
  | "match" // List I / List II; options are code combinations
  | "statement" // "Which of the statements are correct?"; options are combinations
  | "passage" // passage/data followed by a question
  | "numerical"; // calculation; still 4 options

export type PrepQuestion = {
  /** Unique and stable, e.g. "stat-anova-0012". Never reuse or renumber. */
  id: string;
  subject: Subject;
  /** Topic slug within the subject, e.g. "anova", "classical-conditioning". */
  topic: string;
  exams: PrepExam[];
  difficulty: Difficulty;
  type: QuestionType;
  stem: string;
  passage?: string;
  /** For assertion-reason: [A, R]. For statement: the numbered statements. */
  statements?: string[];
  /** For match: List I and List II items. */
  lists?: { left: string[]; right: string[] };
  /** Always exactly 4 options. */
  options: [string, string, string, string];
  /** Index 0 to 3 of the correct option. */
  answer: 0 | 1 | 2 | 3;
  /** Why the answer is right AND why each distractor is wrong. Precise, no padding. */
  explanation: string;
  /** VIBHA study module id for "Learn this", if one fits. */
  module?: string;
  /** Admin-only source note (book + page or URL). Never shown to students. */
  ref?: string;
};

export type InterviewCategory = "academic" | "clinical-vignette" | "research" | "ethics" | "motivation" | "current-affairs" | "assessment";

export type InterviewQuestion = {
  id: string;
  category: InterviewCategory;
  exams: PrepExam[];
  difficulty: Difficulty;
  question: string;
  /** Likely follow-ups a panel asks. */
  followUps: string[];
  /** A strong model answer (spoken style, 120 to 250 words). */
  modelAnswer: string;
  /** Points a good answer must cover (the rubric checklist). */
  mustCover: string[];
  /** Things that lose marks. */
  redFlags: string[];
  module?: string;
};

/** A mock exam pattern. Patterns come from docs/plans/PG_PREP_RESEARCH.md; mark unverified ones. */
export type ExamSpec = {
  /** The exam this pattern mirrors; null for a VIBHA practice mock that covers every exam. */
  exam: PrepExam | null;
  title: string;
  minutes: number;
  marksPerRight: number;
  marksPerWrong: number; // negative, e.g. -1
  sections: { title: string; count: number; subjects: Subject[]; types?: QuestionType[] }[];
  verified: boolean;
  source?: string;
};
