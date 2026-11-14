import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
/** An in-memory games2_run_steps table (null = table missing). */
const rows = new Map<string, unknown>();
let missing = false;
const k = (r: Record<string, unknown>) => [r.user_id, r.game, r.run, r.step].join("|");
vi.mock("./results", () => ({
  adminDb: () => ({
    from: () => {
      const f: Record<string, unknown> = {};
      const q = {
        select: () => q,
        eq: (c: string, v: unknown) => ((f[c] = v), q),
        maybeSingle: async () => (missing ? { data: null, error: { code: "42P01" } } : { data: rows.has(k(f)) ? { result: rows.get(k(f)) } : null, error: null }),
        insert: async (r: Record<string, unknown>) => {
          if (missing) return { error: { code: "42P01" } };
          if (rows.has(k(r))) return { error: { code: "23505" } };
          rows.set(k(r), r.result);
          return { error: null };
        },
      };
      return q;
    },
  }),
}));

import { oncePerStep } from "./run-steps";

describe("run step replay guard", () => {
  it("keeps the first result of a step: a repeat gets it back and is not fresh", async () => {
    const a = await oncePerStep("u", "rx", "run1", "0", () => ({ right: false }));
    expect(a).toEqual({ result: { right: false }, fresh: true });
    const b = await oncePerStep("u", "rx", "run1", "0", () => ({ right: true }));
    expect(b).toEqual({ result: { right: false }, fresh: false });
    // Another step, run, game or student is its own row.
    expect((await oncePerStep("u", "rx", "run1", "1", () => 1)).fresh).toBe(true);
    expect((await oncePerStep("u", "rx", "run2", "0", () => 1)).fresh).toBe(true);
    expect((await oncePerStep("v", "rx", "run1", "0", () => 1)).fresh).toBe(true);
  });
  it("fails open when the table is missing", async () => {
    missing = true;
    expect(await oncePerStep("u", "rx", "run1", "0", () => 7)).toEqual({ result: 7, fresh: true });
    missing = false;
  });
});
