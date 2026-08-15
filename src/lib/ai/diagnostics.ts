/**
 * Provider diagnostics for /api/sim/health (AI-actor brief Phase 2).
 *
 * Pure module (no Next, no server-only) so the same probe/classify logic runs
 * in the API route AND headlessly via `tsx scripts/sim-health-check.ts` — the
 * repair chain (401/402/403/404/429/timeout/5xx) is verified without needing an
 * authed HTTP call.
 *
 * Read-only for the router: probes never mutate the circuit-breaker.
 */

import type { Provider } from "./router";
import { isProviderHealthy } from "./health";

export interface ProbeResult {
  providerId: string;
  model: string;
  ok: boolean;
  /** HTTP status; null on network/timeout (no HTTP response). */
  status: number | null;
  latencyMs: number;
  error?: string;
  suggestion: string;
  /** circuit-breaker view (read-only — probes never mutate it). */
  circuit: "closed" | "OPEN";
}

const DEFAULT_TIMEOUT_MS = 15_000;

/** One deterministic, non-student ping per provider. */
export async function probeProvider(
  provider: Provider,
  opts?: { timeoutMs?: number },
): Promise<ProbeResult> {
  const timeoutMs = opts?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const startedAt = Date.now();
  const model = provider.models.fast;
  try {
    const res = await fetch(`${provider.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env[provider.apiKeyEnv]}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "Reply with the single word: ok" }],
        max_tokens: 8,
        temperature: 0,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
    const latencyMs = Date.now() - startedAt;
    // Drain the body so the socket closes cleanly (connection reuse).
    await res.text().catch(() => "");
    return classify(provider, res.status, latencyMs, model);
  } catch (e) {
    const latencyMs = Date.now() - startedAt;
    const name = (e as { name?: string }).name;
    const isTimeout = name === "TimeoutError" || name === "AbortError";
    const status = isTimeout ? null : (e as { cause?: { status?: number } }).cause?.status ?? null;
    return {
      providerId: provider.id,
      model,
      ok: false,
      status,
      latencyMs,
      error: isTimeout ? `timed out after ${timeoutMs}ms` : (e as Error).message.slice(0, 300),
      suggestion: isTimeout
        ? "Request timed out — check network egress / proxy for the provider's baseUrl"
        : "Network-level failure (DNS/TLS/connection refused)",
      circuit: isProviderHealthy(provider.id) ? "closed" : "OPEN",
    };
  }
}

/** Classify a probe's HTTP status against the repair chain. */
export function classify(
  provider: Provider,
  status: number,
  latencyMs: number,
  model: string,
): ProbeResult {
  const env = provider.apiKeyEnv;
  const base = {
    providerId: provider.id,
    model,
    latencyMs,
    circuit: isProviderHealthy(provider.id) ? ("closed" as const) : ("OPEN" as const),
  };
  if (status === 200) {
    return { ...base, ok: true, status, suggestion: "ok" };
  }
  if (status === 401) {
    return { ...base, ok: false, status, suggestion: `Invalid API key — check ${env}` };
  }
  if (status === 403) {
    return { ...base, ok: false, status, suggestion: `Forbidden — key denied, or the plan blocks model ${model}` };
  }
  if (status === 404) {
    return { ...base, ok: false, status, suggestion: `Endpoint or model not found — ${model} may be retired; update router.ts` };
  }
  if (status === 402) {
    return { ...base, ok: false, status, suggestion: `Payment required — add billing on the provider account (${provider.id} now needs a card; the router treats it as failing over)` };
  }
  if (status === 429) {
    return { ...base, ok: false, status, suggestion: "Rate-limited (quota/RPM) — the router should be failing over; verify a second provider is healthy" };
  }
  if (status >= 500) {
    return { ...base, ok: false, status, suggestion: "Provider-side outage — the router retries then fails over; nothing to fix here" };
  }
  return { ...base, ok: false, status, suggestion: `Unexpected status ${status} — check the provider's docs` };
}
