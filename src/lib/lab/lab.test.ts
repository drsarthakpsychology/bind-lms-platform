import { describe, expect, it } from "vitest";
import {
  checkScore,
  cowanK,
  curveRegions,
  digitSequence,
  editDistanceAtMostOne,
  illusionBias,
  median,
  parseRecall,
  recalledPositions,
  seeded,
  serialCurve,
  simulateSchedule,
  spanCorrect,
  spanFromTrials,
  spanShouldStop,
  stroopEffect,
  stroopTrials,
  WORD_POOL,
  type StroopResponse,
} from "./scoring";
import { BIAS_CASES, BIASES, EXPERIMENTS, experimentById } from "./experiments";
import { emptyState, labRechecksDue, normalise, recordLabCheck, recordLabReflection, recordLabRun, LAB_XP } from "@/lib/learn/engine";
import { mergeCopies } from "@/lib/learn/store";
import { moduleById } from "@/lib/study";
import { STUDENT_SOURCING } from "@/lib/casebook/validate";
import { ATTRIBUTION_CASES, CONS_ITEMS, CONS_TASK_TEXT, CORR_SCENARIOS } from "./experiments2";
import { THREATS } from "./scoring2";

describe("seeded random", () => {
  it("repeats for the same seed", () => {
    const a = seeded(42);
    const b = seeded(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});

describe("digit span", () => {
  it("never repeats a digit back to back", () => {
    const seq = digitSequence(50, seeded(1));
    expect(seq).toHaveLength(50);
    for (let i = 1; i < seq.length; i++) expect(seq[i]).not.toBe(seq[i - 1]);
  });
  it("scores forwards and backwards, ignoring spaces", () => {
    expect(spanCorrect([3, 8, 1], "3 8 1", false)).toBe(true);
    expect(spanCorrect([3, 8, 1], "183", true)).toBe(true);
    expect(spanCorrect([3, 8, 1], "381", true)).toBe(false);
  });
  it("span is the longest length passed and stops after two failures", () => {
    const t = [
      { length: 3, correct: true },
      { length: 4, correct: true },
      { length: 5, correct: false },
      { length: 5, correct: true },
      { length: 6, correct: false },
      { length: 6, correct: false },
    ];
    expect(spanFromTrials(t)).toBe(5);
    expect(spanShouldStop(t, 6)).toBe(true);
    expect(spanShouldStop(t, 5)).toBe(false);
  });
});

describe("serial position", () => {
  it("has a big enough word pool with no duplicates", () => {
    expect(new Set(WORD_POOL).size).toBe(WORD_POOL.length);
    expect(WORD_POOL.length).toBeGreaterThanOrEqual(36);
  });
  it("parses recall and forgives one-letter typos", () => {
    expect(parseRecall("Candle, river\nriver  MONKY")).toEqual(["candle", "river", "monky"]);
    expect(editDistanceAtMostOne("monky", "monkey")).toBe(true);
    expect(editDistanceAtMostOne("cat", "car")).toBe(false); // too short to forgive
    expect(editDistanceAtMostOne("ladder", "laddle")).toBe(false);
    expect(recalledPositions(["candle", "river", "monkey"], ["monky", "candle"])).toEqual([true, false, true]);
  });
  it("builds a curve and splits it into regions", () => {
    const curve = serialCurve([
      [true, true, true, false, false, false, false, false, false, true, true, true],
      [true, true, false, false, true, false, false, false, false, false, true, true],
    ]);
    expect(curve[0]).toBe(1);
    expect(curve[4]).toBe(0.5);
    const r = curveRegions(curve);
    expect(r.primacy).toBeGreaterThan(r.middle);
    expect(r.recency).toBeGreaterThan(r.middle);
  });
});

describe("stroop", () => {
  it("makes half congruent trials, and incongruent words never match the ink", () => {
    const t = stroopTrials(40, seeded(3));
    expect(t.filter((x) => x.congruent)).toHaveLength(20);
    for (const x of t) expect(x.congruent ? x.word === x.ink : x.word !== x.ink).toBe(true);
  });
  it("computes the effect from medians of correct trials and drops anticipations", () => {
    const rs: StroopResponse[] = [];
    for (let i = 0; i < 6; i++) rs.push({ word: "red", ink: "red", congruent: true, answer: "red", rt: 500 + i });
    for (let i = 0; i < 6; i++) rs.push({ word: "blue", ink: "red", congruent: false, answer: "red", rt: 600 + i });
    rs.push({ word: "blue", ink: "red", congruent: false, answer: "blue", rt: 3000 }); // error, excluded
    rs.push({ word: "red", ink: "red", congruent: true, answer: "red", rt: 50 }); // anticipation, excluded
    const e = stroopEffect(rs);
    expect(e.congruentMs).toBe(503);
    expect(e.incongruentMs).toBe(603);
    expect(e.effectMs).toBe(100);
    expect(e.incongruentErrors).toBe(1);
    expect(e.usable).toBe(true);
  });
});

describe("digit span stop rule, run like the runner", () => {
  // Two trials per length; move up after two; stop after two failures at one length.
  function simulate(start: number, passUpTo: number) {
    const trials: { length: number; correct: boolean }[] = [];
    let length = start;
    for (let guard = 0; guard < 40; guard++) {
      trials.push({ length, correct: length <= passUpTo });
      const atLen = trials.filter((t) => t.length === length);
      if (spanShouldStop(trials, length) || (length >= 10 && atLen.length >= 2)) break;
      if (atLen.length >= 2) length++;
    }
    return trials;
  }
  it("stops after two misses and reports the longest length passed", () => {
    const t = simulate(3, 6);
    expect(spanFromTrials(t)).toBe(6);
    expect(t.at(-1)).toEqual({ length: 7, correct: false });
    expect(t).toHaveLength(10); // 3,3,4,4,5,5,6,6,7,7
  });
  it("one miss at a length is not enough to stop", () => {
    const t = [
      { length: 4, correct: false },
      { length: 4, correct: true },
    ];
    expect(spanShouldStop(t, 4)).toBe(false);
    expect(spanFromTrials(t)).toBe(4);
  });
});

describe("serial position shape", () => {
  it("recalling only the first and last three words gives a U", () => {
    const list = WORD_POOL.slice(0, 12);
    const typed = [...list.slice(0, 3), ...list.slice(-3)].join(", ");
    const r = curveRegions(serialCurve([recalledPositions(list, parseRecall(typed))]));
    expect(r).toEqual({ primacy: 1, middle: 0, recency: 1 });
  });
});

describe("change detection", () => {
  it("a 4-item observer gives K = 2 at size 2 and K = 4 at size 4", () => {
    const t: { setSize: number; changed: boolean; saidChanged: boolean }[] = [];
    for (const n of [2, 4]) for (const changed of [true, false, true, false]) t.push({ setSize: n, changed, saidChanged: changed });
    expect(cowanK(t).map((k) => k.k)).toEqual([2, 4]);
  });
  it("K is zero for someone who always says changed", () => {
    const t = [true, false, true, false].map((changed) => ({ setSize: 4, changed, saidChanged: true }));
    expect(cowanK(t)[0].k).toBe(0);
  });
  it("K equals set size for a perfect observer", () => {
    const t = [true, false, true, false].map((changed) => ({ setSize: 6, changed, saidChanged: changed }));
    expect(cowanK(t)[0].k).toBe(6);
  });
});

describe("illusion and schedules", () => {
  it("bias is percent over the true length", () => {
    expect(illusionBias(200, 230)).toBe(15);
    expect(illusionBias(200, 180)).toBe(-10);
  });
  it("variable ratio out-responds fixed interval, and intermittent history resists extinction", () => {
    const vr = simulateSchedule({ schedule: "VR", value: 10, seconds: 60 });
    const fi = simulateSchedule({ schedule: "FI", value: 15, seconds: 60 });
    expect(vr.total).toBeGreaterThan(fi.total);
    expect(vr.rewards.length).toBeGreaterThan(0);
    const extCont = simulateSchedule({ schedule: "EXT", value: 1, seconds: 60, history: "continuous" });
    const extInt = simulateSchedule({ schedule: "EXT", value: 1, seconds: 60, history: "intermittent" });
    expect(extInt.total).toBeGreaterThan(extCont.total);
    expect(extCont.rewards).toHaveLength(0);
  });
  it("cumulative record never goes down", () => {
    const { cumulative } = simulateSchedule({ schedule: "FI", value: 10, seconds: 40 });
    for (let i = 1; i < cumulative.length; i++) expect(cumulative[i]).toBeGreaterThanOrEqual(cumulative[i - 1]);
  });
  it("median and check score", () => {
    expect(median([5, 1, 3])).toBe(3);
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(checkScore([1, 0, 2], [1, 1, 2])).toBe(2);
  });
});

describe("catalogue integrity", () => {
  it("ids are unique, numbered in order, and resolvable", () => {
    expect(new Set(EXPERIMENTS.map((e) => e.id)).size).toBe(EXPERIMENTS.length);
    EXPERIMENTS.forEach((e, i) => expect(e.num).toBe(i + 1));
    expect(experimentById("stroop")?.title).toBe("Stroop");
  });
  it("every check has a valid answer, every experiment has refs and real related modules", () => {
    for (const e of EXPERIMENTS) {
      expect(e.checks.length).toBeGreaterThanOrEqual(3);
      for (const c of e.checks) expect(c.answer).toBeLessThan(c.options.length);
      expect(e.refs.length).toBeGreaterThan(0);
      for (const r of e.related) expect(moduleById(r), `${e.id} → ${r}`).toBeDefined();
    }
  });
  it("bias cases name a known bias and a valid fix", () => {
    for (const c of BIAS_CASES) {
      expect(BIASES).toContain(c.bias);
      expect(c.fix).toBeLessThan(c.fixes.length);
    }
  });
});

describe("lab progress in the learn state", () => {
  const day = "2026-11-03";
  it("first run earns XP; a same-day re-run does not; a later re-run earns a little", () => {
    let s = recordLabRun(emptyState(), "stroop", { effect: 120 }, day);
    expect(s.xp).toBe(LAB_XP.firstRun);
    expect(s.lab.stroop.recheck.due).toBe("2026-11-06");
    const same = recordLabRun(s, "stroop", { effect: 100 }, day);
    expect(same.xp).toBe(s.xp);
    expect(same.lab.stroop.runs).toBe(2);
    s = recordLabRun(s, "stroop", { effect: 90 }, "2026-11-05");
    expect(s.xp).toBe(LAB_XP.firstRun + LAB_XP.rerun);
  });
  it("re-checks come due and move out after a good score, back after a weak one", () => {
    let s = recordLabRun(emptyState(), "digit-span", { forward: 7 }, day);
    s = recordLabCheck(s, "digit-span", 3, 3, day);
    expect(labRechecksDue(s, day)).toEqual([]);
    expect(labRechecksDue(s, "2026-11-06")).toEqual(["digit-span"]);
    const good = recordLabCheck(s, "digit-span", 3, 3, "2026-11-06");
    expect(good.lab["digit-span"].recheck).toEqual({ step: 1, due: "2026-11-16" });
    const weak = recordLabCheck(s, "digit-span", 1, 3, "2026-11-06");
    expect(weak.lab["digit-span"].recheck).toEqual({ step: 0, due: "2026-11-09" });
  });
  it("only checked records come due, oldest first; a check that was not due pays nothing", () => {
    let s = recordLabRun(emptyState(), "stroop", { effect: 90 }, "2026-10-01");
    s = recordLabRun(s, "digit-span", { forward: 6 }, "2026-10-01"); // never checked: never due
    s = recordLabRun(s, "schedules", { tried: 2 }, "2026-10-05");
    s = recordLabCheck(s, "stroop", 2, 3, "2026-10-01");
    s = recordLabCheck(s, "schedules", 3, 3, "2026-10-05");
    expect(labRechecksDue(s, day)).toEqual(["stroop", "schedules"]);
    const early = recordLabCheck(s, "stroop", 3, 3, "2026-10-02");
    expect(labRechecksDue(s, "2026-10-03")).toEqual([]);
    expect(early.xp).toBe(s.xp);
    expect(early.lab.stroop.recheck).toEqual(s.lab.stroop.recheck);
    const done = recordLabCheck(s, "stroop", 2, 3, day);
    expect(done.xp).toBe(s.xp + 2 * LAB_XP.checkPerRight);
    expect(labRechecksDue(done, day)).toEqual(["schedules"]);
  });
  it("after the last interval the re-check settles at 90 days", () => {
    let s = recordLabRun(emptyState(), "stroop", {}, day);
    s = recordLabCheck(s, "stroop", 3, 3, day);
    for (let k = 0; k < 3; k++) s = recordLabCheck(s, "stroop", 3, 3, s.lab.stroop.recheck.due);
    expect(s.lab.stroop.recheck.step).toBe(3);
    const last = s.lab.stroop.recheck.due;
    s = recordLabCheck(s, "stroop", 3, 3, last);
    expect(s.lab.stroop.recheck.step).toBe(3);
    expect(Date.parse(s.lab.stroop.recheck.due) - Date.parse(last)).toBe(90 * 86400000);
  });
  it("a check without a run is ignored; reflection pays once", () => {
    expect(recordLabCheck(emptyState(), "x", 3, 3, day).lab).toEqual({});
    let s = recordLabRun(emptyState(), "schedules", {}, day);
    s = recordLabReflection(s, "schedules", day);
    const again = recordLabReflection(s, "schedules", day);
    expect(again.xp).toBe(s.xp);
    expect(s.lab.schedules.reflected).toBe(true);
  });
  it("normalise drops junk and keeps good records; merge keeps both copies' labs", () => {
    const n = normalise({ lab: { ok: { runs: 2, first: day, last: day, result: { a: 1, b: "x" } }, "BAD ID": { first: day, last: day }, nodate: { runs: 1 } } });
    expect(Object.keys(n.lab)).toEqual(["ok"]);
    expect(n.lab.ok.result).toEqual({ a: 1 });
    expect(n.lab.ok.recheck.due).toBe("2026-11-06");
    const a = recordLabRun(emptyState(), "stroop", {}, day);
    const b = recordLabRun(emptyState(), "schedules", {}, day);
    expect(Object.keys(mergeCopies(a, b).lab).sort()).toEqual(["schedules", "stroop"]);
  });
});

describe("lab: students see the teaching, not the sourcing", () => {
  /**
   * Student-visible Lab fields: title, hook, question, steps, finding, theory,
   * clinic, evidence.status, checks (q, options, why), reflect; plus the
   * runner data (bias cases, conservation tasks, attribution cases,
   * correlation scenarios, design threats). Admin-only: refs, bookRefs,
   * review, evidence.note.
   */
  const AUTHOR_YEAR = /\b[A-Z][a-z]+(?:,| and| &| et al\.?)[^()]{0,40}\b(1[89]\d\d|20[0-2]\d)\b|\((?:[A-Z][a-z]+[^()]*,\s*)(1[89]\d\d|20[0-2]\d)\)|\b[A-Z][a-z]+ (?:and|&) [A-Z][a-z]+ (?:showed|found|demonstrated)\b|\bIn (1[89]\d\d|20[0-2]\d)\b|\b[A-Z][a-z]+, [A-Z]\.(?: [A-Z]\.)* \((1[89]\d\d|20[0-2]\d)\)/;
  const visible = (e: (typeof EXPERIMENTS)[number]) => [e.title, e.hook, e.question, ...e.steps, e.finding, ...e.theory, ...e.clinic, e.evidence.status, ...e.checks.flatMap((c) => [c.q, ...c.options, c.why]), e.reflect];
  const runnerText = JSON.stringify([BIAS_CASES, CONS_ITEMS, CONS_TASK_TEXT, ATTRIBUTION_CASES, CORR_SCENARIOS, THREATS]);
  it("no student-visible string names a book, a page, the review or an author-year citation", () => {
    const hits = EXPERIMENTS.flatMap((e) => visible(e).filter((t) => STUDENT_SOURCING.test(t) || AUTHOR_YEAR.test(t)).map((t) => `${e.id}: ${t}`));
    expect(hits).toEqual([]);
    expect(STUDENT_SOURCING.test(runnerText) || AUTHOR_YEAR.test(runnerText)).toBe(false);
  });
  it("the check would catch a citation", () => {
    for (const t of ["(Miller, 1956)", "Jones & Harris showed", "In 1920 Watson and Rayner", "Cowan, N. (2001)"]) expect(AUTHOR_YEAR.test(t), t).toBe(true);
  });
  it("refs stay as data for admins", () => {
    for (const e of EXPERIMENTS) expect(e.refs.length, e.id).toBeGreaterThan(0);
  });
});
