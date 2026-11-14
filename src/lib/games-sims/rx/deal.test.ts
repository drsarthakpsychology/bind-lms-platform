import { describe, expect, it } from "vitest";
import { makeRng } from "../common";
import { caseAt, current, dealRx, pickRx, revealOf, runTotals, type RxToken } from "./deal";
import { DRUGS, MYSTERIES, PUZZLES, REVIEWS, drugById, reviewById } from "./content";
import { LIVES, STEPS, type Mode } from "./rules";

const mask = (run: string, r: number) => (r * 7919 + run.length * 31) >>> 0;
const EMPTY = new Map();

/** The right pick for the case in play (read on the "server" side). */
function rightPick(t: RxToken): string {
  const c = current(t, "u", mask)!;
  if (c.kind === "chain") return drugById(c.id)![STEPS[t.p.length].key];
  if (c.kind === "mystery") return MYSTERIES.find((m) => m.id === c.id)!.answer;
  if (c.kind === "review") return reviewById(c.id)!.answer;
  return PUZZLES.find((p) => p.id === c.id)!.answer;
}

describe("Rx Detective deal", () => {
  it("a dealt run carries no answer, explanation or case id", () => {
    for (const mode of ["mixed", "chain", "mystery", "puzzle", "review"] as Mode[]) {
      const { payload, cases } = dealRx("u", "run1", mode, makeRng(5), EMPTY, 0, mask);
      expect(cases.length).toBeGreaterThan(0);
      const text = JSON.stringify(cases);
      expect(text).not.toMatch(/"(answer|why|not|correct)"/);
      for (const m of MYSTERIES) expect(text.includes(m.why)).toBe(false);
      for (const p of PUZZLES) expect(text.includes(p.why)).toBe(false);
      for (const r of REVIEWS) expect(text.includes(r.why)).toBe(false);
      // The token holds masked numbers only.
      expect(JSON.stringify(payload)).not.toMatch(/[a-z]{3,}-[a-z]{3,}/);
      expect(caseAt(payload, "someone else", 0, mask)).toBeNull();
    }
  });

  it("checks every pick on the server and reveals a case only once answered", () => {
    let { payload: t } = dealRx("u", "run1", "mixed", makeRng(9), EMPTY, 0, mask);
    const n = t.k.length;
    for (let i = 0; i < n; i++) {
      const c = current(t, "u", mask)!;
      const picks = c.kind === "chain" ? STEPS.length : 1;
      for (let p = 0; p < picks; p++) {
        const res = pickRx(t, c, rightPick(t))!;
        if (p < picks - 1) {
          expect(res.type).toBe("step");
          if (res.type === "step") expect(res.right).toBe(true);
        } else {
          expect(res.type).toBe("case");
          if (res.type === "case") {
            expect(res.answered.graded.score).toBe(1);
            expect(res.answered.reveal).toEqual(revealOf(c)!.reveal);
          }
        }
        t = res.next;
      }
    }
    expect(current(t, "u", mask)).toBeNull();
    const s = runTotals(t, "u", mask);
    expect(s.lives).toBe(LIVES);
    expect(s.got).toBe(s.total);
    expect(s.done.length).toBe(n);
  });

  it("wrong answers cost lives and the run stops at zero", () => {
    let { payload: t } = dealRx("u", "run2", "mystery", makeRng(3), EMPTY, 0, mask);
    for (let i = 0; i < LIVES; i++) {
      const c = current(t, "u", mask)!;
      const res = pickRx(t, c, "nope")!;
      expect(res.type).toBe("case");
      t = res.next;
    }
    expect(current(t, "u", mask)).toBeNull();
    expect(runTotals(t, "u", mask).lives).toBe(0);
  });

  it("every chain drug, mystery, puzzle and review has an answer card", () => {
    for (const d of DRUGS) expect(revealOf({ kind: "chain", id: d.id })).not.toBeNull();
    for (const m of MYSTERIES) expect(revealOf({ kind: "mystery", id: m.id })).not.toBeNull();
    for (const p of PUZZLES) expect(revealOf({ kind: "puzzle", id: p.id })).not.toBeNull();
    for (const r of REVIEWS) expect(revealOf({ kind: "review", id: r.id })).not.toBeNull();
  });
});
