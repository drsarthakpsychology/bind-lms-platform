import { exams, type Exam, type ExamSet, type Level } from "../tags";

/**
 * Hand-written Blitz fast facts (ids "f:NNN"). Each is a true/false line or a
 * four-option pick, short enough to read in a couple of seconds, with one
 * line that says why the answer is right and why the others are not.
 * Server code only (the answers are here).
 */

export type BlitzFact = {
  id: string;
  kind: "tf" | "pick";
  prompt: string;
  options: string[];
  answer: number;
  why: string;
  /** Quick Reference term the "Learn this" link opens. */
  learn: string;
  topic: string;
  level: Level;
  objective: string;
  exams: Exam[];
  /** Study module for this fact (/study/<id>). */
  module: string;
};

/** Default Study module per topic; a fact can override it. */
export const TOPIC_MODULE: Record<string, string> = {
  depression: "depression",
  bipolar: "bipolar",
  anxiety: "anxiety",
  ocd: "ocd",
  trauma: "trauma",
  psychosis: "psychosis",
  substance: "substance",
  neurocognitive: "neurocognitive",
  child: "child",
  personality: "personality",
  eating: "more-disorders",
  sleep: "more-disorders",
  somatic: "more-disorders",
  dissociative: "more-disorders",
  sexual: "more-disorders",
  antidepressants: "antidepressants",
  antipsychotics: "antipsychotics",
  stabilisers: "stabilisers",
  pharmacology: "medicine-profiles",
  psychopathology: "mse-deep",
  neuroscience: "brain",
  assessment: "assessment",
  "law-ethics": "ethics-law",
  learning: "learning-memory",
  memory: "learning-memory",
  perception: "sensation-perception",
  motivation: "motivation-emotion",
  personality_theory: "personality-theories",
  research: "research-methods",
  statistics: "statistics",
  therapies: "therapies",
  lifespan: "lifespan",
  social: "social",
  suicide: "suicide",
  thinking: "thinking-language",
  defences: "defences",
};

type Opts = [string, string, string, string];

/** A module override may be a topic key (e.g. "sleep") or a module id. */
function resolve(topic: string, module?: string): string {
  if (module) return TOPIC_MODULE[module] ?? module;
  return TOPIC_MODULE[topic] ?? "";
}

/** True/false fact. */
export function t(id: string, topic: string, level: Level, statement: string, answer: boolean, why: string, learn: string, objective: string, ex: ExamSet, module?: string): BlitzFact {
  return { id, kind: "tf", prompt: statement, options: ["True", "False"], answer: answer ? 0 : 1, why, learn, topic, level, objective, exams: exams(ex), module: resolve(topic, module) };
}

/**
 * Four-option pick. The stored position of the right option is set from the
 * id (number mod 4) so positions spread evenly across the bank; explanations
 * name options by content, never by position. (The server shuffles again per run.)
 */
export function p(id: string, topic: string, level: Level, prompt: string, options: Opts, answer: 0 | 1 | 2 | 3, why: string, learn: string, objective: string, ex: ExamSet, module?: string): BlitzFact {
  const target = Number(id.replace(/\D/g, "")) % 4;
  const opts = [...options];
  [opts[answer], opts[target]] = [opts[target], opts[answer]];
  return { id, kind: "pick", prompt, options: opts, answer: target, why, learn, topic, level, objective, exams: exams(ex), module: resolve(topic, module) };
}
