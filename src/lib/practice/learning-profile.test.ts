import { describe, expect, it } from "vitest";
import { computeLearningProfile } from "./learning-profile";

function mockSupabase(rubrics: Array<Record<string, unknown>>) {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => ({ data: rubrics.map((rubric) => ({ rubric })) }),
          }),
        }),
      }),
    }),
  } as never;
}

describe("computeLearningProfile — quiet per-student adaptation", () => {
  it("returns an empty profile with no sessions", async () => {
    const p = await computeLearningProfile(mockSupabase([]), "u1");
    expect(p.sessions).toBe(0);
    expect(p.focus).toBeNull();
  });

  it("routes to the consulting room when risk assessment keeps slipping", async () => {
    const p = await computeLearningProfile(mockSupabase([
      { risk_timing: "late" },
      { risk_timing: "absent" },
      { risk_timing: "late" },
    ]), "u1");
    expect(p.focus?.href).toBe("/practice/consulting-room");
    expect(p.focus?.reason).toMatch(/risk assessment/i);
  });

  it("routes to the decoder when the opening phrase goes undecoded", async () => {
    const p = await computeLearningProfile(mockSupabase([
      { idiom_decoding: false },
      { idiom_decoding: false },
      { idiom_decoding: true },
    ]), "u1");
    expect(p.focus?.href).toBe("/practice/decode");
  });

  it("flags premature reassurance as the focus (the #1 novice error)", async () => {
    const p = await computeLearningProfile(mockSupabase([
      { premature_reassurance: 2 },
      { premature_reassurance: 1 },
      { premature_reassurance: 3 },
    ]), "u1");
    expect(p.focus?.href).toBe("/practice/consulting-room");
  });

  it("nudges difficulty up only when the student is strong across the board", async () => {
    const strong = await computeLearningProfile(mockSupabase([
      { risk_timing: "on_time", idiom_decoding: true, premature_reassurance: 0, open_closed_ratio: 2 },
      { risk_timing: "on_time", idiom_decoding: true, premature_reassurance: 0, open_closed_ratio: 2 },
    ]), "u1");
    expect(strong.suggestedDifficulty).toBe("holmes");

    const weak = await computeLearningProfile(mockSupabase([
      { risk_timing: "late", idiom_decoding: false, premature_reassurance: 2, open_closed_ratio: 0.5 },
    ]), "u1");
    expect(weak.suggestedDifficulty).toBe("clear");
  });
});
