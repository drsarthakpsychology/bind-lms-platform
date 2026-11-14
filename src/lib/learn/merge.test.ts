import { describe, expect, it } from "vitest";
import { emptyState, normalise, type LearnState } from "./engine";
import { aheadOf, mergeCopies } from "./merge";

const base = (): LearnState => normalise(emptyState());
const withDone = (s: LearnState, k: string, day = "2026-11-14"): LearnState => ({ ...s, study: { ...s.study, done: { ...s.study.done, [k]: day } } });

describe("mergeCopies keeps every mark", () => {
  it("an older copy saved over a newer one keeps the newer section marks", () => {
    const stored = withDone(withDone(base(), "m1/s1"), "m1/s2");
    const older = withDone(base(), "m1/s1");
    const joined = mergeCopies(older, stored);
    expect(Object.keys(joined.study.done).sort()).toEqual(["m1/s1", "m1/s2"]);
  });

  it("keeps notes read, practice ticks, activities and lab results from both", () => {
    const a = { ...base(), notesRead: { n1: "2026-11-10" }, study: { ...base().study, written: { m1: "2026-11-10" }, acts: { m1: { quiz: "2026-11-10" } } } };
    const b = { ...base(), notesRead: { n2: "2026-11-12" }, study: { ...base().study, written: { m2: "2026-11-12" }, acts: { m1: { cards: "2026-11-12" } } } };
    const j = mergeCopies(a, b);
    expect(Object.keys(j.notesRead).sort()).toEqual(["n1", "n2"]);
    expect(Object.keys(j.study.written).sort()).toEqual(["m1", "m2"]);
    expect(j.study.acts.m1).toEqual({ cards: "2026-11-12", quiz: "2026-11-10" });
  });

  it("keeps the best test score and the most study time", () => {
    const a = { ...base(), study: { ...base().study, secs: { m1: 60 }, tests: { m1: { best: 3, total: 10, day: "2026-11-10", tries: 1 } } } };
    const b = { ...base(), study: { ...base().study, secs: { m1: 600 }, tests: { m1: { best: 8, total: 10, day: "2026-11-12", tries: 2 } } } };
    const j = mergeCopies(a, b);
    expect(j.study.secs.m1).toBe(600);
    expect(j.study.tests.m1.best).toBe(8);
  });

  it("the winner decides where to continue from", () => {
    const a = { ...base(), study: { ...base().study, last: { module: "m2", section: "s1" } } };
    const b = { ...base(), study: { ...base().study, last: { module: "m1", section: "s9" } } };
    expect(mergeCopies(a, b).study.last).toEqual({ module: "m2", section: "s1" });
  });
});

describe("aheadOf", () => {
  it("is true when a copy holds a mark the other lacks", () => {
    expect(aheadOf(withDone(base(), "m1/s1"), base())).toBe(true);
    expect(aheadOf({ ...base(), notesRead: { n1: "2026-11-14" } }, base())).toBe(true);
    expect(aheadOf({ ...base(), xp: 5 }, base())).toBe(true);
  });
  it("is false for the same marks, in any key order", () => {
    const a = withDone(withDone(base(), "a/1"), "b/2");
    const b = withDone(withDone(base(), "b/2"), "a/1");
    expect(aheadOf(a, b)).toBe(false);
    expect(aheadOf(base(), withDone(base(), "m1/s1"))).toBe(false);
  });
});
