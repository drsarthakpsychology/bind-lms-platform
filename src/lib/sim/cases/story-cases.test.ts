/**
 * PHASE 1 STORY CASES — the contract the generator enforces, re-checked at
 * test time. Every case is a STORY: nine-beat spine, drama map, want ≠
 * need, contradictions with causes, ~90% of the iceberg gated, and the
 * patient's voice carries no diagnostic terms.
 */

import { describe, expect, it } from "vitest";
import { STORY_CASES } from "./story-cases";
import { CHARACTER_SKELETONS } from "@/lib/sim/characters";
import { REGIONAL_CAST } from "@/lib/sim/regional-cast";
import { RARE_CASES } from "@/lib/sim/rare-cases";

const STORY_BEATS = ["before", "the_turn", "the_slide", "the_cost", "why_today", "what_they_want", "if_nobody_helps"];

describe("phase 1 story cases — every case is a story", () => {
  it("all 8 cases have a full story spine + drama map + want/need split", () => {
    expect(STORY_CASES.length).toBe(8);
    for (const c of STORY_CASES) {
      // Story beats (the seven authored prose beats + attempts array).
      for (const beat of STORY_BEATS) {
        expect(c.story[beat as keyof typeof c.story]?.length, `${c.key}.${beat}`).toBeGreaterThan(20);
      }
      expect(c.story.attempts.length, `${c.key}.attempts`).toBeGreaterThanOrEqual(3);
      // Drama map.
      expect(c.drama.objective.length).toBeGreaterThan(5);
      expect(c.drama.obstacle.length).toBeGreaterThan(5);
      expect(c.drama.stakes.length).toBeGreaterThan(5);
      expect(c.drama.secret.length).toBeGreaterThan(5);
      // Want ≠ need — if they're the same, it isn't a teaching case.
      expect(c.want).not.toBe(c.need);
      // Contradictions with causes.
      expect(c.contradictions.length).toBeGreaterThanOrEqual(3);
      for (const x of c.contradictions) {
        expect(x.claim.length).toBeGreaterThan(5);
        expect(x.truth.length).toBeGreaterThan(5);
        expect(x.cause.length).toBeGreaterThan(5);
      }
      // The voice profile's most powerful field.
      expect(c.voice_profile.what_they_never_say.length).toBeGreaterThan(10);
      // The story's promise: the patient wants to be known.
      expect(c.fixture_lines.length).toBeGreaterThanOrEqual(6);
    }
  });

  it("the three difficulty tiers are covered (clear/blurred/holmes)", () => {
    const tiers = new Set(STORY_CASES.map((c) => c.difficulty));
    expect(tiers).toEqual(new Set(["clear", "blurred", "holmes"]));
  });

  it("the Holmes Lonazep case carries the 4-layered provenance contradiction", () => {
    const holmes = STORY_CASES.find((c) => c.key === "story-lonazep-provenance")!;
    expect(holmes.difficulty).toBe("holmes");
    const all = holmes.fixture_lines.join(" ");
    // Treatment/diagnosis mismatch: the file says the big word...
    expect(all).toMatch(/schizophrenia|madness/i);
    // ...but the psychiatrist was never seen (provenance contradiction).
    expect(all).toMatch(/never once sat with a psychiatrist|never went/i);
    // The patient's own words reach the reader — "what does the voice say".
    expect(all).toMatch(/no one has asked me what the voice says/);
    // The chemist is in the chain (iatrogenic + polypharmacy).
    expect(all).toMatch(/chemist/i);
  });

  it("no story-case spoken line collides with any existing bank", () => {
    const allBanks = [...CHARACTER_SKELETONS, ...REGIONAL_CAST, ...RARE_CASES];
    const existing = new Set(allBanks.flatMap((c) => c.fixture_lines));
    for (const c of STORY_CASES) {
      for (const line of c.fixture_lines) {
        expect(existing.has(line), `${c.key} collides with an existing bank`).toBe(false);
      }
    }
  });

  it("no patient sentence carries a diagnostic term", () => {
    const TERMS = /\b(schizophrenia|depression|bipolar|psychosis|ocd|anxiety disorder|ptsd|delusion|hallucination|diagnos)\b/i;
    for (const c of STORY_CASES) {
      for (const line of c.fixture_lines) {
        expect(line).not.toMatch(TERMS);
      }
    }
  });
});
