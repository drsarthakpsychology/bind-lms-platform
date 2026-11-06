import { describe, expect, it } from "vitest";
import { cellState, clock, clockWords, step } from "./exam";

describe("exam helpers", () => {
  it("palette states", () => {
    expect(cellState(true, false, true)).toBe("answered");
    expect(cellState(true, true, true)).toBe("answered-marked");
    expect(cellState(false, true, true)).toBe("marked");
    expect(cellState(false, false, true)).toBe("not-answered");
    expect(cellState(false, false, false)).toBe("not-visited");
  });
  it("clock", () => {
    expect(clock(90 * 60_000)).toBe("1:30:00");
    expect(clock(247_000)).toBe("4:07");
    expect(clock(-5)).toBe("0:00");
    expect(clockWords(65 * 60_000)).toBe("1 hour 5 minutes left");
    expect(clockWords(60_000)).toBe("1 minute left");
    expect(clockWords(120 * 60_000)).toBe("2 hours left");
  });
  it("steps across sections and skips empty ones", () => {
    expect(step([2, 3], 0, 1, 1)).toEqual([1, 0]);
    expect(step([2, 3], 1, 2, 1)).toEqual([0, 0]);
    expect(step([2, 0, 3], 0, 1, 1)).toEqual([2, 0]);
    expect(step([2, 3], 1, 0, -1)).toEqual([0, 1]);
    expect(step([], 0, 0, 1)).toEqual([0, 0]);
  });
});
