import { describe, expect, it } from "vitest";
import {
  isProvisional,
  provisionalKeys,
  weightedKappa,
  shouldValidate,
  nextStatus,
  MIN_VALIDATION_SCORES,
  MIN_VALIDATION_KAPPA,
  type RubricDimension,
} from "./rubric";

const DIMS: RubricDimension[] = [
  { key: "premature_reassurance", label: "Premature reassurance", status: "provisional", agreement: null, n_scored: 0 },
  { key: "risk_timing", label: "Risk assessment timing", status: "validated", agreement: 0.81, n_scored: 12 },
];

describe("A3 — rubric dimension calibration gate", () => {
  it("a provisional dimension hides its number (isProvisional = true)", () => {
    expect(isProvisional("premature_reassurance", DIMS)).toBe(true);
  });

  it("a validated dimension shows its number", () => {
    expect(isProvisional("risk_timing", DIMS)).toBe(false);
  });

  it("an unknown dimension is treated as validated (behaviour unchanged)", () => {
    expect(isProvisional("idiom_decoding", DIMS)).toBe(false);
  });

  it("no dimensions loaded → everything shows (safe default)", () => {
    expect(isProvisional("premature_reassurance", undefined)).toBe(false);
  });

  it("provisionalKeys returns exactly the provisional keys", () => {
    expect(provisionalKeys(DIMS)).toEqual(["premature_reassurance"]);
  });
});

describe("A3 — weighted kappa + validation gate", () => {
  it("perfect agreement gives kappa 1", () => {
    expect(weightedKappa([2, 3, 4, 4], [2, 3, 4, 4])).toBeCloseTo(1, 5);
  });

  it("opposite scores give negative kappa (worse than chance)", () => {
    const k = weightedKappa([0, 5], [5, 0]);
    expect(k).toBeLessThan(0);
  });

  it("scattered disagreement lands below the validation threshold (0.6)", () => {
    // Realistic near-random ratings on a 0-5 scale — agreement must be far
    // below the 0.6 validation gate.
    const k = weightedKappa([4.5, 1.5, 3, 0.5, 4, 2.5, 1, 5], [0.5, 4.5, 1, 4, 0.5, 3, 5, 2]);
    expect(k).toBeLessThan(MIN_VALIDATION_KAPPA);
  });

  it("empty input returns 0 (no pairs yet)", () => {
    expect(weightedKappa([], [])).toBe(0);
  });

  it("a dimension stays provisional until >= 10 scores with kappa >= 0.6", () => {
    expect(shouldValidate({ n_scored: 9, agreement: 0.8 })).toBe(false);
    expect(shouldValidate({ n_scored: 10, agreement: 0.59 })).toBe(false);
    expect(shouldValidate({ n_scored: 10, agreement: 0.6 })).toBe(true);
  });

  it("nextStatus graduates a passing dimension and keeps a failing one provisional", () => {
    const passing: RubricDimension = { key: "risk_timing", label: "Risk timing", status: "provisional", agreement: 0.72, n_scored: 14 };
    const failing: RubricDimension = { key: "premature_reassurance", label: "Premature reassurance", status: "provisional", agreement: 0.4, n_scored: 14 };
    expect(nextStatus(passing)).toBe("validated");
    expect(nextStatus(failing)).toBe("provisional");
    void MIN_VALIDATION_SCORES;
    void MIN_VALIDATION_KAPPA;
  });
});
