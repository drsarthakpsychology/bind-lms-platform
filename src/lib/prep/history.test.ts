import { describe, expect, it } from "vitest";
import { ALL_QUESTIONS } from "@/content/prep/index";
import { specById } from "@/content/prep/specs";
import { makeRng } from "@/lib/learn/model/picker";
import { SAMPLE_QUESTIONS } from "./fixtures.test-data";
import { prepHistory } from "./history";
import { nextSet, startIndex, type AnswerState } from "./progress";
import { sampleMock } from "./sampling";
import { pickSmart } from "./smart";

const NOW = Date.parse("2026-11-08T10:00:00Z");
const ans = (ok: boolean, at: string): AnswerState => ({ choice: 0, ok, right: ok ? 1 : 0, wrong: ok ? 0 : 1, saved: false, at });

describe("prep answer history", () => {
  it("reads prep_answers and prep_seen as history rows", () => {
    const h = prepHistory(new Map([["a", ans(false, "2026-11-01T00:00:00Z")]]), new Map([["b", { n: 2, at: "2026-11-02T00:00:00Z" }], ["a", { n: 3, at: null }]]));
    expect(h.get("a")).toMatchObject({ ok: false, seen: 3 });
    expect(h.get("b")).toMatchObject({ ok: null, seen: 2 });
  });

  it("a mock takes never-seen questions first, then wrong, right ones last", () => {
    const spec = { ...specById("semester-objective")!, sections: [{ title: "S", count: 3, subjects: ["statistics" as const] }] };
    const h = prepHistory(new Map([["st-1", ans(true, "2026-11-01T00:00:00Z")], ["st-2", ans(true, "2026-11-01T00:00:00Z")], ["st-3", ans(false, "2026-11-01T00:00:00Z")]]));
    for (let seed = 1; seed < 15; seed++) {
      const ids = sampleMock(SAMPLE_QUESTIONS, spec, makeRng(seed), new Map(), { history: h, now: NOW }).sections[0].ids;
      expect([...ids].sort()).toEqual(["st-3", "st-4", "st-5"]);
      expect(ids[0]).not.toBe("st-3");
    }
  });

  it("a mock recycles right answers oldest first once everything is seen", () => {
    const spec = { ...specById("semester-objective")!, sections: [{ title: "S", count: 1, subjects: ["statistics" as const] }] };
    const all = SAMPLE_QUESTIONS.filter((q) => q.subject === "statistics").map((q, i) => [q.id, ans(true, `2026-11-0${i + 1}T00:00:00Z`)] as const);
    const ids = sampleMock(SAMPLE_QUESTIONS, spec, makeRng(3), new Map(), { history: prepHistory(new Map(all)), now: NOW }).sections[0].ids;
    expect(ids).toEqual([all[0][0]]);
  });

  it("smart practice holds back right answers and opens with a new question", () => {
    const stats = ALL_QUESTIONS.filter((q) => q.subject === "statistics");
    const right = new Map(stats.slice(0, Math.max(0, stats.length - 15)).map((q) => [q.id, ans(true, "2026-11-01T00:00:00Z")]));
    const wrong = stats.slice(-15, -12).map((q) => [q.id, ans(false, "2026-11-01T00:00:00Z")] as const);
    const h = prepHistory(new Map([...right, ...wrong]));
    for (let seed = 1; seed < 10; seed++) {
      const picked = pickSmart(ALL_QUESTIONS, { theta: () => 0, b: () => undefined, due: new Set(), weakSubjects: ["statistics"], weakTopics: new Set(), gotRight: new Set(), history: h, now: NOW }, makeRng(seed));
      expect(picked).toHaveLength(10);
      expect(picked.some((p) => right.has(p.id))).toBe(false);
      expect(h.has(picked[0].id)).toBe(false);
    }
  });

  it("a finished topic set goes round again from a wrong answer, not from the top", () => {
    const ids = ["a", "b", "c"];
    expect(startIndex(ids, new Map([["a", ans(true, "2026-11-03")], ["b", ans(false, "2026-11-02")], ["c", ans(true, "2026-11-01")]]))).toBe(1);
    expect(startIndex(ids, new Map([["a", ans(true, "2026-11-03")], ["b", ans(true, "2026-11-02")], ["c", ans(true, "2026-11-01")]]))).toBe(2);
    const many = Array.from({ length: 20 }, (_, i) => `q${i}`);
    expect(nextSet(many, new Map(many.map((id) => [id, ans(id !== "q15", "2026-11-01")])))).toBe(1);
  });
});
