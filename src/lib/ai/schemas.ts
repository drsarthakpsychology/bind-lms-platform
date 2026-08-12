/**
 * Zod schemas for every structured AI output. Parse everything, render only
 * validated output. One repair-prompt retry on failure, never render
 * unvalidated output.
 */

import { z } from "zod";

/** Debrief scoring output — the product. Schema-validated, deterministic. */
export const debriefSchema = z.object({
  score: z.number().min(0).max(5),
  open_closed_ratio: z.number().min(0).max(5),
  leading_questions: z.number().int().min(0),
  double_barrelled: z.number().int().min(0),
  reflective_statements: z.number().int().min(0),
  premature_reassurance: z.number().int().min(0),
  domain_coverage: z.number().min(0).max(1),
  risk_timing: z.enum(["early", "appropriate", "late", "absent"]),
  disclosure_unlock_rate: z.number().min(0).max(1),
  /** v5 Part 1: did the student ever ask what the opening idiom meant? */
  idiom_decoding: z.boolean().default(false),
  /** Phase 1 §4.2: did the student ask WHY TODAY — the most under-used
   *  question in clinical teaching. Named miss when absent. */
  asked_why_today: z.boolean().default(false),
  quotes: z.array(
    z.object({
      quote: z.string(),
      better: z.string(),
    }),
  ).min(3).max(5),
  missed_disclosures: z.array(z.string()),
});
export type DebriefResult = z.infer<typeof debriefSchema>;

/** A single simulated-patient turn. */
export const patientTurnSchema = z.object({
  reply: z.string().min(1).max(2000),
  // A disclosure the patient chose to reveal, if any
  disclosed: z.string().optional(),
  // Whether the patient would end the session here
  is_terminal: z.boolean().default(false),
});
export type PatientTurnResult = z.infer<typeof patientTurnSchema>;

/** Corpus classification of a scraped document. */
export const corpusClassifySchema = z.object({
  disorders: z.array(z.string()),
  presentation: z.string(),
  demographic: z.object({
    age_band: z.string().optional(),
    gender: z.string().optional(),
    setting: z.string().optional(),
  }).optional(),
  confidence: z.number().min(0).max(1),
});

/** A drafted sim_case scaffold from corpus material (approved: false). */
export const caseDraftSchema = z.object({
  identity: z.object({
    name: z.string(),
    age: z.number(),
    gender: z.enum(["male", "female", "other"]),
    occupation: z.string(),
    city: z.string(),
    family_structure: z.string(),
    language_register: z.string(),
  }),
  presentation: z.string(),
  chief_complaint_in_own_words: z.string(),
  history: z.object({
    timeline: z.string(),
    prior_episodes: z.string().optional(),
    substance_use: z.string().optional(),
    medical: z.string().optional(),
    family: z.string().optional(),
    treatment_history: z.string().optional(),
  }),
  cognitive_model: z.object({
    core_belief: z.string(),
    intermediate_beliefs: z.array(z.string()),
    coping: z.array(z.string()),
  }),
  red_flags: z.array(z.string()),
  context_pack: z.object({
    family_in_room: z.boolean(),
    stigma: z.array(z.string()),
    cost_concerns: z.boolean(),
    legal_relevance: z.array(z.string()),
  }),
  difficulty: z.enum(["cooperative", "guarded", "resistant", "crisis"]),
});
