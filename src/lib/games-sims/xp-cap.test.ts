import { describe, expect, it } from "vitest";
import { cappedPay, GAME_XP_DAY_CAP, GAME_XP_RUN_CAP } from "./xp-cap";

describe("game XP ceiling", () => {
  it("pays a normal run in full", () => {
    expect(cappedPay(0, 60)).toBe(60);
  });
  it("never pays more than a run's ceiling", () => {
    expect(cappedPay(0, 5000)).toBe(GAME_XP_RUN_CAP);
  });
  it("stops at the day's ceiling, so new run ids can't farm XP", () => {
    let paid = 0;
    for (let i = 0; i < 50; i++) paid += cappedPay(paid, 150);
    expect(paid).toBe(GAME_XP_DAY_CAP);
    expect(cappedPay(GAME_XP_DAY_CAP, 10)).toBe(0);
  });
  it("ignores junk", () => {
    expect(cappedPay(Number.NaN, Number.NaN)).toBe(0);
    expect(cappedPay(-50, -3)).toBe(0);
  });
});
