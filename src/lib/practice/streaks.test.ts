import { describe, expect, it } from "vitest";
import {
  istToday,
  MAX_FREEZES_PER_MONTH,
  recordActivity,
  streakAlive,
  type StreakState,
} from "./streaks";

const base: StreakState = {
  current_streak: 0,
  longest_streak: 0,
  last_active_date: null,
  freezes_used_this_month: 0,
  manual_grace_used: 0,
};

describe("streaks — IST rollover + freezes", () => {
  it("first activity starts the streak at 1", () => {
    const s = recordActivity(base, istToday());
    expect(s.current_streak).toBe(1);
  });

  it("consecutive days extend the streak", () => {
    const d1 = recordActivity(base, "2026-08-01");
    const d2 = recordActivity(d1, "2026-08-02");
    const d3 = recordActivity(d2, "2026-08-03");
    expect(d3.current_streak).toBe(3);
    expect(d3.longest_streak).toBe(3);
  });

  it("a one-day gap is covered by a freeze", () => {
    const d1 = recordActivity(base, "2026-08-01");
    const d3 = recordActivity(d1, "2026-08-03"); // missed 08-02
    expect(d3.current_streak).toBe(2);
    expect(d3.freezes_used_this_month).toBe(1);
  });

  it("a gap larger than freeze+grace resets the streak", () => {
    // 08-01 → 08-05 = gap of 4; freeze (gap 2 only) doesn't apply, grace covers
    // at most one, so a 4-day gap resets.
    const d1 = recordActivity(base, "2026-08-01");
    const d5 = recordActivity(d1, "2026-08-05");
    expect(d5.current_streak).toBe(1);
  });

  it("a gap beyond grace but with no freezes also resets", () => {
    const noFreezes = { ...base, freezes_used_this_month: MAX_FREEZES_PER_MONTH };
    const d1 = recordActivity(noFreezes, "2026-08-01");
    const d4 = recordActivity(d1, "2026-08-04"); // gap 3 → resets
    expect(d4.current_streak).toBe(1);
  });

  it("manual grace covers a missed day when freezes are exhausted", () => {
    let s = { ...base, freezes_used_this_month: MAX_FREEZES_PER_MONTH };
    s = recordActivity(s, "2026-08-01");
    s = recordActivity(s, "2026-08-03"); // gap 2, no freezes → grace covers it
    expect(s.current_streak).toBe(2);
    expect(s.manual_grace_used).toBe(1);
  });

  it("a 3-day gap (2 missed days) resets even with grace available", () => {
    let s = recordActivity(base, "2026-08-01");
    s = recordActivity(s, "2026-08-04"); // gap 3 = 2 missed days → resets
    expect(s.current_streak).toBe(1);
  });

  it("freezes are capped per month", () => {
    let s = base;
    // Simulate two freeze uses.
    s = { ...s, freezes_used_this_month: MAX_FREEZES_PER_MONTH };
    const d1 = recordActivity(s, "2026-08-01");
    const d3 = recordActivity(d1, "2026-08-03"); // gap 2 but no freezes left → grace
    expect(d3.current_streak).toBe(2);
    expect(d3.freezes_used_this_month).toBe(MAX_FREEZES_PER_MONTH);
  });

  it("same-day re-recording is idempotent", () => {
    const d1 = recordActivity(base, "2026-08-01");
    const again = recordActivity(d1, "2026-08-01");
    expect(again.current_streak).toBe(1);
  });

  it("IST today differs from UTC at the day boundary", () => {
    // 2026-08-09 20:00 UTC = 2026-08-10 01:30 IST (next day).
    const utc = new Date("2026-08-09T20:00:00Z");
    expect(istToday(utc)).toBe("2026-08-10");
  });

  it("a streak alive yesterday is still alive today", () => {
    // Date-agnostic: yesterday relative to real IST today, so the test never
    // rots when the calendar rolls over.
    const todayIso = istToday();
    const yesterday = new Date(`${todayIso}T00:00:00Z`);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayIso = yesterday.toISOString().slice(0, 10);
    const y = recordActivity(base, yesterdayIso);
    expect(streakAlive(y)).toBe(true);
  });
});
