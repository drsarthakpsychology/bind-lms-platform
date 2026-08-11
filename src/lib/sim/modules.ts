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
import { ANXIETY_CASES } from "./cases/anxiety";
import { PSYCHOSIS_CASES } from "./cases/psychosis";
import { BIPOLAR_CASES } from "./cases/bipolar";
import { SUBSTANCE_CASES } from "./cases/substance";
import { SOMATIC_CASES } from "./cases/somatic";
import { TRAUMA_CASES } from "./cases/trauma";
import { ADOLESCENT_CASES } from "./cases/adolescent";
import { ETHICS_CASES } from "./cases/ethics";
import { VOLUME_1_CASES } from "./cases/volume-1";
import { VOLUME_2_CASES } from "./cases/volume-2";
import { VOLUME_3_CASES } from "./cases/volume-3";
import { VOLUME_4_CASES } from "./cases/volume-4";
import { VOLUME_5_CASES } from "./cases/volume-5";
import { VOLUME_6_CASES } from "./cases/volume-6";
import { VOLUME_7_CASES, VOLUME_7B_CASES } from "./cases/volume-7";
import { VOLUME_8_CASES } from "./cases/volume-8";

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
    cases: [...DEPRESSION_CASES, ...VOLUME_1_CASES.filter(c => c.module_id === "mod-depression"), ...VOLUME_2_CASES.filter(c => c.module_id === "mod-depression"), ...VOLUME_3_CASES.filter(c => c.module_id === "mod-depression"), ...VOLUME_4_CASES.filter(c => c.module_id === "mod-depression"), ...VOLUME_5_CASES.filter(c => c.module_id === "mod-depression"), ...VOLUME_6_CASES.filter(c => c.module_id === "mod-depression"), ...VOLUME_7_CASES.filter(c => c.module_id === "mod-depression"), ...VOLUME_7B_CASES.filter(c => c.module_id === "mod-depression")],
  },
  {
    id: "mod-anxiety",
    title: "Anxiety & Panic",
    order_index: 2,
    state: "draft",
    focus: "Generalised anxiety, panic disorder, and the somatic-first presentations",
    cases: [...ANXIETY_CASES, ...VOLUME_1_CASES.filter(c => c.module_id === "mod-anxiety"), ...VOLUME_4_CASES.filter(c => c.module_id === "mod-anxiety"), ...VOLUME_5_CASES.filter(c => c.module_id === "mod-anxiety"), ...VOLUME_6_CASES.filter(c => c.module_id === "mod-anxiety"), ...VOLUME_7_CASES.filter(c => c.module_id === "mod-anxiety"), ...VOLUME_7B_CASES.filter(c => c.module_id === "mod-anxiety"), ...VOLUME_8_CASES.filter(c => c.module_id === "mod-anxiety")],
  },
  {
    id: "mod-psychosis",
    title: "Psychosis",
    order_index: 3,
    state: "draft",
    focus: "Schizophrenia-spectrum — and the traps that hide it (misattributed diagnosis, provenance)",
    cases: [...PSYCHOSIS_CASES, ...VOLUME_1_CASES.filter(c => c.module_id === "mod-psychosis"), ...VOLUME_4_CASES.filter(c => c.module_id === "mod-psychosis"), ...VOLUME_5_CASES.filter(c => c.module_id === "mod-psychosis"), ...VOLUME_6_CASES.filter(c => c.module_id === "mod-psychosis"), ...VOLUME_7B_CASES.filter(c => c.module_id === "mod-psychosis")],
  },
  {
    id: "mod-bipolar",
    title: "Bipolar & Mood Cycling",
    order_index: 4,
    state: "draft",
    focus: "Bipolar spectrum — hypomania missed, SSRI activation, iatrogenic traps",
    cases: [...BIPOLAR_CASES, ...VOLUME_1_CASES.filter(c => c.module_id === "mod-bipolar"), ...VOLUME_6_CASES.filter(c => c.module_id === "mod-bipolar")],
  },
  {
    id: "mod-substance",
    title: "Substance Use",
    order_index: 5,
    state: "draft",
    focus: "Alcohol, cannabis, opioids — substance-induced presentations vs primary",
    cases: [...SUBSTANCE_CASES, ...VOLUME_2_CASES.filter(c => c.module_id === "mod-substance"), ...VOLUME_3_CASES.filter(c => c.module_id === "mod-substance"), ...VOLUME_4_CASES.filter(c => c.module_id === "mod-substance"), ...VOLUME_5_CASES.filter(c => c.module_id === "mod-substance"), ...VOLUME_7_CASES.filter(c => c.module_id === "mod-substance")],
  },
  {
    id: "mod-somatic",
    title: "Somatic & Idioms of Distress",
    order_index: 6,
    state: "draft",
    focus: "The presenting-complaint decoder — 'not feeling fresh' through Kirmayer's seven readings",
    cases: [...SOMATIC_CASES, ...VOLUME_2_CASES.filter(c => c.module_id === "mod-somatic"), ...VOLUME_3_CASES.filter(c => c.module_id === "mod-somatic"), ...VOLUME_4_CASES.filter(c => c.module_id === "mod-somatic"), ...VOLUME_5_CASES.filter(c => c.module_id === "mod-somatic"), ...VOLUME_6_CASES.filter(c => c.module_id === "mod-somatic"), ...VOLUME_7_CASES.filter(c => c.module_id === "mod-somatic")],
  },
  {
    id: "mod-trauma",
    title: "Trauma & Dissociation",
    order_index: 7,
    state: "draft",
    focus: "PTSD, dissociation, and late risk reveal",
    cases: [...TRAUMA_CASES, ...VOLUME_1_CASES.filter(c => c.module_id === "mod-trauma"), ...VOLUME_6_CASES.filter(c => c.module_id === "mod-trauma")],
  },
  {
    id: "mod-adolescent",
    title: "Child & Adolescent",
    order_index: 8,
    state: "draft",
    focus: "Adolescent depression, POCSO, family dynamics, engaging the young person directly",
    cases: [...ADOLESCENT_CASES, ...VOLUME_2_CASES.filter(c => c.module_id === "mod-adolescent"), ...VOLUME_3_CASES.filter(c => c.module_id === "mod-adolescent"), ...VOLUME_4_CASES.filter(c => c.module_id === "mod-adolescent"), ...VOLUME_5_CASES.filter(c => c.module_id === "mod-adolescent"), ...VOLUME_7_CASES.filter(c => c.module_id === "mod-adolescent"), ...VOLUME_7B_CASES.filter(c => c.module_id === "mod-adolescent"), ...VOLUME_8_CASES.filter(c => c.module_id === "mod-adolescent")],
  },
  {
    id: "mod-ethics",
    title: "Ethics, Law & Scope",
    order_index: 9,
    state: "draft",
    focus: "MHA 2017, RCI scope, POCSO — the consequence-first dilemmas",
    cases: [...ETHICS_CASES, ...VOLUME_2_CASES.filter(c => c.module_id === "mod-ethics"), ...VOLUME_3_CASES.filter(c => c.module_id === "mod-ethics"), ...VOLUME_4_CASES.filter(c => c.module_id === "mod-ethics"), ...VOLUME_5_CASES.filter(c => c.module_id === "mod-ethics"), ...VOLUME_7_CASES.filter(c => c.module_id === "mod-ethics"), ...VOLUME_8_CASES.filter(c => c.module_id === "mod-ethics")],
  },
];

export function moduleById(id: string): PracticeModule | undefined {
  return MODULES.find((m) => m.id === id);
}
