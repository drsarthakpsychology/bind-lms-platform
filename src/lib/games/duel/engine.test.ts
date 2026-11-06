import { describe, expect, it } from "vitest";
import { diagnosisById } from "../diagnoses";
import { DUEL_ITEMS } from "./items";
import { botAnswer, canAnswer, COUNTDOWN_MS, LEFT_MS, matchState, pickItems, REVEAL_MS, ROUND_MS, roundOrder, scoreAnswer, type AnswerRec, type MatchRec } from "./engine";
import { canPair, decayed, expected, inflateRd, pairWindow, tierFor, update, START_RATING, START_RD } from "./rating";

const T0 = 1_000_000;
const match = (over: Partial<MatchRec> = {}): MatchRec => ({
  id: "m",
  p1: "a",
  p2: "b",
  bot: false,
  ranked: true,
  status: "active",
  items: ["du-01", "du-02", "du-03", "du-04", "du-05"],
  seed: 42,
  startedAt: T0,
  p1Seen: T0,
  p2Seen: T0,
  forfeitBy: null,
  ...over,
});

/** The index the player must tap to be right in round r. */
const right = (seed: number, r: number) => ({ dx: roundOrder(seed, r).options.indexOf(0), feature: roundOrder(seed, r).features.indexOf(0) });

describe("items", () => {
  it("are well formed", () => {
    expect(DUEL_ITEMS.length).toBeGreaterThanOrEqual(30);
    for (const it of DUEL_ITEMS) {
      expect(new Set(it.options).size).toBe(4);
      for (const o of it.options) expect(diagnosisById(o), `${it.id} ${o}`).toBeTruthy();
      expect(new Set(it.features).size).toBe(4);
      const name = diagnosisById(it.options[0])!.name.toLowerCase();
      expect(it.vignette.toLowerCase().includes(name)).toBe(false);
    }
  });

  it("picks 5 distinct items with mixed topics", () => {
    const ids = pickItems(DUEL_ITEMS, 7);
    expect(ids).toHaveLength(5);
    expect(new Set(ids).size).toBe(5);
    const topics = new Set(ids.map((id) => DUEL_ITEMS.find((x) => x.id === id)!.topic));
    expect(topics.size).toBe(5);
  });
});

describe("scoring", () => {
  it("diagnosis 100, feature 50 only with the right diagnosis", () => {
    const r = right(42, 0);
    expect(scoreAnswer(42, 0, r.dx, r.feature).points).toBe(150);
    expect(scoreAnswer(42, 0, r.dx, (r.feature + 1) % 4).points).toBe(100);
    expect(scoreAnswer(42, 0, (r.dx + 1) % 4, r.feature).points).toBe(0);
  });

  it("bot is deterministic", () => {
    expect(botAnswer(9, 2)).toEqual(botAnswer(9, 2));
    expect(botAnswer(9, 2).ms).toBeLessThan(ROUND_MS);
  });
});

