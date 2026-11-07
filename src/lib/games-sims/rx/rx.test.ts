import { describe, expect, it } from "vitest";
import { makeRng } from "../common";
import { TOPICS } from "@/lib/learn/model/topics";
import { DRUGS, EFFECTS, FAMILY, MYSTERIES, OUTCOMES, OVERLAP, PUZZLES } from "./content";
import { attemptsFor, buildRun, chainOptions, grade, LIVES, rxXp, runSummary, STEPS, type Answer } from "./game";

describe("Rx Detective content", () => {
  it("has enough of each kind, every drug has a family, Indian brands and a learning dose", () => {
    expect(DRUGS.length).toBeGreaterThanOrEqual(18);
    expect(MYSTERIES.length).toBeGreaterThanOrEqual(10);
    expect(PUZZLES.length).toBeGreaterThanOrEqual(12);
    const topics = new Set(TOPICS.map((t) => t.id));
    for (const d of DRUGS) {
      expect(FAMILY[d.id], d.id).toBeTruthy();
      expect(d.brands.length).toBeGreaterThan(0);
      expect(d.dose).toMatch(/\d/);
      expect(topics.has(d.topic)).toBe(true);
    }
  });
  it("covers serotonin syndrome, QT and liver-enzyme puzzles", () => {
    const answers = new Set(PUZZLES.map((p) => p.answer));
    for (const k of ["ss", "qt", "up", "down", "kidney"]) expect(answers.has(k)).toBe(true);
    expect(PUZZLES.filter((p) => p.answer === "up" || p.answer === "down").every((p) => p.journey)).toBe(true);
  });
  it("mysteries list their answer among four known effects", () => {
    const ids = new Set(EFFECTS.map((e) => e.id));
    for (const m of MYSTERIES) {
      expect(m.options).toContain(m.answer);
      expect(m.options.length).toBe(4);
      expect(m.options.every((o) => ids.has(o))).toBe(true);
      expect(DRUGS.some((d) => d.id === m.drug)).toBe(true);
    }
    expect(PUZZLES.every((p) => OUTCOMES.some((o) => o.id === p.answer))).toBe(true);
  });
  it("never uses week numbers or dashes", () => {
    const text = JSON.stringify([DRUGS, MYSTERIES, PUZZLES]);
    expect(/\bweeks?\b/i.test(text)).toBe(false);
    expect(/[–—]/.test(text)).toBe(false);
  });
});

describe("Rx Detective rules", () => {
  it("chain distractors never come from the same family, topic or overlap group", () => {
    const rng = makeRng(7);
    for (const d of DRUGS)
      for (const s of STEPS) {
        const opts = chainOptions(d, s.key, rng);
        expect(opts).toContain(d[s.key]);
        expect(new Set(opts).size).toBe(opts.length);
        expect(opts.length).toBe(4);
        const allowed = DRUGS.filter((x) => x.id !== d.id && FAMILY[x.id] !== FAMILY[d.id] && (s.key === "cls" || (x.topic !== d.topic && !OVERLAP.some((g) => g.includes(d.id) && g.includes(x.id))))).map((x) => x[s.key]);
        for (const o of opts) if (o !== d[s.key]) expect(allowed, `${d.id} ${s.key}`).toContain(o);
      }
  });
  it("builds an interleaved run of 12 and grades with partial credit", () => {
    const run = buildRun("mixed", makeRng(3));
    expect(run.length).toBe(12);
    expect(run.slice(0, 3).map((q) => q.kind)).toEqual(["chain", "mystery", "puzzle"]);
    const d = DRUGS[0];
    const g = grade({ kind: "chain", id: d.id, picks: [d.cls, d.mech, "nope", "nope"] })!;
    expect(g.score).toBe(0.5);
    expect(grade({ kind: "puzzle", id: "ser-tram", picks: ["ss"] })!.score).toBe(1);
    expect(grade({ kind: "mystery", id: "olz-weight", picks: ["a1"] })!.score).toBe(0);
    expect(grade({ kind: "mystery", id: "nope", picks: [] })).toBeNull();
  });
  it("makes one graded attempt per chain step on the drug's topic", () => {
    const d = DRUGS.find((x) => x.id === "lithium")!;
    const a = attemptsFor({ kind: "chain", id: d.id, picks: [d.cls, "x", d.ae, d.mon] });
    expect(a.map((x) => x.outcome)).toEqual([1, 0, 1, 1]);
    expect(a[0].skill).toBe("stabilisers:pharm");
    expect(attemptsFor({ kind: "puzzle", id: "li-ibu", picks: ["kidney"] })[0].item).toBe("rx:int:li-ibu");
  });
  it("stops counting after three lost lives and caps XP", () => {
    const wrong: Answer = { kind: "puzzle", id: "ser-tram", picks: ["qt"] };
    const right: Answer = { kind: "puzzle", id: "ser-tram", picks: ["ss"] };
    const s = runSummary([right, right, wrong, wrong, wrong, right]);
    expect(s.lives).toBe(0);
    expect(s.scores.length).toBe(5);
    expect(s.best).toBe(2);
    expect(LIVES).toBe(3);
    expect(rxXp(new Array(30).fill(1))).toBe(40);
    expect(rxXp([])).toBe(5);
  });
});
