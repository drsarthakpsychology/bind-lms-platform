/**
 * Sim patient engine — core types (Part 2 of the depth brief).
 *
 * The v1 engine sent prose (gates as English sentences) + the whole case into
 * one static prompt, one model call. This rebuild splits that into:
 *   - a Director (decides what the patient DOES, structured JSON),
 *   - an Actor (writes what the patient SAYS, given the decision),
 *   - a PatientState that mutates every turn and is persisted,
 *   - gates as deterministic code, not prose.
 *
 * Everything here is authored data or pure logic — no prompt text.
 */

import type { SimCase as V1Case } from "@/lib/psychopharm/sim/types";

/** The 16-trap taxonomy (Part 3.1). Traps tag cases; students never see them. */
export const TRAPS = [
  "treatment_mismatch",
  "misattributed_diagnosis",
  "provenance_contradiction",
  "somatic_mask",
  "iatrogenic",
  "substance_induced",
  "medical_mimic",
  "informant_conflict",
  "cultural_idiom",
  "over_diagnosis",
  "under_diagnosis",
  "diagnostic_overshadowing",
  "secondary_gain",
  "late_risk_reveal",
  "adherence_fiction",
  "polypharmacy",
] as const;
export type TrapId = (typeof TRAPS)[number];

/** Controlled variation schema (Part 2.5). Each session draws a seed. */
export interface VariationSchema {
  mood_today: string[];
  recent_event: string[];
  most_defended_topic: string[];
  opening_posture: string[];
  somatic_focus: string[];
  trust_start: number[];
  language_mix: string[];
}

/** One drawn variant — frozen per session so a debrief is reproducible. */
export interface SessionVariant {
  mood_today: string;
  recent_event: string;
  most_defended_topic: string;
  opening_posture: string;
  somatic_focus: string;
  trust_start: number;
  language_mix: string;
}

/** A student's conversational move, classified by the Director. */
export type StudentMove =
  | "closed_question"
  | "open_question"
  | "reflection"
  | "validation"
  | "premature_advice"
  | "interruption"
  | "risk_probe"
  | "silence"
  | "confrontation"
  | "rapport_bid"
  | "off_topic";

/** A patient move the Director may choose (Part 2.3 — the 24-move set). */
export type PatientMoveId =
  | "full_disclose"
  | "partial_disclose"
  | "reluctant_disclose"
  | "deflect_to_somatic"
  | "deflect_to_other_person"
  | "minimise"
  | "intellectualise"
  | "tangent"
  | "question_back"
  | "test_the_clinician"
  | "silence"
  | "one_word"
  | "contradict_earlier"
  | "blame_family"
  | "blame_self"
  | "hollow_compliance"
  | "irritated_push_back"
  | "tearful_break"
  | "humour_as_shield"
  | "somatic_complaint_now"
  | "ask_about_cost"
  | "ask_about_confidentiality"
  | "mention_faith_healer"
  | "defer_to_accompanying_family";

export type Affect =
  | "flat"
  | "flat_with_effort"
  | "sad"
  | "anxious"
  | "irritated"
  | "brittle_cheerful"
  | "numb"
  | "agitated"
  | "resigned";

/** 0-10 scales. trust gates disclosure; guardedness gates volunteering. */
export interface PatientState {
  trust: number;
  guardedness: number;
  irritation: number;
  fatigue: number;
  mood_today: string;
  disclosed: string[]; // fact ids already given
  topics_touched: string[];
  gates_met: string[];
  phase: "opening" | "exploration" | "deepening" | "risk" | "closing";
  last_moves: string[]; // rolling window of PATIENT moves, anti-repetition
  student_moves: string[]; // rolling window of classified STUDENT moves, for move_used gates
  last_patient_utterances: string[]; // for the anti-repetition embedding check
  premature_advice_streak: number; // 3 consecutive → hollow_compliance
  hollow_compliance_engaged: boolean;
  /** consecutive low-effort student messages ("hey", "ok", "hmm") — code-enforced pressure. */
  student_abrupt_streak: number;
  variant: SessionVariant;
  turn_count: number;
  rapport_events: { turn: number; kind: string }[];
}

export function initialState(caseId: string, variant: SessionVariant): PatientState {
  return {
    trust: variant.trust_start,
    guardedness: 5,
    irritation: 0,
    fatigue: 0,
    mood_today: variant.mood_today,
    disclosed: [],
    topics_touched: [],
    gates_met: [],
    phase: "opening",
    last_moves: [],
    student_moves: [],
    last_patient_utterances: [],
    premature_advice_streak: 0,
    hollow_compliance_engaged: false,
    student_abrupt_streak: 0,
    variant,
    turn_count: 0,
    rapport_events: [],
  };
}

/**
 * The Director's decision (Part 2.1). The Actor receives the chosen
 * patient_move + exact permitted facts + affect + length_hint, and writes
 * dialogue ONLY.
 */
export interface DirectorDecision {
  student_move: StudentMove;
  quality: {
    leading: boolean;
    double_barrelled: boolean;
    jargon: boolean;
  };
  gates_now_met: string[];
  state_delta: {
    trust: number;
    guardedness: number;
    irritation: number;
    fatigue: number;
  };
  patient_move: PatientMoveId;
  disclose: string[]; // exact fact ids permitted THIS turn, or []
  affect: Affect;
  length_hint: "one_word" | "short" | "medium" | "long";
  must_not_mention: string[]; // fact ids still gated
}

/** A scripted fallback rendering of a move — the never-silent guarantee. */
export interface MoveRendering {
  move: PatientMoveId;
  /** register-specific exemplar. e.g. "mostly English", "Hinglish". */
  register: string;
  lines: string[]; // pick one, in order, to avoid self-repetition
}

/**
 * A case in the v4 engine: the v1 clinical model PLUS the depth additions.
 * Not every case has all fields yet — the build fills them in.
 */
export interface DepthCase extends V1Case {
  case_id: string;
  traps: TrapId[];
  variation: VariationSchema;
  moves: Partial<Record<PatientMoveId, MoveRendering>>;
  /** The module (condition/section) this case belongs to. */
  module_id?: string;
  /** The patient's opening line is an idiom from the bank, never a clean symptom. */
  opening_idiom?: string;
  /** Distinct-voice key for module organisation: register@city. */
  voice_key?: string;
  /** Authoring bookkeeping (compat with the V1 traps field if renamed later). */
  traps_authored?: TrapId[];
}
