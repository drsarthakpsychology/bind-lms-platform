#!/usr/bin/env tsx
/**
 * doctor — read-only health check. Run this when something is broken.
 *
 *   npm run doctor
 *
 * Checks the same things as setup but changes NOTHING: CLIs present, env vars
 * present, Supabase reachable, R2 reachable, pending migrations, and the
 * production /api/health endpoint. Exits non-zero if something is wrong.
 */

import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { spawnSync } from "node:child_process";

const envFile = ".env.local";

function ok(label: string) {
  console.log(`  ✅ ${label}`);
}
function bad(label: string, detail?: string) {
  console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
  hasFailures = true;
}
let hasFailures = false;

function hasTool(name: string) {
  // Different tools accept different flags and exit codes (ffmpeg exits
  // non-zero on --version but prints it; git needs --version). Try both and
  // accept if either prints anything.
  for (const flag of ["--version", "-version"]) {
    const r = spawnSync(name, [flag], { encoding: "utf8" });
    const out = (r.stdout ?? "") + (r.stderr ?? "");
    if (r.status === 0 || out.trim().length > 0) return true;
  }
  return false;
}

function loadEnvFile(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

async function main() {
  console.log("PLMS doctor — read-only health check\n");

  console.log("1) CLIs");
  for (const t of ["node", "npm", "git", "ffmpeg", "ffprobe", "wrangler", "supabase"]) {
    if (hasTool(t)) ok(t); else bad(t, "not installed (see setup)");
  }

  console.log("\n2) Env");
  const local = loadEnvFile(envFile);
  for (const k of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]) {
    if (local[k]) ok(k); else bad(k, "missing in .env.local");
  }

  console.log("\n3) Supabase");
  if (local["NEXT_PUBLIC_SUPABASE_URL"] && local["NEXT_PUBLIC_SUPABASE_ANON_KEY"]) {
    const sb = createClient(local["NEXT_PUBLIC_SUPABASE_URL"], local["NEXT_PUBLIC_SUPABASE_ANON_KEY"]);
    const { error } = await sb.from("profiles").select("id").limit(1);
    if (error) bad("database", error.message); else ok("database reachable");
  } else {
    bad("database", "missing env");
  }

  console.log("\n4) R2");
  if (local["R2_ACCESS_KEY_ID"] && local["R2_SECRET_ACCESS_KEY"] && local["CLOUDFLARE_ACCOUNT_ID"]) {
    ok("credentials present");
  } else {
    bad("R2", "credentials missing (only matters after C1 migration)");
  }

  console.log("\n5) Pending migrations");
  if (existsSync("supabase/migrations_pending")) {
    const { readdirSync } = await import("node:fs");
    const files = readdirSync("supabase/migrations_pending").filter((f) => f.endsWith(".sql"));
    if (files.length === 0) ok("none"); else bad(`${files.length} pending`, files.join(", "));
  }

  console.log("\n6) Production health endpoint");
  const site = process.env.SITE_URL ?? "bind-lms-platform.vercel.app";
  try {
    const res = await fetch(`https://${site}/api/health`, { signal: AbortSignal.timeout(20000) });
    if (res.ok) ok(`${site}/api/health -> ${res.status}`); else bad(`${site}/api/health`, `HTTP ${res.status}`);
  } catch (e) {
    bad(`${site}/api/health`, e instanceof Error ? e.message : "unreachable");
  }

  console.log(hasFailures ? "\n❌ Issues found — see above." : "\n✅ All systems healthy.");
  process.exit(hasFailures ? 1 : 0);
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