describe("timeline", () => {
  it("countdown, then round 1", () => {
    const m = match();
    expect(matchState(m, [], T0 + 100).phase.kind).toBe("countdown");
    const s = matchState(m, [], T0 + COUNTDOWN_MS + 10);
    expect(s.phase).toEqual({ kind: "round", round: 0, until: T0 + COUNTDOWN_MS + ROUND_MS });
  });

  it("round ends early when both answer, then reveal, then round 2", () => {
    const m = match();
    const start = T0 + COUNTDOWN_MS;
    const ans: AnswerRec[] = [
      { userId: "a", round: 0, ...right(42, 0), at: start + 3000 },
      { userId: "b", round: 0, dx: (right(42, 0).dx + 1) % 4, feature: 0, at: start + 5000 },
    ];
    const s = matchState({ ...m, p1Seen: start + 5000, p2Seen: start + 5000 }, ans, start + 5500);
    expect(s.phase).toEqual({ kind: "reveal", round: 0, until: start + 5000 + REVEAL_MS });
    expect(s.totals.p1.points).toBe(150);
    expect(s.totals.p2.points).toBe(0);
    const s2 = matchState({ ...m, p1Seen: start + 9500, p2Seen: start + 9500 }, ans, start + 5000 + REVEAL_MS + 10);
    expect(s2.phase.kind).toBe("round");
    expect((s2.phase as { round: number }).round).toBe(1);
  });

  it("an open round's answers are hidden from the totals", () => {
    const m = match();
    const start = T0 + COUNTDOWN_MS;
    const s = matchState(m, [{ userId: "a", round: 0, ...right(42, 0), at: start + 1000 }], start + 2000);
    expect(s.phase.kind).toBe("round");
    expect(s.totals.p1.points).toBe(0);
    expect(canAnswer(m, s, "a", 0)).toBe(false);
    expect(canAnswer(m, s, "b", 0)).toBe(true);
    expect(canAnswer(m, s, "b", 1)).toBe(false);
    expect(canAnswer(m, s, "z", 0)).toBe(false);
  });

  it("late answers don't count", () => {
    const m = match();
    const start = T0 + COUNTDOWN_MS;
    const s = matchState({ ...m, p1Seen: start + ROUND_MS + 1000, p2Seen: start + ROUND_MS + 1000 }, [{ userId: "a", round: 0, ...right(42, 0), at: start + ROUND_MS + 1 }], start + ROUND_MS + 100);
    expect(s.answers.p1[0]).toBeNull();
    expect(s.totals.p1.ms).toBe(ROUND_MS);
  });

  /** Play a full match where both answer every round at the given offsets. */
  function full(aMs: number, bMs: number, bRight: boolean) {
    const m = match();
    const ans: AnswerRec[] = [];
    let start = T0 + COUNTDOWN_MS;
    for (let r = 0; r < 5; r++) {
      const ra = right(42, r);
      ans.push({ userId: "a", round: r, ...ra, at: start + aMs });
      ans.push({ userId: "b", round: r, ...(bRight ? ra : { dx: (ra.dx + 1) % 4, feature: 0 }), at: start + bMs });
      start = start + Math.max(aMs, bMs) + REVEAL_MS;
    }
    return { m: { ...m, p1Seen: start, p2Seen: start }, ans, end: start };
  }

  it("more points wins", () => {
    const { m, ans, end } = full(4000, 2000, false);
    const s = matchState(m, ans, end);
    expect(s.phase.kind).toBe("over");
    expect(s.outcome).toEqual({ winner: "p1", reason: "points", forfeitSide: null });
  });

  it("speed breaks a tie", () => {
    const { m, ans, end } = full(4000, 2000, true);
    expect(matchState(m, ans, end).outcome).toEqual({ winner: "p2", reason: "speed", forfeitSide: null });
  });

  it("leaving (no polls) is a forfeit, even when ahead", () => {
    const m = match({ p2Seen: T0 + COUNTDOWN_MS });
    const start = T0 + COUNTDOWN_MS;
    const now = start + LEFT_MS + 100;
    const s = matchState({ ...m, p1Seen: now }, [{ userId: "b", round: 0, ...right(42, 0), at: start + 500 }], now);
    expect(s.outcome).toEqual({ winner: "p1", reason: "forfeit", forfeitSide: "p2" });
  });

  it("quitting is a forfeit", () => {
    expect(matchState(match({ forfeitBy: "a" }), [], T0 + 5000).outcome?.winner).toBe("p2");
  });

  it("bot answers on its own clock", () => {
    const m = match({ p2: null, bot: true, ranked: false });
    const start = T0 + COUNTDOWN_MS;
    const b = botAnswer(42, 0);
    expect(matchState(m, [], start + b.ms - 1).answers.p2[0]).toBeNull();
    expect(matchState({ ...m, p1Seen: start + b.ms }, [], start + b.ms + 1).answers.p2[0]).not.toBeNull();
  });
});

describe("rating", () => {
  const fresh = { rating: START_RATING, rd: START_RD, lastPlayed: null };
  it("equal players expect 50%", () => {
    expect(expected(fresh, fresh)).toBeCloseTo(0.5);
  });
  it("a loss always drops, a win always rises", () => {
    const strong = { rating: 1900, rd: 50, lastPlayed: T0 };
    const weak = { rating: 1100, rd: 50, lastPlayed: T0 };
    expect(update(strong, weak, 0, T0).rating).toBeLessThan(1900);
    expect(update(weak, strong, 1, T0).rating).toBeGreaterThan(1100);
    expect(update(strong, weak, 1, T0).rating).toBeGreaterThan(1900);
    const loss = update(fresh, fresh, 0, T0);
    expect(loss.rating).toBeLessThan(1500);
    expect(loss.rd).toBeLessThan(START_RD);
    expect(1500 - loss.rating).toBeGreaterThan(100); // new players move fast
  });
  it("upsets move more", () => {
    const a = { rating: 1500, rd: 80, lastPlayed: T0 };
    const lowOpp = update(a, { rating: 1300, rd: 80, lastPlayed: T0 }, 0, T0);
    const highOpp = update(a, { rating: 1700, rd: 80, lastPlayed: T0 }, 0, T0);
    expect(1500 - lowOpp.rating).toBeGreaterThan(1500 - highOpp.rating);
  });
  it("RD grows and rating decays when idle", () => {
    const day = 86400000;
    const r = { rating: 1600, rd: 60, lastPlayed: T0 };
    expect(inflateRd(r, T0 + 30 * day)).toBeGreaterThan(60);
    expect(decayed(r, T0 + 6 * day)).toBe(1600);
    expect(decayed(r, T0 + 8 * day)).toBe(1595);
    expect(decayed(r, T0 + 22 * day)).toBe(1585);
    expect(decayed({ rating: 1201, rd: 60, lastPlayed: T0 }, T0 + 400 * day)).toBe(1200);
  });
  it("matchmaking window widens with waiting", () => {
    expect(pairWindow(0)).toBe(100);
    expect(pairWindow(10000)).toBe(350);
    expect(pairWindow(1e9)).toBe(800);
    expect(canPair(1500, 1590, 0)).toBe(true);
    expect(canPair(1500, 1700, 0)).toBe(false);
    expect(canPair(1500, 1700, 6000)).toBe(true);
  });
  it("tiers", () => {
    expect(tierFor(1000)).toBe("Neuron");
    expect(tierFor(1500)).toBe("Cortex");
    expect(tierFor(2000)).toBe("Mind");
  });
});
