/**
 * AI model router — a registry of providers with automatic failover.
 *
 * The whole point is NOT to hard-code one provider. Free tiers are
 * rate-limited, not rate-free; real capacity comes from stacking independent
 * limits and failing over on 429/5xx/timeout.
 *
 * Providers are all OpenAI-compatible chat endpoints except Gemini's native
 * API. `trainsOnData` is the field that decides what a provider may ever see —
 * student data can only go to `trainsOnData === false` providers (see guards.ts).
 *
 * AI_ENABLED=false → the app uses deterministic fixtures in src/lib/ai/fixtures/
 * and never makes a network call. Every AI feature must work in that mode.
 */

export type ProviderCapability = "chat" | "stream" | "json" | "embed" | "vision" | "audio";

export type TaskTier = "simple" | "normal" | "difficult";

import { isProviderHealthy } from "./health";

export interface Provider {
  id: string;
  baseUrl: string; // OpenAI-compatible unless gemini
  apiKeyEnv: string; // env var name holding the key
  models: { fast: string; smart: string; strong?: string; embed?: string };
  limits: { rpm: number; rpd: number; tpm: number };
  trainsOnData: boolean;
  supports: ProviderCapability[];
  protocol: "openai" | "gemini";
}

/**
 * Map a task tier to the model field to use on a provider.
 *   simple   → fast   (classification, metadata, formatting)
 *   normal   → fast   (tutoring, normal patient conversations)
 *   difficult→ smart  (difficult reasoning) or strong when present (premium)
 * Providers without a `strong` model fall back to `smart`.
 */
export function modelForTier(provider: Provider, tier: TaskTier): string {
  if (tier === "difficult") return provider.models.strong ?? provider.models.smart;
  return provider.models.fast;
}

/** Capability → which provider ids can serve it, in priority order. */
export const PROVIDER_PRIORITY: Record<ProviderCapability, string[]> = {
  // fast chat / streaming — Groq first (voice needs sub-second TTFB), then the
  // no-train fallbacks (Cerebras + SambaNova) so student data has capacity
  // beyond Groq's RPD ceiling.
  chat: ["groq", "cerebras", "sambanova", "gemini", "openrouter", "opencode", "omniroute", "deepseek", "anthropic"],
  stream: ["groq", "cerebras", "sambanova", "gemini", "openrouter", "opencode", "omniroute", "deepseek", "anthropic"],
  // structured JSON — Groq is Primary (fast, no-train). The sim Director +
  // debrief scoring carry student data, so the no-train fallbacks (Cerebras,
  // SambaNova, OpenRouter, OpenCode, OmniRoute) sit next; gemini/deepseek
  // (trainsOnData) are excluded by the guard and sit last as non-student lanes.
  json: ["groq", "cerebras", "sambanova", "openrouter", "opencode", "omniroute", "anthropic", "deepseek", "gemini"],
  // vision/audio only where the provider supports it
  vision: ["gemini", "anthropic", "openrouter"],
  audio: ["gemini", "groq"],
  embed: ["openrouter", "gemini"],
};

/**
 * The provider registry. Order within each list = failover order.
 * apiKeyEnv names match .env.example. All free tiers verify at build time.
 */
