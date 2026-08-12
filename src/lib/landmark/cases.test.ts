import { describe, expect, it } from "vitest";
import { LANDMARK_CASES } from "./cases";

describe("landmark cases", () => {
  it("covers the compulsory set", () => {
    const titles = LANDMARK_CASES.map((c) => c.title.toLowerCase());
    expect(titles.some((t) => t.includes("gage"))).toBe(true);
    expect(titles.some((t) => t.includes("little albert"))).toBe(true);
    expect(titles.some((t) => t.includes("genie"))).toBe(true);
    expect(titles.some((t) => t.includes("rosenhan"))).toBe(true);
    expect(titles.some((t) => t.includes("stanford"))).toBe(true);
    expect(titles.some((t) => t.includes("erwadi"))).toBe(true);
  });

  it("every case has a story, believed/understood, and a quiz", () => {
    for (const c of LANDMARK_CASES) {
      expect(c.story.length).toBeGreaterThan(50);
      expect(c.believedThen.length).toBeGreaterThan(10);
      expect(c.understandNow.length).toBeGreaterThan(10);
      expect(c.quiz.length).toBeGreaterThanOrEqual(2);
      for (const q of c.quiz) {
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
        expect(q.rationale.length).toBeGreaterThan(10);
      }
    }
  });

  it("the ethically compromised cases lead with the ethics failure", () => {
    for (const c of LANDMARK_CASES) {
      if (["little albert", "genie", "stanford", "rosenhan"].some((k) => c.title.toLowerCase().includes(k))) {
        expect(c.ethicsFailure).toBeTruthy();
      }
    }
  });

  it("teaches the contestation where it matters", () => {
    const rosenhan = LANDMARK_CASES.find((c) => c.title.toLowerCase().includes("rosenhan"))!;
    expect(rosenhan.contested).toBeTruthy();
    const stanford = LANDMARK_CASES.find((c) => c.title.toLowerCase().includes("stanford"))!;
    expect(stanford.contested).toBeTruthy();
  });
});
