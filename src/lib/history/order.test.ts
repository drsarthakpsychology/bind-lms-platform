import { describe, expect, it } from "vitest";
import { fromRows, leadWithUnseen, mergeHistory, nextRow, orderIds, pickRound, poolFor, seededRng, spreadOut, tierOf, WRONG_GAP_MS, type HistoryRow } from "./order";

const NOW = Date.parse("2026-11-08T10:00:00Z");
const H = (rows: HistoryRow[]) => new Map(rows.map((r) => [r.item, r]));
const right = (item: string, at: number): HistoryRow => ({ item, seen: 1, ok: true, at, due: at + 86400000 });
const wrong = (item: string, at: number, due = at + WRONG_GAP_MS): HistoryRow => ({ item, seen: 1, ok: false, at, due });
const ids = Array.from({ length: 10 }, (_, i) => `q${i}`);

describe("answer history order", () => {
  it("puts never-seen items first", () => {
    const h = H([right("q0", NOW - 5000), wrong("q1", NOW - 3600000), right("q2", NOW - 9000)]);
    const out = orderIds(ids, h, NOW, seededRng(1));
    expect(out.slice(0, 7).sort()).toEqual(["q3", "q4", "q5", "q6", "q7", "q8", "q9"]);
    expect(out[7]).toBe("q1");
    expect(out.slice(8)).toEqual(["q2", "q0"]);
  });

  it("keeps right answers out until everything else has been seen", () => {
    const h = H(ids.slice(0, 6).map((id, i) => right(id, NOW - i * 1000)));
    for (let seed = 1; seed < 30; seed++) {
      const round = pickRound(ids, (x) => x, h, NOW, seededRng(seed), 4);
      expect(round.every((x) => !h.has(x))).toBe(true);
    }
  });

  it("brings wrong ones back before right ones, due ones first", () => {
    const h = H([right("q0", NOW - 1000), wrong("q1", NOW - 60000, NOW + 3600000), wrong("q2", NOW - 9e6)]);
    const out = orderIds(["q0", "q1", "q2"], h, NOW, seededRng(3));
    expect(out).toEqual(["q2", "q1", "q0"]);
    expect(tierOf(h.get("q2"), NOW)).toBe(1);
    expect(tierOf(h.get("q1"), NOW)).toBe(2);
  });

  it("recycles right answers oldest first once all are seen", () => {
    const h = H(ids.map((id, i) => right(id, NOW - (10 - i) * 1000)));
    expect(orderIds(ids, h, NOW, seededRng(9))).toEqual(ids);
  });

  it("never opens two fresh rounds with the same first questions", () => {
    let h = new Map<string, HistoryRow>();
    const firsts = new Set<string>();
    let t = NOW;
    for (let r = 0; r < 5; r++) {
      const round = pickRound(ids, (x) => x, h, t, seededRng(42), 2);
      expect(firsts.has(round.join())).toBe(false);
      firsts.add(round.join());
      for (const id of round) h = new Map(h).set(id, nextRow(h.get(id), id, true, t));
      t += 1000;
    }
  });

  it("spreads comeback items among new ones and opens with a new one", () => {
    const h = H([wrong("w1", NOW - 9e6), wrong("w2", NOW - 9e6)]);
    const out = spreadOut(["a", "b", "c", "d", "w1", "w2"], (x) => x, h, NOW);
    expect(out[0]).toBe("a");
    expect(out.indexOf("w1")).toBeLessThan(out.indexOf("d"));
    expect(leadWithUnseen(["w1", "a"], (x) => x, h, NOW)).toEqual(["a", "w1"]);
  });

  it("poolFor stops at whole groups", () => {
    const h = H([right("q0", NOW), right("q1", NOW)]);
    const pool = poolFor(ids, (x) => x, h, NOW, seededRng(2), 5);
    expect(pool.length).toBe(8);
    expect(pool.includes("q0")).toBe(false);
    expect(poolFor(ids, (x) => x, h, NOW, seededRng(2), 9).length).toBe(10);
  });

  it("merges browser and server copies (newer answer wins)", () => {
    const m = mergeHistory(H([right("a", 100)]), H([{ ...wrong("a", 200), seen: 1 }, right("b", 50)]));
    expect(m.get("a")?.ok).toBe(false);
    expect(m.size).toBe(2);
  });

  it("works with no history at all (plain random order)", () => {
    const a = orderIds(ids, new Map(), NOW, seededRng(1));
    const b = orderIds(ids, new Map(), NOW, seededRng(2));
    expect([...a].sort()).toEqual([...ids].sort());
    expect(a.join()).not.toBe(b.join());
  });

  it("reads only well-formed rows", () => {
    expect(fromRows([{ item: "x", at: 1, ok: true }, { item: "", at: 1 }, null, { item: "y" }]).size).toBe(1);
  });
});
