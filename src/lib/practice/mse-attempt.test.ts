import { describe, expect, it } from "vitest";
import { SEED_MSE_STIMULI } from "./mse";
import {
  buildMseAttemptPayload,
  scoreMseLevel1Attempt,
  scoreMseLevel2Attempt,
} from "./mse-attempt";

describe("buildMseAttemptPayload", () => {
  const started = new Date("2026-08-13T10:00:00Z");
  const completed = new Date("2026-08-13T10:05:00Z");

  it("carries the stimulus slug, level, and timestamps", () => {
    const stimulus = SEED_MSE_STIMULI[0];
    const payload = buildMseAttemptPayload(stimulus, "2", { domain: "perception" }, started, completed);
    expect(payload.stimulus_id).toBe(stimulus.id);
    expect(payload.level).toBe("2");
    expect(payload.domain).toBe("perception");
    expect(payload.started_at).toBe(started.toISOString());
    expect(payload.completed_at).toBe(completed.toISOString());
  });

  it("attaches score and per-level detail fields", () => {
    const payload = buildMseAttemptPayload(
      SEED_MSE_STIMULI[0],
      "1",
      { score: 0.75, labels: ["depressed"], observations: 14 },
      started,
      completed,
    );
    expect(payload.score).toBe(0.75);
    expect(payload.labels).toEqual(["depressed"]);
    expect(payload.observations).toBe(14);
  });

  it("Level 5 (session-based) sends null stimulus_id plus source_session_id", () => {
    const sessionId = "11111111-2222-3333-8888-555555555555";
    const payload = buildMseAttemptPayload(
      null,
      "5",
      { score: 0.4, source_session_id: sessionId },
      started,
      completed,
    );
    expect(payload.stimulus_id).toBeNull();
    expect(payload.source_session_id).toBe(sessionId);
    expect(payload.level).toBe("5");
  });
});

describe("scoreMseLevel1Attempt", () => {
  it("clean describe-don't-diagnose attempt scores 1", () => {
    expect(scoreMseLevel1Attempt(20, [], 100)).toBe(1);
  });

  it("fewer observation words (and fewer words) reduces the score", () => {
    expect(scoreMseLevel1Attempt(5, [], 40)).toBeLessThan(1);
    expect(scoreMseLevel1Attempt(5, [], 40)).toBeGreaterThan(0);
  });

  it("each smuggled diagnostic label costs 0.25", () => {
    const clean = scoreMseLevel1Attempt(20, [], 100);
    const labelled = scoreMseLevel1Attempt(20, ["depressed"], 100);
    expect(labelled).toBeCloseTo(clean - 0.25);
  });

  it("never returns below zero", () => {
    expect(scoreMseLevel1Attempt(0, ["depressed", "anxious", "manic", "psychotic", "ptsd"], 0)).toBe(0);
  });
});

describe("scoreMseLevel2Attempt", () => {
  it("perfect match on expert + amber tags scores 1", () => {
    expect(scoreMseLevel2Attempt(["hallucinations", "auditory hallucination"], ["hallucinations"], ["auditory hallucination"])).toBe(1);
  });

  it("missing the expert tag drops the score", () => {
    const perfect = scoreMseLevel2Attempt(["hallucinations", "auditory hallucination"], ["hallucinations"], ["auditory hallucination"]);
    const missed = scoreMseLevel2Attempt(["auditory hallucination"], ["hallucinations"], ["auditory hallucination"]);
    // expert = 1pt, amber = 0.5pt → max 1.5; missing expert keeps only amber
    expect(missed).toBeCloseTo(1 / 3, 2);
    expect(missed).toBeLessThan(perfect);
  });

  it("empty attempt scores 0", () => {
    expect(scoreMseLevel2Attempt([], ["delusions"], [])).toBe(0);
  });

  it("no expert tags (uncoded stimulus) returns 0 rather than dividing by zero", () => {
    expect(scoreMseLevel2Attempt(["whatever"], [], [])).toBe(0);
  });
});
