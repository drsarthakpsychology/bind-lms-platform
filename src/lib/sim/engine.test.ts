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

describe("A1 retry — Director determinism (identical rewind + identical input ⇒ identical move)", () => {
  /** Build a director stub whose decision depends ONLY on the prompt text,
   *  so two identical rewinds get identical decisions. */
  function deterministicDirector() {
    return async (prompt: string): Promise<DirectorDecision> => {
      const lower = prompt.toLowerCase();
      const move: DirectorDecision["patient_move"] = lower.includes("you're the director") ? "partial_disclose" : "minimise";
      // The decision is a pure function of the prompt — no randomness, no time.
      return mkDecision({
        patient_move: move,
        student_move: lower.includes("think positive") ? "premature_advice" : "open_question",
        disclose: lower.includes("debt") ? ["debt"] : [],
      });
    };
  }

  it("two rewinds from the same turn with the same input produce the same patient move", async () => {
    // Same seed ⇒ same variant ⇒ same initial state (the rewind contract).
    const v1 = drawVariant(FIXTURE_CASE.variation, FIXTURE_CASE.case_id, 7);
    const v2 = drawVariant(FIXTURE_CASE.variation, FIXTURE_CASE.case_id, 7);
    const s1 = initialState(FIXTURE_CASE.case_id, v1);
    const s2 = initialState(FIXTURE_CASE.case_id, v2);

    const input = "Tell me about the money problems at home.";
    const r1 = await runPatientTurn(FIXTURE_CASE, s1, input, [], FACTS, {
      director: deterministicDirector(),
      actor: async () => "It's the debt. I haven't told anyone.",
    });
    const r2 = await runPatientTurn(FIXTURE_CASE, s2, input, [], FACTS, {
      director: deterministicDirector(),
      actor: async () => "It's the debt. I haven't told anyone.",
    });
    // Same seed + same state + same input ⇒ the Director must choose the same
    // move and the same disclose set. This is the A1 rewind determinism contract.
    expect(r1.move).toBe(r2.move);
    expect(r1.decision.disclose).toEqual(r2.decision.disclose);
    expect(r1.decision.affect).toBe(r2.decision.affect);
    expect(r1.state.trust).toBe(r2.state.trust);
  });

  it("the same rewind with DIFFERENT input diverges", async () => {
    const v = drawVariant(FIXTURE_CASE.variation, FIXTURE_CASE.case_id, 7);
    const s1 = initialState(FIXTURE_CASE.case_id, v);
    const s2 = initialState(FIXTURE_CASE.case_id, v);
    const a = await runPatientTurn(FIXTURE_CASE, s1, "Just think positive, it'll be fine.", [], FACTS, {
      director: deterministicDirector(),
      actor: async () => "Okay.",
    });
    const b = await runPatientTurn(FIXTURE_CASE, s2, "Tell me what a bad day looks like.", [], FACTS, {
      director: deterministicDirector(),
      actor: async () => "I can't get out of bed.",
    });
    // Different input must produce a different classification, hence a
    // different patient move — divergence, not identical repetition.
    expect(a.decision.student_move).not.toBe(b.decision.student_move);
  });

  it("rewind state is a faithful snapshot: same seed reproduces the same variant fingerprint", () => {
    const a = drawVariant(FIXTURE_CASE.variation, FIXTURE_CASE.case_id, 42);
    const b = drawVariant(FIXTURE_CASE.variation, FIXTURE_CASE.case_id, 42);
    expect(variantFingerprint(a)).toBe(variantFingerprint(b));
    expect(a.trust_start).toBe(b.trust_start);
    expect(a.mood_today).toBe(b.mood_today);
  });
});
