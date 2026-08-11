#!/usr/bin/env tsx
/**
 * Pre-generate scripted patient fallbacks (v5 §6) — every scripted move
 * rendering in the 24-move library is synthesised ONCE at case-approval
 * time and cached in R2 keyed on sha256(text+voice+emotion+speed), so the
 * never-silent fallback is instant at run time (no provider call then).
 *
 *   npm run pregen-voice [-- --dry-run]
 *
 * - dry-run prints what WOULD be synthesised (no provider calls, no R2).
 * - With AI_ENABLED=true + NVIDIA_API_KEY: synthesises via CosyVoice 2.
 * - With R2 creds: uploads to the voice/ prefix.
 * - Without a key: honest no-op with instructions (the browser still works).
 *
 * Env: NVIDIA_API_KEY, CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID,
 * R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME (from .env.local).
 */
import { readFileSync, existsSync } from "node:fs";
import { MOVES } from "../src/lib/sim/moves";
import { synthesisCacheKey } from "../src/lib/voice/synthesis-keys";

const DRY_RUN = process.argv.includes("--dry-run");

function loadEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  if (existsSync(".env.local")) {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m) out[m[1]] = m[2].trim();
    }
  }
  return { ...process.env, ...out } as Record<string, string>;
}

async function main() {
  const env = loadEnv();
  const voice = env.R2_BUCKET_NAME ? `patient-fallback` : "patient-fallback";

  const lines = MOVES.flatMap((m) => m.fallbackLines);
  console.log(`Pre-generating ${lines.length} scripted fallback line(s) in ${voice}.`);

  if (DRY_RUN) {
    for (const l of lines.slice(0, 5)) {
      console.log(`  would synth [${synthesisCacheKey({ text: l, voice, speed: 0.9 }).slice(0, 12)}…] "${l.slice(0, 50)}…"`);
    }
    console.log(`  …and ${lines.length - 5} more. Nothing was called.`);
    return;
  }

  if (env.AI_ENABLED !== "true" || !env.NVIDIA_API_KEY) {
    console.log("No NVIDIA_API_KEY / AI_ENABLED=true — no synthesis. The browser TTS path works regardless; run this once a key exists.");
    return;
  }
  if (!env.R2_ACCESS_KEY_ID || !env.R2_BUCKET_NAME) {
    console.log("R2 creds missing — synthesis would have nothing to land on. Config R2 first.");
    return;
  }

  // Lazy import the synthesizer (server-only module).
  const { synthesize } = await import("../src/lib/voice/synthesize");
  let done = 0;
  for (const l of lines) {
    const r = await synthesize({ text: l, voice, emotionTag: "neutral", speed: 0.9 });
    if (r.provider !== "fixture") {
      console.log(`  ✓ [${r.provider}] ${l.slice(0, 60)}…`);
      done++;
    }
  }
  console.log(`\nSynthesised ${done}/${lines.length} fallback lines into R2 (voice/ keyed on sha256).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});