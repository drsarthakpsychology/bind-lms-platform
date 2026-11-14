import { describe, expect, it } from "vitest";
import { gradeTest, keepServerTests, mcqKey, withTestResult } from "./test-grade";
import { normalise } from "@/lib/learn/engine";
import { MODULES } from "@/lib/study";
import { testSection } from "./plan";
import { splitSection } from "./chunk";

const mcqs = [
  { q: "Q one", options: ["a", "b"], answer: 1 },
  { q: "Q two", options: ["a", "b"], answer: 0 },
  { q: "Q three", options: ["a", "b", "c"], answer: 2 },
];

describe("gradeTest (module tests graded on the server)", () => {
  it("counts only picks that match the server's answers", () => {
    const picks = { [mcqKey("m", mcqs[0])]: 1, [mcqKey("m", mcqs[1])]: 1, [mcqKey("m", mcqs[2])]: 2 };
    expect(gradeTest(mcqs, "m", picks)).toEqual({ right: 2, total: 3 });
  });
  it("cannot be talked into a higher total or score", () => {
    expect(gradeTest(mcqs, "m", { anything: 1, "m:fake": 0 })).toEqual({ right: 0, total: 3 });
    // Keys from another module do not count.
    expect(gradeTest(mcqs, "m", { [mcqKey("other", mcqs[0])]: 1 }).right).toBe(0);
  });
  it("grades a real module test from the server copy", () => {
    const mod = MODULES.find((m) => testSection(m));
    expect(mod).toBeDefined();
    const qs = splitSection(testSection(mod!)!).mcq;
    expect(qs.length).toBeGreaterThan(0);
    const all = Object.fromEntries(qs.map((q) => [mcqKey(mod!.id, q), q.answer]));
    expect(gradeTest(qs, mod!.id, all)).toEqual({ right: qs.length, total: qs.length });
  });
});

describe("withTestResult / keepServerTests (certificate scores are server-owned)", () => {
  it("keeps the best score without touching XP", () => {
    const s0 = normalise(null);
    const s1 = withTestResult(s0, "m", 8, 10, "2026-11-14");
    const s2 = withTestResult(s1, "m", 5, 10, "2026-11-15");
    expect(s2.study.tests.m).toMatchObject({ best: 8, total: 10, tries: 2 });
    expect(s2.xp).toBe(s0.xp);
  });
  it("replaces browser-sent results for server-owned modules", () => {
    const client = { m: { best: 10, total: 10 }, "m@starting": { best: 3, total: 4 }, n: { best: 9, total: 9 } };
    const server = { m: { best: 4, total: 10 } };
    const out = keepServerTests(client, server, ["m", "n"]);
    expect(out.m).toEqual({ best: 4, total: 10 });
    expect(out.n).toBeUndefined();
    expect(out["m@starting"]).toEqual({ best: 3, total: 4 });
  });
});
