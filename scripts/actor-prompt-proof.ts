#!/usr/bin/env tsx
/**
 * AI-actor brief Phase 3 proof — "the Actor receives FULL case context every
 * turn". Renders a REAL Actor prompt from the fixture case + a drawn variant +
 * a sample Director decision, then asserts every context block the brief cares
 * about is present (identity, how-you-are-today, affect/resistance/belief,
 * unknowns, contradictions, this-turn move + permitted facts + must-not-mention,
 * recent conversation, voice rules, stage directions). Exits non-zero on any
 * missing block. The prompt is synthetic fixture data (Ravi) — safe to print.
 *
 *   npm run sim:actor-prompt-proof
 */
import { FIXTURE_CASE } from "../src/lib/sim/fixture-case";
import { initialState, type PatientState } from "../src/lib/sim/types";
import { drawVariant } from "../src/lib/sim/variation";
import { buildActorPrompt } from "../src/lib/sim/actor";
import type { DirectorDecision } from "../src/lib/sim/director";

const variant = drawVariant(
  FIXTURE_CASE.variation ?? {
    mood_today: ["flat"],
    recent_event: ["a long day"],
    most_defended_topic: ["the family"],
    opening_posture: ["came willingly"],
    somatic_focus: ["head"],
    trust_start: [3],
    language_mix: ["Hinglish"],
  },
  "fixture-ravi",
  0xbeef,
);

const state: PatientState = {
  ...initialState("fixture-ravi", variant),
  turn_count: 4,
  trust: 4,
  disclosed: [],
  topics_touched: ["sleep", "money"],
};

const decision: DirectorDecision = {
  student_move: "open_question",
  quality: { leading: false, double_barrelled: false, jargon: false },
  gates_now_met: [],
  state_delta: { trust: 1, guardedness: 0, irritation: 0, fatigue: 0 },
  patient_move: "reluctant_disclose",
  disclose: ["debt"],
  affect: "resigned",
  length_hint: "medium",
  must_not_mention: ["self_harm_history", "medication_plan"],
};

const prompt = buildActorPrompt({
  case_: FIXTURE_CASE,
  decision,
  state,
  recentTurns: [
    { role: "student", content: "How have you been sleeping lately?" },
    { role: "patient", content: "Not well. The shop keeps me up." },
  ],
});

// The blocks Phase 3 must verify are in the assembled prompt.
const REQUIRED: Array<[string, RegExp]> = [
  ["identity (name/age/occupation)", /You are Ravi, a 34-year-old male shopkeeper from Ahmedabad/],
  ["how-you-are-today (variant)", /# HOW YOU ARE TODAY/],
  ["mood", /Mood today:/],
  ["language register", /You speak:/],
  ["chief complaint (own words)", /heaviness in my chest/],
  ["recent event (variant)", /A recent thing that happened:/],
  ["defended topic (variant)", /most defended topic/],
  ["somatic focus (variant)", /Somatic focus:/],
  ["opening posture (variant)", /You came/],
  ["affect rules", /WHAT SETS YOU OFF/],
  ["irritation triggers (resistance)", /Things that make you irritated:/],
  ["core belief", /The belief underneath it all/],
  ["unknowns", /Things you genuinely do NOT know/],
  ["contradictions", /Ways you contradict yourself/],
  ["this-turn move", /THIS TURN, YOUR MOVE IS: reluctant_disclose/],
  ["permitted facts", /You may disclose these facts THIS turn/],
  ["must-not-mention", /Facts you MUST NOT mention: self_harm_history, medication_plan/],
  ["affect", /Your affect this turn: resigned/],
  ["length hint", /Length:/],
  ["recent conversation", /# THE RECENT CONVERSATION/],
  ["voice rules", /# VOICE RULES/],
  ["stage directions", /# STAGE DIRECTIONS/],
  ["prompt version", /prompt v\d+/],
];

let fail = 0;
console.log("── Actor prompt assembly (Phase 3 proof) ──\n");
console.log(prompt.slice(0, 1400));
console.log("…");
console.log("\n── context-block verification ──");
for (const [name, re] of REQUIRED) {
  const ok = re.test(prompt);
  if (!ok) fail++;
  console.log(`${ok ? "✓" : "✗"} ${name}`);
}
console.log(`\n${fail === 0 ? `ALL ${REQUIRED.length} context blocks present` : `${fail} MISSING`}`);
process.exit(fail === 0 ? 0 : 1);
