import { describe, expect, it } from "vitest";
import { blockedBy, FEATURES } from "./features";

describe("per-student switches", () => {
  it("blocks a section and everything under it", () => {
    expect(blockedBy("/games/coach", ["games"])).toBe("games");
    expect(blockedBy("/study/interview-mse/1-1", ["notes"])).toBe("notes");
    expect(blockedBy("/courses/x", ["games", "notes"])).toBeNull();
  });
  it("turning off Practice keeps Medicines and Rankings on", () => {
    expect(blockedBy("/practice/judgment", ["practice"])).toBe("practice");
    expect(blockedBy("/practice/medicines/lithium", ["practice"])).toBeNull();
    expect(blockedBy("/practice/leaderboard", ["practice"])).toBeNull();
    expect(blockedBy("/practice/medicines", ["medicines"])).toBe("medicines");
  });
  it("can switch off one Practice tool", () => {
    expect(blockedBy("/practice/judgment", ["tool:judgment"])).toBe("tool:judgment");
    expect(blockedBy("/practice/mse", ["tool:judgment"])).toBeNull();
  });
  it("has unique keys", () => {
    expect(new Set(FEATURES.map((f) => f.key)).size).toBe(FEATURES.length);
  });
});
