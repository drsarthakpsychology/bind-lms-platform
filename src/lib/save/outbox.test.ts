import { describe, expect, it } from "vitest";
import { LOCK_MS, MAX_AGE_MS, OUTBOX_KEY, backoff, createOutbox, mergeEvents, mergeHistory, type StorageLike } from "./outbox";

function memStorage() {
  const m = new Map<string, string>();
  const s: StorageLike & { map: Map<string, string>; full: boolean } = {
    map: m,
    full: false,
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => {
      if (s.full) throw new Error("QuotaExceededError");
      m.set(k, v);
    },
    removeItem: (k) => void m.delete(k),
  };
  return s;
}

function setup() {
  let t = 1_000_000;
  const storage = memStorage();
  const box = createOutbox({ storage: () => storage, now: () => t });
  return { box, storage, tick: (ms: number) => (t += ms), now: () => t };
}

describe("outbox", () => {
  it("keeps saves in storage so a new page load still has them", () => {
    const { box, storage, now } = setup();
    box.add({ kind: "progress", key: "L1", owner: "a", payload: { watched: 10 } });
    const again = createOutbox({ storage: () => storage, now });
    expect(again.list("a")).toHaveLength(1);
    expect(JSON.parse(storage.map.get(OUTBOX_KEY)!)[0].payload).toEqual({ watched: 10 });
  });

  it("replaces a queued save with the same key (newest wins)", () => {
    const { box } = setup();
    box.add({ kind: "progress", key: "L1", owner: "a", payload: { watched: 10 } });
    box.add({ kind: "progress", key: "L1", owner: "a", payload: { watched: 20 } });
    box.add({ kind: "progress", key: "L2", owner: "a", payload: { watched: 5 } });
    expect(box.list("a").map((x) => x.payload)).toEqual([{ watched: 20 }, { watched: 5 }]);
  });

  it("keeps each student's saves apart", () => {
    const { box } = setup();
    box.add({ kind: "learn", key: "k", owner: "a", payload: 1 });
    box.add({ kind: "learn", key: "k", owner: "b", payload: 2 });
    expect(box.due("a").map((x) => x.payload)).toEqual([1]);
    expect(box.due("b").map((x) => x.payload)).toEqual([2]);
  });

  it("never merges into a save that is on its way", () => {
    const { box } = setup();
    box.add({ kind: "history", key: "t", owner: "a", payload: { tool: "t", answers: [{ item: "1", correct: true }] } }, mergeHistory);
    const sent = box.claim("a");
    expect(sent).toHaveLength(1);
    box.add({ kind: "history", key: "t", owner: "a", payload: { tool: "t", answers: [{ item: "2", correct: false }] } }, mergeHistory);
    expect(box.list("a")).toHaveLength(2);
    box.remove(sent.map((x) => x.id));
    expect(box.list("a").map((x) => x.payload)).toEqual([{ tool: "t", answers: [{ item: "2", correct: false }] }]);
  });

  it("does not hand out a locked save twice, until the lock runs out", () => {
    const { box, tick } = setup();
    box.add({ kind: "learn", key: "k", owner: "a", payload: 1 });
    expect(box.claim("a")).toHaveLength(1);
    expect(box.claim("a")).toHaveLength(0);
    tick(LOCK_MS + 1);
    expect(box.claim("a")).toHaveLength(1);
  });

  it("waits longer after each failure", () => {
    const { box, tick } = setup();
    const item = box.add({ kind: "learn", key: "k", owner: "a", payload: 1 });
    box.claim("a");
    box.fail([item.id]);
    expect(box.due("a")).toHaveLength(0);
    tick(backoff(1));
    expect(box.due("a")).toHaveLength(1);
    box.fail([item.id]);
    expect(box.list("a")[0].tries).toBe(2);
    tick(backoff(1));
    expect(box.due("a")).toHaveLength(0);
    box.wake("a");
    expect(box.due("a")).toHaveLength(1);
  });

  it("drops saves that are too old", () => {
    const { box, tick } = setup();
    box.add({ kind: "progress", key: "L1", owner: "a", payload: 1 });
    tick(MAX_AGE_MS + 1);
    expect(box.prune()).toHaveLength(1);
    expect(box.list()).toHaveLength(0);
  });

  it("carries on in memory when storage is blocked", () => {
    const box = createOutbox({
      storage: () => {
        throw new Error("SecurityError");
      },
    });
    box.add({ kind: "learn", key: "k", owner: "a", payload: 1 });
    expect(box.list("a")).toHaveLength(1);
  });

  it("keeps everything in memory when storage is full", () => {
    const { box, storage } = setup();
    box.add({ kind: "progress", key: "L1", owner: "a", payload: 1 });
    storage.full = true;
    box.add({ kind: "progress", key: "L2", owner: "a", payload: 2 });
    box.add({ kind: "progress", key: "L3", owner: "a", payload: 3 });
    expect(box.list("a").map((x) => x.payload)).toEqual([1, 2, 3]);
  });

  it("ignores broken stored data", () => {
    const { storage, now } = setup();
    storage.setItem(OUTBOX_KEY, "{not json");
    expect(createOutbox({ storage: () => storage, now }).list()).toEqual([]);
    storage.setItem(OUTBOX_KEY, JSON.stringify([{ id: 1 }, null]));
    expect(createOutbox({ storage: () => storage, now }).list()).toEqual([]);
  });
});

describe("merges", () => {
  it("piles answers up to 100, then starts a new save", () => {
    const a = { tool: "t", answers: Array.from({ length: 60 }, (_, i) => ({ item: `i${i}`, correct: true })) };
    expect((mergeHistory(a, { tool: "t", answers: [{ item: "x", correct: false }] }) as typeof a).answers).toHaveLength(61);
    expect(mergeHistory(a, a)).toBeUndefined();
  });
  it("a full events save starts a new entry instead of losing old events", () => {
    const { box } = setup();
    const batch = (n: number) => ({ path: "/p", events: Array.from({ length: n }, (_, i) => ({ i })) });
    box.add({ kind: "events", key: "/p", owner: "a", payload: batch(40) }, mergeEvents);
    box.add({ kind: "events", key: "/p", owner: "a", payload: batch(20) }, mergeEvents);
    const all = box.list("a");
    expect(all).toHaveLength(2);
    expect(all.reduce((n, x) => n + (x.payload as { events: unknown[] }).events.length, 0)).toBe(60);
  });
});
