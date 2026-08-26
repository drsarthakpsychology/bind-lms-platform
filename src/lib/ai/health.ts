/**
 * Provider health — circuit-breaker for the AI router (§24).
 *
 * Two sides:
 *   1. isProviderHealthy() — pure, in-memory circuit check consulted by
 *      providersFor. A provider with >= FAILURE_THRESHOLD consecutive failures
 *      is treated as unavailable (circuit open) so the router routes around it.
 *   2. recordProviderOutcome() — called from aiChat after each outcome. Updates
 *      the in-memory circuit immediately, and persists to provider_health for
 *      /admin/infra via a lazy server import (fire-and-forget, never blocks).
 *
 * Circuit reset: a success zeroes consecutive_failures; a provider failing
 * longer than RECOVERY_WINDOW_MS is probed (half-open) so recovery is automatic.
 *
 * This module is PURE (no top-level server dependency) so the router can import
 * it without dragging in Supabase — the DB write is a lazy dynamic import.
 */

/** Consecutive failures before the circuit opens. */
export const FAILURE_THRESHOLD = 3;
/** After this long failing, allow a retry (half-open → full recovery on success). */
export const RECOVERY_WINDOW_MS = 60_000;
/** A rolling EMA above this opens the circuit for latency (a slow-but-200
 *  provider must not stall every request up to the 20s timeout). */
export const LATENCY_THRESHOLD_MS = 8_000;
/** Require this many samples before the latency signal counts (warmup). */
export const LATENCY_WARMUP_SAMPLES = 5;

/** In-memory circuit state. */
const circuit = new Map<
  string,
  { failures: number; lastFailureAt: number; latencyEma: number; latencySamples: number }
>();

/** Whether a provider is currently healthy enough to serve a request. */
export function isProviderHealthy(providerId: string): boolean {
  const s = circuit.get(providerId);
  if (!s) return true; // unknown → assume healthy (first-use)
  if (s.failures >= FAILURE_THRESHOLD) {
    // Circuit open — allow a probe after the recovery window (half-open).
    return Date.now() - s.lastFailureAt > RECOVERY_WINDOW_MS;
  }
  // Latency trip: a provider that consistently returns 200-but-slow is
  // treated as degraded once enough samples have built up.
  if (s.latencySamples >= LATENCY_WARMUP_SAMPLES && s.latencyEma > LATENCY_THRESHOLD_MS) {
    return false;
  }
  return true;
}

/** Reset a provider's circuit state (call after a success). */
export function resetProviderHealth(providerId: string): void {
  circuit.delete(providerId);
}

/**
 * Seed the in-memory circuit from provider_health (serverless cold starts get
 * an empty Map; this restores the last known failures + latency so a provider
 * that was degraded before the cold start doesn't get a free retry). Called
 * fire-and-forget from aiChat before the routing loop; never blocks the request.
 */
export async function warmProviderCircuit(): Promise<void> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/server");
    const admin = createAdminClient();
    const { data } = await admin
      .from("provider_health")
      .select("provider, consecutive_failures, avg_latency_ms, latency_samples");
    for (const row of data ?? []) {
      const providerId = String(row.provider);
      if (circuit.has(providerId)) continue; // a live sample already exists
      const failures = Number(row.consecutive_failures ?? 0);
      const latencySamples = Number(row.latency_samples ?? 0);
      circuit.set(providerId, {
        failures,
        lastFailureAt: failures > 0 ? Date.now() : 0,
        latencyEma: Number(row.avg_latency_ms ?? 0),
        latencySamples,
      });
    }
  } catch {
    // Best-effort bootstrap; the in-memory circuit still works on its own.
  }
}

/**
 * Write one row to ai_usage_log (the /admin/infra "AI usage (7 days)" panel).
 * Fire-and-forget, lazy server import, never throws — mirroring
 * recordProviderOutcome. user_id is intentionally left null here: aiChat has
 * no session context, and per-workload aggregation (which lane used how many
 * tokens from which provider) is what the panel needs; per-student attribution
 * is already recorded where the route has the session (sim turns, debriefs).
 */
export async function logAiUsage(p: {
  workload: string;
  provider: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  status: "ok" | "failover" | "error";
}): Promise<void> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/server");
    const admin = createAdminClient();
    await admin.from("ai_usage_log").insert({
      workload: p.workload,
      provider: p.provider,
      tokens_in: p.tokensIn,
      tokens_out: p.tokensOut,
      latency_ms: p.latencyMs,
      status: p.status,
    });
  } catch {
    // Usage persistence is best-effort; never fail the AI request over it.
  }
}

/** Record a provider outcome (in-memory always; DB write fire-and-forget). */
export async function recordProviderOutcome(
  providerId: string,
  ok: boolean,
  latencyMs?: number,
): Promise<void> {
  if (ok) {
    // A success resets failures but keeps the latency EMA — a consistently slow
    // provider still trips the latency signal even though it never errors.
    const s = circuit.get(providerId) ?? { failures: 0, lastFailureAt: 0, latencyEma: 0, latencySamples: 0 };
    s.failures = 0;
    s.lastFailureAt = 0;
    if (latencyMs != null) {
      s.latencyEma = s.latencySamples === 0 ? latencyMs : s.latencyEma * 0.7 + latencyMs * 0.3;
      s.latencySamples += 1;
    }
    circuit.set(providerId, s);
  } else {
    const s = circuit.get(providerId) ?? { failures: 0, lastFailureAt: 0, latencyEma: 0, latencySamples: 0 };
    s.failures += 1;
    s.lastFailureAt = Date.now();
    circuit.set(providerId, s);
  }

  // Persist for /admin/infra — lazy server import, fire-and-forget, never throw.
  try {
    const { createAdminClient } = await import("@/lib/supabase/server");
    const admin = createAdminClient();
    const s = circuit.get(providerId);
    if (ok) {
      await admin.from("provider_health").upsert(
        {
          provider: providerId,
          consecutive_failures: 0,
          last_success_at: new Date().toISOString(),
          last_failure_at: null,
          avg_latency_ms: s?.latencySamples ? Math.round(s.latencyEma) : null,
          latency_samples: s?.latencySamples ?? 0,
        },
        { onConflict: "provider" },
      );
      return;
    }
    const { data } = await admin
      .from("provider_health")
      .select("consecutive_failures, last_success_at")
      .eq("provider", providerId)
      .maybeSingle();
    const prior = Number((data as { consecutive_failures?: number } | null)?.consecutive_failures ?? 0);
    const priorSuccess = (data as { last_success_at?: string | null } | null)?.last_success_at ?? null;
    await admin.from("provider_health").upsert(
      {
        provider: providerId,
        consecutive_failures: prior + 1,
        last_failure_at: new Date().toISOString(),
        last_success_at: priorSuccess,
        avg_latency_ms: s?.latencySamples ? Math.round(s.latencyEma) : null,
        latency_samples: s?.latencySamples ?? 0,
      },
      { onConflict: "provider" },
    );
  } catch {
    // Health persistence is best-effort; never fail the AI request over it.
  }
}
