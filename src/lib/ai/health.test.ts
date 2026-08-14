import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  FAILURE_THRESHOLD,
  RECOVERY_WINDOW_MS,
  isProviderHealthy,
  recordProviderOutcome,
  resetProviderHealth,
} from "./health";

describe("provider health circuit-breaker (§24)", () => {
  beforeEach(() => {
    resetProviderHealth("groq");
  });

  it("an unknown provider is assumed healthy", () => {
    expect(isProviderHealthy("groq")).toBe(true);
  });

  it("opens the circuit after FAILURE_THRESHOLD consecutive failures", async () => {
    for (let i = 0; i < FAILURE_THRESHOLD; i++) {
      await recordProviderOutcome("groq", false);
    }
    expect(isProviderHealthy("groq")).toBe(false);
  });

  it("a success resets the circuit immediately", async () => {
    for (let i = 0; i < FAILURE_THRESHOLD; i++) {
      await recordProviderOutcome("groq", false);
    }
    expect(isProviderHealthy("groq")).toBe(false);
    await recordProviderOutcome("groq", true);
    expect(isProviderHealthy("groq")).toBe(true);
  });

  it("stays healthy below the threshold", async () => {
    await recordProviderOutcome("groq", false);
    await recordProviderOutcome("groq", false);
    expect(isProviderHealthy("groq")).toBe(true); // 2 < 3
  });

  it("reopens (half-open probe) after the recovery window", async () => {
    for (let i = 0; i < FAILURE_THRESHOLD; i++) {
      await recordProviderOutcome("groq", false);
    }
    expect(isProviderHealthy("groq")).toBe(false);

    // Time-travel past the recovery window by mocking Date.now.
    const realNow = Date.now;
    vi.spyOn(Date, "now").mockReturnValue(realNow() + RECOVERY_WINDOW_MS + 1000);
    expect(isProviderHealthy("groq")).toBe(true); // allowed to probe
    vi.restoreAllMocks();

    // A success during the probe closes the circuit for good.
    await recordProviderOutcome("groq", true);
    expect(isProviderHealthy("groq")).toBe(true);
  });
});
