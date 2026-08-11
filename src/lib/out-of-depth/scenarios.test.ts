import { describe, expect, it } from "vitest";
import { OUT_OF_DEPTH_SCENARIOS, scoreReferralDecision } from "./scenarios";

describe("out-of-depth", () => {
  it("has 30 scenarios (A4 DONE MEANS)", () => {
    expect(OUT_OF_DEPTH_SCENARIOS.length).toBeGreaterThanOrEqual(30);
  });

  it("every scenario has the refer/continue/medical option set + reasoning", () => {
    for (const s of OUT_OF_DEPTH_SCENARIOS) {
      expect(s.options.length).toBeGreaterThanOrEqual(4);
      expect(s.reasoning.length).toBeGreaterThan(20);
      expect(s.options.some((o) => o.option === s.correct)).toBe(true);
    }
  });

  it("over-referral is scored as a distinct failure", () => {
    const continueCase = OUT_OF_DEPTH_SCENARIOS.find((s) => s.correct === "continue")!;
    const over = scoreReferralDecision(continueCase, "refer_psychiatrist");
    expect(over.correct).toBe(false);
    expect(over.overReferral).toBe(true);
  });

  it("imminent-risk scenarios are NOT over-referral traps", () => {
    const suicide = OUT_OF_DEPTH_SCENARIOS.find((s) => s.id === "ood-1")!;
    const call = scoreReferralDecision(suicide, "refer_psychiatrist");
    expect(call.correct).toBe(true);
    expect(call.overReferral).toBe(false);
  });

  it("at least one scenario is genuinely a 'continue' (over-referral trap exists)", () => {
    expect(OUT_OF_DEPTH_SCENARIOS.some((s) => s.correct === "continue")).toBe(true);
  });
});
