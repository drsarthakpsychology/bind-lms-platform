import { describe, expect, it } from "vitest";
import { parseGate, permittedFacts } from "./gates";
import { initialState, type PatientState, type SessionVariant } from "./types";

const VARIANT: SessionVariant = {
  mood_today: "flat",
  recent_event: "a long day",
  most_defended_topic: "the family",
  opening_posture: "came willingly",
  somatic_focus: "head",
  trust_start: 5,
  language_mix: "Hinglish",
};

function state(overrides: Partial<PatientState> = {}): PatientState {
  return { ...initialState("case-1", VARIANT), ...overrides };
}

function ctx(text: string, move: PatientState["last_moves"][number] = "open_question") {
  return { move: move as "open_question", text, topics: [], quality: { leading: false, double_barrelled: false, jargon: false } };
}

describe("parseGate — authored disclosure gate strings → deterministic gates", () => {
  it("asked_about_self_harm_clearly → explicit_phrase that needs clear self-harm phrasing", () => {
    const gate = parseGate("asked_about_self_harm_clearly");
    expect(gate.kind).toBe("explicit_phrase");
    const s = state({ trust: 8, disclosed: [] });
    // A clear question unlocks the fact…
    expect(permittedFacts([{ fact_id: "f1", gate, sensitive: true }], s, ctx("have you ever thought about hurting yourself?"))).toContain("f1");
    // …but a neutral question does NOT — even at high trust.
    expect(permittedFacts([{ fact_id: "f1", gate, sensitive: true }], s, ctx("how was your week?"))).not.toContain("f1");
  });

  it("validation_given → move_used(validation, 1), counted from the student's own moves", () => {
    const gate = parseGate("validation_given");
    expect(gate.kind).toBe("move_used");
    const s = state({ trust: 8, student_moves: ["validation"] });
    expect(permittedFacts([{ fact_id: "f1", gate, sensitive: true }], s, ctx("that sounds really hard"))).toContain("f1");
    // Patient moves in last_moves must NOT count toward a student gate.
    const s2 = state({ trust: 8, student_moves: [], last_moves: ["validation"] });
    expect(permittedFacts([{ fact_id: "f1", gate, sensitive: true }], s2, ctx("hello"))).not.toContain("f1");
  });

  it("two_or_more_reflective_statements → move_used(reflection, 2)", () => {
    const gate = parseGate("two_or_more_reflective_statements");
    expect(gate.kind).toBe("move_used");
    const one = state({ trust: 8, student_moves: ["reflection"] });
    expect(permittedFacts([{ fact_id: "f1", gate, sensitive: true }], one, ctx("ok"))).not.toContain("f1");
    const two = state({ trust: 8, student_moves: ["reflection", "reflection"] });
    expect(permittedFacts([{ fact_id: "f1", gate, sensitive: true }], two, ctx("ok"))).toContain("f1");
  });

  it("unknown/empty gate → a conservative trust bar (never a catch-all)", () => {
    expect(parseGate(undefined)).toEqual({ kind: "trust_at_least", value: 4 });
    expect(parseGate("some_future_tag")).toEqual({ kind: "trust_at_least", value: 4 });
  });
});

describe("permittedFacts — trust and gate both apply", () => {
  it("a sensitive fact never opens below trust 3, whatever the gate says", () => {
    const s = state({ trust: 2, student_moves: ["validation"] });
    const rules = [{ fact_id: "f1", gate: parseGate("validation_given"), sensitive: true }];
    expect(permittedFacts(rules, s, ctx("that sounds hard"))).not.toContain("f1");
  });

  it("the same fact with a met gate DOES open at trust 5", () => {
    const s = state({ trust: 5, student_moves: ["validation"] });
    const rules = [{ fact_id: "f1", gate: parseGate("validation_given"), sensitive: true }];
    expect(permittedFacts(rules, s, ctx("that sounds hard"))).toContain("f1");
  });

  it("already-disclosed facts are never re-permitted", () => {
    const s = state({ trust: 8, disclosed: ["f1"], student_moves: ["validation"] });
    const rules = [{ fact_id: "f1", gate: parseGate("validation_given"), sensitive: true }];
    expect(permittedFacts(rules, s, ctx("that sounds hard"))).not.toContain("f1");
  });
});
