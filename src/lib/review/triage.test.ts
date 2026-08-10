import { describe, expect, it } from "vitest";
import { needsReview, priorityScore, queueSummary } from "./triage";

describe("review triage", () => {
  it("first session always needs review", () => {
    expect(needsReview({ submissionId: "a", isFirstSession: true })).toBe(true);
  });

  it("a low-confidence or concerning submission needs review", () => {
    expect(needsReview({ submissionId: "a", isFirstSession: false, concerning: true })).toBe(true);
    expect(needsReview({ submissionId: "a", isFirstSession: false, aiConfidence: 0.3 })).toBe(false); // 2 < 4
    expect(needsReview({ submissionId: "a", isFirstSession: false, passesDisagreed: true })).toBe(false); // 3 < 4
    expect(needsReview({ submissionId: "a", isFirstSession: false, repeatedFailure: true, passesDisagreed: true })).toBe(true);
  });

  it("priority is additive", () => {
    const s = priorityScore({ submissionId: "a", isFirstSession: true, concerning: true });
    expect(s).toBe(9);
  });

  it("queue summary counts auto-released", () => {
    const inputs = [
      { submissionId: "a", isFirstSession: true }, // needs review
      { submissionId: "b", isFirstSession: false }, // auto
      { submissionId: "c", isFirstSession: false, randomSample: true }, // auto (1)
      { submissionId: "d", isFirstSession: false, repeatedFailure: true }, // needs review
    ];
    const s = queueSummary(inputs);
    expect(s.needsReview).toBe(2);
    expect(s.autoReleased).toBe(2);
  });
});
