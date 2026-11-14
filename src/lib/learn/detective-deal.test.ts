import { describe, expect, it } from "vitest";
import { CASES } from "./detective";
import { caseAt, clueOf, deal, judge, poolFor, ROUNDS } from "./detective-deal";

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
