/**
 * Sim case model — the structured clinical spec per patient (Part 6.1).
 * This is authored DATA, not prompt text. A case is a JSONB object with a
 * fixed shape so the router, scorer, and voice layer all read the same fields.
 */

export type SimDifficulty = "cooperative" | "guarded" | "resistant" | "crisis";

export type DisclosureGate =
  | "asked_open_about_marriage"
  | "two_or_more_reflective_statements"
  | "asked_about_self_harm_clearly"
  | "validation_given"
  | "asked_open_about_family";

export interface SimCaseIdentity {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  occupation: string;
  city: string;
  family_structure: string;
  language_register: string;
}

export interface SimCaseHistory {
  timeline: string;
  prior_episodes?: string;
  substance_use?: string;
  medical?: string;
  family?: string;
  treatment_history?: string;
  help_seeking_delay?: string; // NMHS-realistic delay, e.g. "2 years"
  prior_contacts?: string[]; // e.g. ["GP tonic", "faith healer", "family remedy"]
}

export interface SimCaseCognitiveModel {
  core_belief: string;
  intermediate_beliefs: string[];
  coping: string[];
}

export interface SimDisclosureRule {
  fact: string;
  gate: DisclosureGate;
}

export interface SimResistance {
  deflections: string[];
  topic_changes: string[];
  irritation_triggers: string[];
  silence_tolerance_seconds: number;
}

export interface SimAffectRules {
  on_interruption: string;
  on_premature_advice: string;
  on_validation: string;
  tts_rate: number; // 0.6–1.4
  tts_pitch: number; // 0.6–1.4
}

export interface SimRedFlag {
  content: string;
  gate: DisclosureGate;
}

export interface SimContextPack {
  family_in_room: boolean;
  stigma: string[];
  cost_concerns: boolean;
  legal_relevance: string[]; // e.g. ["MHA 2017", "POCSO"]
}

export interface SimFewShotExchange {
  student: string;
  patient: string;
}

import type { TrapId } from "@/lib/sim/types";

export interface SimCase {
  title: string;
  difficulty: SimDifficulty;
  identity: SimCaseIdentity;
  presentation: string; // clinician summary
  chief_complaint_in_own_words: string;
  /** The patient's opening line is an idiom from the bank, never a clean symptom. */
  opening_idiom?: string;
  /** Clinical traps mapped to this case (v5 Part 5.1). */
  traps?: TrapId[];
  history: SimCaseHistory;
  cognitive_model: SimCaseCognitiveModel;
  disclosure_rules: SimDisclosureRule[];
  resistance: SimResistance;
  affect_rules: SimAffectRules;
  red_flags: SimRedFlag[];
  context_pack: SimContextPack;
  style_refs: string[];
  rubric_targets: string[];
  few_shot: SimFewShotExchange[];
}

/** The minimal state a running session tracks. */
export interface SimSessionState {
  turn_count: number;
  unlocked_disclosures: string[];
  reflective_statements: number;
  open_questions_asked: number;
  premature_reassurance_count: number;
  time_elapsed_seconds: number;
}
