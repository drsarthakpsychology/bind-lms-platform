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

/** In-memory circuit state. */
const circuit = new Map<string, { failures: number; lastFailureAt: number }>();

/** Whether a provider is currently healthy enough to serve a request. */
export function isProviderHealthy(providerId: string): boolean {
  const s = circuit.get(providerId);
  if (!s) return true; // unknown → assume healthy (first-use)
  if (s.failures < FAILURE_THRESHOLD) return true;
  // Circuit open — allow a probe after the recovery window (half-open).
  return Date.now() - s.lastFailureAt > RECOVERY_WINDOW_MS;
}

/** Reset a provider's circuit state (call after a success). */
export function resetProviderHealth(providerId: string): void {
  circuit.delete(providerId);
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
export async function recordProviderOutcome(providerId: string, ok: boolean): Promise<void> {
  if (ok) {
    resetProviderHealth(providerId);
  } else {
    const s = circuit.get(providerId) ?? { failures: 0, lastFailureAt: 0 };
    s.failures += 1;
    s.lastFailureAt = Date.now();
    circuit.set(providerId, s);
  }

  // Persist for /admin/infra — lazy server import, fire-and-forget, never throw.
  try {
    const { createAdminClient } = await import("@/lib/supabase/server");
    const admin = createAdminClient();
    if (ok) {
      await admin.from("provider_health").upsert(
        { provider: providerId, consecutive_failures: 0, last_success_at: new Date().toISOString(), last_failure_at: null },
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
      },
      { onConflict: "provider" },
    );
  } catch {
    // Health persistence is best-effort; never fail the AI request over it.
  }
}
