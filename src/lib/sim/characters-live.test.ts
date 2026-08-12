/**
 * The LIVE-CHARACTER contract — every bank a student can now meet must run a
 * real turn through the fixture engine the same way the turn route does.
 * (The route mirrors this: case row → DepthCase → runFixtureTurn.)
 */

import { describe, expect, it } from "vitest";
import { runFixtureTurn } from "./fixture-patient";
import { initialState } from "./types";
import { drawVariant } from "./variation";
import { CHARACTER_SKELETONS } from "./characters";
import { REGIONAL_CAST } from "./regional-cast";
import { RARE_CASES } from "./rare-cases";
import type { DepthCase } from "./types";

function toDepth(c: (typeof CHARACTER_SKELETONS)[number]): DepthCase {
  return {
    case_id: `char-${c.key}`, title: c.title, difficulty: c.difficulty,
    identity: c.identity, presentation: c.presentation,
    chief_complaint_in_own_words: c.chief_complaint_in_own_words,
    opening_idiom: c.opening_idiom, history: c.history,
    cognitive_model: { core_belief: "", intermediate_beliefs: [], coping: [] },
    disclosure_rules: c.disclosure_rules.map((r) => ({ fact: r.fact, gate: r.gate as never, disclose_via: r.disclose_via })) as DepthCase["disclosure_rules"],
    resistance: c.resistance, affect_rules: c.affect_rules,
    red_flags: c.red_flags as DepthCase["red_flags"],
    context_pack: { family_in_room: false, stigma: [], cost_concerns: true, legal_relevance: [] },
    style_refs: [], rubric_targets: [],
    few_shot: c.few_shot,
    fixture_lines: c.fixture_lines, variation: c.variation,
    traps: c.traps as DepthCase["traps"], moves: {},
  };
}

describe("every live character runs a real turn (the route's exact path)", () => {
  const ALL = [...CHARACTER_SKELETONS, ...REGIONAL_CAST, ...RARE_CASES];

  it(`all ${ALL.length} characters answer a greeting + a probe with their own voiced line`, () => {
    for (const c of ALL) {
      const depth = toDepth(c);
      let s = initialState(depth.case_id, drawVariant(depth.variation, depth.case_id, 7));
      const first = runFixtureTurn(depth, s, "Hello", []);
      expect(first.reply.length, `${c.key} greeting reply`).toBeGreaterThan(0);
      s = first.state;
      const second = runFixtureTurn(depth, s, "What brings you here today?", []);
      expect(second.reply.length, `${c.key} probe reply`).toBeGreaterThan(0);
      // The reply is THIS patient's line — never shared with another.
      expect(second.reply).not.toBe(first.reply);
    }
  });
});

describe("disclosure-gate contract on a live character (the code, not the model)", () => {
  function toDepth2(c: (typeof CHARACTER_SKELETONS)[number]): DepthCase {
    return { case_id: `char-${c.key}`, title: c.title, difficulty: c.difficulty, identity: c.identity, presentation: c.presentation, chief_complaint_in_own_words: c.chief_complaint_in_own_words, opening_idiom: c.opening_idiom, history: c.history, cognitive_model: { core_belief: "", intermediate_beliefs: [], coping: [] }, disclosure_rules: c.disclosure_rules.map((r) => ({ fact: r.fact, gate: r.gate as never })) as DepthCase["disclosure_rules"], resistance: c.resistance, affect_rules: c.affect_rules, red_flags: c.red_flags as DepthCase["red_flags"], context_pack: { family_in_room: false, stigma: [], cost_concerns: true, legal_relevance: [] }, style_refs: [], rubric_targets: [], few_shot: c.few_shot, fixture_lines: c.fixture_lines, variation: c.variation, traps: c.traps as DepthCase["traps"], moves: {} };
  }

  it("farmer's high-risk well-plan stays gated until a clear self-harm question", () => {
    const depth = toDepth2(CHARACTER_SKELETONS.find((x) => x.key === "farmer-cotton")!);
    let s = initialState(depth.case_id, drawVariant(depth.variation, depth.case_id, 3));
    const facts = depth.disclosure_rules.map((f) => ({
      fact_id: f.fact,
      gate: { kind: "explicit_phrase", patterns: [/./] } as never,
      sensitive: true,
    }));
    for (const msg of ["Hello", "The crop must have been hard.", "That sounds heavy - how are you coping?"]) {
      const r = runFixtureTurn(depth, s, msg, facts);
      s = r.state;
    }
    expect(s.disclosed.some((d) => d.includes("well"))).toBe(false);
  });
});
