import { describe, expect, it } from "vitest";
import { buildCorrectionRow, correctionSchema, shouldInjectCorrection } from "./sim-review";

describe("sim-review corrections (faculty feedback loop)", () => {
  it("parses a valid correction payload", () => {
    const r = correctionSchema.safeParse({
      sessionId: "00000000-0000-0000-0000-000000000000",
      note: "The student explored the debt but never asked openly.",
      originalOverall: 3,
      correctedOverall: 4,
    });
    expect(r.success).toBe(true);
  });

  it("rejects a missing note and a non-uuid session", () => {
    expect(
      correctionSchema.safeParse({ sessionId: "nope", note: "" }).success,
    ).toBe(false);
  });

  it("stores corrected scores as scalars (clean few-shot text)", () => {
    const row = buildCorrectionRow(
      {
        sessionId: "00000000-0000-0000-0000-000000000000",
        note: "raised — premature reassurance deserved the hit.",
        originalOverall: 4,
        correctedOverall: 3,
      },
      "admin-id",
    );
    expect(row.original).toBe(4);
    expect(row.corrected).toBe(3);
    expect(row.corrected_by).toBe("admin-id");
  });

  it("stores a note-only review as empty objects (no score change)", () => {
    const row = buildCorrectionRow(
      {
        sessionId: "00000000-0000-0000-0000-000000000000",
        note: "Excellent rapport — keep it up.",
      },
      "admin-id",
    );
    expect(row.original).toEqual({});
    expect(row.corrected).toEqual({});
  });

  it("only score-changing rows feed the feedback loop", () => {
    expect(shouldInjectCorrection({ original: {}, corrected: {} })).toBe(false);
    expect(shouldInjectCorrection({ original: {}, corrected: "" })).toBe(false);
    expect(shouldInjectCorrection({ original: 3, corrected: 4 })).toBe(true);
    expect(shouldInjectCorrection({ original: 3, corrected: 3 })).toBe(true);
  });
});
