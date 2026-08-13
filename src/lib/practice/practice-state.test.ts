import { describe, expect, it } from "vitest";
import { startOfTodayIST } from "./practice-state";

describe("startOfTodayIST", () => {
  it("is midnight IST (UTC+05:30) on the current date", () => {
    const d = startOfTodayIST();
    // Adding 05:30 to the returned UTC instant must land on 00:00 IST of the
    // IST-today (the date now has in IST).
    const istMidnight = new Date(d.getTime() + 5.5 * 3600_000);
    expect(istMidnight.getUTCHours()).toBe(0);
    expect(istMidnight.getUTCMinutes()).toBe(0);
    const istNow = new Date(Date.now() + 5.5 * 3600_000);
    expect(istMidnight.toISOString().slice(0, 10)).toBe(istNow.toISOString().slice(0, 10));
  });

  it("is deterministic within a day (stable across calls)", () => {
    expect(startOfTodayIST().toISOString()).toBe(startOfTodayIST().toISOString());
  });
});
