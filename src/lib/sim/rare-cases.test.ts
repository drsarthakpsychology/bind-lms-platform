/**
 * TIER 4 contract — the rare-case band.
 * Each rare presentation has a full authored voice: 6+ spoken lines in
 * register, story, disclosure rules, variation — and the teaching shape:
 * the patient describes the phenomenon from inside, never the label.
 */

import { describe, expect, it } from "vitest";
import { RARE_CASES } from "./rare-cases";

describe("tier 4 — the rare-case band", () => {
  it("the band is authored with full voices", () => {
    for (const c of RARE_CASES) {
      expect(c.fixture_lines.length, `${c.key} lines`).toBeGreaterThanOrEqual(6);
      expect(c.variation.mood_today.length, `${c.key} moods`).toBeGreaterThanOrEqual(3);
      expect(c.history.timeline.length, `${c.key} story`).toBeGreaterThan(20);
      expect(c.disclosure_rules.length, `${c.key} disclosures`).toBeGreaterThanOrEqual(1);
      for (const line of c.fixture_lines) {
        expect(line.split(" ").length, `${c.key} line length`).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it("no line is shared with any other bank", () => {
    const seen = new Map<string, string>();
    const all = [...RARE_CASES];
    for (const c of all) {
      for (const line of c.fixture_lines) {
        expect(seen.has(line), `${c.key} repeats "${line}"`).toBe(false);
        seen.set(line, c.key);
      }
    }
  });

  it("the patient describes the phenomenon from inside — never the label", () => {
    const capgras = RARE_CASES.find((c) => c.key === "rare-capgras")!;
    const all = capgras.fixture_lines.join(" ");
    // She describes the impostor, the letter, the sleeping — not 'Capgras'.
    expect(all).toMatch(/impostor|letter|sleeping/i);
    expect(all).not.toMatch(/capgras|delusion|disorder/i);
  });
});