import { describe, expect, it } from "vitest";
import { ALL_CONCEPTS, conceptById, DOMAINS } from "./concepts";
import { buildSession, distractors, domainMastery, formatFor, recordAnswer, reasonFor, similarConcepts, topConfusions, typedMatches, updateStat } from "./adaptive";

const today = "2026-11-02";
const rng = () => 0.42;
const empty = { concepts: {}, confusions: {} };

describe("concept bank", () => {
  it("is large, unique and well formed", () => {
    expect(ALL_CONCEPTS.length).toBeGreaterThan(200);
    const ids = ALL_CONCEPTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    const terms = ALL_CONCEPTS.map((c) => c.term.toLowerCase());
    expect(new Set(terms).size).toBe(terms.length);
    for (const c of ALL_CONCEPTS) {
      expect(c.student.length, c.id).toBeGreaterThan(10);
      expect(c.clinician.length, c.id).toBeGreaterThan(10);
      expect(c.tags.length, c.id).toBeGreaterThan(0);
      expect(/stahl|kaplan|sadock|ahuja|page \d/i.test(c.student + c.clinician), c.id).toBe(false);
    }
    for (const d of DOMAINS) expect(ALL_CONCEPTS.filter((c) => c.domain === d.id).length, d.id).toBeGreaterThanOrEqual(10);
  });
});

describe("adaptive engine", () => {
  it("climbs on right answers and re-teaches on wrong ones", () => {
    let s = updateStat(undefined, true, today);
    expect(s.lvl).toBe(1);
    expect(s.teach).toBe(false);
    s = updateStat(s, false, today, "avolition");
    expect(s.lvl).toBe(0);
    expect(s.teach).toBe(true);
    expect(s.due).toBe(today);
    expect(s.miss).toEqual(["avolition"]);
  });

  it("escalates the question format with mastery", () => {
    expect(formatFor(0, rng)).toBe("pick-term");
    expect(formatFor(2, rng)).toBe("pick-meaning");
    expect(formatFor(3, rng)).toBe("tf");
    expect(formatFor(4, rng)).toBe("type");
  });

  it("remembers confusions and uses them as distractors", () => {
    const d = recordAnswer(empty, "anhedonia", false, today, "avolition");
    expect(topConfusions(d)[0].times).toBe(1);
    const ds = distractors(conceptById("anhedonia")!, d, 3, rng);
    expect(ds[0].id).toBe("avolition");
    expect(ds.every((x) => x.id !== "anhedonia")).toBe(true);
  });

  it("builds sessions: a new concept first, the missed one back in the session, similar new concepts", () => {
    const d = recordAnswer(empty, "anhedonia", false, today, "avolition");
    const s = buildSession(d, "psychopathology", today, rng, 8);
    expect(s[0]).not.toBe("anhedonia");
    expect(s).toContain("anhedonia");
    expect(buildSession(d, "psychopathology", today, () => 0.1, 8)[0]).not.toBe(buildSession(d, "psychopathology", today, () => 0.9, 8)[0]);
    expect(s).toHaveLength(8);
    expect(new Set(s).size).toBe(8);
    const similar = similarConcepts(conceptById("anhedonia")!).map((c) => c.id);
    expect(s.some((id) => similar.includes(id))).toBe(true);
    expect(reasonFor("anhedonia", d, today)).toMatch(/missed/);
  });

  it("measures mastery per domain", () => {
    let d = empty as ReturnType<typeof recordAnswer>;
    for (let i = 0; i < 5; i++) d = recordAnswer(d, "gaba", true, today);
    const m = domainMastery(d, "neuroscience");
    expect(m.mastered).toBe(1);
    expect(m.pct).toBeGreaterThan(0);
  });

  it("accepts small typos when typing a term", () => {
    expect(typedMatches("anhedonia", "Anhedonia")).toBe(true);
    expect(typedMatches("anhedona", "Anhedonia")).toBe(true);
    expect(typedMatches("loosening", "Loosening of associations")).toBe(true);
    expect(typedMatches("avolition", "Anhedonia")).toBe(false);
    expect(typedMatches("", "GABA")).toBe(false);
  });
});

import { CASES } from "./detective";
describe("detective cases", () => {
  it("every answer is a real concept with at least 3 same-family alternatives", () => {
    for (const c of CASES) {
      expect(conceptById(c.answer), c.answer).toBeTruthy();
      expect(CASES.filter((x) => x.family === c.family && x.answer !== c.answer).length).toBeGreaterThanOrEqual(3);
    }
    expect(new Set(CASES.map((c) => c.answer)).size).toBe(CASES.length);
  });
});
