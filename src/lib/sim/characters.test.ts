/**
 * The 200-character pipeline contract: every authored character is a fully
 * voiced DepthCase — identity + story + their own lines — so the fixture
 * engine and the live Director/Actor both serve the SAME person.
 */

import { describe, expect, it } from "vitest";
import { CHARACTER_SKELETONS, DEMOGRAPHIES } from "./characters";

describe("character bank — the authored-voice contract", () => {
  it("every character has a name, story fields, and their OWN spoken lines", () => {
    for (const c of CHARACTER_SKELETONS) {
      expect(c.identity.name.length).toBeGreaterThan(0);
      expect(c.identity.occupation.length).toBeGreaterThan(0);
      expect(c.chief_complaint_in_own_words.length).toBeGreaterThan(10);
      expect(c.history.timeline.length).toBeGreaterThan(10);
      expect(c.fixture_lines.length).toBeGreaterThanOrEqual(6);
      expect(c.variation.mood_today.length).toBeGreaterThanOrEqual(3);
      expect(c.disclosure_rules.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("their spoken lines are in-character: no two characters share a line", () => {
    const seen = new Map<string, string>();
    for (const c of CHARACTER_SKELETONS) {
      for (const line of c.fixture_lines) {
        expect(seen.has(line), `${line} (${c.key}) must be unique`).toBe(false);
        seen.set(line, c.key);
      }
    }
  });

  it("the shop owner's voice is his own: throat + loan + father, never generic", () => {
    const shop = CHARACTER_SKELETONS.find((c) => c.key === "shop-owner")!;
    const all = shop.fixture_lines.join(" ");
    expect(all).toMatch(/throat|swallow/i);
    expect(all).toMatch(/loan|shop|business/i);
    expect(all).not.toMatch(/heaviness feels like a lot|getting up is hard/i);
  });

  it("the teacher is a no-disorder voice: preserved function, no diagnosis", () => {
    const teacher = CHARACTER_SKELETONS.find((c) => c.key === "teacher-worn")!;
    const all = teacher.fixture_lines.join(" ");
    expect(all).toMatch(/love my class|waking up|tired/i);
    // She never presents a diagnostic label or a medication claim — she
    // asks whether the tiredness is NORMAL (the no-disorder lesson).
    expect(all).not.toMatch(/i have depression|i'm bipolar|the doctor gave me/i);
    expect(teacher.red_flags.length).toBe(0);
  });

  it("Tier 2 = 15 archetypes, each with a full authored voice", () => {
    expect(CHARACTER_SKELETONS.length).toBe(15);
    const keys = new Set(CHARACTER_SKELETONS.map((c) => c.key));
    expect(keys.size).toBe(15);
    for (const c of CHARACTER_SKELETONS) {
      expect(c.fixture_lines.length, `${c.key} lines`).toBeGreaterThanOrEqual(6);
      expect(c.variation.mood_today.length, `${c.key} moods`).toBeGreaterThanOrEqual(3);
      expect(c.history.timeline.length, `${c.key} story`).toBeGreaterThan(20);
      expect(c.disclosure_rules.length, `${c.key} disclosures`).toBeGreaterThanOrEqual(1);
      // Every fixture line is a full spoken turn, never a word.
      for (const line of c.fixture_lines) {
        expect(line.split(" ").length, `${c.key} line length`).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it("every character's voice is theirs alone — no line shared across the bank", () => {
    const seen = new Map<string, string>();
    for (const c of CHARACTER_SKELETONS) {
      for (const line of c.fixture_lines) {
        expect(seen.has(line), `${c.key} repeats "${line}"`).toBe(false);
        seen.set(line, c.key);
      }
    }
  });

  it("the demography matrix builds 60 characters from 15 skeletons × 4 regions", () => {
    // The Tier-2 volume contract: each skeleton is instantiated across the
    // 4 demographic regions with placeholders filled — 15 × 4 = 60 voices.
    expect(DEMOGRAPHIES.length).toBe(4);
    const total = CHARACTER_SKELETONS.length * DEMOGRAPHIES.length;
    expect(total).toBe(60);
    // No two demographic identities may collide on name+city.
    const pairs = new Set<string>();
    for (const d of DEMOGRAPHIES) {
      for (const c of CHARACTER_SKELETONS) {
        pairs.add(`${c.identity.name}|${d.city}`);
      }
    }
    expect(pairs.size).toBe(60);
  });

  it("regional + class coverage spans the country, not one city", () => {
    const cities = new Set(DEMOGRAPHIES.map((d) => d.city));
    expect(cities.size).toBe(4);
    expect([...cities]).toEqual(expect.arrayContaining(["Kolhapur", "Lucknow", "Howrah", "Salem"]));
  });
});
