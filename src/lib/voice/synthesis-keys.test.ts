import { describe, expect, it } from "vitest";
import { synthesisCacheKey } from "./synthesis-keys";

describe("synthesis cache keys (v5 §6)", () => {
  it("is deterministic — same inputs, same key", () => {
    const a = synthesisCacheKey({ text: "Hello", voice: "ravi", emotionTag: "sad", speed: 0.9 });
    const b = synthesisCacheKey({ text: "Hello", voice: "ravi", emotionTag: "sad", speed: 0.9 });
    expect(a).toBe(b);
  });

  it("varies on text, voice, emotion and speed (each is part of the key)", () => {
    const base = { text: "Hello", voice: "ravi", emotionTag: "sad" as const, speed: 0.9 };
    expect(synthesisCacheKey(base)).not.toBe(synthesisCacheKey({ ...base, text: "Goodbye" }));
    expect(synthesisCacheKey(base)).not.toBe(synthesisCacheKey({ ...base, voice: "priya" }));
    expect(synthesisCacheKey(base)).not.toBe(synthesisCacheKey({ ...base, emotionTag: "angry" }));
    expect(synthesisCacheKey(base)).not.toBe(synthesisCacheKey({ ...base, speed: 1.1 }));
  });

  it("is a 64-char sha256 hex string", () => {
    const k = synthesisCacheKey({ text: "x", voice: "y" });
    expect(k).toMatch(/^[0-9a-f]{64}$/);
  });
});