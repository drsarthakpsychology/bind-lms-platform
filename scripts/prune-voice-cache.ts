#!/usr/bin/env tsx
/**
 * prune-voice-cache — list and (optionally) delete stale voice-synthesis
 * cache objects in R2 (the `voice/` prefix, keyed on sha256 by
 * src/lib/voice/synthesize.ts).
 *
 *   npm run prune-voice-cache               # DRY RUN — list stale objects only
 *   npm run prune-voice-cache -- --days 60  # change the age threshold
 *   npm run prune-voice-cache -- --apply    # actually delete stale objects
 *
 * Safe by default: without `--apply` this ONLY lists what WOULD be deleted.
 * It never runs automatically — execute it only when an operator has decided
 * the stale cache is safe to remove. Cost of a wrong deletion is bounded: a
 * re-synthesis is one provider call, and the browser-TTS fallback works with
 * zero keys.
 *
 * Env (all required, from .env.local): CLOUDFLARE_ACCOUNT_ID,
 * R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME.
 * Exits cleanly (code 0) with a hint when any of them are absent.
 */
import { existsSync, readFileSync } from "node:fs";
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");

function daysArg(): number {
  const i = args.indexOf("--days");
  if (i === -1) return 30;
  const raw = Number(args[i + 1]);
  if (!Number.isFinite(raw) || raw < 0) {
    console.error(`Invalid --days value: "${args[i + 1]}". Expected a non-negative number.`);
    process.exit(2);
  }
  return raw;
}

/** Load KEY=VALUE pairs from a .env-style file (no interpolation). */
function loadEnvFile(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

// Merge .env.local over process.env (env already set wins).
const fileEnv = loadEnvFile(".env.local");
const env = { ...fileEnv, ...process.env };
const accountId = env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = env.R2_ACCESS_KEY_ID;
const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
const bucket = env.R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
  console.log(
    "R2 env vars not set (CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME) — nothing to prune. Add them to .env.local (see .env.example) and rerun.",
  );
  process.exit(0);
}

const MAX_AGE_DAYS = daysArg();
const cutoff = new Date(Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

interface Stale {
  key: string;
  size: number;
  lastModified: Date;
}

async function main() {
  const prefix = "voice/";

  // List all objects under voice/ (paginated).
  const stale: Stale[] = [];
  let token: string | undefined;
  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: token,
      }),
    );
    for (const obj of res.Contents ?? []) {
      if (!obj.Key || !obj.LastModified) continue;
      if (obj.LastModified < cutoff) {
        stale.push({ key: obj.Key, size: obj.Size ?? 0, lastModified: obj.LastModified });
      }
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);

  const totalBytes = stale.reduce((n, s) => n + s.size, 0);

  if (stale.length === 0) {
    console.log(
      `No voice/ objects older than ${MAX_AGE_DAYS} day(s) in "${bucket}". Nothing to ${APPLY ? "delete" : "prune"}.`,
    );
    return;
  }

  console.log(
    `Found ${stale.length} voice/ object(s) older than ${MAX_AGE_DAYS} day(s) in "${bucket}" (${(totalBytes / 1e6).toFixed(2)} MB total).`,
  );
  for (const s of stale.sort((a, b) => a.lastModified.getTime() - b.lastModified.getTime())) {
    console.log(
      `  ${s.lastModified.toISOString().slice(0, 10)}  ${(s.size / 1e3).toFixed(1)} KB  ${s.key}`,
    );
  }

  if (!APPLY) {
    console.log(`\nDRY RUN — nothing deleted. Re-run with --apply to delete these ${stale.length} object(s).`);
    return;
  }

  console.log(`\nDeleting ${stale.length} object(s)…`);
  let deleted = 0;
  for (const s of stale) {
    try {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: s.key }));
      deleted++;
    } catch (e) {
      console.error(`  ✗ failed to delete ${s.key}:`, e instanceof Error ? e.message : e);
    }
  }
  console.log(`Deleted ${deleted}/${stale.length} object(s).`);
}

main().catch((e) => {
  console.error("prune-voice-cache FAILED:", e instanceof Error ? e.message : e);
  process.exit(1);
});
