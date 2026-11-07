import { describe, expect, it } from "vitest";
import { makeRng } from "../common";
import { EXCERPTS } from "./excerpts";
import { acceptedDomains, segments, gradeExcerpt, gradeTag, nextLevel, nextStreak, optionsFor, pickExcerpt, pointsFor } from "./grade";
import { DOMAINS, TERMS } from "./terms";

describe("MSE Lab content", () => {
  it("has at least 30 excerpts across all three levels", () => {
    expect(EXCERPTS.length).toBeGreaterThanOrEqual(30);
    for (const l of [1, 2, 3]) expect(EXCERPTS.filter((e) => e.level === l).length).toBeGreaterThanOrEqual(8);
  });
  it("has unique ids, quotes that appear in the text, and valid terms", () => {
    const ids = new Set<string>();
    for (const e of EXCERPTS) {
      expect(ids.has(e.id)).toBe(false);
      ids.add(e.id);
      const text = [...e.lines.map((l) => l[1]), e.note].join("\n");
      for (const f of e.findings) {
        expect(text.includes(f.q), `${e.id}: "${f.q}"`).toBe(true);
        expect(TERMS[f.a]).toBeTruthy();
        expect(f.o.length).toBeGreaterThanOrEqual(3);
        for (const o of [...f.o, ...(f.close ?? [])]) expect(TERMS[o], `${e.id} ${o}`).toBeTruthy();
        for (const c of f.close ?? []) expect(f.o).toContain(c);
        expect(f.o).not.toContain(f.a);
        expect(f.why.length).toBeGreaterThan(20);
      }
    }
  });
  it("covers the fine distinctions", () => {
    const answers = new Set(EXCERPTS.flatMap((e) => e.findings.map((f) => f.a)));
    for (const t of ["tangential", "circumstantial", "foi", "loosening", "pseudo", "ah2", "overvalued", "illusion", "vh", "blunted", "flat", "incongruent", "embarrassed"]) expect(answers.has(t as never), t).toBe(true);
    for (const d of DOMAINS) expect(EXCERPTS.some((e) => e.findings.some((f) => acceptedDomains(f).includes(d.id))), d.id).toBe(true);
  });
});

describe("MSE Lab scoring", () => {
  const f = EXCERPTS.find((e) => e.id === "m13")!.findings[0]; // tangential, close: foi, circumstantial
  it("gives full, half and quarter credit", () => {
    expect(gradeTag(f, { domain: "form", term: "tangential" }).score).toBe(1);
    expect(gradeTag(f, { domain: "form", term: "loosening" }).score).toBe(0.5);
    expect(gradeTag(f, { domain: "form", term: "circumstantial" }).score).toBe(0.75);
    expect(gradeTag(f, { domain: "speech", term: "tangential" }).score).toBe(0.5);
    expect(gradeTag(f, { domain: "speech", term: "foi" }).score).toBe(0.25);
    expect(gradeTag(f, { domain: null, term: null }).score).toBe(0);
  });
  it("averages an excerpt", () => {
    const e = EXCERPTS.find((x) => x.id === "m13")!;
    expect(gradeExcerpt(e, [{ domain: "form", term: "tangential" }, { domain: "speech", term: "normalspeech" }]).score).toBe(1);
    expect(gradeExcerpt(e, [{ domain: "form", term: "tangential" }]).score).toBe(0.5);
  });
  it("streak, points and level", () => {
    expect(nextStreak(3, gradeTag(f, { domain: "form", term: "tangential" }))).toBe(4);
    expect(nextStreak(3, gradeTag(f, { domain: "form", term: "foi" }))).toBe(0);
    expect(pointsFor(1, 0)).toBe(10);
    expect(pointsFor(1, 5)).toBe(15);
    expect(pointsFor(1, 50)).toBe(20);
    expect(nextLevel(1, [0.9, 0.85])).toBe(2);
    expect(nextLevel(3, [0.9, 1])).toBe(3);
    expect(nextLevel(2, [0.2, 0.4])).toBe(1);
    expect(nextLevel(2, [0.9])).toBe(2);
  });
  it("picks unseen excerpts and shuffles options with the answer included", () => {
    const rng = makeRng(7);
    const seen = new Set<string>();
    for (let i = 0; i < 12; i++) {
      const e = pickExcerpt(1, seen, rng)!;
      expect(seen.has(e.id)).toBe(false);
      seen.add(e.id);
    }
    const opts = optionsFor(f, rng);
    expect(opts).toContain("tangential");
    expect(new Set(opts).size).toBe(opts.length);
  });
});

describe("segments", () => {
  it("splits text around quotes without overlaps", () => {
    expect(segments("a big red dog", ["big", "red dog", "big red"])).toEqual([
      { text: "a ", idx: null },
      { text: "big", idx: 0 },
      { text: " ", idx: null },
      { text: "red dog", idx: 1 },
    ]);
    expect(segments("plain", ["zzz"])).toEqual([{ text: "plain", idx: null }]);
  });
  it("every finding quote is highlighted somewhere", () => {
    for (const e of EXCERPTS) {
      const qs = e.findings.map((f) => f.q);
      const found = new Set<number>();
      for (const t of [...e.lines.map((l) => l[1]), e.note]) for (const s of segments(t, qs)) if (s.idx !== null) found.add(s.idx);
      expect(found.size, e.id).toBe(qs.length);
    }
  });
});
