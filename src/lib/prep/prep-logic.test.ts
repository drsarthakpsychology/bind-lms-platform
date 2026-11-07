import { describe, expect, it } from "vitest";
import { makeRng } from "@/lib/learn/model/picker";
import { ALL_SPECS, EXAM_SPECS, PRACTICE_SPECS, SUBJECT_GROUPS, specById } from "@/content/prep/specs";
import { SUBJECTS, type PrepQuestion } from "./types";
import { EXAM_TRACKS_ENABLED, GOALS, PREP_EXAMS, PREP_TITLE, SUBJECT_MODULE, activeGoal, learnTarget, planWeights, prepSkill, specVisible, studyHref, subjectOfSkill, subjectWeights, topicModules, unifiedWeights } from "./catalog";
import { allocate, diagnosticSize, mixByDifficulty, pickPractice, reviewQueue, sampleDiagnostic, sampleMock, stepUp } from "./sampling";
import { bestPerUser, scoreDiagnostic, scoreMock, standing } from "./scoring";
import { buildPlan, nextActions, statusOf, type PathState, type SkillSnap } from "./plan";
import { pickPanel, selfScore } from "./interview";
import { toView } from "./view";
import { SAMPLE_INTERVIEWS, SAMPLE_QUESTIONS } from "./fixtures.test-data";

const KEY = new Map(SAMPLE_QUESTIONS.map((q) => [q.id, q]));
const NOW = new Date("2026-11-06T10:00:00Z");

