import { exams, type ExamSet, type Level } from "../tags";
import type { DuelItem } from "./items";

/**
 * Builder for the newer Duel rounds (du-033 on). Same shape as items.ts: four
 * diagnoses and four "what tells it apart" features, the first of each right.
 * `why` says why the right answer fits and why each other option doesn't.
 */
export function y(
  id: string,
  topic: string,
  level: Level,
  vignette: string,
  options: DuelItem["options"],
  features: DuelItem["features"],
  why: string,
  objective: string,
  ex: ExamSet,
  module?: string,
): DuelItem {
  return { id, topic, vignette, options, features, why, level, objective, exams: exams(ex), module: module ? (MODULE_OF[module] ?? module) : (MODULE_OF[topic] ?? topic) };
}

/** Study module per Duel topic. */
export const MODULE_OF: Record<string, string> = {
  depression: "depression",
  bipolar: "bipolar",
  anxiety: "anxiety",
  ocd: "ocd",
  trauma: "trauma",
  psychosis: "psychosis",
  substance: "substance",
  neurocognitive: "neurocognitive",
  eating: "more-disorders",
  sleep: "more-disorders",
  child: "child",
  personality: "personality",
  somatic: "more-disorders",
  dissociative: "more-disorders",
  sexual: "more-disorders",
  medication: "antipsychotics",
  "clinical-attention": "suicide",
};
