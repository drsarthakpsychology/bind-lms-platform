import { describe, expect, it } from "vitest";
import { PROVIDERS, PROVIDER_PRIORITY } from "./router";

describe("AI router provider priority (Director/Actor wiring, research 2026-08-14)", () => {
  it("Groq is the Primary Director (json) provider and Cerebras the Fallback", () => {
    expect(PROVIDER_PRIORITY.json[0]).toBe("groq");
    expect(PROVIDER_PRIORITY.json[1]).toBe("cerebras");
  });

  it("Groq is the Primary Actor provider (chat/stream already lead with groq)", () => {
    expect(PROVIDER_PRIORITY.chat[0]).toBe("groq");
    expect(PROVIDER_PRIORITY.stream[0]).toBe("groq");
  });

  it("Groq is a no-train provider able to serve json + stream for student data", () => {
    const groq = PROVIDERS.find((p) => p.id === "groq");
    expect(groq).toBeDefined();
    expect(groq!.trainsOnData).toBe(false);
    expect(groq!.supports).toContain("json");
    expect(groq!.supports).toContain("stream");
    expect(groq!.apiKeyEnv).toBe("GROQ_API_KEY");
  });

  it("no data-training provider outranks the no-train pair in the json lane", () => {
    const order = PROVIDER_PRIORITY.json;
    const trainingIndexes = order
      .map((id, i) => ({ id, i }))
      .filter(({ id }) => PROVIDERS.find((p) => p.id === id)?.trainsOnData)
      .map(({ i }) => i);
    for (const i of trainingIndexes) expect(i).toBeGreaterThan(1);
  });
});
