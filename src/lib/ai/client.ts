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
): Promise<{ text: string; raw: string }> {
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
  });
  if (res.status === 429 || res.status >= 500) {
    const e = new Error(`provider ${provider.id} responded ${res.status}`);
    (e as unknown as { status: number }).status = res.status;
    throw e;
  }
  if (!res.ok) {
    throw new Error(`provider ${provider.id} responded ${res.status}`);
  }
  const j = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const text = j.choices?.[0]?.message?.content ?? "";
  return { text, raw: text };
}

async function callGemini(
  provider: Provider,
  messages: AiChatMessage[],
  opts: AiRequestOptions,
): Promise<{ text: string; raw: string }> {
  // Gemini native endpoint (non-OpenAI-compatible). Fall back to the
  // OpenAI-compatible wrapper which Gemini now exposes at the same baseUrl.
  return callOpenAI(provider, messages, opts);
}

async function callProvider(
  provider: Provider,
  messages: AiChatMessage[],
  opts: AiRequestOptions,
): Promise<{ text: string; raw: string }> {
  assertProviderAllowed(opts.workload, provider);
  if (provider.protocol === "gemini") return callGemini(provider, messages, opts);
  return callOpenAI(provider, messages, opts);
}

const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const TIMEOUT_MS = 20_000;

/** One call with provider failover. Never throws for a student-visible failure
 *  when another provider can serve the request. */
export async function aiChat(messages: AiChatMessage[], opts: AiRequestOptions): Promise<AiResponse> {
  if (!isEnabled()) {
    // Fixture path — deterministic, network-free.
    const turn = fixtureReply(opts.workload);
    return { text: turn.patient, provider: "fixture" };
  }
  const capability: ProviderCapability = opts.schema ? "json" : "stream";
  const candidates = providersFor(capability, opts.workload === "content_generation" || opts.workload === "corpus_processing" || opts.workload === "embeddings" ? false : true);
  if (!candidates.length) {
    if (process.env.AI_FIXTURE_FALLBACK === "true") {
      log(null, opts.workload, "no provider, falling back to fixture");
      const turn = fixtureReply(opts.workload);
      return { text: turn.patient, provider: "fixture" };
    }
    throw new AiUnavailableError(opts.workload);
  }

  let attempt = 0;
  for (const provider of candidates) {
    attempt++;
    try {
      const timeout = new Promise<never>((_, rej) =>
        setTimeout(() => rej(new Error(`provider ${provider.id} timed out`)), TIMEOUT_MS),
      );
      const { text } = await Promise.race([
        callProvider(provider, messages, opts),
        timeout,
      ]);
      if (opts.schema) {
        try {
          const parsed = opts.schema.parse(JSON.parse(text));
          log(provider.id, opts.workload, "ok");
          return { text, provider: provider.id, json: parsed };
        } catch {
          // JSON parse/validation failed — try one repair retry, else fail over.
          if (attempt === 1) {
            const repair = await callProvider(provider, [
              ...messages,
              { role: "user", content: `Return valid JSON matching the schema. Your previous output was not valid JSON. Output ONLY the JSON object.` },
            ], { ...opts, schema: undefined });
            const parsed = opts.schema.parse(JSON.parse(repair.text));
            return { text: repair.text, provider: provider.id, json: parsed };
          }
          throw new Error(`schema validation failed on provider ${provider.id}`);
        }
      }
      log(provider.id, opts.workload, "ok");
      return { text, provider: provider.id };
    } catch (e) {
      const status = (e as unknown as { status?: number }).status;
      const retryable = status !== undefined ? RETRYABLE.has(status) : true;
      log(provider.id, opts.workload, `failed: ${(e as Error).message} (retryable=${retryable})`);
      if (!retryable && attempt >= candidates.length) throw e;
      if (retryable) {
        // exponential backoff, but capped so we never block long
        await new Promise((r) => setTimeout(r, Math.min(200 * 2 ** attempt, 2000)));
      }
    }
  }
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
