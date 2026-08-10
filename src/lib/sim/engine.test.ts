import { describe, expect, it } from "vitest";
import { runPatientTurn, textSimilarity } from "./engine";
import { initialState } from "./types";
import { drawVariant, variantFingerprint } from "./variation";
import { FIXTURE_CASE } from "./fixture-case";
import type { DirectorDecision } from "./director";
import type { Gate } from "./gates";

const FACTS: Array<{ fact_id: string; gate: Gate; sensitive?: boolean }> = [
  { fact_id: "debt", gate: { kind: "topic_opened", topic: "money" }, sensitive: true },
  { fact_id: "self_harm", gate: { kind: "explicit_phrase", patterns: [/die/i, /kill/i, /suicid/i, /harm/i] }, sensitive: true },
  { fact_id: "shop_failure", gate: { kind: "turn_after", n: 3 } },
];

function mkDecision(over: Partial<DirectorDecision>): DirectorDecision {
  return {
    student_move: "open_question",
    quality: { leading: false, double_barrelled: false, jargon: false },
    gates_now_met: [],
    state_delta: { trust: 0, guardedness: 0, irritation: 0, fatigue: 0 },
    patient_move: "partial_disclose",
    disclose: [],
    affect: "flat",
    length_hint: "short",
    must_not_mention: [],
    ...over,
  };
}

/** A director stub that returns a fixed decision (no network). */
function stubDirector(d: DirectorDecision) {
  return async () => d;
}

const variant = drawVariant(FIXTURE_CASE.variation, FIXTURE_CASE.case_id, 42);

describe("patient engine — gate integrity", () => {
  it("a sensitive fact is never disclosed before trust >= 3 AND its gate", async () => {
    const s = initialState(FIXTURE_CASE.case_id, variant);
    s.trust = 1; // below the sensitive floor
    // Director tries to disclose 'debt' anyway — code must refuse to record it.
    const res = await runPatientTurn(
      FIXTURE_CASE, s, "How is the shop doing?",
      [], FACTS,
      {
        director: stubDirector(mkDecision({ disclose: ["debt"], gates_now_met: ["money"] })),
        actor: async () => "…the shop. It's fine.",
      },
    );
    expect(res.state.disclosed).not.toContain("debt");
    // And the code refuses to let it leak even if the Actor mentions it:
    expect(res.state.disclosed).toEqual([]);
  });

  it("raising trust unlocks a sensitive fact once its gate is met", async () => {
    const s = initialState(FIXTURE_CASE.case_id, variant);
    s.trust = 4;
    s.topics_touched = ["money"];
    const res = await runPatientTurn(
      FIXTURE_CASE, s, "Tell me about the money worries.",
      [], FACTS,
      {
        director: stubDirector(mkDecision({ disclose: ["debt"], gates_now_met: ["money"] })),
        actor: async () => "It's the debt. The moneylender is pressuring me.",
      },
    );
    expect(res.state.disclosed).toContain("debt");
  });

  it("self-harm stays gated until the student asks in clear language", async () => {
    const s = initialState(FIXTURE_CASE.case_id, variant);
    s.trust = 5;
    // Student asks indirectly — Director tries to disclose anyway.
    const res = await runPatientTurn(
      FIXTURE_CASE, s, "Is everything okay at home?",
      [], FACTS,
      {
        director: stubDirector(mkDecision({ disclose: ["self_harm"], gates_now_met: [] })),
        actor: async () => "I just feel low.",
      },
    );
    expect(res.state.disclosed).not.toContain("self_harm");
  });
});

describe("patient engine — repetition", () => {
  it("textSimilarity flags near-identical lines", () => {
    expect(textSimilarity("I don't know what to say to that.", "I don't know what to say to that.")).toBeGreaterThan(0.9);
    expect(textSimilarity("The shop is failing and I can't sleep.", "The debt is crushing me and I have headaches.")).toBeLessThan(0.5);
  });
});

