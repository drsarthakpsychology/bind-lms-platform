import { describe, expect, it } from "vitest";
import { addDays, emptyState, normalise, type LearnState } from "./engine";
import { clampLearnSave, HISTORY_GRACE_DAYS, MAX_XP_PER_DAY } from "./integrity";

const today = "2026-11-03";
const st = (p: Partial<LearnState>): LearnState => ({ ...emptyState(), ...p });

describe("MAX_XP_PER_DAY", () => {
  it("is derived from the engine constants and generous", () => {
    expect(MAX_XP_PER_DAY).toBe(4510);
  });
});

describe("clampLearnSave", () => {
  it("passes an honest save through untouched", () => {
    const prev = { state: st({ xp: 100, history: { [today]: 100 } }), updatedDay: today };
    const next = st({ xp: 140, history: { [today]: 140 }, answered: 5, correct: 4 });
    const r = clampLearnSave(prev, next, today);
    expect(r.clamped).toBe(false);
    expect(r.state.xp).toBe(140);
    expect(r.state.history[today]).toBe(140);
  });

  it("never lets XP or lifetime counters go below the stored row", () => {
    const prev = { state: st({ xp: 500, answered: 50, correct: 40, history: { [today]: 500 } }), updatedDay: today };
    const r = clampLearnSave(prev, st({ xp: 10, answered: 1, correct: 1, history: { [today]: 10 } }), today);
    expect(r.state.xp).toBe(500);
    expect(r.state.answered).toBe(50);
    expect(r.state.correct).toBe(40);
    expect(r.state.history[today]).toBe(500);
    expect(r.clamped).toBe(true);
  });

  it("caps a day's history and ties the XP rise to the history rise", () => {
    const prev = { state: st({ xp: 100, history: { [today]: 100 } }), updatedDay: today };
    const r = clampLearnSave(prev, st({ xp: 999_999, history: { [today]: 999_999 } }), today);
    expect(r.state.history[today]).toBe(MAX_XP_PER_DAY);
    expect(r.state.xp).toBe(MAX_XP_PER_DAY);
    expect(r.clamped).toBe(true);
  });

  it("refuses XP that did not come with history", () => {
    const prev = { state: st({ xp: 100, history: { [today]: 100 } }), updatedDay: today };
    const r = clampLearnSave(prev, st({ xp: 5000, history: { [today]: 100 } }), today);
    expect(r.state.xp).toBe(100);
  });

  it("freezes days before the last save (minus grace) and drops future days", () => {
    const old = addDays(today, -(HISTORY_GRACE_DAYS + 3));
    const grace = addDays(today, -HISTORY_GRACE_DAYS);
    const prev = { state: st({ xp: 50, history: { [old]: 50 } }), updatedDay: today };
    const next = st({ xp: 50 + 4000 + 30, history: { [old]: 4000, [grace]: 30, "2027-01-01": 900 } });
    const r = clampLearnSave(prev, next, today);
    expect(r.state.history[old]).toBe(50);
    expect(r.state.history[grace]).toBe(30);
    expect(r.state.history["2027-01-01"]).toBeUndefined();
    expect(r.state.xp).toBe(80);
  });

  it("lets an offline tab add XP to the days since its last save", () => {
    const last = addDays(today, -5);
    const prev = { state: st({ xp: 200, history: { [last]: 200 } }), updatedDay: last };
    const next = st({ xp: 200 + 60 + 40, history: { [last]: 200, [addDays(today, -3)]: 60, [today]: 40 } });
    const r = clampLearnSave(prev, next, today);
    expect(r.clamped).toBe(false);
    expect(r.state.xp).toBe(300);
  });

  it("limits a first save to the XP its (capped) history explains", () => {
    const r = clampLearnSave(null, st({ xp: 1_000_000, history: { [today]: 120, [addDays(today, -1)]: 80 } }), today);
    expect(r.state.xp).toBe(200);
    expect(r.clamped).toBe(true);
  });

  it("bounds the streak by the days since the last save", () => {
    const prev = { state: st({ streak: { count: 3, best: 3, lastDay: today, freezes: 0 } }), updatedDay: today };
    const r = clampLearnSave(prev, st({ streak: { count: 400, best: 400, lastDay: today, freezes: 0 } }), today);
    expect(r.state.streak.count).toBeLessThanOrEqual(3 + 1 + HISTORY_GRACE_DAYS);
    expect(r.state.streak.best).toBe(r.state.streak.count);
  });

  it("keeps correct at or below answered", () => {
    const r = clampLearnSave(null, st({ answered: 5, correct: 50 }), today);
    expect(r.state.correct).toBe(5);
  });
});

describe("normalise coerces counters", () => {
  it("turns junk numbers into finite non-negative integers and drops unknown keys", () => {
    const n = normalise({ xp: -5, answered: "12", correct: 3.7, chests: Infinity, history: { [today]: NaN, bad: 3, "2026-11-01": 12.9 }, evil: "x" });
    expect(n.xp).toBe(0);
    expect(n.answered).toBe(0);
    expect(n.correct).toBe(3);
    expect(n.chests).toBe(0);
    expect(n.history).toEqual({ [today]: 0, "2026-11-01": 12 });
    expect((n as Record<string, unknown>).evil).toBeUndefined();
    expect((normalise({ owner: "u1" }) as Record<string, unknown>).owner).toBeUndefined();
  });
});
