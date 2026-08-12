import { afterEach, describe, expect, it } from "vitest";
import { assertProviderAllowed, guardStudentCall, workloadHasStudentData, type Workload } from "./guards";
import { PROVIDERS } from "./router";

describe("ai data-policy split (non-negotiable)", () => {
  const studentWorkloads: Workload[] = ["sim_patient_turn", "debrief_scoring", "journal_support"];
  const contentWorkloads: Workload[] = ["content_generation", "corpus_processing", "embeddings"];

  it("marks student-data workloads correctly", () => {
    for (const w of studentWorkloads) {
      expect(workloadHasStudentData(w), `${w} should have student data`).toBe(true);
    }
    for (const w of contentWorkloads) {
      expect(workloadHasStudentData(w), `${w} should NOT have student data`).toBe(false);
    }
  });

  it("a student-data workload CANNOT route to a provider that trains on data", () => {
    for (const w of studentWorkloads) {
      for (const p of PROVIDERS) {
        if (!p.trainsOnData) continue; // these are always allowed
        expect(() => assertProviderAllowed(w, p), `${w} must refuse ${p.id}`).toThrow(/data-policy violation/);
      }
    }
  });

  it("a student-data workload CAN route to a no-train provider", () => {
    for (const w of studentWorkloads) {
      for (const p of PROVIDERS) {
        if (p.trainsOnData) continue;
        expect(() => assertProviderAllowed(w, p)).not.toThrow();
      }
    }
  });

  it("content-generation may use ANY provider (free tiers)", () => {
    for (const w of contentWorkloads) {
      for (const p of PROVIDERS) {
        expect(() => assertProviderAllowed(w, p)).not.toThrow();
      }
    }
  });
});

describe("AI_STUDENT_TIER (the dev-only override)", () => {
  const saved = process.env.AI_STUDENT_TIER;

  afterEach(() => {
    if (saved === undefined) delete process.env.AI_STUDENT_TIER;
    else process.env.AI_STUDENT_TIER = saved;
  });

  it("default (no tier set) still refuses student data without a no-train provider", () => {
    delete process.env.AI_STUDENT_TIER;
    expect(() => guardStudentCall("sim_patient_turn", { enabled: true, dailyCap: 10, sessionCap: 5 })).toThrow(/no no-train/i);
  });

  it("AI_STUDENT_TIER=any skips the no-train requirement (dev override)", () => {
    process.env.AI_STUDENT_TIER = "any";
    expect(() => guardStudentCall("sim_patient_turn", { enabled: true, dailyCap: 10, sessionCap: 5 })).not.toThrow();
  });

  it("AI_STUDENT_TIER=no_train_only keeps the strict gate", () => {
    process.env.AI_STUDENT_TIER = "no_train_only";
    expect(() => guardStudentCall("debrief_scoring", { enabled: true, dailyCap: 10, sessionCap: 5 })).toThrow(/no no-train/i);
  });
});
