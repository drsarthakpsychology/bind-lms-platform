import { describe, expect, it } from "vitest";
import { castVoiceId } from "./casting";

describe("voice casting — distinct, deterministic, demographic-matched", () => {
  it("same demographics ⇒ same voice id (determinism)", () => {
    expect(castVoiceId({ gender: "male", age: 45, region: "Tamil Nadu" }))
      .toBe(castVoiceId({ gender: "male", age: 45, region: "Tamil Nadu" }));
  });

  it("different demographics ⇒ different voice ids", () => {
    const youngFemaleDelhi = castVoiceId({ gender: "female", age: 19, region: "Delhi" });
    const seniorMaleKerala = castVoiceId({ gender: "male", age: 68, region: "Kerala" });
    expect(youngFemaleDelhi).not.toBe(seniorMaleKerala);
    expect(youngFemaleDelhi).toContain("hindi");
    expect(youngFemaleDelhi).toContain("young");
    expect(youngFemaleDelhi).toContain("female");
    expect(seniorMaleKerala).toContain("malayalam");
  });

  it("defaults gracefully for unknown input", () => {
    const id = castVoiceId({});
    expect(id).toContain("en-IN");
    expect(id).toContain("adult");
  });
});
