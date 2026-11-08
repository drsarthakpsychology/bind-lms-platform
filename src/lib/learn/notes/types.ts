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
  /** Labelled anatomy figures (ids from the study figure library) shown after the sections. */
  figures?: { id: string; focus?: string[]; quiz?: boolean; caption?: string }[];
  /** Where the quiz for this note lives. */
  quiz: { lessonId?: string; domain?: Domain };
};

export const WEEK_BLOCKS = [
  "Weeks 1 to 2 · Brain basics, how patients talk, interview & MSE",
  "Weeks 3 to 4 · Defences & assessment",
  "Weeks 5 to 6 · Mood, anxiety, psychosis & OCD",
  "Weeks 7 to 8 · Medicines & side effects",
  "Weeks 9 to 10 · Therapies",
  "Weeks 11 to 12 · Personality, addiction & crisis",
  "Weeks 13 to 14 · Memory, dementia & children",
  "Weeks 15 to 16 · Trauma, eating disorders & notes",
  "DSM-5-TR · every chapter, A to Z",
] as const;

export function pick(b: Bullet, view: "student" | "clinician"): string {
  return typeof b === "string" ? b : view === "clinician" ? b[1] : b[0];
}