export const PROVIDERS: Provider[] = [
  {
    id: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/",
    apiKeyEnv: "GEMINI_API_KEY",
    models: { fast: "gemini-2.0-flash", smart: "gemini-2.5-flash", embed: "text-embedding-004" },
    limits: { rpm: 10, rpd: 1500, tpm: 1000000 },
    trainsOnData: true, // free-tier Gemini is used to improve Google products
    supports: ["chat", "stream", "json", "vision", "audio", "embed"],
    protocol: "openai",
  },
  {
    id: "groq",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKeyEnv: "GROQ_API_KEY",
    models: { fast: "llama-3.3-70b-versatile", smart: "llama-3.3-70b-versatile" },
    limits: { rpm: 30, rpd: 1000, tpm: 12000 },
    trainsOnData: false,
    supports: ["chat", "stream", "json", "audio"],
    protocol: "openai",
  },
  {
    id: "cerebras",
    baseUrl: "https://api.cerebras.ai/v1",
    apiKeyEnv: "CEREBRAS_API_KEY",
    models: { fast: "llama-3.3-70b", smart: "llama-3.3-70b" },
    limits: { rpm: 30, rpd: 1440, tpm: 1000000 },
    trainsOnData: false,
    supports: ["chat", "stream", "json"],
    protocol: "openai",
  },
  {
    // SambaNova Cloud — the Cerebras-alternative lane (user request 2026-08-14).
    // Verified catalog: Meta-Llama-3.3-70B-Instruct, DeepSeek-V3.1/V3.2,
    // gpt-oss-120b, gemma-4-31B-it. OpenAI-compatible. NOTE (verified 2026-08-14):
    // the API now requires a payment method (PAYMENT_METHOD_REQUIRED) — the old
    // "free, no card" claim is outdated, so this is a PAID fallback lane, not a
    // free one. Cerebras (free, no-train) remains the true free double.
    id: "sambanova",
    baseUrl: "https://api.sambanova.ai/v1",
    apiKeyEnv: "SAMBANOVA_API_KEY",
    models: { fast: "Meta-Llama-3.3-70B-Instruct", smart: "Meta-Llama-3.3-70B-Instruct", strong: "gpt-oss-120b" },
    limits: { rpm: 30, rpd: 10000, tpm: 1000000 },
    trainsOnData: false,
    supports: ["chat", "stream", "json"],
    protocol: "openai",
  },
  {
    // OpenCode Zen — OpenAI-compatible gateway (user request 2026-08-14).
    // https://opencode.ai/zen/v1 via OPENCODE_API_KEY. USER DIRECTION: use the
    // FREE models. Verified live 2026-08-14: deepseek-v4-flash-free returns
    // direct content (the other frees — nemotron, mimo — are reasoning/<think>
    // style). Paid models (claude/gpt-5) exist but need billing; the free lane
    // is the default here.
    id: "opencode",
    baseUrl: "https://opencode.ai/zen/v1",
    apiKeyEnv: "OPENCODE_API_KEY",
    models: { fast: "deepseek-v4-flash-free", smart: "deepseek-v4-flash-free" },
    limits: { rpm: 30, rpd: 1000, tpm: 40000 },
    trainsOnData: false,
    supports: ["chat", "stream", "json"],
    protocol: "openai",
  },
  {
    // OmniRoute — self-hosted free-model pooling gateway (user request
    // 2026-08-14; repo diegosouzapw/OmniRoute). OpenAI-compatible /v1 on
    // localhost:20128; "auto" routes across 42 provider pools (~1.5B free
    // tokens/mo) with health/speed/cost/quality scoring + fallback.
    // PRIVACY: the gateway itself does not train (trainsOnData=false), BUT it
    // can route to training upstreams — for student data it MUST be configured
    // with only no-train providers enabled. Env OMNIROUTE_URL/OMNIROUTE_API_KEY.
    id: "omniroute",
    baseUrl: "http://localhost:20128/v1",
    apiKeyEnv: "OMNIROUTE_API_KEY",
    models: { fast: "auto", smart: "auto/smart", strong: "auto/smart" },
    limits: { rpm: 60, rpd: 10000, tpm: 1000000 },
    trainsOnData: false,
    supports: ["chat", "stream", "json"],
    protocol: "openai",
  },
  {
    // OpenRouter overflow lane — current free model verified live 2026-08-14:
    // the previous llama-3.3-70b-instruct:free no longer exists; openai/gpt-
    // oss-20b:free is a current free general model that returns real content
    // (verified). Free tier ~50 RPD; $10 one-time → ~1,000 RPD.
    id: "openrouter",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    models: { fast: "openai/gpt-oss-20b:free", smart: "openai/gpt-oss-20b:free" },
    limits: { rpm: 20, rpd: 50, tpm: 20000 }, // free tier; $10 one-time → ~1,000 RPD
    trainsOnData: false,
    supports: ["chat", "stream", "json", "embed", "vision"],
    protocol: "openai",
  },
  {
    // DeepSeek V4 — verified 2026-08-14 (api-docs.deepseek.com): base
    // https://api.deepseek.com, OpenAI-compatible, models deepseek-v4-flash
    // (+0731) and deepseek-v4-pro (+0813). PRIVACY: the API training posture is
    // unresolved (sources conflict; CN controller, no fixed retention), so
    // trainsOnData=true — the data-policy guard keeps it OUT of student-data
    // lanes automatically. It is ideal for the brief §13 bulk NON-student
    // workloads (corpus processing, metadata, classification, knowledge
    // structuring) where the guard already allows it. Flash = cheap bulk;
    // Pro ≈ 3× flash, for selective difficult verification.
    id: "deepseek",
    baseUrl: "https://api.deepseek.com/v1",
    apiKeyEnv: "DEEPSEEK_API_KEY",
    models: { fast: "deepseek-v4-flash", smart: "deepseek-v4-pro", strong: "deepseek-v4-pro" },
    limits: { rpm: 60, rpd: 10000, tpm: 1000000 },
    trainsOnData: true, // unresolved posture — never for student data (guard-enforced)
    supports: ["chat", "stream", "json"],
    protocol: "openai",
  },
  {
    id: "anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    apiKeyEnv: "ANTHROPIC_API_KEY",
    models: { fast: "claude-sonnet-4-5", smart: "claude-sonnet-4-5", strong: "claude-opus-4-5" },
    limits: { rpm: 50, rpd: 1000, tpm: 40000 },
    trainsOnData: false,
    supports: ["chat", "stream", "json", "vision"],
    protocol: "openai",
  },
];

export function isEnabled(): boolean {
  return process.env.AI_ENABLED === "true";
}

export function getKey(provider: Provider): string | undefined {
  return process.env[provider.apiKeyEnv];
}

/** Which providers currently have a key set and are enabled. */
export function availableProviders(): Provider[] {
  if (!isEnabled()) return [];
  return PROVIDERS.filter((p) => getKey(p));
}

/**
 * Providers that may serve a given workload. `studentData: true` filters to
 * providers that do not train on data — this is the data-policy hard split.
 */
export function providersFor(capability: ProviderCapability, studentData: boolean): Provider[] {
  const order = PROVIDER_PRIORITY[capability];
  const available = availableProviders();
  return order
    .map((id) => available.find((p) => p.id === id))
    .filter(
      (p): p is Provider =>
        !!p &&
        p.supports.includes(capability) &&
        (!studentData || !p.trainsOnData) &&
        // Circuit-breaker: route around providers that are currently unhealthy
        // (≥3 consecutive failures, outside the recovery window).
        isProviderHealthy(p.id),
    );
}

/** True if a student-data workload has ANY eligible provider right now. */
export function canServe(capability: ProviderCapability, studentData: boolean): boolean {
  return providersFor(capability, studentData).length > 0;
}

export class AiUnavailableError extends Error {
  constructor(workload: string) {
    super(`No available provider for ${workload}`);
    this.name = "AiUnavailableError";
  }
}
