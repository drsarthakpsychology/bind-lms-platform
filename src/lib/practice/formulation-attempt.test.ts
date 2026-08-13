import { describe, expect, it } from "vitest";
import { buildFormulationAttemptPayload } from "./formulation-attempt";

describe("buildFormulationAttemptPayload", () => {
  const started = new Date("2026-08-13T10:00:00Z");
  const completed = new Date("2026-08-13T10:05:00Z");

  it("carries the seed case slug, sorted factors, and timestamps", () => {
    const payload = buildFormulationAttemptPayload(
      {
        caseId: "form-1",
        caseTitle: "Ravi",
        sortedFactors: [{ factorId: "f1", bucket: "presenting" }],
        narrative: "Ravi presents with somatic depression.",
        diff: { missing: ["predisposing"], present: ["somatic"] },
        score: 0.9,
      },
      started,
      completed,
    );
    expect(payload.case_id).toBe("form-1");
    expect(payload.case_title).toBe("Ravi");
    expect(payload.sorted_factors).toEqual([{ factorId: "f1", bucket: "presenting" }]);
    expect(payload.narrative).toContain("Ravi");
    expect(payload.diff.missing).toEqual(["predisposing"]);
    expect(payload.score).toBe(0.9);
    expect(payload.started_at).toBe(started.toISOString());
    expect(payload.completed_at).toBe(completed.toISOString());
  });

  it("own-transcript attempts send null case_id plus source session", () => {
    const sessionId = "11111111-2222-3333-4444-555555555555";
    const payload = buildFormulationAttemptPayload(
      { caseId: null, sourceSimSessionId: sessionId, sortedFactors: [], narrative: "n", diff: { missing: [], present: [] } },
      started,
      completed,
    );
    expect(payload.case_id).toBeNull();
    expect(payload.source_sim_session_id).toBe(sessionId);
  });
});
