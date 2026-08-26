/**
 * The single AI client interface. All providers sit behind it; swapping to a
 * paid Anthropic key later is a one-line env change.
 *
 * Router behaviour (from Part 3.1):
 *   - Try providers in priority order for the requested capability.
 *   - On 429 / 5xx / timeout → fail over to the next provider immediately,
 *     log it, don't surface an error to the student.
 *   - Exponential backoff per provider, but never block — go sideways.
 *   - AI_ENABLED=false → deterministic fixture, no network call.
 */

import "server-only";

import { z } from "zod";
import {
  AiUnavailableError,
  availableProviders,
  isEnabled,
  modelForTier,
  providersFor,
  type Provider,
  type ProviderCapability,
  type TaskTier,
} from "./router";
import { assertProviderAllowed, type Workload } from "./guards";
import { fixtureReply } from "./fixtures";
import { logAiUsage, recordProviderOutcome, warmProviderCircuit } from "./health";

const DEBUG = process.env.AI_DEBUG === "true";

function log(provider: string | null, workload: string, note: string) {
  if (DEBUG) console.log(`[ai] ${workload} → ${provider ?? "fixture"}: ${note}`);
}

export interface AiChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiRequestOptions {
  workload: Workload;
  capability?: ProviderCapability;
  /** task difficulty → model tier (§7). simple/normal → fast; difficult → smart/strong */
  taskTier?: TaskTier;
  maxTokens?: number;
  /** schema to validate a JSON output; when set, forces json capability */
  schema?: z.ZodType;
  temperature?: number;
  /** Force a specific provider id (multi-model consensus). Default: routed. */
  providerId?: string;
}

export interface AiResponse {
  text: string;
  provider: string; // "fixture" when disabled
  json?: unknown;
}

/** Read a provider key from env. */
function keyFor(p: Provider): string | undefined {
  return process.env[p.apiKeyEnv];
}

