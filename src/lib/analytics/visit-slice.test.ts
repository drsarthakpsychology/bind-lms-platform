import { describe, expect, it } from "vitest";
import { clampToNow, MIN_SECONDS, trimOverlap } from "./visit-slice";

const now = Date.parse("2026-11-22T06:00:00Z");

describe("visit slices", () => {
  it("keeps a normal slice as it is", () => {
    expect(clampToNow({ enteredMs: now - 120_000, seconds: 120 }, now)).toEqual({ enteredMs: now - 120_000, seconds: 120 });
  });

  it("cuts a slice that ends in the future", () => {
    expect(clampToNow({ enteredMs: now - 60_000, seconds: 1800 }, now)).toEqual({ enteredMs: now - 60_000, seconds: 65 });
  });

  it("drops a slice that is too short", () => {
    expect(clampToNow({ enteredMs: now, seconds: 1 }, now)).toBeNull();
    expect(clampToNow({ enteredMs: now + 30_000, seconds: 600 }, now)).toBeNull();
  });

  it("never counts the same minute twice (two tabs or a replay)", () => {
    const s = { enteredMs: now - 120_000, seconds: 120 };
    expect(trimOverlap(s, [now - 60_000])).toEqual({ enteredMs: now - 60_000, seconds: 60 });
    expect(trimOverlap(s, [now])).toBeNull();
    expect(trimOverlap(s, [])).toEqual(s);
    expect(trimOverlap(s, [now - 120_000 - 5_000])).toEqual(s);
    expect(trimOverlap(s, [now - MIN_SECONDS * 1000 + 1])).toBeNull();
  });
});
