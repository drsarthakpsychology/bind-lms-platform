import { describe, expect, it } from "vitest";
import type { HistoryRow } from "@/lib/history/order";
import { arrangeCases, BIG_NEW, dripSize, freshRound, hubNewLabel, newCount, nextCase, RECYCLE_LINE, weekIndex, weekStart, weeklyDrip } from "./fresh";
import { mergeProgress, startedIds } from "./progress";

const DAY = 86_400_000;
// Wednesday 18 Nov 2026, noon India time.
const NOW = Date.parse("2026-11-18T06:30:00Z");
const ids = Array.from({ length: 40 }, (_, i) => `c${i}`);
const row = (item: string, ok: boolean | null, at = NOW - DAY): HistoryRow => ({ item, seen: 1, ok, at, due: null });
const H = (rows: HistoryRow[]) => new Map(rows.map((r) => [r.item, r]));
const idOf = (x: string) => x;

describe("weeks (India time, Monday first)", () => {
  it("a week starts on Monday 00:00 IST", () => {
    const w = weekIndex(NOW);
    expect(new Date(weekStart(w)).toISOString()).toBe("2026-11-15T18:30:00.000Z");
    expect(weekIndex(weekStart(w))).toBe(w);
    expect(weekIndex(weekStart(w) - 1)).toBe(w - 1);
    expect(weekIndex(NOW + 7 * DAY)).toBe(w + 1);
  });
});

describe("the weekly drip", () => {
  it("is the same for the same student and week, whatever the input order", () => {
    const a = weeklyDrip(ids, "s1", new Map(), NOW);
    const b = weeklyDrip([...ids].reverse(), "s1", new Map(), NOW + DAY);
    expect([...a].sort()).toEqual([...b].sort());
    expect(a.size).toBe(dripSize(ids.length));
  });

  it("differs by student and by week, and never picks a case done before the week", () => {
    const a = weeklyDrip(ids, "s1", new Map(), NOW);
    expect([...weeklyDrip(ids, "s2", new Map(), NOW)].sort()).not.toEqual([...a].sort());
    expect([...weeklyDrip(ids, "s1", new Map(), NOW + 7 * DAY)].sort()).not.toEqual([...a].sort());
    const h = H(ids.slice(0, 30).map((id) => row(id, true, NOW - 10 * DAY)));
    for (const id of weeklyDrip(ids, "s1", h, NOW)) expect(Number(id.slice(1))).toBeGreaterThanOrEqual(30);
  });

  it("stays put mid-week when a case in it is done", () => {
    const a = weeklyDrip(ids, "s1", new Map(), NOW);
    const first = [...a][0];
    expect(weeklyDrip(ids, "s1", H([row(first, true, NOW - 60_000)]), NOW)).toEqual(a);
  });

  it("small libraries have no weekly set (every case is simply New)", () => {
    expect(weeklyDrip(ids.slice(0, 8), "s1", new Map(), NOW).size).toBe(0);
  });
});

describe("arrangeCases", () => {
  it("half-done first, then new this week, then new, done last; nothing is hidden", () => {
    const h = H([row("c1", true), row("c2", false), row("c3", true)]);
    const a = arrangeCases(ids, idOf, { history: h, now: NOW, student: "s1", started: new Set(["c5"]) });
    expect(a.list).toHaveLength(ids.length);
    expect(a.list[0]).toMatchObject({ id: "c5", mark: "started" });
    const marks = a.list.map((x) => x.mark);
    expect(marks.lastIndexOf("week")).toBeLessThan(marks.indexOf("new"));
    expect(marks.slice(-3)).toEqual(["done", "done", "done"]);
    expect(a.recycled).toBe(false);
    expect(a.fresh).toBe(ids.length - 4);
  });

  it("done ones: missed first, then harder, then oldest", () => {
    const h = H([row("a", true, NOW - 5 * DAY), row("b", false, NOW - DAY), row("c", true, NOW - 9 * DAY), row("d", true, NOW - DAY)]);
    const level = (x: string) => (x === "d" ? 3 : 1);
    const a = arrangeCases(["a", "b", "c", "d"], idOf, { history: h, now: NOW, student: "s", level });
    expect(a.list.map((x) => x.id)).toEqual(["b", "d", "c", "a"]);
    expect(a.recycled).toBe(true);
  });
});

describe("the next case", () => {
  it("is never a done one while any case is not done", () => {
    const h = H(ids.slice(0, 39).map((id) => row(id, true)));
    const n = nextCase(ids, idOf, { history: h, now: NOW, student: "s1" });
    expect(n).toEqual({ item: "c39", recycled: false });
    // "Next" after the last new one: everything is done now, so it recycles.
    const all = H(ids.map((id) => row(id, id !== "c7")));
    expect(nextCase(ids, idOf, { history: all, now: NOW, student: "s1", current: "c39" })).toEqual({ item: "c7", recycled: true });
  });

  it("skips the case just finished", () => {
    const n = nextCase(["x", "y"], idOf, { history: new Map(), now: NOW, student: "s", current: "x" });
    expect(n?.item).toBe("y");
  });

  it("resumes a half-done case before anything new", () => {
    const n = nextCase(ids, idOf, { history: new Map(), now: NOW, student: "s", started: new Set(["c20"]) });
    expect(n?.item).toBe("c20");
  });
});

describe("rounds", () => {
  it("hold new cases only while any are left (even if short), and recycle only when all are done", () => {
    const h = H(ids.slice(0, 37).map((id) => row(id, true)));
    const r = freshRound(ids, idOf, 5, { history: h, now: NOW, student: "s" });
    expect(r.recycled).toBe(false);
    expect([...r.round].sort()).toEqual(["c37", "c38", "c39"]);
    const all = H(ids.map((id) => row(id, true)));
    const again = freshRound(ids, idOf, 5, { history: all, now: NOW, student: "s" });
    expect(again.recycled).toBe(true);
    expect(again.round).toHaveLength(5);
    expect(RECYCLE_LINE).toBe("You've done every case. Here they are again, hardest first.");
  });
});

describe("hub count", () => {
  it("counts never-done cases and shows only a large number", () => {
    expect(newCount(ids, H([row("c1", true), row("c2", false)]))).toBe(38);
    expect(hubNewLabel(BIG_NEW - 1)).toBeNull();
    expect(hubNewLabel(127)).toBe("120+ new cases");
  });
});

describe("saved progress", () => {
  it("the newer copy wins and a finished case stays cleared", () => {
    const server = [{ item: "w1", state: { day: 2 }, at: 100 }, { item: "w2", state: { day: 1 }, at: 100 }];
    const local = [{ item: "w1", state: { day: 3 }, at: 200 }, { item: "w2", state: null, at: 300 }];
    const m = mergeProgress(server, local);
    expect(m.get("w1")?.state).toEqual({ day: 3 });
    expect([...startedIds(m)]).toEqual(["w1"]);
    expect(mergeProgress(local, [{ item: "w1", state: { day: 9 }, at: 50 }]).get("w1")?.state).toEqual({ day: 3 });
  });
});
