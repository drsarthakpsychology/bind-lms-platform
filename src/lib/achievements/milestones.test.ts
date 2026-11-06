import { describe, expect, it } from "vitest";
import { evaluate, type EvalCtx } from "./engine";
import { MILESTONES, GROUP_LABEL } from "./milestones";
import { MILESTONE_KINDS } from "./rules";
import { newlyFinishedModules } from "./completion";
import { emptyStudy, type StudyProgress } from "@/lib/learn/engine";

const M = { id: "mse", title: "Interview & MSE", reading: 2, activities: 1, hasTest: true };
const N = { id: "ocd", title: "OCD", reading: 1, activities: 0, hasTest: false };

function ctx(over: Partial<EvalCtx> = {}): EvalCtx {
  return { study: emptyStudy(), xp: 0, watchSeconds: 0, modules: [M, N], courseLessons: new Map(), completedLessons: new Set(), ...over };
}

const complete = (best: number): StudyProgress => ({
  ...emptyStudy(),
  done: { "mse/1": "d", "mse/2": "d" },
  written: { mse: "d" },
  acts: { mse: { a: "d" } },
  tests: { mse: { best, total: 10, day: "d", tries: 1 } },
});

describe("milestone catalogue", () => {
  it("has 30–40 milestones in four groups, unique slugs, known kinds", () => {
    expect(MILESTONES.length).toBeGreaterThanOrEqual(30);
    expect(MILESTONES.length).toBeLessThanOrEqual(40);
    expect(new Set(MILESTONES.map((m) => m.slug)).size).toBe(MILESTONES.length);
    expect(new Set(MILESTONES.map((m) => m.group))).toEqual(new Set(Object.keys(GROUP_LABEL)));
    for (const m of MILESTONES) expect(MILESTONE_KINDS).toContain(m.requirements.kind);
  });
  it("keeps every rare milestone secret", () => {
    for (const m of MILESTONES.filter((x) => x.group === "rare")) expect(m.requirements.secret).toBe(true);
  });
  it("never hands out a milestone for nothing", () => {
    for (const m of MILESTONES) expect(evaluate(m.requirements, ctx()).ok).toBe(false);
  });
});

describe("new requirement kinds", () => {
  it("streak_days uses the best streak", () => {
    expect(evaluate({ kind: "streak_days", min: 30 }, ctx({ streakBest: 30 })).ok).toBe(true);
    expect(evaluate({ kind: "streak_days", min: 30 }, ctx({ streakBest: 29 })).ok).toBe(false);
  });
  it("league_promoted counts promotions and the tier reached", () => {
    expect(evaluate({ kind: "league_promoted", count: 1 }, ctx({ promotions: 1 })).ok).toBe(true);
    expect(evaluate({ kind: "league_promoted", tier: 4 }, ctx({ bestTier: 3 })).ok).toBe(false);
    expect(evaluate({ kind: "league_promoted", tier: 4 }, ctx({ bestTier: 4 })).ok).toBe(true);
    expect(evaluate({ kind: "league_promoted", count: 20, tier: 5 }, ctx({ promotions: 20, bestTier: 4 })).ok).toBe(false);
    expect(evaluate({ kind: "league_promoted" }, ctx({ promotions: 9 })).ok).toBe(false);
  });
  it("duels_won and daily_cases_solved compare counts", () => {
    expect(evaluate({ kind: "duels_won", min: 5 }, ctx({ duelsWon: 5 })).ok).toBe(true);
    expect(evaluate({ kind: "daily_cases_solved", min: 10 }, ctx({ dailyCasesSolved: 9 })).ok).toBe(false);
  });
  it("module_mastered needs the whole module and 80% on the test", () => {
    expect(evaluate({ kind: "module_mastered", module: "mse" }, ctx({ study: complete(8) })).ok).toBe(true);
    expect(evaluate({ kind: "module_mastered", module: "mse" }, ctx({ study: complete(7) })).ok).toBe(false);
    expect(evaluate({ kind: "module_mastered", count: 1 }, ctx({ study: complete(9) })).ok).toBe(true);
    expect(evaluate({ kind: "module_mastered", count: 2 }, ctx({ study: complete(9) })).ok).toBe(false);
    expect(evaluate({ kind: "module_mastered", module: "nope" }, ctx()).ok).toBe(false);
  });
  it("xp_total adds server XP to Learn XP", () => {
    expect(evaluate({ kind: "xp_total", min: 1000 }, ctx({ xp: 900, ledgerXp: 100 })).ok).toBe(true);
    expect(evaluate({ kind: "xp_total", min: 1000 }, ctx({ xp: 900 })).ok).toBe(false);
  });
  it("hides progress on a secret milestone until it is earned", () => {
    expect(evaluate({ kind: "duels_won", min: 300, secret: true }, ctx({ duelsWon: 12 })).reason).toBe("Secret. Keep going.");
    expect(evaluate({ kind: "duels_won", min: 300, secret: true }, ctx({ duelsWon: 300 })).ok).toBe(true);
  });
  it("still answers 'Awarded by the VIBHA team' for unknown kinds", () => {
    expect(evaluate({ kind: "membership" } as never, ctx())).toEqual({ ok: false, reason: "Awarded by the VIBHA team" });
  });
});

describe("module completion on save", () => {
  it("spots a module finished by this save, once", () => {
    const before = { ...complete(8), tests: {} };
    expect(newlyFinishedModules(before, complete(5), [M, N])).toEqual(["mse"]);
    expect(newlyFinishedModules(complete(5), complete(5), [M, N])).toEqual([]);
  });
  it("also spots a retake that reaches mastery", () => {
    expect(newlyFinishedModules(complete(5), complete(9), [M, N])).toEqual(["mse"]);
  });
  it("handles a first save and a module with no test", () => {
    const s = { ...emptyStudy(), done: { "ocd/1": "d" }, written: { ocd: "d" } };
    expect(newlyFinishedModules(null, s, [M, N])).toEqual(["ocd"]);
  });
});
