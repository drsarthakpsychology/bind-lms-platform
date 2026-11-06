import { describe, expect, it } from "vitest";
import { ANSWER_WINDOW_MS, CHECK_MAX_S, CHECK_MIN_S, isMissed, nextCheckAfter, shouldAsk } from "./schedule";

describe("still-watching schedule", () => {
  it("next check is 12 to 20 minutes of playback away", () => {
    expect(nextCheckAfter(0)).toBe(CHECK_MIN_S);
    expect(nextCheckAfter(0.5)).toBe(16 * 60);
    expect(nextCheckAfter(1)).toBeLessThanOrEqual(CHECK_MAX_S);
    expect(nextCheckAfter(-3)).toBe(CHECK_MIN_S);
  });
  it("asks only after enough playback and not near the end", () => {
    expect(shouldAsk(800, 720, 100, 3000)).toBe(true);
    expect(shouldAsk(700, 720, 100, 3000)).toBe(false);
    expect(shouldAsk(800, 720, 2980, 3000)).toBe(false);
    expect(shouldAsk(800, 0, 100, 3000)).toBe(false);
  });
  it("60 seconds to answer", () => {
    expect(isMissed(0, ANSWER_WINDOW_MS - 1)).toBe(false);
    expect(isMissed(0, ANSWER_WINDOW_MS)).toBe(true);
  });
});
