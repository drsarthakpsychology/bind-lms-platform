import { describe, expect, it } from "vitest";
import { buildRun, rxItem } from "@/lib/games-sims/rx/game";
import { makeRng } from "@/lib/games-sims/common";
import { EXCERPTS } from "@/lib/games-sims/mse/excerpts";
import { pickExcerpt } from "@/lib/games-sims/mse/grade";
import { newGame } from "@/lib/games-sims/comorbid/game";
import { DIAGNOSES } from "@/lib/games-sims/comorbid/cards";
import { SEED_MSE_STIMULI, domainRound } from "@/lib/practice/mse";
import { nextFresh, type HistoryRow } from "./order";

const NOW = 5_000_000;
const right = (item: string, at = NOW - 10): HistoryRow => ({ item, seen: 1, ok: true, at, due: null });
const wrong = (item: string): HistoryRow => ({ item, seen: 1, ok: false, at: NOW - 10, due: NOW - 1 });
const H = (rows: HistoryRow[]) => new Map(rows.map((r) => [r.item, r]));

describe("pickers that follow the answer history", () => {
  it("Rx Detective: a run takes unseen questions first and holds right ones back", () => {
    const base = buildRun("chain", makeRng(1), 500);
    const seen = base.slice(0, base.length - 3);
    const h = H([...seen.slice(0, -2).map((q) => right(rxItem(q.kind, q.id))), ...seen.slice(-2).map((q) => wrong(rxItem(q.kind, q.id)))]);
    for (let seed = 1; seed < 10; seed++) {
      const run = buildRun("chain", makeRng(seed), 5, h, NOW);
      expect(run).toHaveLength(5);
      expect(h.has(rxItem(run[0].kind, run[0].id))).toBe(false);
      expect(run.slice(0, 3).every((q) => !h.has(rxItem(q.kind, q.id)))).toBe(true);
      expect(run.slice(3).every((q) => h.get(rxItem(q.kind, q.id))?.ok === false)).toBe(true);
    }
    // No history: still a full run.
    expect(buildRun("mixed", makeRng(3))).toHaveLength(buildRun("mixed", makeRng(3)).length);
  });

  it("MSE Lab: an excerpt never done (at the level, else the nearest level); done ones only once all are done", () => {
    const level = EXCERPTS[0].level;
    const pool = EXCERPTS.filter((e) => e.level === level);
    const oneNew = H(pool.slice(1).map((e) => right(e.id)));
    expect(pickExcerpt(level, new Set(), makeRng(9), oneNew, NOW)?.id).toBe(pool[0].id);
    // Every excerpt at the level done: a new one from the nearest level, never a done one.
    const levelDone = H(pool.map((e) => right(e.id)));
    for (let seed = 1; seed < 6; seed++) {
      const e = pickExcerpt(level, new Set(), makeRng(seed), levelDone, NOW)!;
      expect(levelDone.has(e.id)).toBe(false);
      expect(Math.abs(e.level - level)).toBe(1);
    }
    // Every excerpt done: the missed one at the level first, then the oldest right one.
    const allRight = H(EXCERPTS.map((e, i) => right(e.id, NOW - 100000 + i)));
    expect(pickExcerpt(level, new Set(), makeRng(1), allRight, NOW)?.id).toBe(pool[0].id);
    const oneMissed = H([...EXCERPTS.map((e) => right(e.id)), wrong(pool[2].id)]);
    expect(pickExcerpt(level, new Set(), makeRng(4), oneMissed, NOW)?.id).toBe(pool[2].id);
  });

  it("MSE trainer: a domain round takes unseen stimuli first", () => {
    const speech = SEED_MSE_STIMULI.filter((s) => s.domain === "speech");
    const h = H(speech.slice(0, -3).map((s) => right(s.id)));
    const round = domainRound(SEED_MSE_STIMULI, "speech", 3, 42, h, NOW);
    expect(round.every((s) => !h.has(s.id))).toBe(true);
  });

  it("Comorbid: Player 1 gets the preferred diagnosis (and a bad preference is ignored)", () => {
    const want = DIAGNOSES[3].id;
    const g = newGame({ seed: "abcd1", mode: "bot", level: 1, names: ["a", "b"], prefer: want });
    expect(g.seats[0].dx).toBe(want);
    expect(g.seats[1].dx).not.toBe(want);
    expect(newGame({ seed: "abcd1", mode: "bot", level: 1, names: ["a", "b"], prefer: "nope" }).seats[0].dx).toBe(newGame({ seed: "abcd1", mode: "bot", level: 1, names: ["a", "b"] }).seats[0].dx);
  });

  it("walk-through lists: Next goes to an unseen item, else a missed one, else none", () => {
    const ids = ["a", "b", "c", "d"];
    expect(nextFresh(ids, "a", H([right("b"), right("c")]), NOW)).toBe("d");
    expect(nextFresh(ids, "c", H([right("d"), right("b"), wrong("a")]), NOW)).toBe("a");
    expect(nextFresh(ids, "a", H([right("b"), right("c"), right("d")]), NOW)).toBeNull();
  });
});
