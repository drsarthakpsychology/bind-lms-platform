/**
 * Modules (v5 Part 7.4 + the "organise cases into sections" ask).
 *
 * A module is a named section — usually one condition — that groups its own
 * sim cases, SCT items, cards, idioms and quizzes. The DEPRESSION module
 * holds several patients, each with a DIFFERENT voice and register, so the
 * student learns the condition from multiple people who present it
 * differently. That is the point of organising cases into modules.
 */

import type { DepthCase } from "./types";
import { DEPRESSION_CASES } from "./cases/depression";

export type ModuleState = "draft" | "scheduled" | "published" | "archived";

export interface PracticeModule {
  id: string;
  title: string;
  order_index: number;
  state: ModuleState;
  release_at?: string;
  /** What condition/skill this section teaches. */
  focus: string;
  /** The cases in this module, each with its own distinct voice. */
  cases: DepthCase[];
}

/**
 * The module catalogue. Each module = one condition with its own cases.
 * Case voices differ by: register/language mix, age, occupation, how they
 * deflect, what they defend, and their opening idiom.
 */
export const MODULES: PracticeModule[] = [
  {
    id: "mod-depression",
    title: "Depression",
    order_index: 1,
    state: "draft",
    focus: "Major depressive disorder — recognising it across very different people",
    cases: DEPRESSION_CASES,
  },
  {
    id: "mod-anxiety",
    title: "Anxiety & Panic",
    order_index: 2,
    state: "draft",
    focus: "Generalised anxiety, panic disorder, and the somatic-first presentations",
    cases: [],
  },
  {
    id: "mod-psychosis",
    title: "Psychosis",
    order_index: 3,
    state: "draft",
    focus: "Schizophrenia-spectrum — and the traps that hide it (misattributed diagnosis, provenance)",
    cases: [],
  },
  {
    id: "mod-bipolar",
    title: "Bipolar & Mood Cycling",
    order_index: 4,
    state: "draft",
    focus: "Bipolar spectrum — hypomania missed, SSRI activation, iatrogenic traps",
    cases: [],
  },
  {
    id: "mod-substance",
    title: "Substance Use",
    order_index: 5,
    state: "draft",
    focus: "Alcohol, cannabis, opioids — substance-induced presentations vs primary",
    cases: [],
  },
  {
    id: "mod-somatic",
    title: "Somatic & Idioms of Distress",
    order_index: 6,
    state: "draft",
    focus: "The presenting-complaint decoder — 'not feeling fresh' through Kirmayer's seven readings",
    cases: [],
  },
  {
    id: "mod-trauma",
    title: "Trauma & Dissociation",
    order_index: 7,
    state: "draft",
    focus: "PTSD, dissociation, and late risk reveal",
    cases: [],
  },
  {
    id: "mod-adolescent",
    title: "Child & Adolescent",
    order_index: 8,
    state: "draft",
    focus: "Adolescent depression, POCSO, family dynamics, engaging the young person directly",
    cases: [],
  },
  {
    id: "mod-ethics",
    title: "Ethics, Law & Scope",
    order_index: 9,
    state: "draft",
    focus: "MHA 2017, RCI scope, POCSO — the consequence-first dilemmas",
    cases: [],
  },
];

export function moduleById(id: string): PracticeModule | undefined {
  return MODULES.find((m) => m.id === id);
}