describe("exam specs", () => {
  it("every pattern is well formed and mirrors the research numbers", () => {
    const ids = ALL_SPECS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of ALL_SPECS) {
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
  it("the shared mocks: 100 in 120 minutes over every subject, 50-question sectionals, +1 / -0.25", () => {
    const full = specById("psych-full")!;
    expect(full).toMatchObject({ exam: null, minutes: 120, marksPerRight: 1, marksPerWrong: -0.25 });
    expect(full.sections.reduce((a, x) => a + x.count, 0)).toBe(100);
    // The union of every exam's syllabus: no subject left out.
    expect(new Set(full.sections.flatMap((x) => x.subjects))).toEqual(new Set(SUBJECTS));
    expect(new Set(SUBJECT_GROUPS.flatMap((g) => g.subjects)).size).toBe(SUBJECTS.length);
    const parts = PRACTICE_SPECS.slice(1);
    expect(parts).toHaveLength(SUBJECT_GROUPS.length);
    for (const p of parts) expect(p).toMatchObject({ exam: null, minutes: 60, marksPerRight: 1, marksPerWrong: -0.25, sections: [expect.objectContaining({ count: 50 })] });
  });
  it("no en or em dashes in anything a student reads from the specs", () => {
    for (const s of ALL_SPECS) expect(JSON.stringify([s.title, s.short, s.cycle, s.source, s.notes, s.sections.map((x) => x.title)]), s.id).not.toMatch(/[\u2013\u2014]/);
  });
});

describe("one shared course (exam tracks off)", () => {
  it("is the default, and hides exam choices", () => {
    expect(EXAM_TRACKS_ENABLED).toBe(false);
    expect(activeGoal("cuet-pg")).toBeNull();
    expect(activeGoal("cuet-pg", true)).toBe("cuet-pg");
    expect(specVisible(specById("psych-full")!)).toBe(true);
    expect(specVisible(specById("cuet-pg-huqp20")!)).toBe(false);
    expect(specVisible(specById("cuet-pg-huqp20")!, true)).toBe(true);
  });
  it("names the section and the three exams, without dashes", () => {
    expect(PREP_TITLE).toBe("Psychology Entrance & Competitive Exam Preparation");
    expect(PREP_EXAMS.join(" · ")).toBe("CUET-PG · UGC-NET · Clinical Psychology Entrances (M.Clin.Psy) · MD Psychiatry");
    expect(PREP_TITLE + PREP_EXAMS.join("")).not.toMatch(/[\u2013\u2014]/);
  });
  it("weights every subject, averaged over the exams, summing to 1", () => {
    const w = unifiedWeights();
    expect([...w.keys()].sort()).toEqual([...SUBJECTS].sort());
    expect([...w.values()].reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
    for (const v of w.values()) expect(v).toBeGreaterThan(0);
    // Tested by every exam beats tested by one.
    expect(w.get("psychopathology")!).toBeGreaterThan(w.get("organisational")!);
    // NET Paper 1 is part of the one course.
    expect(w.get("ugc-paper1")!).toBeGreaterThan(0.05);
    expect(planWeights(null)).toEqual(w);
    expect(planWeights("cuet-pg")).toEqual(subjectWeights("cuet-pg"));
  });
  it("a subject no pattern names still gets a share", () => {
    const w = unifiedWeights([{ ...specById("cuet-pg-huqp20")!, sections: [{ title: "x", count: 10, subjects: ["statistics"] }] }]);
    expect(w.get("ugc-paper1")!).toBeGreaterThan(0);
    expect(w.get("statistics")!).toBeGreaterThan(w.get("ugc-paper1")!);
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
    expect(learnTarget("psychopathology", SAMPLE_QUESTIONS)[0]).toBe("more-disorders");
    expect(learnTarget("psychopathology", SAMPLE_QUESTIONS)).toContain("exam-prep/3-1");
    expect(learnTarget("biological", SAMPLE_QUESTIONS)).toEqual(["brain"]);
    expect(studyHref("exam-prep/2-2")).toBe("/study/exam-prep/2-2");
    expect(studyHref("exam-prep/9-9", (m, s) => m === "exam-prep" && !s)).toBe("/study/exam-prep");
    expect(studyHref("nope", () => false)).toBe("/study/exam-prep");
  });
  it("learn links go to the new dedicated modules when they exist, else the old mapping", () => {
    expect(SUBJECT_MODULE.cognitive[0]).toBe("thinking-language");
    expect(SUBJECT_MODULE["perception-attention"][0]).toBe("sensation-perception");
    expect(SUBJECT_MODULE["learning-motivation-emotion"][0]).toBe("learning-memory");
    expect(SUBJECT_MODULE.developmental[0]).toBe("lifespan");
    expect(SUBJECT_MODULE["history-systems"][0]).toBe("foundations");
    expect(SUBJECT_MODULE["indian-psychology"][0]).toBe("foundations");
    expect(SUBJECT_MODULE["ugc-paper1"][0]).toBe("net-paper1");
    for (const s of ["health", "positive", "organisational"] as const) expect(SUBJECT_MODULE[s][0]).toBe("applied");
    expect(SUBJECT_MODULE.counselling[0]).toBe("therapies");
    expect(topicModules("learning-motivation-emotion", "intrinsic-motivation")[0]).toBe("motivation-emotion");
    expect(topicModules("learning-motivation-emotion", "operant-conditioning")[0]).toBe("learning-memory");
    const live = new Set(["exam-prep", "child"]);
    const exists = (m: string, s?: string) => live.has(m) && (!s || s === "2-3");
    expect(studyHref(SUBJECT_MODULE.cognitive, exists)).toBe("/study/exam-prep/2-3");
    expect(studyHref(SUBJECT_MODULE.developmental, exists)).toBe("/study/child");
    live.add("thinking-language");
    expect(studyHref(SUBJECT_MODULE.cognitive, exists)).toBe("/study/thinking-language");
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
  it("the diagnostic leaves out subjects the goal doesn't test (exam tracks)", () => {
    const d = sampleDiagnostic(SAMPLE_QUESTIONS, "cuet-pg", makeRng(2));
    expect(d.some((q) => q.subject === "ugc-paper1")).toBe(false);
  });
  it("the shared-course diagnostic samples every subject, easier first within each", () => {
    expect(diagnosticSize(null)).toBe(30);
    const d = sampleDiagnostic(SAMPLE_QUESTIONS, null, makeRng(2));
    expect(new Set(d.map((q) => q.subject))).toEqual(new Set(SAMPLE_QUESTIONS.map((q) => q.subject)));
    expect(new Set(d.map((q) => q.id)).size).toBe(d.length);
    const last = new Map<string, number>();
    for (const q of d) {
      expect(q.difficulty).toBeGreaterThanOrEqual(last.get(q.subject) ?? 0);
      last.set(q.subject, q.difficulty);
    }
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
  it("the full shared mock draws from every subject group, untagged, at mixed difficulty", () => {
    const paper = sampleMock(SAMPLE_QUESTIONS, specById("psych-full")!, makeRng(9));
    expect(paper.sections).toHaveLength(SUBJECT_GROUPS.length);
    const all = paper.sections.flatMap((s) => s.ids);
    expect(new Set(all).size).toBe(all.length);
    // The sample bank is small, so every question fits.
    expect(all.length).toBe(SAMPLE_QUESTIONS.length);
    expect(paper.sections.find((s) => s.title.includes("NET Paper 1"))!.ids.every((id) => KEY.get(id)!.subject === "ugc-paper1")).toBe(true);
  });
  it("mixByDifficulty spreads levels instead of bunching one", () => {
    const qs = SAMPLE_QUESTIONS.filter((q) => q.subject === "statistics");
    const sorted = [...qs].sort((a, b) => b.difficulty - a.difficulty);
    expect(new Set(mixByDifficulty(sorted).slice(0, 3).map((q) => q.difficulty)).size).toBe(3);
    expect(mixByDifficulty(sorted)).toHaveLength(qs.length);
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
  it("steps up a level as ability grows", () => {
    expect(stepUp(-2)).toBe(1);
    expect(stepUp(0)).toBe(2);
    expect(stepUp(1.5)).toBe(3);
    expect(stepUp(2.6)).toBe(4);
    expect(stepUp(5)).toBe(4);
  });
  const ladder = (counts: Record<1 | 2 | 3 | 4, number>): PrepQuestion[] =>
    ([1, 2, 3, 4] as const).flatMap((d) => Array.from({ length: counts[d] }, (_, i) => ({ ...SAMPLE_QUESTIONS[0], id: `l${d}-${i}`, topic: `t${i % 3}`, difficulty: d })));
  it("practice starts a new subject near easy and medium", () => {
    const bank = ladder({ 1: 8, 2: 8, 3: 8, 4: 8 });
    const lvl = new Map(bank.map((q) => [q.id, q.difficulty]));
    const picked = pickPractice(bank, "statistics", { theta: 0, b: () => undefined, due: () => false }, makeRng(11), new Map(), 10);
    const levels = picked.map((p) => lvl.get(p.id)!);
    expect(levels.filter((d) => d <= 2).length).toBeGreaterThanOrEqual(8);
    expect(levels).not.toContain(4);
    expect(levels).toContain(2);
  });
  it("practice brings in very hard questions once ability is high", () => {
    // Plenty of hard questions sit in the 70 to 85 % band at theta 2.6; very hard (69 %) would never be picked without the climb.
    const bank = ladder({ 1: 0, 2: 4, 3: 14, 4: 3 });
    const lvl = new Map(bank.map((q) => [q.id, q.difficulty]));
    const picked = pickPractice(bank, "statistics", { theta: 2.6, b: () => undefined, due: () => false }, makeRng(12), new Map(), 10);
    expect(picked).toHaveLength(10);
    expect(new Set(picked.map((p) => p.id)).size).toBe(10);
    expect(picked.some((p) => lvl.get(p.id) === 4)).toBe(true);
    const mean = picked.reduce((a, p) => a + p.p, 0) / picked.length;
    expect(mean).toBeGreaterThan(0.7);
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
  it("the shared plan lists every subject, weakest and most tested first", () => {
    const plan = buildPlan(null, new Map([["statistics" as const, snap(-3, 8)], ["organisational" as const, snap(3, 20)]]), NOW);
    expect(plan.map((t) => t.subject).sort()).toEqual([...SUBJECTS].sort());
    expect(plan[0].subject).toBe("statistics");
    expect(plan[plan.length - 1].subject).toBe("organisational");
    // Untested: the most-tested subject comes before the least.
    const at = (s: string) => plan.findIndex((t) => t.subject === s);
    expect(at("ugc-paper1")).toBeLessThan(at("positive"));
  });
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
    tracks: true,
    ...over,
  });
  it("shows only one step before the goal and before the diagnostic (exam tracks)", () => {
    expect(nextActions(base({ goal: null }))).toEqual([expect.objectContaining({ kind: "goal" })]);
    expect(nextActions(base({ diagnosed: false }))).toEqual([expect.objectContaining({ kind: "diagnostic" })]);
  });
  it("never asks for an exam with tracks off: the starting check covers every subject", () => {
    const shared = (over: Partial<PathState> = {}) => base({ goal: null, tracks: false, plan: buildPlan(null, new Map(), NOW), ...over });
    const a = nextActions(shared({ diagnosed: false }));
    expect(a).toEqual([expect.objectContaining({ kind: "diagnostic" })]);
    expect(a[0].why).toMatch(/30 questions across every subject/);
    expect(nextActions(shared()).some((x) => x.kind === "goal")).toBe(false);
    // A stored goal is ignored while tracks are off.
    expect(nextActions(shared({ goal: "cuet-pg", diagnosed: false }))[0].kind).toBe("diagnostic");
    expect(nextActions(shared()).length).toBeLessThanOrEqual(3);
  });
  it("offers the interview to everyone in the shared course after a mock", () => {
    const st = base({ goal: null, tracks: false, plan: buildPlan(null, new Map(), NOW), answered: 200, mocks: 1, lastMockAt: "2026-11-05T00:00:00Z" });
    expect(nextActions(st).some((x) => x.kind === "interview")).toBe(true);
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
  it("draws from every category and exam with no goal", () => {
    const panel = pickPanel(SAMPLE_INTERVIEWS, null, makeRng(7), new Set(), 7);
    expect(new Set(panel.map((q) => q.category)).size).toBe(7);
    expect(panel.some((q) => q.id === "iv-cur-1")).toBe(true);
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
