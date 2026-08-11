import { describe, expect, it } from "vitest";
import { DOMAIN_UNITS, MSE_DOMAIN_ORDER, scoreMseCode, scoreObserve, summarizeMseScore } from "./ladder";
import { MSE_EXPERT_CODES, getExpertMseForCase } from "./mse-stories";
import { FULL_MSE_STIMULI, scoreFullMse } from "./mse4-stimuli";
import { SMALL_THINGS } from "./small-things";

describe("MSE ladder — Level 1 observe", () => {
  it("flags diagnostic terms as conclusions, not observations", () => {
    const result = scoreObserve("The patient was depressed and anxious. He sat slumped and avoided eye contact.");
    expect(result.labels.length).toBeGreaterThanOrEqual(2);
  });

  it("rewards pure observation and penalises labels hard", () => {
    const clean = scoreObserve("Sits slumped, avoids eye contact, voice is soft and slow, pauses before answering.");
    const labelled = scoreObserve("The patient is depressed.");
    expect(clean.labels.length).toBe(0);
    expect(clean.score).toBeGreaterThan(labelled.score);
    expect(labelled.score).toBe(0);
  });

  it("never returns a negative score", () => {
    expect(scoreObserve("depressed").score).toBe(0);
  });
});

describe("MSE ladder — domain order", () => {
  it("teaches 11 domains in the documented order", () => {
    expect(MSE_DOMAIN_ORDER).toHaveLength(11);
    expect(DOMAIN_UNITS.map((u) => u.domain)).toEqual([...MSE_DOMAIN_ORDER]);
    DOMAIN_UNITS.forEach((u, i) => expect(u.order).toBe(i + 1));
  });

  it("every domain has a probe and what-you're-looking-for", () => {
    for (const u of DOMAIN_UNITS) {
      expect(u.probe.length).toBeGreaterThan(10);
      expect(u.whatYoureLookingFor.length).toBeGreaterThan(10);
    }
  });
});

describe("MSE ladder — Level 4/5 scoring", () => {
  it("green when the student matches the expert code", () => {
    // Mahesh presents a perceptual finding (trance state), so every domain is
    // coded and a full match scores green everywhere.
    const s = FULL_MSE_STIMULI.find((x) => x.id === "mse4-mahesh")!;
    const { caseKey: _key, small_things: _st, ...expertDomains } = s.expert;
    const scores = scoreFullMse(s, expertDomains);
    expect(Object.values(scores).every((v) => v === "green")).toBe(true);
  });

  it("amber for a defensible alternative, red for missing", () => {
    const s = FULL_MSE_STIMULI[0];
    const scores = scoreFullMse(s, { affect: ["labile"] }); // amber for sandeep
    expect(scores.affect).toBe("amber");
    const red = scoreFullMse(s, {}); // nothing addressed → red everywhere except empty-expert domains
    expect(Object.values(red).some((v) => v === "red")).toBe(true);
  });

  it("perception domain with empty expert code is amber, not red", () => {
    // Sandeep presents no perceptual disturbance → the expert code is empty, so a
    // student cannot be 'wrong' there: it is amber (nothing to miss).
    const sandeep = FULL_MSE_STIMULI.find((s) => s.id === "mse4-sandeep")!;
    const scores = scoreMseCode(sandeep.expert, {});
    expect(scores.perception).toBe("amber");
  });

  it("summarizeMseScore computes green/amber/red totals", () => {
    const summary = summarizeMseScore({ a: "green", b: "amber", c: "red", d: "green" });
    expect(summary.green).toBe(2);
    expect(summary.amber).toBe(1);
    expect(summary.red).toBe(1);
    expect(summary.score).toBe(2.5);
    expect(summary.max).toBe(4);
  });
});

describe("MSE expert codes", () => {
  it("every expert code keys to a real authored sim case title", () => {
    expect(MSE_EXPERT_CODES.length).toBeGreaterThanOrEqual(6);
    for (const c of MSE_EXPERT_CODES) {
      expect(c.title.length).toBeGreaterThan(5);
      expect(c.caseKey.length).toBeGreaterThan(3);
      expect(c.small_things.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("getExpertMseForCase resolves by title and returns null for unknown", () => {
    expect(getExpertMseForCase("Ravi, 34 — the heaviness in his chest")).not.toBeNull();
    expect(getExpertMseForCase("no such case")).toBeNull();
  });

  it("expert codes match the authored patient presentations", () => {
    const vikram = getExpertMseForCase("Vikram, 27 — the Lonazep case (four traps at once)")!;
    expect(vikram.perception.join(" ")).toContain("auditory hallucination");
    expect(vikram.insight.some((i) => i.includes("poor"))).toBe(true);
    const neha = getExpertMseForCase("Neha, 26 — the 'best three months ever' that ended badly")!;
    expect(neha.thought_process.join(" ")).toContain("flight of ideas");
  });
});

describe("MSE small things checklist", () => {
  it("covers the novice-never-notice observations — at least 20 items (v5 §3.1)", () => {
    expect(SMALL_THINGS.length).toBeGreaterThanOrEqual(20);
    for (const s of SMALL_THINGS) {
      expect(s.moment.length).toBeGreaterThan(20);
      expect(s.read.length).toBeGreaterThan(10);
      expect(s.move.length).toBeGreaterThan(10);
    }
  });

  it("the past-tense and pause items are present (the two Kavya named)", () => {
    const all = SMALL_THINGS.map((s) => s.moment.toLowerCase()).join("\n");
    expect(all).toContain("past tense");
    expect(all).toContain("pause");
  });
});
