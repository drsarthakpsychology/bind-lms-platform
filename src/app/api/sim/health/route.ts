import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { PROVIDERS, getKey, isEnabled, providersFor } from "@/lib/ai/router";
import { probeProvider, type ProbeResult } from "@/lib/ai/diagnostics";

export const runtime = "nodejs";

/**
 * GET /api/sim/health
 *
 * Diagnostic for the AI-actor brief Phase 2. One deterministic probe call per
 * configured provider, each classified against the repair chain
 * (401/402/403/404/429/timeout/5xx) with a human-readable fix, PLUS the
 * router's live view of what would actually serve a `sim_patient_turn` right now.
 *
 * - Admin-only (a student must never learn which AI providers are configured).
 * - Never returns a key, secret, or response body — only status + latency.
 * - Does NOT mutate the circuit-breaker (probes are read-only for the router).
 * - HTTP 200 = the sim patient can be served right now; 503 = it can't (the
 *   body carries the full breakdown either way — curl-able for a green/red).
 *
 * The probe/classify logic lives in src/lib/ai/diagnostics.ts so the same
 * chain runs headlessly via `tsx scripts/sim-health-check.ts`.
 */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const configured = PROVIDERS.filter((p) => getKey(p));
  const probes: ProbeResult[] = await Promise.all(
    configured.map((p) => probeProvider(p)),
  );

  // The router's live view: which providers would actually serve a student
  // turn right now (json capability, student data → no-train only, circuit
  // filtered). This is the "is the patient real?" answer.
  const simCandidates = providersFor("json", true).map((p) => p.id);
  const simServable = simCandidates.length > 0;

  return NextResponse.json(
    {
      at: new Date().toISOString(),
      aiEnabled: isEnabled(),
      simLane: {
        capability: "json",
        studentData: true,
        candidates: simCandidates,
        servable: simServable,
      },
      configuredCount: configured.length,
      probes,
    },
    { status: simServable ? 200 : 503 },
  );
}
