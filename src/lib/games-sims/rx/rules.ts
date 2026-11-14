/**
 * Rx Detective's numbers, scoring rules and the shapes the browser holds,
 * with no medicine or case data in this file, so the game screen can import
 * it without carrying the answers. The cases are read on the server only
 * (game.ts, deal.ts).
 */
import type { JourneyData } from "@/lib/study/types";

export type Kind = "chain" | "mystery" | "puzzle" | "review";
export type StepKey = "cls" | "mech" | "ae" | "mon";
export type Mode = "mixed" | Kind;

export const STEPS: { key: StepKey; label: string; ask: string }[] = [
  { key: "cls", label: "Class", ask: "What kind of medicine is it?" },
  { key: "mech", label: "How it works", ask: "How does it work?" },
  { key: "ae", label: "Watch for", ask: "Which side effect is the one to remember?" },
  { key: "mon", label: "Check", ask: "What do you monitor?" },
];

export const LIVES = 3;
export const RUN_SIZE = 12;

/** The answer history id of a question ("chain:lithium"). */
export const rxItem = (kind: Kind, id: string) => `${kind}:${id}`;

export const costsLife = (score: number) => score < 0.5;

/** Points: 100 per fully right answer, part credit for chains, +10% per streak step (max +50%). */
export function pointsFor(score: number, streak: number): number {
  return Math.round(score * 100 * (1 + Math.min(5, streak) * 0.1));
}
export const nextStreak = (streak: number, score: number) => (score >= 0.999 ? streak + 1 : 0);

/** XP: 5 for playing plus 2 per question's worth of right answers, at most 40. */
export function rxXp(scores: number[]): number {
  return Math.min(40, 5 + Math.round(scores.reduce((a, s) => a + s, 0) * 2));
}

/** An option: what is sent back (`id`) and what is shown (`label`). */
export type Opt = { id: string; label: string };

/** A case as the browser sees it before answering: the story and the options, never the answer. */
export type PublicCase = { title: string } & (
  | { kind: "chain"; name: string; brands: string[]; steps: string[][] }
  | { kind: "mystery"; who: string; story: string; clues: string[]; drug: string; brand: string; options: Opt[] }
  | { kind: "puzzle"; a: string; b: string; aBrands: string[] | null; bBrands: string[] | null; story: string; options: Opt[] }
  | { kind: "review"; who: string; story: string; rx: string[]; options: Opt[] }
);

/** What the answer card shows once a case is answered. */
export type Reveal =
  | { kind: "chain"; name: string; values: string[]; dose: string; receptor: string; line: string }
  | { kind: "mystery"; label: string; why: string; not: string | null; receptor: string; drug: string }
  | { kind: "review"; answer: string; why: string; not: string }
  | { kind: "puzzle"; label: string; why: string; not: string | null; journey: (Omit<JourneyData, "caption"> & { caption?: string }) | null; receptor: { receptor: string; caption: string } | null; qt: boolean };

export type Graded = { score: number; parts: { ok: boolean; chosen: string | null; correct: string }[] };

/** A link under the answer: the medicine's page or its Study module. */
export type LearnItem = { id: string; name: string; href?: string };

/** A whole case once answered: the grade, the right option's id, the answer card and the links. */
export type Answered = { graded: Graded; answer: string; reveal: Reveal; learn: LearnItem[]; pages: { id: string; name: string }[] };
