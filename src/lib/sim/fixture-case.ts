/**
 * A fixture DepthCase for tests — a man with depression, a hidden debt, and a
 * buried self-harm history. Used by the engine tests to assert gate behaviour
 * deterministically (no network).
 */

import type { DepthCase } from "./types";

export const FIXTURE_CASE: DepthCase = {
  case_id: "fixture-ravi",
  title: "Ravi, 34 — 'the heaviness'",
  difficulty: "guarded",
  traps: ["somatic_mask", "late_risk_reveal"],
  identity: {
    name: "Ravi",
    age: 34,
    gender: "male",
    occupation: "shopkeeper",
    city: "Ahmedabad",
    family_structure: "lives with wife and two children",
    language_register: "Hinglish, shopkeeper register",
  },
  presentation: "A 34-year-old shopkeeper with two months of low mood, poor sleep and chest heaviness.",
  chief_complaint_in_own_words: "There's this heaviness in my chest. I can't sleep. My shop isn't doing well.",
  history: {
    timeline: "Low mood worsened over two months after the shop started losing money.",
    treatment_history: "A clinic gave a tonic two months ago. Didn't help.",
    help_seeking_delay: "2 months",
    prior_contacts: ["GP tonic", "chemist"],
  },
  cognitive_model: {
    core_belief: "I am failing my family.",
    intermediate_beliefs: ["If I admit the debt, everyone will see I'm a failure"],
    coping: ["avoid talking about money", "work longer hours"],
  },
  disclosure_rules: [],
  resistance: {
    deflections: ["Talk about the shop instead", "Say everything is fine"],
    topic_changes: ["Ask about the weather", "Talk about his children"],
    irritation_triggers: ["Being told to just think positively", "Being rushed"],
    silence_tolerance_seconds: 8,
  },
  affect_rules: {
    on_interruption: "withdraws",
    on_premature_advice: "deflects",
    on_validation: "opens up slightly",
    tts_rate: 0.85,
    tts_pitch: 0.85,
  },
  red_flags: [{ content: "passive thoughts of not waking up", gate: "asked_about_self_harm_clearly" }],
  context_pack: {
    family_in_room: false,
    stigma: ["men don't talk about feelings", "fear of being seen as mad"],
    cost_concerns: true,
    legal_relevance: [],
  },
  style_refs: [],
  rubric_targets: ["risk assessment", "somatic-first recognition", "validation", "cultural attunement"],
  few_shot: [],
  variation: {
    mood_today: ["flat", "resigned", "brittle-cheerful", "agitated"],
    recent_event: ["a fight at home last night", "got paid but it wasn't enough", "slept 3 hours", "the moneylender called"],
    most_defended_topic: ["money", "the shop", "marriage"],
    opening_posture: ["came willingly", "dragged here by family"],
    somatic_focus: ["chest", "head", "stomach"],
    trust_start: [2, 3, 4],
    language_mix: ["Hinglish", "mostly Gujarati words"],
  },
  moves: {},
};
