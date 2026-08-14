import { describe, expect, it } from "vitest";
import { PROVIDERS, PROVIDER_PRIORITY, modelForTier } from "./router";
import { assertProviderAllowed } from "./guards";

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

describe("task-tier model selection (§7)", () => {
  it("simple + normal tiers use the fast model", () => {
    const groq = PROVIDERS.find((p) => p.id === "groq")!;
    expect(modelForTier(groq, "simple")).toBe(groq.models.fast);
    expect(modelForTier(groq, "normal")).toBe(groq.models.fast);
  });

  it("difficult tier uses smart, falling back to strong when present", () => {
    const groq = PROVIDERS.find((p) => p.id === "groq")!;
    // Groq has no dedicated strong model → falls back to smart.
    expect(modelForTier(groq, "difficult")).toBe(groq.models.smart);
    const anthropic = PROVIDERS.find((p) => p.id === "anthropic")!;
    // Anthropic has a strong (opus) model → difficult uses it.
    expect(anthropic.models.strong).toBeDefined();
    expect(modelForTier(anthropic, "difficult")).toBe(anthropic.models.strong);
  });

  it("difficult maps to smart (or strong) — never fast", () => {
    for (const p of PROVIDERS) {
      expect(modelForTier(p, "difficult")).toBe(p.models.strong ?? p.models.smart);
    }
  });

  it("when a provider has a distinct strong model, difficult uses it", () => {
    const withStrong = PROVIDERS.filter((p) => p.models.strong);
    expect(withStrong.length).toBeGreaterThan(0);
    for (const p of withStrong) {
      expect(modelForTier(p, "difficult")).toBe(p.models.strong);
    }
  });
});

describe("SambaNova provider (Cerebras alternative, 2026-08-14)", () => {
  it("is registered as a no-train provider with the verified Llama model", () => {
    const sn = PROVIDERS.find((p) => p.id === "sambanova");
    expect(sn).toBeDefined();
    expect(sn!.trainsOnData).toBe(false);
    expect(sn!.models.fast).toBe("Meta-Llama-3.3-70B-Instruct");
    expect(sn!.apiKeyEnv).toBe("SAMBANOVA_API_KEY");
  });

  it("sits in the no-train json chain after Groq + Cerebras", () => {
    const json = PROVIDER_PRIORITY.json;
    // The three no-train student-safe lanes lead the chain.
    expect(json.slice(0, 3)).toEqual(["groq", "cerebras", "sambanova"]);
  });

  it("can serve student data (no-train)", () => {
    const sn = PROVIDERS.find((p) => p.id === "sambanova")!;
    expect(() => assertProviderAllowed("sim_patient_turn", sn)).not.toThrow();
  });
});

describe("OpenCode provider (user request 2026-08-14)", () => {
  it("is registered as a no-train OpenAI-compatible gateway", () => {
    const oc = PROVIDERS.find((p) => p.id === "opencode");
    expect(oc).toBeDefined();
    expect(oc!.trainsOnData).toBe(false);
    expect(oc!.apiKeyEnv).toBe("OPENCODE_API_KEY");
    expect(oc!.baseUrl).toMatch(/\/v1$/); // required by the OpenAI adapter
  });

  it("sits in the json fallback chain after the free trio", () => {
    const json = PROVIDER_PRIORITY.json;
    // no-train student-safe lanes lead, opencode after openrouter.
    expect(json.slice(0, 3)).toEqual(["groq", "cerebras", "sambanova"]);
    expect(json).toContain("opencode");
    expect(json.indexOf("opencode")).toBeGreaterThan(json.indexOf("openrouter"));
  });
});

describe("DeepSeek provider (§13, registered 2026-08-14)", () => {
  it("is registered with V4 Flash fast + V4 Pro smart/strong", () => {
    const ds = PROVIDERS.find((p) => p.id === "deepseek");
    expect(ds).toBeDefined();
    expect(ds!.models.fast).toBe("deepseek-v4-flash");
    expect(ds!.models.smart).toBe("deepseek-v4-pro");
    expect(ds!.apiKeyEnv).toBe("DEEPSEEK_API_KEY");
  });

  it("is marked trainsOnData (unresolved posture) so the guard keeps it off student data", () => {
    const ds = PROVIDERS.find((p) => p.id === "deepseek");
    expect(ds!.trainsOnData).toBe(true);
    // assertProviderAllowed must reject it for a student-data workload.
    expect(() => assertProviderAllowed("sim_patient_turn", ds!)).toThrow(/data-policy violation/);
    // But it's allowed for non-student bulk work.
    expect(() => assertProviderAllowed("corpus_processing", ds!)).not.toThrow();
  });
});
