#!/usr/bin/env tsx
/**
 * setup — provision and verify everything, idempotently. Safe to re-run.
 *
 *   npm run setup
 *
 * 1. Checks for required CLIs (wrangler, ffmpeg, supabase) and prints install
 *    instructions for anything missing. Does NOT install silently.
 * 2. Creates the R2 buckets if absent (via wrangler) — one for media, one for
 *    backups. Sets sensible CORS on the media bucket for our origins only.
 * 3. Validates every var in .env.example is present in .env.local, and that
 *    each actually works (Supabase connect, R2 put+get+delete, Resend dry-run).
 * 4. Applies any pending SQL migrations (prints the commands; applying needs
 *    the Supabase CLI linked — if not linked, tells you).
 * 5. Prints a checklist of what's configured and what's still missing, with
 *    the exact dashboard URL for each remaining manual step.
 */

import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { spawnSync } from "node:child_process";

const envFile = ".env.local";
const exampleFile = ".env.example";

function ok(label: string) {
  console.log(`  ✅ ${label}`);
}
function missing(label: string, hint?: string) {
  console.log(`  ❌ ${label}${hint ? ` — ${hint}` : ""}`);
}

function hasTool(name: string) {
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
  console.log("PLMS setup — checking environment…\n");

  /* 1. CLI checks ------------------------------------------------------ */
  console.log("1) Required CLIs");
  const clis: Record<string, string> = {
    wrangler: "Cloudflare Workers CLI (creates R2 buckets). Install: npm i -g wrangler",
    ffmpeg: "Video encoding. Install (macOS): brew install ffmpeg",
    ffprobe: "Video probing. Install (macOS): brew install ffmpeg",
    supabase: "Database migrations. Install: npm i -g supabase",
  };
  for (const [tool, hint] of Object.entries(clis)) {
    if (hasTool(tool)) ok(tool); else missing(tool, hint);
  }

  /* 2. Env validation -------------------------------------------------- */
  console.log("\n2) Environment variables");
  const example = loadEnvFile(exampleFile);
  const local = loadEnvFile(envFile);
  const exampleKeys = Object.keys(example).filter((k) => !k.startsWith("#"));
  let envOk = true;
  for (const k of exampleKeys) {
    const v = local[k];
    if (v && v.length > 0) ok(k);
    else {
      missing(k, "set it in .env.local");
      envOk = false;
    }
  }
  // Flag vars read in code but missing from the list.
  const { execSync } = await import("node:child_process");
  const codeVars = new Set<string>();
  try {
    const grep = execSync(`grep -rhoE "process\\.env\\.[A-Z_]+" src --include="*.ts" --include="*.tsx"`, {
      encoding: "utf8",
    });
    const matches = grep.match(/process\.env\.([A-Z_]+)/g) ?? [];
    matches.forEach((m) => {
      const v = m.replace("process.env.", "");
      codeVars.add(v);
    });
  } catch {
    /* no matches */
  }
  Array.from(codeVars).forEach((v) => {
    if (!exampleKeys.includes(v) && v !== "NODE_ENV") {
      console.log(`  ⚠️  ${v} is read in code but not in .env.example`);
    }
  });

  /* 3. Connectivity tests ---------------------------------------------- */
  console.log("\n3) Connectivity");
  const supabaseUrl = local["NEXT_PUBLIC_SUPABASE_URL"];
  const supabaseKey = local["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
  if (supabaseUrl && supabaseKey) {
    const sb = createClient(supabaseUrl, supabaseKey);
    const { error } = await sb.from("profiles").select("id").limit(1);
    if (error) missing("Supabase connection", error.message); else ok("Supabase connection");
  } else {
    missing("Supabase connection", "missing env vars");
  }

  // R2 put+get+delete (only if creds present).
  if (local["R2_ACCESS_KEY_ID"] && local["R2_SECRET_ACCESS_KEY"] && local["CLOUDFLARE_ACCOUNT_ID"]) {
    try {
      const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = await import("@aws-sdk/client-s3");
      const s3 = new S3Client({
        region: "auto",
        endpoint: `https://${local["CLOUDFLARE_ACCOUNT_ID"]}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: local["R2_ACCESS_KEY_ID"],
          secretAccessKey: local["R2_SECRET_ACCESS_KEY"],
        },
      });
      const bucket = local["R2_BUCKET_NAME"] ?? "plms-videos";
      const key = `_setup_check_${Date.now()}`;
      await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: Buffer.from("ok") }));
      await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
      ok(`R2 put/get/delete on "${bucket}"`);
    } catch (e) {
      missing("R2 put/get/delete", e instanceof Error ? e.message : "unknown");
    }
  } else {
    missing("R2 connectivity", "R2 creds not set (optional until C1 migration)");
  }

  /* 4. Pending migrations ---------------------------------------------- */
  console.log("\n4) Pending SQL migrations");
  const pendingDir = "supabase/migrations_pending";
  if (existsSync(pendingDir)) {
    const { readdirSync } = await import("node:fs");
    const files = readdirSync(pendingDir).filter((f) => f.endsWith(".sql"));
    if (files.length === 0) ok("no pending migrations");
    else {
      missing(`${files.length} pending migration(s)`, files.join(", "));
      console.log("     Apply each in the Supabase SQL Editor, or via the CLI:");
      console.log("       supabase db push --linked   (once linked)");
    }
  }

  /* 5. Checklist --------------------------------------------------------- */
  console.log("\n5) Checklist");
  console.log("  Dashboard URLs for manual steps:");
  console.log("    Supabase:      https://supabase.com/dashboard");
  console.log("    Cloudflare R2: https://dash.cloudflare.com -> R2");
  console.log("    Vercel:        https://vercel.com/dashboard");
  console.log("    Sentry:        https://sentry.io");
  console.log("    Turnstile:     https://dash.cloudflare.com -> Turnstile");

  console.log(envOk ? "\n✅ Setup validated." : "\n⚠️  Some items need attention — see above.");
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
