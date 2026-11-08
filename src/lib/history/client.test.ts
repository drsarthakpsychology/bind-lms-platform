// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

const calls: { tool: string; answers: unknown[] }[] = [];
let serverRows: HistoryRow[] = [];
let fail = false;
import { historyFor, noteAnswer, pickRoundFor, prefetchHistory, resetHistoryCache, setHistoryTransport } from "./client";
import type { HistoryRow } from "./order";

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) },
  });
  calls.length = 0;
  serverRows = [];
  fail = false;
  resetHistoryCache();
  setHistoryTransport({
    load: async () => {
      if (fail) throw new Error("offline");
      return { owner: "me", rows: serverRows };
    },
    record: async (tool, answers) => {
      if (fail) throw new Error("offline");
      calls.push({ tool, answers });
      return { ok: true };
    },
  });
});

describe("answer history in the browser", () => {
  it("keeps a browser copy, sends answers to the server, and skips them next round", async () => {
    noteAnswer("rx", "a", true);
    noteAnswer("rx", "b", false);
    await vi.waitFor(() => expect(calls.map((c) => c.answers).flat()).toHaveLength(2));
    expect(historyFor("rx").get("a")?.ok).toBe(true);
    for (let i = 0; i < 10; i++) {
      const round = pickRoundFor("rx", ["a", "b", "c", "d"], (x) => x, 2);
      expect(round).not.toContain("a");
      expect(["c", "d"]).toContain(round[0]);
    }
  });

  it("merges the server copy after prefetch", async () => {
    serverRows = [{ item: "z", seen: 2, ok: true, at: Date.now() - 1000, due: null }];
    await prefetchHistory("osce");
    expect(historyFor("osce").get("z")?.seen).toBe(2);
  });

  it("works offline and with blocked storage (fails open)", async () => {
    fail = true;
    await prefetchHistory("wwyd");
    noteAnswer("wwyd", "x", false);
    expect(historyFor("wwyd").get("x")?.ok).toBe(false);
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("blocked");
      },
    });
    expect(() => noteAnswer("wwyd", "y", true)).not.toThrow();
    expect(pickRoundFor("wwyd", ["p", "q"], (x) => x, 2).sort()).toEqual(["p", "q"]);
  });

  it("a different student on the same browser does not inherit the copy", async () => {
    store.set("vibha-history-v1:rx", JSON.stringify({ o: "someone-else", r: { a: [1, 1, Date.now(), null] } }));
    await prefetchHistory("rx");
    expect(historyFor("rx").has("a")).toBe(false);
  });
});