async function callOpenAI(
  provider: Provider,
  messages: AiChatMessage[],
  opts: AiRequestOptions,
): Promise<{ text: string; raw: string; usage: { tokensIn: number; tokensOut: number } }> {
  // Model selection: embed/json keep their dedicated lanes; general chat/stream
  // use the task tier (simple/normal → fast, difficult → smart/strong).
  const model =
    opts.capability === "embed"
      ? (provider.models.embed ?? provider.models.fast)
      : opts.capability === "json"
        ? provider.models.smart
        : modelForTier(provider, opts.taskTier ?? "normal");
  const url = `${provider.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const body: Record<string, unknown> = {
    model,
    messages,
    max_tokens: opts.maxTokens ?? 1024,
    temperature: opts.temperature ?? 0.7,
  };
  if (opts.schema) {
    // Ask for JSON; we validate with Zod ourselves.
    body.response_format = { type: "json_object" };
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${keyFor(provider)}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
    // Abort the request on timeout — the old code raced a manual setTimeout
    // and leaked the timer (the fetch kept running in the background).
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (res.status === 429 || res.status >= 500) {
    const bodyText = await res.text().catch(() => "");
    const e = new Error(`provider ${provider.id} ${model} responded ${res.status}: ${bodyText.slice(0, 500)}`);
    (e as unknown as { status: number }).status = res.status;
    (e as unknown as { model: string }).model = model;
    throw e;
  }
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(`provider ${provider.id} ${model} responded ${res.status}: ${bodyText.slice(0, 500)}`);
  }
  const j = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  const text = j.choices?.[0]?.message?.content ?? "";
  return {
    text,
    raw: text,
    // Real token counts from the provider — what /admin/infra's AI usage panel
    // needs to be truthful. Absent usage → 0 (some providers omit it).
    usage: {
      tokensIn: j.usage?.prompt_tokens ?? 0,
      tokensOut: j.usage?.completion_tokens ?? 0,
    },
  };
}

async function callGemini(
  provider: Provider,
  messages: AiChatMessage[],
  opts: AiRequestOptions,
): Promise<{ text: string; raw: string; usage: { tokensIn: number; tokensOut: number } }> {
  // Gemini native endpoint (non-OpenAI-compatible). Fall back to the
  // OpenAI-compatible wrapper which Gemini now exposes at the same baseUrl.
  return callOpenAI(provider, messages, opts);
}

async function callProvider(
  provider: Provider,
  messages: AiChatMessage[],
  opts: AiRequestOptions,
): Promise<{ text: string; raw: string; usage: { tokensIn: number; tokensOut: number } }> {
  assertProviderAllowed(opts.workload, provider);
  if (provider.protocol === "gemini") return callGemini(provider, messages, opts);
  return callOpenAI(provider, messages, opts);
}

const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const TIMEOUT_MS = 20_000;

/**
 * Models sometimes wrap JSON in ```json fences or preface it with prose.
 * Strip that before parsing so the schema parse succeeds on the first try
 * (no repair round-trip, no spurious failover).
 */
function extractJson(text: string): string {
  let s = text;
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) s = fenced[1];
  else {
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    if (start >= 0 && end > start) s = s.slice(start, end + 1);
  }
  // Models occasionally emit `+1` (a leading plus) for positive numbers, which
  // is not valid JSON. Strip it so the schema parse succeeds first try.
  return s.replace(/([:,\s[])\+(\d)/g, "$1$2").trim();
}

/** One call with provider failover. Never throws for a student-visible failure
 *  when another provider can serve the request. */
export async function aiChat(messages: AiChatMessage[], opts: AiRequestOptions): Promise<AiResponse> {
  if (!isEnabled()) {
    // Fixture path — deterministic, network-free. Logged as provider
    // "fixture" so the usage panel reflects reality (served by fixtures).
    const turn = fixtureReply(opts.workload);
    void logAiUsage({ workload: opts.workload, provider: "fixture", tokensIn: 0, tokensOut: 0, latencyMs: 0, status: "ok" });
    return { text: turn.patient, provider: "fixture" };
  }
  const capability: ProviderCapability = opts.schema ? "json" : "stream";
  const allCandidates = providersFor(capability, opts.workload === "content_generation" || opts.workload === "corpus_processing" || opts.workload === "embeddings" ? false : true);
  // A forced provider (multi-model consensus) narrows to exactly that lane; the
  // normal path routes across all candidates in priority order.
  const candidates = opts.providerId ? allCandidates.filter((p) => p.id === opts.providerId) : allCandidates;
  if (!candidates.length) {
    const reason = `no configured/enabled providers (AI_ENABLED=${process.env.AI_ENABLED ?? "unset"}, keys present: ${availableProviders().filter((p) => keyFor(p)).map((p) => p.id).join(",") || "none"})`;
    console.warn(`[SIM] ALL PROVIDERS FAILED — falling back to scripted. Reasons: ["${reason}"]`);
    if (process.env.AI_FIXTURE_FALLBACK === "true") {
      log(null, opts.workload, "no provider, falling back to fixture");
      const turn = fixtureReply(opts.workload);
      void logAiUsage({ workload: opts.workload, provider: "fixture", tokensIn: 0, tokensOut: 0, latencyMs: 0, status: "failover" });
      return { text: turn.patient, provider: "fixture" };
    }
    throw new AiUnavailableError(opts.workload);
  }

  // Cold-start bootstrap: restore the last known failures/latency from the DB
  // so a provider degraded before a serverless cold start isn't retried blind.
  // Fire-and-forget — never blocks the request.
  void warmProviderCircuit();

  let attempt = 0;
  const reasons: string[] = [];
  for (const provider of candidates) {
    attempt++;
    const startedAt = Date.now();
    try {
      // Timeout is enforced by AbortSignal.timeout inside callOpenAI's fetch,
      // so a slow provider aborts cleanly instead of racing a leaked timer.
      const { text, usage } = await callProvider(provider, messages, opts);
      const latencyMs = Date.now() - startedAt;
      if (opts.schema) {
        try {
          const parsed = opts.schema.parse(JSON.parse(extractJson(text)));
          log(provider.id, opts.workload, "ok");
          void recordProviderOutcome(provider.id, true, latencyMs);
          void logAiUsage({ workload: opts.workload, provider: provider.id, tokensIn: usage.tokensIn, tokensOut: usage.tokensOut, latencyMs, status: "ok" });
          return { text, provider: provider.id, json: parsed };
        } catch {
          // JSON parse/validation failed — try one repair retry, else fail over.
          if (attempt === 1) {
            const repair = await callProvider(provider, [
              ...messages,
              { role: "user", content: `Return valid JSON matching the schema. Your previous output was not valid JSON. Output ONLY the JSON object.` },
            ], { ...opts, schema: undefined });
            const parsed = opts.schema.parse(JSON.parse(extractJson(repair.text)));
            void recordProviderOutcome(provider.id, true, latencyMs);
            void logAiUsage({ workload: opts.workload, provider: provider.id, tokensIn: repair.usage.tokensIn, tokensOut: repair.usage.tokensOut, latencyMs, status: "ok" });
            return { text: repair.text, provider: provider.id, json: parsed };
          }
          const schemaErr = new Error(`schema validation failed on provider ${provider.id}`);
          // A provider returning valid HTTP but garbage content isn't "down" —
          // mark it so the catch doesn't open the circuit for it.
          (schemaErr as Error & { misbehavior?: boolean }).misbehavior = true;
          throw schemaErr;
        }
      }
      log(provider.id, opts.workload, "ok");
      void recordProviderOutcome(provider.id, true, latencyMs);
      void logAiUsage({ workload: opts.workload, provider: provider.id, tokensIn: usage.tokensIn, tokensOut: usage.tokensOut, latencyMs, status: "ok" });
      return { text, provider: provider.id };
    } catch (e) {
      const latencyMs = Date.now() - startedAt;
      const status = (e as unknown as { status?: number }).status;
      const model = (e as unknown as { model?: string }).model ?? "?";
      const retryable = status !== undefined ? RETRYABLE.has(status) : true;
      // Schema-parse misbehavior (valid HTTP, bad content) and non-retryable
      // client errors (4xx) are NOT provider outages — don't open the circuit
      // for them. Only transport failures (429/5xx/timeout) trip the breaker.
      const misbehavior = Boolean((e as { misbehavior?: boolean }).misbehavior);
      const openCircuit = retryable && !misbehavior;
      const reason = `${provider.id} ${model} status=${status ?? "?"} latency=${latencyMs}ms: ${(e as Error).message.slice(0, 500)}`;
      reasons.push(reason);
      // Loud per-provider failure line (Phase 1 observability).
      console.warn(`[ai] ${opts.workload} -> ${provider.id} ${model} FAILED status=${status ?? "?"} latency=${latencyMs}ms retryable=${retryable} ${(e as Error).message.slice(0, 500)}`);
      if (openCircuit) void recordProviderOutcome(provider.id, false, latencyMs);
      void logAiUsage({ workload: opts.workload, provider: provider.id, tokensIn: 0, tokensOut: 0, latencyMs, status: openCircuit ? "failover" : "error" });
      if (!retryable && attempt >= candidates.length) throw e;
      if (retryable) {
        // exponential backoff, but capped so we never block long
        await new Promise((r) => setTimeout(r, Math.min(200 * 2 ** attempt, 2000)));
      }
    }
  }
  console.warn(`[SIM] ALL PROVIDERS FAILED — falling back to scripted. Reasons: ${JSON.stringify(reasons)}`);
  throw new AiUnavailableError(opts.workload);
}

/** Convenience: fetch the list of currently-available providers (for admin UI). */
export function providerStatus(): Array<{ id: string; configured: boolean; available: boolean }> {
  return availableProviders().map((p) => ({
    id: p.id,
    configured: !!keyFor(p),
    available: true,
  }));
}
