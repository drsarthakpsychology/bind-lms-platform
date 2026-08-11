import { describe, expect, it } from "vitest";
import {
  applyAnswer, applyTranscript, buildCaseFromState, collectedCount, nextMissingField,
  parseAnswer, FIELD_QUESTION, missingFields,
} from "./interviewer";

describe("dictation interviewer — state machine", () => {
  it("nextMissingField returns the highest-priority missing field", () => {
    expect(nextMissingField({})).toBe("name");
    expect(nextMissingField({ name: "Ravi" })).toBe("age");
    expect(nextMissingField({ name: "Ravi", age: 34, gender: "male" })).toBe("occupation");
    expect(nextMissingField(fullState())).toBeNull();
  });

  it("applyAnswer is non-destructive — never overwrites a collected field", () => {
    const s = applyAnswer({ name: "Ravi" }, "name", "Sunita");
    expect(s.name).toBe("Ravi");
  });

  it("parseAnswer coerces age and gender", () => {
    expect(parseAnswer("age", "34")).toBe(34);
    expect(parseAnswer("age", "about 28")).toBe(28);
    expect(parseAnswer("age", "don't know")).toBe("don't know");
    expect(parseAnswer("gender", "it's a woman")).toBe("female");
    expect(parseAnswer("gender", "male")).toBe("male");
  });

  it("parseAnswer splits list fields on commas/newlines/and", () => {
    const r = parseAnswer("red_flags", "suicidal thoughts\npassive ideas, no plan and a worry");
    expect(r).toContain("suicidal thoughts");
    expect(r).toContain("passive ideas");
    expect(r).toContain("no plan");
    expect(r).toContain("a worry");
  });

  it("applyTranscript backfills unanswered fields line by line", () => {
    const s = applyTranscript({}, "Ravi\n34\nmale");

    expect(s.name).toBe("Ravi");
    expect(s.age).toBe(34);
    expect(s.gender).toBe("male");
    expect(collectedCount(s)).toBe(3);
  });

  it("buildCaseFromState yields a SimCase-shaped object + records missing", () => {
    const full = fullState();
    const { case_data, missing } = buildCaseFromState(full);
    expect(missing).toHaveLength(0);
    expect(case_data.identity.name).toBe("Ravi");
    expect(case_data.identity.age).toBe(34);
    expect(case_data.chief_complaint_in_own_words).toBeTruthy();
    expect(case_data.history.timeline).toBeTruthy();
    expect(case_data.cognitive_model.core_belief).toBeTruthy();
    expect(Array.isArray(case_data.red_flags)).toBe(true);
  });

  it("buildCaseFromState flags required gaps, doesn't fabricate", () => {
    const { missing } = buildCaseFromState({ name: "Only a name" });
    expect(missing.length).toBeGreaterThan(0);
    expect(missing).toContain("chief_complaint");
  });

  it("every field has a human question", () => {
    for (const f of Object.keys(FIELD_QUESTION) as Array<keyof typeof FIELD_QUESTION>) {
      expect(FIELD_QUESTION[f].length).toBeGreaterThan(10);
    }
  });

  it("missingFields lists only the required build surfacaze", () => {
    const m = missingFields({ name: "x", age: 2 });
    expect(m).toContain("chief_complaint");
    expect(m).toContain("core_belief");
  });
});

function fullState(): Record<string, unknown> {
  return {
    name: "Ravi",
    age: 34,
    gender: "male",
    occupation: "shopkeeper",
    city: "Ahmedabad",
    family: "wife and two children",
    register: "Hinglish",
    chief_complaint: "heaviness in the chest, can't sleep",
    timeline: "two months after the shop started losing money",
    treatment_history: "a clinic gave a tonic",
    help_seeking_delay: "two months",
    prior_contacts: ["GP", "chemist"],
    core_belief: "I am failing my family",
    intermediate_beliefs: ["if I admit the debt everyone sees a failure", "a man doesn't talk about this"],
    coping: ["work longer", "drink tea"],
    opening_idiom: "fresh nahi lag raha",
    red_flags: ["passive thoughts of not waking up"],
    resistance: "deflects on money",
    affect_rules: "withdraws on advice",
  };
}
describe("fixture interviewer", () => {
  it("returns the deterministic next question for an empty state", async () => {
    const { fixtureFollowUp } = await import("@/lib/ai/fixtures/corpus-interviewer");
    expect(fixtureFollowUp({})).toContain("first name");
    expect(fixtureFollowUp({ name: "Ravi" })).toContain("old");
  });

  it("says it is complete when every field is gathered", async () => {
    const { fixtureFollowUp } = await import("@/lib/ai/fixtures/corpus-interviewer");
    expect(fixtureFollowUp(fullState())).toContain("finish");
  });

  it("progress label reflects collected count", async () => {
    const { progressLabel } = await import("@/lib/ai/fixtures/corpus-interviewer");
    expect(progressLabel(fullState())).toContain("19/19");
  });
});
