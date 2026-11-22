/**
 * The question bank's reads: every row past the 1000-row cap, pages in
 * parallel, and item difficulty remembered for 5 minutes.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

type Call = { table: string; in?: string[]; range?: [number, number] };
const calls: Call[] = [];
let table: Record<string, Record<string, unknown>[]> = {};
let failIn = false;

function builder(name: string) {
  const call: Call = { table: name };
  let eqUser: string | null = null;
  const b = {
    select: () => b,
    eq: (_c: string, v: string) => ((eqUser = v), b),
    like: () => b,
    order: () => b,
    limit: () => b,
    in: (_c: string, list: string[]) => ((call.in = list), b),
    range: (a: number, z: number) => ((call.range = [a, z]), b),
    then: (ok: (r: { data: unknown; error: unknown }) => unknown) => {
      calls.push(call);
      if (call.in && failIn) return Promise.resolve({ data: null, error: { message: "down" } }).then(ok);
      let rows = table[name] ?? [];
      if (eqUser) rows = rows.filter((r) => r.user_id === eqUser);
      if (call.in) rows = rows.filter((r) => call.in!.includes(String(r.item)));
      if (call.range) rows = rows.slice(call.range[0], call.range[1] + 1);
      return Promise.resolve({ data: rows, error: null }).then(ok);
    },
  };
  return b;
}

vi.mock("@/lib/supabase/server", () => ({ createAdminClient: () => ({ from: (t: string) => builder(t) }) }));
vi.mock("@/lib/learn/model/server", () => ({ recordAttempts: vi.fn() }));

const { allRows, clearItemBCache, loadItemB, loadSeenRows, loadCards } = await import("./server");
const { loadAnswers } = await import("./answers");

beforeEach(() => {
  calls.length = 0;
  table = {};
  failIn = false;
  clearItemBCache();
});

const seen = (n: number) => Array.from({ length: n }, (_, i) => ({ user_id: "u1", item: `q${String(i).padStart(5, "0")}`, n: 1, last_at: "2026-11-01T00:00:00Z" }));

describe("allRows", () => {
  it("one read when the list is short", async () => {
    table.prep_seen = seen(10);
    expect((await loadSeenRows("u1")).size).toBe(10);
    expect(calls).toHaveLength(1);
  });

  it("reads past 1000 rows (the old read stopped at 1000)", async () => {
    table.prep_seen = seen(1519);
    expect((await loadSeenRows("u1")).size).toBe(1519);
  });

  it("pages after the first go out together", async () => {
    let live = 0;
    let most = 0;
    const page = async (from: number, to: number) => {
      live++;
      most = Math.max(most, live);
      await new Promise((r) => setTimeout(r, 5));
      live--;
      const n = Math.max(0, Math.min(4500, to + 1) - from);
      return { data: Array.from({ length: n }, () => ({})), error: null };
    };
    expect(await allRows(page)).toHaveLength(4500);
    expect(most).toBe(4);
  });

  it("stops at the limit", async () => {
    const page = async (from: number, to: number) => ({ data: Array.from({ length: to - from + 1 }, () => ({})), error: null });
    expect(await allRows(page, 3000)).toHaveLength(3000);
  });

  it("a failed page counts as empty, never throws", async () => {
    const page = async (from: number) => (from === 0 ? { data: Array.from({ length: 1000 }, () => ({})), error: null } : { data: null, error: { message: "x" } });
    expect(await allRows(page)).toHaveLength(1000);
  });

  it("review cards past 1000", async () => {
    table.review_cards = Array.from({ length: 1565 }, (_, i) => ({ user_id: "u1", item: `prep:q${i}`, due_at: "2026-11-01T00:00:00Z", lapses: 0 }));
    expect(await loadCards("u1")).toHaveLength(1565);
  });
});

describe("loadAnswers", () => {
  it("every answer past 1000, in parallel pages", async () => {
    table.prep_answers = Array.from({ length: 2500 }, (_, i) => ({ user_id: "u1", item: `q${i}`, last_choice: 1, last_ok: i % 2 === 0, right_n: 1, wrong_n: 0, saved: false, last_at: "2026-11-01T00:00:00Z" }));
    const book = await loadAnswers("u1");
    expect(book.ready).toBe(true);
    expect(book.map.size).toBe(2500);
    expect(calls.filter((c) => c.table === "prep_answers")).toHaveLength(4);
  });
});

describe("loadItemB", () => {
  const ids = Array.from({ length: 900 }, (_, i) => `q${i}`);
  beforeEach(() => {
    table.item_stats = ids.slice(0, 600).map((id, i) => ({ item: `prep:${id}`, b: i / 100 }));
  });

  it("reads in chunks of 300 and remembers for 5 minutes", async () => {
    const t = Date.parse("2026-11-22T10:00:00Z");
    const first = await loadItemB(ids, t);
    expect(first.size).toBe(600);
    expect(calls).toHaveLength(3);
    const again = await loadItemB(ids, t + 60_000);
    expect(again.size).toBe(600);
    expect(again.get("q5")).toBe(0.05);
    expect(calls).toHaveLength(3); // nothing read again, not even the ones with no difficulty
    await loadItemB(ids, t + 6 * 60_000);
    expect(calls).toHaveLength(6);
  });

  it("a failed read is not remembered", async () => {
    failIn = true;
    expect((await loadItemB(ids.slice(0, 10))).size).toBe(0);
    failIn = false;
    expect((await loadItemB(ids.slice(0, 10))).size).toBe(10);
  });
});
