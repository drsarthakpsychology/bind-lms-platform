/**
 * Case builder — makes authoring many cases systematic (v5 Part 5).
 *
 * Each case = the clinical core (fixed facts, never invented) + a distinct
 * VOICE. The voice is what makes two patients with the same diagnosis feel
 * different: register, language mix, age, occupation, how they deflect, what
 * they defend, their opening idiom.
 *
 * A helper that fills the DepthCase shape from compact authored data, so
 * writing 60 cases is data-entry, not boilerplate.
 */

import type { SimDifficulty } from "@/lib/psychopharm/sim/types";
import type {
  DepthCase, TrapId, VariationSchema,
} from "./types";

export interface CaseAuthoring {
  id: string;
  title: string;
  difficulty: SimDifficulty;
  traps: TrapId[];
  moduleId: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  occupation: string;
  city: string;
  family: string;
  register: string; // "Hinglish, shopkeeper" / "college English" / "Hindi-dominant"
  presentation: string;
  chiefComplaint: string;
  timeline: string;
  treatmentHistory?: string;
  helpSeekingDelay?: string;
  priorContacts?: string[];
  coreBelief: string;
  intermediateBeliefs: string[];
  coping: string[];
  openingIdiom: string;
  redFlags: Array<{ content: string; gate: string }>;
  variation: VariationSchema;
}

export function buildCase(a: CaseAuthoring): DepthCase {
  return {
    case_id: a.id,
    title: a.title,
    difficulty: a.difficulty,
    traps: a.traps,
    identity: {
      name: a.name,
      age: a.age,
      gender: a.gender,
      occupation: a.occupation,
      city: a.city,
      family_structure: a.family,
      language_register: a.register,
    },
    presentation: a.presentation,
    chief_complaint_in_own_words: a.chiefComplaint,
    history: {
      timeline: a.timeline,
      treatment_history: a.treatmentHistory,
      help_seeking_delay: a.helpSeekingDelay,
      prior_contacts: a.priorContacts,
    },
    cognitive_model: {
      core_belief: a.coreBelief,
      intermediate_beliefs: a.intermediateBeliefs,
      coping: a.coping,
    },
    disclosure_rules: [],
    resistance: {
      deflections: [],
      topic_changes: [],
      irritation_triggers: ["being told to just think positive", "being rushed"],
      silence_tolerance_seconds: 8,
    },
    affect_rules: {
      on_interruption: "withdraws",
      on_premature_advice: "deflects",
      on_validation: "opens up slightly",
      tts_rate: 0.85,
      tts_pitch: 0.85,
    },
    red_flags: a.redFlags.map((r) => ({ content: r.content, gate: r.gate as never })),
    context_pack: {
      family_in_room: false,
      stigma: ["men don't talk about feelings"],
      cost_concerns: true,
      legal_relevance: [],
    },
    style_refs: [],
    rubric_targets: ["risk assessment", "validation", "cultural attunement"],
    few_shot: [],
    // Depth-case fields:
    traps_authored: a.traps,
    opening_idiom: a.openingIdiom,
    variation: a.variation,
    moves: {},
    // voice-identity for the module organisation
    module_id: a.moduleId,
    voice_key: `${a.register}@${a.city}`,
  } as DepthCase;
}
