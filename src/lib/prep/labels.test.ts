import { describe, expect, it } from "vitest";
import { ALL_QUESTIONS } from "@/content/prep/index";
import { labelKind, normaliseLabels, romaniseCodes, stripLabels } from "./labels";
import type { PrepQuestion } from "./types";

const base = { type: "mcq", explanation: "", options: ["", "", "", ""] } as unknown as PrepQuestion;

describe("labels", () => {
  it("strips the author's own label from an item", () => {
    expect(stripLabels(["A. Posttest-only design", "B. Two"])).toEqual(["Posttest-only design", "Two"]);
    expect(stripLabels(["i) One", "ii) Two", "iii) Something"])).toEqual(["One", "Two", "Something"]);
    expect(stripLabels(["(1) One", "(2) Two"])).toEqual(["One", "Two"]);
    expect(stripLabels(["1.5 times the mean", "2 more"])).toEqual(["1.5 times the mean", "2 more"]);
    expect(stripLabels(["B. F. Skinner", "Wundt"])).toEqual(["B. F. Skinner", "Wundt"]);
  });
  it("tells letters from roman numerals", () => {
    expect(labelKind(["I. one", "II. two"])).toBe("roman");
    expect(labelKind(["A. one", "B. two"])).toBe("letter");
    expect(labelKind(["1. one"])).toBe("digit");
    expect(labelKind(["plain"])).toBeNull();
  });
  it("writes List II codes as roman numerals", () => {
    expect(romaniseCodes("A-2, B-3, C-4, D-1")).toBe("A-II, B-III, C-IV, D-I");
    expect(romaniseCodes("a-iii, b-i")).toBe("A-III, B-I");
    expect(romaniseCodes("A-III, B-I")).toBe("A-III, B-I");
  });
  it("numbers lettered statements and rewrites the options and explanation", () => {
    const q = normaliseLabels({ ...base, type: "statement", statements: ["A. x", "B. y", "C. z"], options: ["A and B only", "B and C only", "A only", "A, B and C"], explanation: "A test of this: Statement C is wrong, so 'B and C only' fails." });
    expect(q.statements).toEqual(["x", "y", "z"]);
    expect(q.options).toEqual(["1 and 2 only", "2 and 3 only", "1 only", "1, 2 and 3"]);
    expect(q.explanation).toBe("A test of this: Statement 3 is wrong, so '2 and 3 only' fails.");
  });
  it("drops assertion and reason labels", () => {
    const q = normaliseLabels({ ...base, type: "assertion-reason", statements: ["Assertion (A): x", "R: y"] });
    expect(q.statements).toEqual(["x", "y"]);
  });
  it("leaves every bank question in one style", () => {
    const bad: string[] = [];
    for (const raw of ALL_QUESTIONS) {
      const q = normaliseLabels(raw);
      if (q.lists) {
        for (const list of [q.lists.left, q.lists.right]) if (labelKind(list)) bad.push(`${q.id}: list ${list[0]}`);
        for (const o of q.options) if (/\b[A-Ha-h]\s*[-\u2013]\s*([0-9]|[ivx]+)\b/.test(o)) bad.push(`${q.id}: option ${o}`);
      }
      if (q.type === "statement" && q.statements) {
        if (labelKind(q.statements)) bad.push(`${q.id}: statements ${q.statements[0]}`);
        for (const o of q.options) if (/\b([A-H]|II|III|IV)\b\s*(,|and|only)/.test(o)) bad.push(`${q.id}: option ${o}`);
      }
      if (q.type === "assertion-reason" && q.statements) for (const s of q.statements) if (/^(Assertion|Reason|A:|R:)/.test(s)) bad.push(`${q.id}: ${s}`);
    }
    expect(bad.slice(0, 20)).toEqual([]);
  });
});
