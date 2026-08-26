import { describe, expect, it } from "vitest";
import { canServeLayerForQuery, assertLayerAllowsSource } from "./layers";

describe("Casebook layer firewall (the separation is the design)", () => {
  it("style → clinical-query BLOCKED: a STYLE chunk can never answer a clinical query", () => {
    expect(canServeLayerForQuery("style", "clinical")).toBe(false);
  });

  it("clinical → patient-voice BLOCKED: clinical content can never voice a patient", () => {
    expect(() => assertLayerAllowsSource("clinical", "patient_voice")).toThrow(/textbook/);
  });

  it("style → fact BLOCKED: style can never supply ground truth, scoring, or quiz rationale", () => {
    expect(() => assertLayerAllowsSource("style", "ground_truth")).toThrow(/firewall/);
    expect(() => assertLayerAllowsSource("style", "scoring")).toThrow(/firewall/);
    expect(() => assertLayerAllowsSource("style", "quiz_rationale")).toThrow(/firewall/);
  });

  it("style CAN serve dialogue craft", () => {
    expect(canServeLayerForQuery("style", "dialogue_craft")).toBe(true);
    expect(() => assertLayerAllowsSource("style", "hesitation_pattern")).not.toThrow();
  });

  it("clinical CAN serve ground truth, scoring and quiz rationale", () => {
    expect(() => assertLayerAllowsSource("clinical", "ground_truth")).not.toThrow();
    expect(() => assertLayerAllowsSource("clinical", "scoring")).not.toThrow();
    expect(() => assertLayerAllowsSource("clinical", "quiz_rationale")).not.toThrow();
    expect(canServeLayerForQuery("clinical", "clinical")).toBe(true);
  });

  it("cultural CAN serve opening lines and family dynamics, never overrides clinical truth", () => {
    expect(() => assertLayerAllowsSource("cultural", "opening_line")).not.toThrow();
    expect(() => assertLayerAllowsSource("cultural", "family_dynamics")).not.toThrow();
    // Cultural never blocks clinical ground truth from serving too.
    expect(canServeLayerForQuery("cultural", "clinical")).toBe(true);
  });

  it("phenomenological CAN voice a patient (how symptoms are experienced)", () => {
    expect(() => assertLayerAllowsSource("phenomenological", "patient_voice")).not.toThrow();
  });
});
