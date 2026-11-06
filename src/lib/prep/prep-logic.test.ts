import { describe, expect, it } from "vitest";
import { makeRng } from "@/lib/learn/model/picker";
import { EXAM_SPECS, specById } from "@/content/prep/specs";
import { SUBJECTS } from "./types";
import { GOALS, learnTarget, prepSkill, studyHref, subjectOfSkill, subjectWeights } from "./catalog";
import { allocate, pickPractice, reviewQueue, sampleDiagnostic, sampleMock } from "./sampling";
import { bestPerUser, scoreDiagnostic, scoreMock, standing } from "./scoring";
import { buildPlan, nextActions, statusOf, type PathState, type SkillSnap } from "./plan";
import { pickPanel, selfScore } from "./interview";
import { toView } from "./view";
import { SAMPLE_INTERVIEWS, SAMPLE_QUESTIONS } from "./fixtures.test-data";

const KEY = new Map(SAMPLE_QUESTIONS.map((q) => [q.id, q]));
const NOW = new Date("2026-11-06T10:00:00Z");

describe("exam specs", () => {
  it("every pattern is well formed and mirrors the research numbers", () => {
    const ids = EXAM_SPECS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of EXAM_SPECS) {
      expect(s.minutes).toBeGreaterThan(0);
      expect(s.marksPerRight).toBeGreaterThan(0);
      expect(s.marksPerWrong).toBeLessThanOrEqual(0);
      for (const sec of s.sections) {
        expect(sec.count).toBeGreaterThan(0);
        for (const sub of sec.subjects) expect(SUBJECTS).toContain(sub);
      }
      if (!s.verified) expect(s.source).toBeTruthy();
    }
    const total = (id: string) => specById(id)!.sections.reduce((a, x) => a + x.count, 0);
    expect(total("cuet-pg-huqp20")).toBe(75);
    expect(specById("cuet-pg-huqp20")).toMatchObject({ minutes: 90, marksPerRight: 4, marksPerWrong: -1, verified: true });
    expect(total("ugc-net-04")).toBe(150);
    expect(specById("ugc-net-04")).toMatchObject({ minutes: 180, marksPerRight: 2, marksPerWrong: 0, verified: true });
    expect(specById("nimhans-mclinpsy")).toMatchObject({ minutes: 90, marksPerRight: 1, marksPerWrong: -0.25, verified: false });
    expect(total("ihbas-delhi")).toBe(100);
    expect(total("csjmu-kanpur")).toBe(70);
    expect(specById("gmch-chandigarh")).toMatchObject({ minutes: 120, verified: true });
  });
  it("every goal has at least one pattern", () => {
    for (const g of GOALS) expect(EXAM_SPECS.some((s) => s.exam === g.id)).toBe(true);
  });
});

