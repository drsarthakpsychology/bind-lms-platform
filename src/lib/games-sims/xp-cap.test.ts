import { describe, expect, it } from "vitest";
import { cappedGameXp, GAME_XP_PER_DAY } from "./xp-cap";

describe("cappedGameXp (XP farming with fresh run ids)", () => {
  it("pays in full under the daily ceiling", () => {
    expect(cappedGameXp(0, 40)).toBe(40);
    expect(cappedGameXp(GAME_XP_PER_DAY - 100, 40)).toBe(40);
  });
  it("pays only what is left at the ceiling, then nothing", () => {
    expect(cappedGameXp(GAME_XP_PER_DAY - 10, 40)).toBe(10);
    expect(cappedGameXp(GAME_XP_PER_DAY, 40)).toBe(0);
    // 1000 scripted replays of a solved run earn no more than the ceiling.
    let paid = 0;
    for (let i = 0; i < 1000; i++) paid += cappedGameXp(paid, 40);
    expect(paid).toBe(GAME_XP_PER_DAY);
  });
  it("fails closed when today's total is unknown", () => {
    expect(cappedGameXp(Number.NaN, 40)).toBe(0);
  });
});
