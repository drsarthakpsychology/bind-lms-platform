import { describe, expect, it } from "vitest";
import { buildDirectorPrompt } from "./director";

const base = {
  studentTurn: "How are you doing today?",
  stateSummary: "trust 3 · guardedness 5 · irritation 0",
  caseSpec: "Chief complaint: the debt",
  allowedMoves: ["partial_disclose", "deflect_to_somatic", "silence"],
  mustNotMention: ["self_harm_plan"],
  permittedFacts: ["debt"],
  lastMoves: ["partial_disclose"],
  recentTurns: [],
};

describe("buildDirectorPrompt — difficulty drives behaviour (T122)", () => {
  it("a guarded patient gets the guarded disposition, not a number", () => {
    const prompt = buildDirectorPrompt({ ...base, difficulty: "guarded" });
    expect(prompt).toMatch(/Wary and watchful/);
    expect(prompt).not.toMatch(/difficulty: guarded|difficulty is 2/);
  });

  it("a crisis patient is framed around safety", () => {
    const prompt = buildDirectorPrompt({ ...base, difficulty: "crisis" });
    expect(prompt).toMatch(/safety/);
  });

  it("defaults to cooperative when difficulty is absent", () => {
    const prompt = buildDirectorPrompt(base);
    expect(prompt).toMatch(/discloses when trust allows/);
  });

  it("never drops the rules section", () => {
    const prompt = buildDirectorPrompt({ ...base, difficulty: "resistant" });
    expect(prompt).toMatch(/YOUR RULES/);
    expect(prompt).toMatch(/DANGLING-THREAD RULE/);
  });
});
