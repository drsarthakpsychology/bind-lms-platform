import { describe, expect, it } from "vitest";
import { CASES } from "./detective";
import { caseAt, clueOf, deal, hintOf, judge, poolFor, ROUNDS } from "./detective-deal";
import { DETECTIVE_GUIDE } from "./detective-guide";
import { hintLoss } from "./detective-rules";
import { conceptById } from "./concepts";

const mask = (run: string, round: number) => (run.length * 7919 + round * 104729) >>> 0;
const rng = () => 0.42;

describe("Clinic detective deal", () => {
  const ordered = poolFor("mixed").map((c) => c.answer);
  const d = deal("u1", "run-a", ordered, mask, rng);

  it("sends options and the first clue only: no answer, no later clue, no case id", () => {
    expect(d.rounds).toHaveLength(ROUNDS);
    const json = JSON.stringify({ rounds: d.rounds, token: d.payload });
    d.rounds.forEach((r, i) => {
      const c = CASES.find((x) => x.answer === ordered[i])!;
      expect(r.clue).toBe(c.clues[0]);
      expect(r.options).toContain(c.answer);
      expect(r.options).toHaveLength(4);
      for (const later of c.clues.slice(1)) expect(json).not.toContain(later);
    });
    // The token holds masked numbers, not the plain case numbers.
    const plain = d.rounds.map((_, i) => CASES.findIndex((x) => x.answer === ordered[i]));
    expect(d.payload.k).not.toEqual(plain);
    expect(JSON.stringify(d.payload)).not.toMatch(/answer|lithium|clozapine/);
  });

  it("finds the case behind a round only for the same student", () => {
    expect(caseAt(d.payload, "u1", 0, mask)?.answer).toBe(ordered[0]);
    expect(caseAt(d.payload, "someone-else", 0, mask)).toBeNull();
    expect(caseAt(d.payload, "u1", 99, mask)).toBeNull();
    expect(caseAt(null, "u1", 0, mask)).toBeNull();
  });

  it("gives clues 1 to 4 and nothing else", () => {
    const c = CASES[0];
    expect(clueOf(c, 2)).toBe(c.clues[1]);
    expect(clueOf(c, 0)).toBeNull();
    expect(clueOf(c, 5)).toBeNull();
  });

  it("says the answer only when the guess is right or the round is over", () => {
    const c = CASES[0];
    expect(judge(c, "nope", false)).toEqual({ right: false, answer: null });
    expect(judge(c, "nope", true)).toEqual({ right: false, answer: c.answer });
    expect(judge(c, c.answer, false)).toEqual({ right: true, answer: c.answer });
  });

  it("keeps the history order (unseen first) and the family", () => {
    const drugs = poolFor("drug").map((c) => c.answer).reverse();
    const dd = deal("u1", "run-b", drugs, mask, rng);
    dd.rounds.forEach((_, i) => expect(caseAt(dd.payload, "u1", i, mask)?.answer).toBe(drugs[i]));
    expect(dd.rounds.every((r) => r.options.every((o) => CASES.find((x) => x.answer === o)?.family === "drug"))).toBe(true);
  });
});

describe("Clinic detective: starting picture and guided hints", () => {
  it("every case has a picture and three hints, and the deal sends the picture and option names", () => {
    for (const c of CASES) {
      const g = DETECTIVE_GUIDE[c.answer];
      expect(g, c.answer).toBeTruthy();
      expect(g!.hints).toHaveLength(3);
      expect(g!.picture.length, c.answer).toBeGreaterThan(40);
    }
    const d = deal("u1", "run-b", poolFor("mixed").map((c) => c.answer), (run, r) => (run.length + r) >>> 0, () => 0.3);
    for (const r of d.rounds) {
      expect(r.picture).toBeTruthy();
      expect(r.names).toHaveLength(4);
    }
  });

  it("the picture and hints 1 and 2 never name the answer", () => {
    for (const c of CASES) {
      const g = DETECTIVE_GUIDE[c.answer]!;
      const term = (conceptById(c.answer)?.term ?? c.answer).toLowerCase();
      for (const t of [g.picture, g.hints[0], g.hints[1]]) expect(t.toLowerCase().includes(term), `${c.answer}: ${t}`).toBe(false);
      expect(JSON.stringify(g)).not.toMatch(/[–—]/);
    }
  });

  it("gives hints 1 to 3 only; the first is free and the next two cost 5 each", () => {
    expect(hintOf(CASES[0], 1)).toBe(DETECTIVE_GUIDE[CASES[0].answer]!.hints[0]);
    expect(hintOf(CASES[0], 0)).toBeNull();
    expect(hintOf(CASES[0], 4)).toBeNull();
    expect([0, 1, 2, 3, 9].map(hintLoss)).toEqual([0, 0, 5, 10, 10]);
  });
});
