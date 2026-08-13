import { describe, expect, it } from "vitest";
import { buildSctAttemptPayload } from "./sct-attempt";

describe("buildSctAttemptPayload", () => {
  it("carries the item slug, response, score, and seconds", () => {
    const payload = buildSctAttemptPayload("sct-1", 1, 0.75, 42);
    expect(payload.item_id).toBe("sct-1");
    expect(payload.response).toBe(1);
    expect(payload.scored).toBe(0.75);
    expect(payload.seconds_spent).toBe(42);
  });

  it("accepts the full -2..2 scale", () => {
    expect(buildSctAttemptPayload("sct-2", -2, 0, 10).response).toBe(-2);
    expect(buildSctAttemptPayload("sct-3", 2, 1, 10).response).toBe(2);
  });
});
