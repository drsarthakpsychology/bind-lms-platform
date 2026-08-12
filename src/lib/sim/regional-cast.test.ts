/**
 * TIER 3 contract — the regional full-cast.
 * 5 pilot states × 6+ authored characters = 30 voices, each with the full
 * authored contract (6+ spoken lines, variation, disclosure rules), and
 * each voice unique across the whole bank.
 */

import { describe, expect, it } from "vitest";
import { REGIONAL_CAST } from "./regional-cast";
import { CHARACTER_SKELETONS } from "./characters";

const PILOT_STATES = new Set(["mh", "ts", "ka", "tn", "up"]);

describe("tier 3 — regional full-cast", () => {
  it("6+ authored characters per pilot state (5 states = 30)", () => {
    const byState = new Map<string, number>();
    for (const c of REGIONAL_CAST) {
      const state = c.key.split("-")[0];
      expect(PILOT_STATES.has(state), `unknown state prefix ${state}`).toBe(true);
      byState.set(state, (byState.get(state) ?? 0) + 1);
    }
    expect(byState.size).toBe(5);
    for (const [state, n] of byState) {
      expect(n, `${state} needs 6+ characters`).toBeGreaterThanOrEqual(6);
    }
  });

  it("every character has the full authored voice contract", () => {
    for (const c of REGIONAL_CAST) {
      expect(c.fixture_lines.length, `${c.key} lines`).toBeGreaterThanOrEqual(6);
      expect(c.variation.mood_today.length, `${c.key} moods`).toBeGreaterThanOrEqual(3);
      expect(c.history.timeline.length, `${c.key} story`).toBeGreaterThan(20);
      expect(c.disclosure_rules.length, `${c.key} disclosures`).toBeGreaterThanOrEqual(1);
      for (const line of c.fixture_lines) {
        expect(line.split(" ").length, `${c.key} line length`).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it("no line is shared with the tier-2 bank or within the cast", () => {
    const seen = new Map<string, string>();
    const all = [...REGIONAL_CAST, ...CHARACTER_SKELETONS];
    for (const c of all) {
      for (const line of c.fixture_lines) {
        expect(seen.has(line), `${c.key} repeats "${line}"`).toBe(false);
        seen.set(line, c.key);
      }
    }
  });
});