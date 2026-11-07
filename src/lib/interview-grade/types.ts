/**
 * Graded AI patient interview: what the student hands in after talking to
 * the simulated patient, and the rubric they get back. Shapes only (safe for
 * the browser and the server).
 */
import { z } from "zod";

const field = (max: number) => z.string().trim().max(max).default("");

export const MSE_DOMAINS = [
  { id: "appearance", label: "Appearance and behaviour", hint: "How they look, eye contact, how they sit or move" },
  { id: "speech", label: "Speech", hint: "Rate, volume, amount" },
  { id: "mood", label: "Mood", hint: "In their own words" },
  { id: "affect", label: "Affect", hint: "What you saw: range, fit with the words" },
  { id: "thought", label: "Thought", hint: "Form and content, worries, beliefs" },
  { id: "perception", label: "Perception", hint: "Voices, visions, or none found" },
  { id: "cognition", label: "Cognition", hint: "Alert, oriented, attention" },
  { id: "insight", label: "Insight", hint: "What they think is wrong, and if they want help" },
] as const;
export type MseDomain = (typeof MSE_DOMAINS)[number]["id"];

export const RISK_LEVELS = ["low", "moderate", "high", "unsure"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

/** The student's write-up. Untrusted input: length-capped, never put in a system prompt. */
export const submissionSchema = z
  .object({
    mse: z.object(Object.fromEntries(MSE_DOMAINS.map((d) => [d.id, field(400)])) as Record<MseDomain, ReturnType<typeof field>>).strict(),
    risk: z.object({ findings: field(800), level: z.enum(RISK_LEVELS) }).strict(),
    formulation: field(1500),
  })
  .strict();
export type Submission = z.infer<typeof submissionSchema>;

/** One checklist item: did the student ask it, and where. */
export type CheckItem = { id: string; label: string; asked: boolean; quote: string | null; why: string };

export type Verdict = "accurate" | "partly" | "inaccurate" | "missing" | "not_checked";

/** What the grader model must return. Parsed strictly. */
export const modelGradeSchema = z
  .object({
    mse: z
      .array(
        z
          .object({
            domain: z.enum(MSE_DOMAINS.map((d) => d.id) as [MseDomain, ...MseDomain[]]),
            verdict: z.enum(["accurate", "partly", "inaccurate", "missing"]),
            feedback: z.string().trim().min(3).max(400),
          })
          .strict(),
      )
      .min(1)
      .max(8),
    risk: z
      .object({
        expected_level: z.enum(["low", "moderate", "high"]),
        feedback: z.string().trim().min(3).max(600),
      })
      .strict(),
    rapport: z.object({ score: z.number().min(0).max(4), feedback: z.string().trim().min(3).max(500) }).strict(),
    formulation: z.object({ score: z.number().min(0).max(4), feedback: z.string().trim().min(3).max(600) }).strict(),
    better_questions: z.array(z.string().trim().min(3).max(240)).max(4),
    summary: z.string().trim().min(3).max(500),
  })
  .strict();
export type ModelGrade = z.infer<typeof modelGradeSchema>;

/** The rubric the student sees, and what is stored in sim_interview_grades.grade. */
export type InterviewGrade = {
  /** 0 to 100. */
  overall: number;
  parts: {
    history: { score: number; asked: CheckItem[]; missed: CheckItem[]; feedback: string };
    rapport: { score: number; reflections: number; openQuestions: number; questions: number; reassurance: string[]; feedback: string };
    risk: { score: number; asked: CheckItem[]; missed: CheckItem[]; yourLevel: RiskLevel; expectedLevel: RiskLevel | null; levelOk: boolean | null; feedback: string };
    mse: { score: number | null; domains: { domain: MseDomain; label: string; verdict: Verdict; feedback: string }[] };
    formulation: { score: number | null; feedback: string };
  };
  betterQuestions: string[];
  summary: string;
  /** False when the AI part couldn't run: the checklist parts are still scored. */
  aiChecked: boolean;
  provider: string;
};
