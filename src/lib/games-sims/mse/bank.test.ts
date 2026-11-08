import { describe, expect, it } from "vitest";
import { EXCERPTS } from "./excerpts";
import { DOMAINS, TERMS } from "./terms";

const STUDENT = (e: (typeof EXCERPTS)[number]) => JSON.stringify([e.who, e.place, e.lines, e.note, e.findings, e.objective, e.topic]);
const EXAMS = ["cuet-pg", "ugc-net", "mcp-entrance", "md-psychiatry", "ma-semester"];

describe("MSE Lab library", () => {
  it("has at least 500 passages with unique ids", () => {
    expect(EXCERPTS.length).toBeGreaterThanOrEqual(500);
    expect(new Set(EXCERPTS.map((e) => e.id)).size).toBe(EXCERPTS.length);
  });
  it("tags every passage: topic, difficulty, objective, exams, study module", () => {
    for (const e of EXCERPTS) {
      expect(e.topic?.length, e.id).toBeGreaterThan(2);
      expect([1, 2, 3, 4, 5], e.id).toContain(e.difficulty);
      expect(e.objective?.length, e.id).toBeGreaterThan(8);
      expect(e.exams?.length, e.id).toBeGreaterThan(0);
      for (const x of e.exams ?? []) expect(EXAMS).toContain(x);
      expect(e.module, e.id).toMatch(/^[a-z-]+(\/\d+-\d+)?$/);
    }
  });
  it("spreads passages across all five rungs", () => {
    for (const d of [1, 2, 3, 4, 5]) expect(EXCERPTS.filter((e) => e.difficulty === d).length, `rung ${d}`).toBeGreaterThanOrEqual(EXCERPTS.length * 0.12);
  });
  it("covers every MSE domain many times", () => {
    for (const d of DOMAINS) {
      const n = EXCERPTS.flatMap((e) => e.findings).filter((f) => TERMS[f.a].domain === d.id).length;
      expect(n, d.id).toBeGreaterThanOrEqual(25);
    }
  });
  it("has no dashes and no citations in student text", () => {
    for (const e of EXCERPTS) {
      const t = STUDENT(e);
      expect(/[–—]/.test(t), e.id).toBe(false);
      expect(/et al\.|\(\d{4}\)|Kaplan|Sadock|Stahl|Maudsley|Fish's|Ahuja's|DSM-5-TR p/.test(t), e.id).toBe(false);
    }
  });
  it("every quote is in the passage and every option is a real term", () => {
    for (const e of EXCERPTS) {
      const text = [...e.lines.map((l) => l[1]), e.note].join("\n");
      for (const f of e.findings) {
        expect(text.includes(f.q), `${e.id}: ${f.q}`).toBe(true);
        expect(f.o).not.toContain(f.a);
        for (const o of f.o) expect(TERMS[o], `${e.id} ${o}`).toBeTruthy();
      }
    }
  });
  it("does not make the right word the longest or shortest option too often", () => {
    const fs = EXCERPTS.flatMap((e) => e.findings);
    const len = (t: string) => TERMS[t as keyof typeof TERMS].label.length;
    const longest = fs.filter((f) => len(f.a) > Math.max(...f.o.map(len))).length / fs.length;
    const shortest = fs.filter((f) => len(f.a) < Math.min(...f.o.map(len))).length / fs.length;
    expect(longest).toBeLessThan(0.36);
    expect(shortest).toBeLessThan(0.36);
  });
});
