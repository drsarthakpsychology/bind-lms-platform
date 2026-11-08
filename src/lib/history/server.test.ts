import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

type Rows = Record<string, unknown>[];
const state: { rows: Rows; fail: boolean; throws: boolean; upserts: Rows } = { rows: [], fail: false, throws: false, upserts: [] };

function query() {
  const q: Record<string, unknown> = {};
  const self = () => q;
  for (const k of ["select", "eq", "in", "order"]) q[k] = vi.fn(self);
  q.limit = vi.fn(async () => (state.fail ? { data: null, error: { code: "42P01", message: "relation does not exist" } } : { data: state.rows, error: null }));
  q.then = (res: (v: unknown) => void) => res(state.fail ? { data: null, error: { code: "42P01" } } : { data: state.rows, error: null });
  q.upsert = vi.fn(async (rows: Rows) => {
    state.upserts.push(...rows);
    return { error: state.fail ? { message: "x" } : null };
  });
  return q;
}

vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => {
    if (state.throws) throw new Error("no service key");
    return { from: () => query() };
  },
}));

import { loadHistory, order, record, recordHistory } from "./server";
import { seededRng } from "./order";

beforeEach(() => {
  state.rows = [];
  state.fail = false;
  state.throws = false;
  state.upserts = [];
});

describe("answer history server", () => {
  it("fails open when the table is missing", async () => {
    state.fail = true;
    expect((await loadHistory("u1", "rx")).ready).toBe(false);
    expect(await record("u1", "rx", "a", true)).toBe(false);
    const out = await order("u1", "rx", ["a", "b", "c"], { rng: seededRng(1) });
    expect([...out].sort()).toEqual(["a", "b", "c"]);
  });

  it("fails open when the database cannot be reached", async () => {
    state.throws = true;
    expect((await loadHistory("u1", "rx")).ready).toBe(false);
    expect(await record("u1", "rx", "a", false)).toBe(false);
  });

  it("orders by the stored rows", async () => {
    const t = new Date("2026-11-08T10:00:00Z");
    state.rows = [
      { item: "a", seen_count: 2, last_correct: true, last_seen_at: "2026-11-07T10:00:00Z", next_due: null },
      { item: "b", seen_count: 1, last_correct: false, last_seen_at: "2026-11-07T10:00:00Z", next_due: "2026-11-07T10:10:00Z" },
    ];
    expect(await order("u1", "rx", ["a", "b", "c"], { rng: seededRng(1), now: t })).toEqual(["c", "b", "a"]);
  });

  it("upserts one row per item with the last answer, counting up", async () => {
    state.rows = [{ item: "a", seen_count: 3, last_correct: false, last_seen_at: "2026-11-07T10:00:00Z", next_due: null }];
    expect(await recordHistory("u1", "rx", [{ item: "a", correct: false }, { item: "a", correct: true }, { item: "", correct: true }])).toBe(true);
    expect(state.upserts).toHaveLength(1);
    expect(state.upserts[0]).toMatchObject({ user_id: "u1", tool: "rx", item: "a", seen_count: 4, last_correct: true });
  });

  it("ignores unknown tools", async () => {
    expect(await record("u1", "nope" as never, "a", true)).toBe(false);
  });
});
