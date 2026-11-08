import { describe, expect, it } from "vitest";
import { pickContinue, type ContinueInput } from "./next-step";

const base: ContinueInput = { lecture: null, study: null, weakest: null, dailyCase: false };
const lecture = { title: "Lecture 3", href: "/courses/c/lessons/3", week: 2, number: 3, kind: "lesson" as const, started: true };
const study = { kind: "read", label: "Read 1.2 Mood", href: "/study/depression/1-2", module: "Depression", resumed: true };

describe("pickContinue", () => {
  it("puts a due re-test first", () => {
    expect(pickContinue({ ...base, lecture, study: { ...study, kind: "retest", label: "Re-test: Depression" } }).kind).toBe("retest");
  });

  it("resumes a lecture stopped part-way first", () => {
    const s = pickContinue({ ...base, lecture: { ...lecture, midway: true }, study });
    expect(s).toMatchObject({ kind: "lecture", cta: "Resume", eyebrow: "Continue watching", meta: "Week 2 · Lecture 3" });
  });

  it("then Study, where the student stopped, before a new lecture", () => {
    expect(pickContinue({ ...base, lecture, study })).toMatchObject({ kind: "study", cta: "Continue", href: study.href });
    expect(pickContinue({ ...base, lecture: { ...lecture, started: false }, study }).kind).toBe("study");
  });

  it("then the next lecture: Up next once the course has begun, Start here before", () => {
    const fresh = { ...study, resumed: false };
    expect(pickContinue({ ...base, lecture, study: fresh })).toMatchObject({ kind: "lecture", eyebrow: "Up next", cta: "Watch" });
    expect(pickContinue({ ...base, lecture: { ...lecture, started: false }, study: fresh })).toMatchObject({ eyebrow: "Start here", cta: "Watch" });
    expect(pickContinue({ ...base, study: fresh })).toMatchObject({ kind: "study", eyebrow: "Start studying" });
  });

  it("an assignment is never mistaken for a lecture in progress", () => {
    const a = { ...lecture, kind: "assignment" as const, midway: true };
    expect(pickContinue({ ...base, lecture: a, study }).kind).toBe("study");
    expect(pickContinue({ ...base, lecture: a }).kind).toBe("assignment");
  });

  it("no small counts and no how-to text in the card", () => {
    const steps = [
      pickContinue({ ...base, weakest: { title: "Bipolar", href: "/x" } }),
      pickContinue({ ...base, dailyCase: true }),
    ];
    for (const s of steps) expect(`${s.title} ${s.meta}`).not.toMatch(/\b(ten|\d+) questions|as few clues/i);
  });

  it("falls back to the weakest topic, then the daily case, then lectures", () => {
    expect(pickContinue({ ...base, study: { ...study, kind: "done" }, weakest: { title: "Bipolar", href: "/x" } }).kind).toBe("weak");
    expect(pickContinue({ ...base, dailyCase: true }).href).toBe("/practice/daily?from=/dashboard");
    expect(pickContinue(base).href).toBe("/courses");
  });
});
