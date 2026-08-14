import { describe, expect, it } from "vitest";
import { buildActorPrompt } from "./actor";
import { FIXTURE_CASE } from "./fixture-case";
import { initialState, type PatientState, type SessionVariant } from "./types";

const VARIANT: SessionVariant = {
  mood_today: "flat",
  recent_event: "a long day",
  most_defended_topic: "the money",
  opening_posture: "came willingly",
  somatic_focus: "chest",
  trust_start: 4,
  language_mix: "Hinglish",
};

const decision = {
  patient_move: "partial_disclose" as const,
  disclose: ["debt"],
  must_not_mention: ["self_harm_plan"],
  affect: "flat_with_effort" as const,
  length_hint: "short" as const,
  gates_now_met: [],
  state_delta: { trust: 1, guardedness: -1, irritation: 0, fatigue: 0 },
  quality: { leading: false, double_barrelled: false, jargon: false },
  student_move: "open_question" as const,
};

function state(): PatientState {
  return initialState(FIXTURE_CASE.case_id, VARIANT);
}

describe("buildActorPrompt — behavioural source material reaches the Actor (T116/T118)", () => {
  it("carries the affect rules and irritation triggers", () => {
    const prompt = buildActorPrompt({
      case_: FIXTURE_CASE,
      decision,
      state: state(),
      recentTurns: [],
    });
    expect(prompt).toMatch(/WHAT SETS YOU OFF/);
    expect(prompt).toMatch(/If someone talks over you/);
    expect(prompt).toMatch(/Being told to just think positively/);
  });

  it("carries the core belief so the patient stays consistent", () => {
    const prompt = buildActorPrompt({
      case_: FIXTURE_CASE,
      decision,
      state: state(),
      recentTurns: [],
    });
    expect(prompt).toMatch(/I am failing my family/);
  });

  it("still lists the permitted facts and the forbidden ones", () => {
    const prompt = buildActorPrompt({
      case_: FIXTURE_CASE,
      decision,
      state: state(),
      recentTurns: [],
    });
    expect(prompt).toMatch(/debt/);
    expect(prompt).toMatch(/self_harm_plan/);
  });
});
