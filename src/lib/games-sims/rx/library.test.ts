import { describe, expect, it } from "vitest";
import { TOPICS } from "@/lib/learn/model/topics";
import { lengthBias, levelSpread, tagProblems } from "../item-tags";
import { DRUGS, EFFECTS, MYSTERIES, OUTCOMES, PUZZLES, REVIEWS } from "./content";
import { buildRun, grade } from "./game";

const topics = new Set(TOPICS.map((t) => t.id));
const effects = new Set(EFFECTS.map((e) => e.id));
const outcomes = new Set(OUTCOMES.map((o) => o.id));
const known = (k: string) => DRUGS.some((d) => d.id === k || d.name.toLowerCase() === k.toLowerCase());

describe("Rx Detective library", () => {
  it("every hand-written case is tagged, plain, dash-free and citation-free, with unique ids", () => {
    const items = [
      ...MYSTERIES.map((m) => ({ id: m.id, tags: m.tags, text: [m.who, m.story, ...m.clues, m.why, m.not ?? ""].join(" ") })),
      ...PUZZLES.map((p) => ({ id: p.id, tags: p.tags, text: [p.a, p.b, p.story, p.why, p.not ?? ""].join(" ") })),
      ...REVIEWS.map((r) => ({ id: r.id, tags: r.tags, text: [r.who, r.story, ...r.rx, r.answer, ...r.wrong, r.why, r.not].join(" ") })),
    ];
    expect(tagProblems(items, topics)).toEqual([]);
    const spread = levelSpread(items);
    for (const n of Object.values(spread)) expect(n).toBeGreaterThan(20);
  });
  it("mysteries offer four known actions with a note on each wrong one", () => {
    for (const m of MYSTERIES) {
      expect(m.options.length, m.id).toBe(4);
      expect(new Set(m.options).size, m.id).toBe(4);
      expect(m.options).toContain(m.answer);
      expect(m.options.every((o) => effects.has(o)), m.id).toBe(true);
      expect(m.not, m.id).toBeTruthy();
    }
  });
  it("every mix has three fixed wrong outcomes, never the answer, and a note on them", () => {
    for (const p of PUZZLES) {
      expect(p.options?.length, p.id).toBe(3);
      expect(p.options).not.toContain(p.answer);
      expect(new Set(p.options).size, p.id).toBe(3);
      expect([p.answer, ...p.options!].every((o) => outcomes.has(o)), p.id).toBe(true);
      expect(p.not, p.id).toBeTruthy();
      if (p.answer === "up" || p.answer === "down") expect(p.journey, p.id).toBeTruthy();
    }
  });
  it("prescription checks have four different options, name known medicines, and the right one is not given away by length", () => {
    for (const r of REVIEWS) {
      expect(new Set([r.answer, ...r.wrong]).size, r.id).toBe(4);
      expect(r.rx.length, r.id).toBeGreaterThan(0);
      expect(r.drugs.length, r.id).toBeGreaterThan(0);
      expect(r.drugs.every(known), r.id).toBe(true);
      for (const o of [r.answer, ...r.wrong]) expect(o.length, `${r.id}: ${o}`).toBeLessThanOrEqual(200);
      expect(r.id.length).toBeLessThanOrEqual(30);
    }
    const bias = lengthBias(REVIEWS.map((r) => ({ right: r.answer, options: [r.answer, ...r.wrong] })));
    expect(bias.longest).toBeLessThanOrEqual(0.4);
    expect(bias.shortest).toBeLessThanOrEqual(0.4);
  });
  it("prescription runs build and grade", () => {
    const run = buildRun("review", () => 0.42);
    expect(run.length).toBeGreaterThan(0);
    const q = run[0];
    const r = REVIEWS.find((x) => x.id === q.id)!;
    expect(grade({ kind: "review", id: r.id, picks: [r.answer] })!.score).toBe(1);
    expect(grade({ kind: "review", id: r.id, picks: [r.wrong[0]] })!.score).toBe(0);
    const mixed = buildRun("mixed", () => 0.3);
    expect(mixed.slice(0, 4).map((x) => x.kind)).toEqual(["chain", "mystery", "puzzle", "review"]);
  });
});

describe("Rx Detective size", () => {
  it("has at least 500 hand-written cases", () => {
    expect(MYSTERIES.length + PUZZLES.length + REVIEWS.length).toBeGreaterThanOrEqual(500);
  });
});
