import { describe, expect, it } from "vitest";
import { pickContinue, type ContinueInput } from "./next-step";

const base: ContinueInput = { lecture: null, study: null, weakest: null, dailyCase: false };
const lecture = { title: "Lecture 3", href: "/courses/c/lessons/3", week: 2, number: 3, kind: "lesson" as const, started: true };
const study = { kind: "read", label: "Read 1.2 Mood", href: "/study/depression/1-2", module: "Depression", resumed: true };

describe("pickContinue", () => {
  it("puts a due re-test first", () => {
    expect(pickContinue({ ...base, lecture, study: { ...study, kind: "retest", label: "Re-test: Depression" } }).kind).toBe("retest");
  });

  it("then the next lecture", () => {
    const s = pickContinue({ ...base, lecture, study });
    expect(s).toMatchObject({ kind: "lecture", cta: "Resume", meta: "Week 2 · Lecture 3" });
  });

  it("prefers Study when lectures were never started but Study is underway", () => {
    expect(pickContinue({ ...base, lecture: { ...lecture, started: false }, study }).kind).toBe("study");
  });

  it("falls back to the weakest topic, then the daily case, then lectures", () => {
    expect(pickContinue({ ...base, study: { ...study, kind: "done" }, weakest: { title: "Bipolar", href: "/x" } }).kind).toBe("weak");
    expect(pickContinue({ ...base, dailyCase: true }).href).toBe("/practice/daily?from=/dashboard");
    expect(pickContinue(base).href).toBe("/courses");
  });
});