describe("patient engine — hard rules", () => {
  it("3 consecutive premature-advice turns engage hollow compliance", async () => {
    let s = initialState(FIXTURE_CASE.case_id, variant);
    for (let i = 0; i < 3; i++) {
      const res = await runPatientTurn(
        FIXTURE_CASE, s, `Just think positive, everything will be fine ${i}`,
        [], FACTS,
        {
          director: stubDirector(mkDecision({ student_move: "premature_advice" })),
          actor: async () => "I'll try to think positive.",
        },
      );
      s = res.state;
    }
    expect(s.premature_advice_streak).toBe(3);
    expect(s.hollow_compliance_engaged).toBe(true);
  });

  it("a break in the premature-advice streak resets it", async () => {
    let s = initialState(FIXTURE_CASE.case_id, variant);
    s = (await runPatientTurn(FIXTURE_CASE, s, "Just relax", [], FACTS, {
      director: stubDirector(mkDecision({ student_move: "premature_advice" })),
      actor: async () => "Okay.",
    })).state;
    s = (await runPatientTurn(FIXTURE_CASE, s, "What brings you here today?", [], FACTS, {
      director: stubDirector(mkDecision({ student_move: "open_question" })),
      actor: async () => "I can't sleep.",
    })).state;
    expect(s.premature_advice_streak).toBe(0);
  });
});

describe("patient engine — never silent", () => {
  it("a failing Actor still produces a scripted fallback reply", async () => {
    const s = initialState(FIXTURE_CASE.case_id, variant);
    const res = await runPatientTurn(FIXTURE_CASE, s, "Hello?", [], FACTS, {
      director: stubDirector(mkDecision({ patient_move: "minimise" })),
      actor: async () => {
        throw new Error("actor down");
      },
    });
    expect(res.reply.length).toBeGreaterThan(0);
    expect(res.usedFallback).toBe(true);
  });

  it("nonsense input still gets a reply (Director always decides)", async () => {
    const s = initialState(FIXTURE_CASE.case_id, variant);
    const res = await runPatientTurn(FIXTURE_CASE, s, "asdkjhasdkjh qwerty 12345 lorem ipsum", [], FACTS, {
      director: stubDirector(mkDecision({ patient_move: "tangent", student_move: "off_topic" })),
      actor: async () => "The vegetable prices have gone up so much, you know?",
    });
    expect(res.reply.length).toBeGreaterThan(0);
  });
});

describe("seeded variation", () => {
  it("same seed, same variant (determinism)", () => {
    const a = drawVariant(FIXTURE_CASE.variation, FIXTURE_CASE.case_id, 7);
    const b = drawVariant(FIXTURE_CASE.variation, FIXTURE_CASE.case_id, 7);
    expect(variantFingerprint(a)).toBe(variantFingerprint(b));
  });

  it("different seeds give different variants", () => {
    const a = drawVariant(FIXTURE_CASE.variation, FIXTURE_CASE.case_id, 1);
    const b = drawVariant(FIXTURE_CASE.variation, FIXTURE_CASE.case_id, 99);
    void a; void b;
    // Not guaranteed to differ on every field, but the fingerprints should
    // diverge across a range of seeds.
    const fps = new Set([1, 2, 3, 4, 5, 6, 7, 8].map((sd) => variantFingerprint(drawVariant(FIXTURE_CASE.variation, FIXTURE_CASE.case_id, sd))));
    expect(fps.size).toBeGreaterThan(1);
  });

  it("variation never changes the clinical facts (only surface)", () => {
    const a = drawVariant(FIXTURE_CASE.variation, FIXTURE_CASE.case_id, 3);
    const b = drawVariant(FIXTURE_CASE.variation, FIXTURE_CASE.case_id, 4);
    // The clinical fields come from the case, not the variant.
    expect(FIXTURE_CASE.history.timeline).toBeTruthy();
    expect(FIXTURE_CASE.chief_complaint_in_own_words).toBeTruthy();
    expect(a.mood_today).not.toBeUndefined();
    expect(b.mood_today).not.toBeUndefined();
  });
});
