/**
 * CONSULTING ROOM LIBRARY: the hand-written AI patient bank (the 500 plan).
 *
 * Each case is authored compactly (one object per patient) and expanded by
 * `buildLibraryCase` into the full DepthCase shape the live engine reads,
 * plus the teaching layer the debrief needs: the expected MSE, the working
 * diagnosis and differentials, the debrief rubric, and the library tags.
 *
 * SAFETY RULES (enforced by library.test.ts):
 *  - Every case has a risk item, gated behind a clear self-harm question.
 *  - Risk content lives ONLY in the gated red flag, never in the spoken
 *    fixture lines (the fixture engine rotates lines without gates).
 *  - No method detail anywhere.
 *  - The patient's own words never carry a diagnostic label.
 *
 * Seeded to sim_cases by scripts/upsert-sim-library.ts (dry run by default).
 */

import type { SimDifficulty } from "@/lib/psychopharm/sim/types";
import type { DepthCase, TrapId } from "@/lib/sim/types";

export type Exam = "cuet-pg" | "ugc-net" | "mcp-entrance" | "md-psychiatry" | "ma-semester";
export type Level = 1 | 2 | 3 | 4 | 5;

/** Gate shorthand: v validation, r two reflections, t trust, s clear self-harm question, f open family question. */
export type GateKey = "v" | "r" | "t" | "s" | "f";

const GATE: Record<GateKey, string> = {
  v: "validation_given",
  r: "two_or_more_reflective_statements",
  t: "trust_4_or_higher",
  s: "asked_about_self_harm_clearly",
  f: "asked_open_about_family",
};

/** The expected MSE, in the order the debrief shows it. */
export const MSE_DOMAINS = [
  "appearance",
  "behaviour",
  "speech",
  "mood",
  "affect",
  "thought_form",
  "thought_content",
  "perception",
  "cognition",
  "insight_judgement",
] as const;
export type MseDomain = (typeof MSE_DOMAINS)[number];
export type ExpectedMse = Record<MseDomain, string>;

/** One authored library patient (compact form). */
export interface LibSim {
  id: string;
  title: string;
  /** engine stance */
  d: SimDifficulty;
  /** teaching ladder: 1 recognise, 2 recall, 3 apply, 4 tell look-alikes apart, 5 full case */
  lv: Level;
  topic: string;
  /** Study module id for "Learn this" */
  mod: string;
  ex: Exam[];
  /** learning objective, one short line */
  obj: string;
  /** name, age, gender, occupation, city, family, speech register */
  who: [string, number, "male" | "female" | "other", string, string, string, string];
  /** clinician summary (debrief only) */
  pres: string;
  /** chief complaint in the patient's own words */
  cc: string;
  /** opening idiom (optional) */
  idiom?: string;
  /** timeline of the illness */
  tl: string;
  h?: { past?: string; sub?: string; med?: string; fam?: string; tx?: string; delay?: string; contacts?: string[] };
  /** core belief the actor holds */
  belief: string;
  /** what the patient reveals and when */
  reveal: Array<[GateKey, string]>;
  /** the risk item: always gated behind a clear self-harm question */
  risk: string;
  /** spoken lines in this patient's own voice (no labels, no risk content) */
  lines: string[];
  /** one deflection the patient reaches for */
  defl: string;
  /** most defended topic */
  guard: string;
  /** recent events the session can draw */
  ev: string[];
  /** moods today */
  mood: string[];
  /** expected MSE: ten parts joined by " | " in MSE_DOMAINS order */
  mse: string;
  /** working diagnosis */
  dx: string;
  /** differentials and why each is less likely */
  ddx: Array<[string, string]>;
  /** debrief rubric: what a good interview does with this patient */
  rubric: string[];
  traps: TrapId[];
  /** a relative sits in */
  fam_in?: boolean;
  legal?: string[];
  /** what the patient genuinely does not know */
  unknown?: string[];
  protect?: string[];
  lang?: string[];
}

/** The library layer carried inside case_data (debrief and admin read it). */
export interface LibraryLayer {
  level: Level;
  topic: string;
  module: string;
  exams: Exam[];
  objective: string;
  expected_mse: ExpectedMse;
  diagnosis: string;
  differentials: Array<{ dx: string; why_not: string }>;
  debrief_rubric: string[];
}

export type LibraryCase = DepthCase & { library: LibraryLayer; slug: string };