describe("catalog", () => {
  it("weights sum to 1 per goal and NET Paper 1 is a third of NET", () => {
    for (const g of GOALS) {
      const w = subjectWeights(g.id);
      expect([...w.values()].reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
    }
    expect(subjectWeights("ugc-net").get("ugc-paper1")).toBeCloseTo(1 / 3, 6);
    expect(subjectWeights("cuet-pg").has("ugc-paper1")).toBe(false);
  });
  it("skill keys round-trip", () => {
    expect(prepSkill("statistics")).toBe("prep-statistics:apply");
    expect(subjectOfSkill("prep-statistics:apply")).toBe("statistics");
    expect(subjectOfSkill("depression:criteria")).toBeNull();
  });
  it("learn links prefer the questions' module, then the subject map, and fall back safely", () => {
    expect(learnTarget("psychopathology", SAMPLE_QUESTIONS)).toBe("more-disorders");
    expect(learnTarget("biological", SAMPLE_QUESTIONS)).toBe("brain");
    expect(studyHref("exam-prep/2-2")).toBe("/study/exam-prep/2-2");
    expect(studyHref("exam-prep/9-9", (m, s) => m === "exam-prep" && !s)).toBe("/study/exam-prep");
    expect(studyHref("nope", () => false)).toBe("/study/exam-prep");
  });
  it("views never carry the answer, explanation or source", () => {
    const v = toView({ ...SAMPLE_QUESTIONS[0], ref: "secret book p.1" });
    expect(v).not.toHaveProperty("answer");
    expect(v).not.toHaveProperty("explanation");
    expect(JSON.stringify(v)).not.toContain("secret");
  });
});

describe("sampling", () => {
  it("allocate gives every weighted key a seat and uses every seat", () => {
    const a = allocate(new Map([["a", 0.7], ["b", 0.2], ["c", 0.1]]), 10);
    expect([...a.values()].reduce((x, y) => x + y, 0)).toBe(10);
    expect(a.get("c")).toBeGreaterThanOrEqual(1);
    expect(a.get("a")).toBeGreaterThan(a.get("b")!);
  });
  it("the diagnostic spreads across the goal's subjects with mixed difficulty and no repeats", () => {
    const d = sampleDiagnostic(SAMPLE_QUESTIONS, "ugc-net", makeRng(1));
    expect(d.length).toBeLessThanOrEqual(25);
    expect(new Set(d.map((q) => q.id)).size).toBe(d.length);
    expect(new Set(d.map((q) => q.subject)).size).toBeGreaterThanOrEqual(6);
    expect(new Set(d.map((q) => q.difficulty)).size).toBeGreaterThanOrEqual(3);
    // Subjects interleave: the first two questions are not the same subject.
    expect(d[0].subject).not.toBe(d[1].subject);
  });
  it("the diagnostic leaves out subjects the goal doesn't test", () => {
    const d = sampleDiagnostic(SAMPLE_QUESTIONS, "cuet-pg", makeRng(2));
    expect(d.some((q) => q.subject === "ugc-paper1")).toBe(false);
  });
  it("a mock fills each section from its subjects only, without repeats", () => {
    const paper = sampleMock(SAMPLE_QUESTIONS, specById("ugc-net-04")!, makeRng(3));
    expect(paper.sections.map((s) => s.title)).toEqual(["Paper 1", "Paper 2"]);
    expect(paper.sections[0].ids.every((id) => KEY.get(id)!.subject === "ugc-paper1")).toBe(true);
    expect(paper.sections[1].ids.some((id) => KEY.get(id)!.subject === "ugc-paper1")).toBe(false);
    const all = paper.sections.flatMap((s) => s.ids);
    expect(new Set(all).size).toBe(all.length);
    expect(paper.sections[0].wanted).toBe(50);
  });
  it("a mock puts seen questions last", () => {
    const spec = { ...specById("semester-objective")!, sections: [{ title: "S", count: 2, subjects: ["statistics" as const] }] };
    const seen = new Map([["st-1", 3], ["st-2", 1], ["st-3", 2]]);
    const paper = sampleMock(SAMPLE_QUESTIONS, spec, makeRng(4), seen);
    expect(paper.sections[0].ids.sort()).toEqual(["st-4", "st-5"]);
  });
  it("practice aims near 70 % and stays in the subject", () => {
    const picked = pickPractice(SAMPLE_QUESTIONS, "statistics", { theta: 0, b: () => undefined, due: () => false }, makeRng(5), new Map(), 10);
    expect(picked.length).toBe(5);
    expect(picked.every((p) => KEY.get(p.id)!.subject === "statistics")).toBe(true);
    const mean = picked.reduce((a, p) => a + p.p, 0) / picked.length;
    expect(mean).toBeGreaterThan(0.3);
  });
  it("practice prefers questions near the 70–85 % band for a strong student", () => {
    const picked = pickPractice(SAMPLE_QUESTIONS, "statistics", { theta: 2.5, b: () => undefined, due: () => false }, makeRng(6), new Map(), 2);
    // At theta 2.5: easy (b -1) → 0.97, medium (b 0) → 0.92, hard (b 1) → 0.82 (core), very hard (b 1.8) → 0.67.
    expect(picked.map((p) => p.id)).toContain("st-3");
  });
  it("review queue keeps only missed, due questions that still exist", () => {
    const cards = [
      { id: "a", dueAt: "2026-11-01T00:00:00Z", lapses: 1 },
      { id: "b", dueAt: "2026-11-05T00:00:00Z", lapses: 2 },
      { id: "c", dueAt: "2026-11-01T00:00:00Z", lapses: 0 },
      { id: "d", dueAt: "2026-12-01T00:00:00Z", lapses: 1 },
      { id: "gone", dueAt: "2026-11-01T00:00:00Z", lapses: 1 },
    ];
    expect(reviewQueue(cards, new Set(["a", "b", "c", "d"]), NOW)).toEqual(["a", "b"]);
  });
});

describe("scoring", () => {
  const spec = specById("cuet-pg-huqp20")!;
  const paper = { specId: spec.id, sections: [{ title: "Psychology", ids: ["st-1", "st-2", "st-3", "rm-1", "missing"], wanted: 75 }] };
  it("applies +4 / −1 / 0 and ignores unknown ids", () => {
    const r = scoreMock(spec, paper, { "st-1": 0, "st-2": 0, "st-3": null, "rm-1": 1, missing: 2 }, KEY, { "st-1": 5000, "st-2": -3 });
    expect(r).toMatchObject({ right: 2, wrong: 1, blank: 1, score: 7, max: 16 });
    expect(r.items).toHaveLength(4);
    expect(r.items.find((i) => i.id === "st-1")!.ms).toBe(5000);
    expect(r.items.find((i) => i.id === "st-2")!.ms).toBeNull();
    expect(r.accuracy).toBeCloseTo(2 / 3);
    expect(r.subjects.find((s) => s.subject === "statistics")).toMatchObject({ right: 1, wrong: 1, blank: 1, score: 3 });
  });
  it("handles quarter-mark negatives without float noise", () => {
    const nim = specById("nimhans-mclinpsy")!;
    const r = scoreMock(nim, paper, { "st-1": 0, "st-2": 0, "st-3": 0, "rm-1": 0 }, KEY);
    expect(r.score).toBe(0.25);
  });
  it("rejects out-of-range choices as blank", () => {
    const r = scoreMock(spec, paper, { "st-1": 7, "st-2": "1", "rm-1": 1.5 }, KEY);
    expect(r.blank).toBe(4);
  });
  it("standing: rank, ties and percentile", () => {
    expect(standing(50, [])).toEqual({ rank: 1, of: 1, percentile: null });
    expect(standing(50, [10, 20, 50, 80])).toEqual({ rank: 2, of: 5, percentile: 63 });
    expect(bestPerUser([{ user: "a", score: 5 }, { user: "a", score: 9 }, { user: "b", score: 3 }, { user: "me", score: 99 }], "me").sort()).toEqual([3, 9]);
  });
  it("diagnostic profile: weakest first, skips count as not known", () => {
    const r = scoreDiagnostic(
      [
        { id: "st-1", choice: 0 },
        { id: "st-2", choice: 1 },
        { id: "pp-1", choice: 0 },
        { id: "pp-2", choice: null },
      ],
      KEY,
    );
    expect(r).toMatchObject({ answered: 4, right: 2 });
    expect(r.topics[0].subject).toBe("psychopathology");
    expect(r.topics[r.topics.length - 1].subject).toBe("statistics");
    expect(r.topics[0].level).toBe("weak");
  });
});

describe("plan", () => {
  const snap = (theta: number, n: number): SkillSnap => ({ theta, n, lastAt: NOW.toISOString() });
  it("orders weakest × heaviest first and puts strong topics last", () => {
    const skills = new Map([
      ["ugc-paper1" as const, snap(-1, 5)],
      ["statistics" as const, snap(-1.5, 5)],
      ["social" as const, snap(3, 20)],
    ]);
    const plan = buildPlan("ugc-net", skills, NOW);
    expect(plan[0].subject).toBe("ugc-paper1"); // weight 1/3, weak
    expect(plan[plan.length - 1].subject).toBe("social");
    expect(plan[plan.length - 1].status).toBe("strong");
    expect(plan.find((t) => t.subject === "cognitive")!.status).toBe("new");
  });
  it("status needs enough answers to call a topic strong", () => {
    expect(statusOf(0.9, 3)).toBe("building");
    expect(statusOf(0.9, 8)).toBe("strong");
    expect(statusOf(0.4, 1)).toBe("weak");
    expect(statusOf(null, 0)).toBe("new");
  });
  const base = (over: Partial<PathState> = {}): PathState => ({
    goal: "mcp-entrance",
    diagnosed: true,
    plan: buildPlan("mcp-entrance", new Map(), NOW),
    due: 0,
    answered: 0,
    mocks: 0,
    lastMockAt: null,
    interviews: 0,
    learnHref: (s) => `/study/${s}`,
    now: NOW,
    ...over,
  });
  it("shows only one step before the goal and before the diagnostic", () => {
    expect(nextActions(base({ goal: null }))).toEqual([expect.objectContaining({ kind: "goal" })]);
    expect(nextActions(base({ diagnosed: false }))).toEqual([expect.objectContaining({ kind: "diagnostic" })]);
  });
  it("never shows more than three steps, topic first", () => {
    const a = nextActions(base({ due: 10, answered: 200, mocks: 1, lastMockAt: "2026-10-01T00:00:00Z" }));
    expect(a).toHaveLength(3);
    expect(a.map((x) => x.kind)).toEqual(["topic", "review", "mock"]);
  });
  it("suggests the interview after a mock for clinical entrances only", () => {
    const recent = { answered: 200, mocks: 1, lastMockAt: "2026-11-05T00:00:00Z" };
    expect(nextActions(base(recent)).some((x) => x.kind === "interview")).toBe(true);
    expect(nextActions(base({ ...recent, goal: "cuet-pg", plan: buildPlan("cuet-pg", new Map(), NOW) })).some((x) => x.kind === "interview")).toBe(false);
  });
  it("no mock before enough practice", () => {
    expect(nextActions(base({ answered: 10 })).some((x) => x.kind === "mock")).toBe(false);
  });
});

describe("interview", () => {
  it("draws one per category in panel order for the goal", () => {
    const panel = pickPanel(SAMPLE_INTERVIEWS, "mcp-entrance", makeRng(7));
    expect(panel).toHaveLength(5);
    expect(panel.map((q) => q.category)).toEqual(["motivation", "academic", "clinical-vignette", "assessment", "research"]);
  });
  it("prefers unseen items", () => {
    const panel = pickPanel(SAMPLE_INTERVIEWS, "mcp-entrance", makeRng(8), new Set(["iv-mot-1"]));
    expect(panel[0].id).toBe("iv-mot-2");
  });
  it("self score: coverage minus red flags", () => {
    expect(selfScore(4, 4, 0)).toEqual({ pct: 100, band: "strong" });
    expect(selfScore(4, 2, 1)).toEqual({ pct: 35, band: "weak" });
    expect(selfScore(0, 0, 0).pct).toBe(0);
  });
});
