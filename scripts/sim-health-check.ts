#!/usr/bin/env tsx
/**
 * Headless provider-health check for /api/sim/health (AI-actor brief Phase 2).
 *
 *   npm run sim:health-check
 *
 * Loads `.env.local` into process.env, probes EVERY configured provider with
 * the same deterministic ping the API route uses, and prints the repair-chain
 * classification (provider / model / status / latency / suggestion / circuit).
 * No auth, no HTTP server, no secrets printed — only status + latency.
 *
 * This is the offline twin of `GET /api/sim/health` (admin-only in the app);
 * the same `probeProvider`/`classify` code drives both.
 */
import { readFileSync } from "node:fs";
import { PROVIDERS, getKey, isEnabled, providersFor } from "../src/lib/ai/router";
import { probeProvider } from "../src/lib/ai/diagnostics";

// Load .env.local into process.env (existing env wins).
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
  }
} catch {
  /* no .env.local — only real env vars are probed */
}

async function main() {
  const configured = PROVIDERS.filter((p) => getKey(p));
  const simCandidates = providersFor("json", true).map((p) => p.id);

  console.log(`aiEnabled=${isEnabled()}  simLane(json,studentData) candidates=[${simCandidates.join(", ") || "NONE"}]  servable=${simCandidates.length > 0}`);
  console.log(`configured providers: ${configured.length}${configured.length ? "" : "  (no *_API_KEY set — the sim runs on fixtures)"}`);
  console.log();

  const rows = await Promise.all(configured.map((p) => probeProvider(p)));
  for (const r of rows) {
    const status = r.status === null ? "timeout/net" : String(r.status);
    console.log(
      `${r.providerId.padEnd(12)} ${r.model.padEnd(28)} ${r.ok ? "OK " : "FAIL"} status=${status.padEnd(7)} ${String(r.latencyMs).padStart(5)}ms  circuit=${r.circuit}  → ${r.suggestion}`,
    );
  }

  console.log();
  if (rows.length && !rows.some((r) => r.ok)) {
    console.log("NO provider answered a probe — the sim would fall back to scripted.");
    process.exit(1);
  }
}

void main();
