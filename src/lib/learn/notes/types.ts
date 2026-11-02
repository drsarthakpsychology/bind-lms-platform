import type { Domain } from "../concepts/types";

/** A bullet: one string (same for both views) or [student, clinician]. */
export type Bullet = string | [string, string];
export type Section = { title: string; tone?: "lime" | "blue" | "ink" | "white"; style?: "list" | "chips" | "steps" | "alert"; points: Bullet[] };
export type Note = {
  id: string;
  block: number; // index into WEEK_BLOCKS
  title: string;
  emoji: string;
  tagline: string;
  /** One-line summary you could say out loud. */
  tldr: Bullet;
  sections: Section[];
  /** Lay phrase → clinical term pairs for this topic ("Say it clinically"). */
  terms?: [string, string][];
  /** Where the quiz for this note lives. */
  quiz: { lessonId?: string; domain?: Domain };
};

export const WEEK_BLOCKS = [
  "Weeks 1–2 · Foundations, interview & MSE",
  "Weeks 3–4 · Defences & assessment",
  "Weeks 5–6 · Mood, anxiety, psychosis & OCD",
  "Weeks 7–8 · Medicines & side effects",
  "Weeks 9–10 · Therapies",
  "Weeks 11–12 · Personality, addiction & crisis",
  "Weeks 13–14 · Memory, dementia & children",
  "Weeks 15–16 · Trauma, eating disorders & notes",
] as const;

export function pick(b: Bullet, view: "student" | "clinician"): string {
  return typeof b === "string" ? b : view === "clinician" ? b[1] : b[0];
}
