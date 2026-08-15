import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { AiUnavailableError } from "./router";
import { resetProviderHealth } from "./health";

// client.ts imports "server-only" whose default entry throws outside a React
// server. Intercept it so aiChat is testable (the router logic is what we're
// proving here, not the module boundary). vi.mock is hoisted above the import.
vi.mock("server-only", () => ({}));

import { aiChat } from "./client";

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Deterministic candidate list: only GROQ + CEREBRAS keys are set, so for a
 * non-student workload the stream lane is exactly [groq, cerebras] — a 429 on
 * groq MUST advance to cerebras (the brief's "verify the router genuinely
 * advances on 429", not silently fall back to scripted).
 */
function setTwoProviders() {
  process.env.GROQ_API_KEY = "k-groq";
  process.env.CEREBRAS_API_KEY = "k-cerebras";
  process.env.AI_ENABLED = "true";
}

beforeEach(() => {
  setTwoProviders();
  resetProviderHealth("groq");
  resetProviderHealth("cerebras");
  vi.restoreAllMocks();
});

afterEach(() => {
  delete process.env.GROQ_API_KEY;
  delete process.env.CEREBRAS_API_KEY;
  delete process.env.AI_ENABLED;
  vi.unstubAllGlobals();
});

describe("aiChat provider failover (§3.1 — the 429 advance)", () => {
  it("advances to the next provider when the first returns 429", async () => {
    const calls: Array<{ url: string }> = [];
    vi.stubGlobal("fetch", vi.fn(async (url: RequestInfo | URL) => {
      calls.push({ url: String(url) });
      if (calls.length === 1) return jsonResponse(429, { error: { message: "rate limited" } });
      return jsonResponse(200, {
        choices: [{ message: { content: "the second provider answered" } }],
        usage: { prompt_tokens: 5, completion_tokens: 3 },
      });
    }));

    const res = await aiChat(
      [{ role: "user", content: "hello" }],
      { workload: "content_generation", temperature: 0 },
    );

    expect(calls.length).toBe(2); // groq failed, cerebras served
    expect(calls[0].url).toContain("api.groq.com");
    expect(calls[1].url).toContain("api.cerebras.ai");
    expect(res.provider).toBe("cerebras");
    expect(res.text).toBe("the second provider answered");
  });

  it("throws AiUnavailableError and logs the loud marker when EVERY candidate 429s", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse(429, { error: { message: "quota" } })));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(
      aiChat([{ role: "user", content: "hello" }], { workload: "content_generation", temperature: 0 }),
    ).rejects.toBeInstanceOf(AiUnavailableError);

    const marker = warn.mock.calls.find((c) => String(c[0]).includes("[SIM] ALL PROVIDERS FAILED"));
    expect(marker).toBeTruthy();
    // The marker's single string arg must name both providers' failure reasons.
    expect(String(marker?.[0] ?? "")).toContain("groq");
    expect(String(marker?.[0] ?? "")).toContain("cerebras");
  });
});
