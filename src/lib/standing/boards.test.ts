import { describe, expect, it } from "vitest";
import { BOARDS, boardWindow, OLD_OVERALL_HREF, sameGroup, scopeLine } from "./boards";

describe("the two leaderboards", () => {
  it("have different names, homes and periods", () => {
    expect(BOARDS.quiz.label).toBe("Quiz leaderboard");
    expect(BOARDS.overall.label).toBe("Overall leaderboard");
    expect(BOARDS.quiz.href.startsWith("/games/")).toBe(true);
    expect(BOARDS.overall.href).not.toBe(OLD_OVERALL_HREF);
    expect(BOARDS.quiz.period).not.toBe(BOARDS.overall.period);
  });
});

describe("who is on my board", () => {
  it("shows people who share a cohort", () => {
    expect(sameGroup(["c1"], ["c1"])).toBe(true);
    expect(sameGroup(["c1", "c2"], ["c2", "c3"])).toBe(true);
  });
  it("never shows another cohort", () => {
    expect(sameGroup(["c1"], ["c2"])).toBe(false);
    expect(sameGroup(["c1"], [])).toBe(false);
  });
  it("a student in no cohort sees only others in no cohort", () => {
    expect(sameGroup([], [])).toBe(true);
    expect(sameGroup([], ["c1"])).toBe(false);
  });
  it("states the scope plainly", () => {
    expect(scopeLine(["Cohort 2"])).toBe("Cohort 2 only. First name and initial.");
    expect(scopeLine(["Cohort 1", "Cohort 2"])).toContain("Cohort 1 & Cohort 2 only");
    expect(scopeLine([])).toContain("not in a cohort");
  });
});

describe("which rows to show", () => {
  it("shows the top 10 when I am in it", () => {
    expect(boardWindow(30, 3)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  it("adds me and my neighbours when I am lower down", () => {
    expect(boardWindow(30, 20)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 19, 20, 21]);
  });
  it("handles the last place, short boards and no me", () => {
    expect(boardWindow(15, 14)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14]);
    expect(boardWindow(3, -1)).toEqual([0, 1, 2]);
    expect(boardWindow(0, -1)).toEqual([]);
  });
});
