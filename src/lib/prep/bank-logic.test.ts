import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ALL_QUESTIONS } from "@/content/prep/index";
import { makeRng } from "@/lib/learn/model/picker";
import { moduleById, sectionById } from "@/lib/study";
import { BANK_SUBJECTS, SUBJECT_TITLE } from "./catalog";
import { latestAnswered, nextSet, pageOf, resumePoint, savedIds, startIndex, statsOf, wrongIds, type AnswerState } from "./progress";
import { pickSmart } from "./smart";
import { MORE, SET_SIZE, TOPIC_GROUPS, groupOf, setsOf, topicsOf } from "./topics";
import { SUBJECTS } from "./types";

const ans = (ok: boolean | null, at: string, saved = false): AnswerState => ({ choice: ok === null ? null : 0, ok, right: ok ? 1 : 0, wrong: ok === false ? 1 : 0, saved, at });

describe("bank topics", () => {
  it("lists every subject once, NET Paper 1 last", () => {
    expect([...BANK_SUBJECTS].sort()).toEqual([...SUBJECTS].sort());
    expect(BANK_SUBJECTS[BANK_SUBJECTS.length - 1]).toBe("ugc-paper1");
  });
  it("puts almost every question in a named topic", () => {
    const more = ALL_QUESTIONS.filter((q) => groupOf(q.subject, q.topic) === MORE);
    expect(more.length / Math.max(1, ALL_QUESTIONS.length)).toBeLessThan(0.02);
  });
  it("every topic's Learn link points at a real Study module section", () => {
    const bad: string[] = [];
    for (const s of SUBJECTS)
      for (const grp of TOPIC_GROUPS[s])
        for (const l of grp.learn) {
          const [m, sec] = l.split("/");
          const mod = moduleById(m);
          if (!mod || (sec && !sectionById(mod, sec))) bad.push(`${s}/${grp.id}: ${l}`);
        }
    expect(bad).toEqual([]);
  });
  it("orders a topic easier first, in sets of 10", () => {
    const t = topicsOf("statistics", ALL_QUESTIONS, SUBJECT_TITLE.statistics);
    expect(t.length).toBeGreaterThan(5);
    for (const x of t) {
      const d = x.ids.map((id) => ALL_QUESTIONS.find((q) => q.id === id)!.difficulty);
      expect(d).toEqual([...d].sort((a, b) => a - b));
    }
    expect(setsOf([...Array(23).keys()]).map((s) => s.length)).toEqual([SET_SIZE, SET_SIZE, 3]);
  });
});

describe("bank progress", () => {
  const ids = Array.from({ length: 25 }, (_, i) => `q${i}`);
  it("counts percent right over answered questions only", () => {
    const m = new Map([["q0", ans(true, "2026-11-01")], ["q1", ans(false, "2026-11-02")], ["q2", ans(null, "2026-11-03", true)]]);
    expect(statsOf(ids, m)).toEqual({ total: 25, answered: 2, right: 1, pct: 50 });
    expect(statsOf(ids, new Map()).pct).toBeNull();
  });
  it("opens a set at the first unanswered question, and goes round again when all are done", () => {
    const m = new Map(ids.slice(0, 3).map((id) => [id, ans(true, "2026-11-01")]));
    expect(startIndex(ids.slice(0, 10), m)).toBe(3);
    expect(startIndex(ids.slice(0, 3), m)).toBe(0);
    expect(nextSet(ids, new Map(ids.slice(0, 10).map((id) => [id, ans(true, "2026-11-01")])))).toBe(1);
  });
  it("resumes in the topic of the latest answer", () => {
    const m = new Map([["q12", ans(true, "2026-11-05")], ["q0", ans(false, "2026-11-01")]]);
    expect(latestAnswered(m)).toBe("q12");
    const r = resumePoint("q12", () => ({ subject: "statistics", topic: "anova", ids }), m);
    expect(r).toEqual({ subject: "statistics", topic: "anova", set: 1, index: 0 });
    const all = new Map(ids.map((id) => [id, ans(true, "2026-11-01")]));
    expect(resumePoint("q3", () => ({ subject: "s", topic: "t", ids }), all)).toBeNull();
  });
  it("lists saved and wrong questions, newest first, a page at a time", () => {
    const m = new Map([["a", ans(false, "2026-11-01", true)], ["b", ans(true, "2026-11-03", true)], ["c", ans(false, "2026-11-04")]]);
    expect(savedIds(m)).toEqual(["b", "a"]);
    expect(wrongIds(m)).toEqual(["c", "a"]);
    expect(pageOf(ids, 3)).toMatchObject({ page: 3, pages: 3, items: ids.slice(20) });
    expect(pageOf(ids, 99).page).toBe(3);
    expect(pageOf([], 1)).toMatchObject({ page: 1, pages: 1, items: [] });
  });
});

describe("smart practice", () => {
  it("builds 10 from weak subjects and due reviews, reviews first in line", () => {
    const due = new Set(ALL_QUESTIONS.filter((q) => q.subject === "social").slice(0, 3).map((q) => q.id));
    const picked = pickSmart(ALL_QUESTIONS, { theta: () => 0, b: () => undefined, due, weakSubjects: ["statistics", "biological"], weakTopics: new Set(), gotRight: new Set() }, makeRng(7));
    expect(picked).toHaveLength(10);
    expect(new Set(picked.map((p) => p.id)).size).toBe(10);
    for (const p of picked) expect(due.has(p.id) || ["statistics", "biological"].includes(p.family)).toBe(true);
    expect(picked.filter((p) => p.bucket === "review").length).toBe(2);
  });
});

describe("prep code has no em or en dashes", () => {
  const DASH = /[\u2013\u2014]/;
  const files = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const p = join(dir, name);
      return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(name) ? [p] : [];
    });
  for (const root of ["src/app/(dashboard)/prep", "src/lib/prep"]) {
    it(root, () => {
      const hits = files(join(process.cwd(), root)).filter((f) => DASH.test(readFileSync(f, "utf8")));
      expect(hits).toEqual([]);
    });
  }
});
