import { describe, expect, it } from "vitest";
import { pointsFor, rankRows, standingFor } from "./score";

describe("level points", () => {
  it("starts everyone at level 1", () => {
    const s = standingFor({ learnXp: 0, platformSeconds: 0, watchedSeconds: 0, lessonsDone: 0 });
    expect(s.points).toBe(0);
    expect(s.level).toBe(1);
  });
  it("counts notes XP, lecture minutes, finished lectures and hours", () => {
    expect(pointsFor({ learnXp: 50, platformSeconds: 7200, watchedSeconds: 600, lessonsDone: 2 })).toBe(50 + 10 + 50 + 20);
  });
  it("ranks with shared places for ties", () => {
    expect(rankRows([{ points: 5 }, { points: 9 }, { points: 5 }]).map((r) => r.rank)).toEqual([1, 2, 2]);
  });
});