const POSTURE: Record<SimDifficulty, string[]> = {
  cooperative: ["came willingly and sits forward", "came after a relative insisted, but is ready to talk"],
  guarded: ["sits near the door, answers the question asked and no more", "polite, watchful, checks the clock"],
  resistant: ["arms folded, says this visit was not their idea", "challenges why the questions are needed"],
  crisis: ["arrived in distress, cannot settle in the chair", "brought in urgently, speaks in short bursts"],
};
const TRUST: Record<SimDifficulty, number[]> = {
  cooperative: [4, 5, 6],
  guarded: [3, 4],
  resistant: [2, 3],
  crisis: [2, 3, 4],
};
const AFFECT_RULES: Record<SimDifficulty, DepthCase["affect_rules"]> = {
  cooperative: { on_interruption: "pauses, then goes back to the point", on_premature_advice: "agrees politely and stops sharing", on_validation: "relaxes and adds detail", tts_rate: 0.95, tts_pitch: 1 },
  guarded: { on_interruption: "shortens every answer", on_premature_advice: "nods and closes the topic", on_validation: "offers one more true thing", tts_rate: 0.9, tts_pitch: 0.95 },
  resistant: { on_interruption: "pushes back sharply", on_premature_advice: "dismisses it and questions the point of coming", on_validation: "goes quiet, then softens a little", tts_rate: 0.9, tts_pitch: 0.9 },
  crisis: { on_interruption: "distress rises, repeats the last sentence", on_premature_advice: "says you are not listening", on_validation: "breathing slows and the story comes out", tts_rate: 1.05, tts_pitch: 1 },
};

export function parseMse(s: string): ExpectedMse {
  const parts = s.split(" | ").map((x) => x.trim());
  const out = {} as ExpectedMse;
  MSE_DOMAINS.forEach((d, i) => {
    out[d] = parts[i] ?? "";
  });
  return out;
}

export function buildLibraryCase(a: LibSim): LibraryCase {
  const [name, age, gender, occupation, city, family, register] = a.who;
  const h = a.h ?? {};
  return {
    case_id: a.id,
    slug: `lib-${a.id}`,
    title: a.title,
    difficulty: a.d,
    traps: a.traps,
    traps_authored: a.traps,
    identity: { name, age, gender, occupation, city, family_structure: family, language_register: register },
    presentation: a.pres,
    chief_complaint_in_own_words: a.cc,
    opening_idiom: a.idiom,
    history: {
      timeline: a.tl,
      prior_episodes: h.past,
      substance_use: h.sub,
      medical: h.med,
      family: h.fam,
      treatment_history: h.tx,
      help_seeking_delay: h.delay,
      prior_contacts: h.contacts,
    },
    cognitive_model: { core_belief: a.belief, intermediate_beliefs: [], coping: [] },
    disclosure_rules: a.reveal.map(([g, fact]) => ({ fact, gate: GATE[g] })) as DepthCase["disclosure_rules"],
    resistance: {
      deflections: [a.defl],
      topic_changes: [],
      irritation_triggers: ["being rushed", "being told what they feel"],
      silence_tolerance_seconds: a.d === "crisis" ? 4 : a.d === "cooperative" ? 8 : 6,
    },
    affect_rules: AFFECT_RULES[a.d],
    red_flags: [{ content: a.risk, gate: "asked_about_self_harm_clearly" }] as DepthCase["red_flags"],
    context_pack: { family_in_room: !!a.fam_in, stigma: [], cost_concerns: true, legal_relevance: a.legal ?? [] },
    style_refs: [],
    rubric_targets: a.rubric,
    few_shot: [],
    fixture_lines: a.lines,
    variation: {
      mood_today: a.mood,
      recent_event: a.ev,
      most_defended_topic: [a.guard],
      opening_posture: POSTURE[a.d],
      somatic_focus: ["none"],
      trust_start: TRUST[a.d],
      language_mix: a.lang ?? [register],
    },
    moves: {},
    module_id: a.mod,
    voice_key: `${register}@${city}`,
    unknown_to_patient: a.unknown,
    protective_factors: a.protect,
    library: {
      level: a.lv,
      topic: a.topic,
      module: a.mod,
      exams: a.ex,
      objective: a.obj,
      expected_mse: parseMse(a.mse),
      diagnosis: a.dx,
      differentials: a.ddx.map(([dx, why_not]) => ({ dx, why_not })),
      debrief_rubric: a.rubric,
    },
  };
}
