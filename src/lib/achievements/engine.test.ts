import { describe, expect, it } from "vitest";
import { evaluate, type EvalCtx } from "./engine";
import { emptyStudy, type StudyProgress } from "@/lib/learn/engine";

const M = { id: "mse", title: "Interview & MSE", reading: 3, activities: 2, hasTest: true };

function ctx(over: Partial<EvalCtx> = {}): EvalCtx {
  return {
    study: emptyStudy(),
    xp: 0,
    watchSeconds: 0,
    modules: [M],
    courseLessons: new Map([["c1", ["l1", "l2"]]]),
    completedLessons: new Set(),
    ...over,
  };
}

function study(over: Partial<StudyProgress>): StudyProgress {
  return { ...emptyStudy(), ...over };
}

describe("achievement engine", () => {
  it("module_complete requires all sections, written task, activities and test", () => {
    const full = study({
      done: { "mse/0-1": "d", "mse/0-2": "d", "mse/0-3": "d" },
      written: { mse: "d" },
      acts: { mse: { a1: "d", a2: "d" } },
      tests: { mse: { best: 8, total: 10, day: "d", tries: 1 } },
    });
    expect(evaluate({ kind: "module_complete", module: "mse" }, ctx({ study: full })).ok).toBe(true);

    const noTest = study({
      done: { "mse/0-1": "d", "mse/0-2": "d", "mse/0-3": "d" },
      written: { mse: "d" },
      acts: { mse: { a1: "d", a2: "d" } },
    });
    expect(evaluate({ kind: "module_complete", module: "mse" }, ctx({ study: noTest })).ok).toBe(false);
  });

  it("sections_read counts finished sections", () => {
    const s = study({ done: { "mse/0-1": "d", "mse/0-2": "d" } });
    expect(evaluate({ kind: "sections_read", module: "mse", count: 2 }, ctx({ study: s })).ok).toBe(true);
    expect(evaluate({ kind: "sections_read", module: "mse", count: 3 }, ctx({ study: s })).ok).toBe(false);
  });

  it("xp and watch_seconds compare against totals", () => {
    expect(evaluate({ kind: "xp", min: 200 }, ctx({ xp: 200 })).ok).toBe(true);
    expect(evaluate({ kind: "xp", min: 201 }, ctx({ xp: 200 })).ok).toBe(false);
    expect(evaluate({ kind: "watch_seconds", min: 3600 }, ctx({ watchSeconds: 3600 })).ok).toBe(true);
    expect(evaluate({ kind: "watch_seconds", min: 3601 }, ctx({ watchSeconds: 3600 })).ok).toBe(false);
  });

  it("course_complete requires every lesson in the course", () => {
    expect(evaluate({ kind: "course_complete", course_id: "c1" }, ctx({ completedLessons: new Set(["l1", "l2"]) })).ok).toBe(true);
    expect(evaluate({ kind: "course_complete", course_id: "c1" }, ctx({ completedLessons: new Set(["l1"]) })).ok).toBe(false);
    expect(evaluate({ kind: "course_complete", course_id: "missing" }, ctx({ completedLessons: new Set(["l1", "l2"]) })).ok).toBe(false);
  });

  it("never returns undefined for a kind it can't check (e.g. 'membership' stored in the database)", () => {
    const r = evaluate({ kind: "membership" } as never, ctx());
    expect(r).toEqual({ ok: false, reason: "Awarded by the VIBHA team" });
    expect(evaluate({} as never, ctx()).ok).toBe(false);
  });

  it("is a pure predicate (idempotent — repeated evaluation is stable)", () => {
    const c = ctx({ xp: 500 });
    const first = evaluate({ kind: "xp", min: 100 }, c);
    const second = evaluate({ kind: "xp", min: 100 }, c);
    expect(first).toEqual(second);
    expect(first.ok).toBe(true);
  });
});
