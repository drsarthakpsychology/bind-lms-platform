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

export interface Provider {
  id: string;
  baseUrl: string; // OpenAI-compatible unless gemini
  apiKeyEnv: string; // env var name holding the key
  models: { fast: string; smart: string; embed?: string };
  limits: { rpm: number; rpd: number; tpm: number };
  trainsOnData: boolean;
  supports: ProviderCapability[];
  protocol: "openai" | "gemini";
}

/** Capability → which provider ids can serve it, in priority order. */
export const PROVIDER_PRIORITY: Record<ProviderCapability, string[]> = {
  // fast chat / streaming — Groq is first for speed (voice needs sub-second TTFB)
  chat: ["groq", "gemini", "cerebras", "openrouter", "anthropic"],
  stream: ["groq", "gemini", "cerebras", "openrouter", "anthropic"],
  // structured JSON — Groq is Primary (fast, no-train, OpenAI-compatible
  // json_schema/json_object). Both JSON callers (sim Director + debrief
  // scoring) carry student data, so gemini (trainsOnData) is excluded by the
  // guard and sits last purely as a non-student fallback lane.
  json: ["groq", "cerebras", "openrouter", "anthropic", "gemini"],
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
    id: "openrouter",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    models: { fast: "meta-llama/llama-3.3-70b-instruct:free", smart: "meta-llama/llama-3.3-70b-instruct:free" },
    limits: { rpm: 20, rpd: 50, tpm: 20000 },
    trainsOnData: false,
    supports: ["chat", "stream", "json", "embed", "vision"],
    protocol: "openai",
  },
  {
    id: "anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    apiKeyEnv: "ANTHROPIC_API_KEY",
    models: { fast: "claude-sonnet-4-5", smart: "claude-sonnet-4-5" },
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
    .filter((p): p is Provider => !!p && p.supports.includes(capability) && (!studentData || !p.trainsOnData));
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
