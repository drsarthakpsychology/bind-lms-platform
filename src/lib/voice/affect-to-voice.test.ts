import { describe, expect, it } from "vitest";
import { affectToVoice } from "./affect-to-voice";

describe("affect → voice mapping (v5 §6)", () => {
  it("flat affect slows and quietens delivery", () => {
    const v = affectToVoice("flat", { fatigue: 2 });
    expect(v.rate).toBeLessThan(0.95);
    expect(v.loudness).toBeLessThan(0.75);
    expect(v.emotionTag).toBe("sad");
  });

  it("THE line: fatigue 8 + flat mood sounds slow, flat, quiet", () => {
    const v = affectToVoice("flat", { fatigue: 8, mood: "flat" });
    expect(v.rate).toBeLessThanOrEqual(0.65);
    expect(v.pitch).toBeLessThanOrEqual(0.75);
    expect(v.loudness).toBeLessThanOrEqual(0.45);
    expect(v.styleHint).toMatch(/slow, very quiet, long gaps/i);
  });

  it("anxious affect is faster and higher", () => {
    const v = affectToVoice("anxious");
    expect(v.rate).toBeGreaterThan(1.05);
    expect(v.pitch).toBeGreaterThan(1.05);
  });

  it("irritated affect is clipped and firmer", () => {
    const v = affectToVoice("irritated", { irritation: 8 });
    expect(v.emotionTag).toBe("angry");
    expect(v.loudness).toBeGreaterThan(0.9);
  });

  it("brittle cheerful stays bright on the surface", () => {
    const v = affectToVoice("brittle_cheerful");
    expect(v.emotionTag).toBe("happy");
    expect(v.styleHint).toMatch(/wavering underneath/);
  });

  it("is pure — identical inputs give identical outputs", () => {
    const a = affectToVoice("sad", { fatigue: 5, mood: "resigned" });
    const b = affectToVoice("sad", { fatigue: 5, mood: "resigned" });
    expect(a).toEqual(b);
  });
});