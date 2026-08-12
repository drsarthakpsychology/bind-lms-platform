import { describe, expect, it } from "vitest";
import {
  canServeLayerForQuery,
  isIngestibleRights,
  assertIngestible,
  assertLayerAllowsSource,
} from "./layers";

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

describe("Casebook licence gate (nothing unlicensed reaches a student)", () => {
  it("only public_domain / open_access / licensed are ingestible", () => {
    expect(isIngestibleRights("public_domain")).toBe(true);
    expect(isIngestibleRights("open_access")).toBe(true);
    expect(isIngestibleRights("licensed")).toBe(true);
  });

  it("pending_licence / not_started / unlicensed / acquisition_failed are NOT ingestible", () => {
    expect(isIngestibleRights("pending_licence")).toBe(false);
    expect(isIngestibleRights("not_started")).toBe(false);
    expect(isIngestibleRights("unlicensed")).toBe(false);
    expect(isIngestibleRights("acquisition_failed")).toBe(false);
  });

  it("assertIngestible throws for unlicensed content", () => {
    expect(() => assertIngestible("unlicensed")).toThrow(/rights gate/);
    expect(() => assertIngestible("pending_licence")).toThrow(/rights gate/);
    expect(() => assertIngestible("licensed")).not.toThrow();
  });
});
