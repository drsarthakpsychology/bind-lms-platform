#!/usr/bin/env tsx
/**
 * verify-r2 — prove R2 credentials are valid and can read the video bucket.
 *
 *   npm run verify-r2
 *
 * Use this BEFORE and AFTER rotating the R2 signing key:
 *  1. Run it with the old credentials → confirm it succeeds (baseline).
 *  2. Create the new token in the Cloudflare dashboard (R2 → Manage R2 API
 *     Tokens → Create token → Object Read/Write on the video bucket).
 *  3. Replace R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY in .env.local (and
 *     Vercel), then run this again → the new credentials work.
 *
 * Secret values are never printed.
 */
import { existsSync, readFileSync } from "node:fs";
import { S3Client, ListObjectsV2Command, HeadObjectCommand } from "@aws-sdk/client-s3";

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
  console.error("Missing R2 env vars: CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME.");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

async function main() {
  // 1. List objects (proves read access).
  const list = await client.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 5 }));
  const count = list.KeyCount ?? 0;
  console.log(`✅ R2 read OK — bucket "${bucket}" has ${count} objects in the first page.`);
  if (list.Contents?.length) {
    console.log("   sample object:", list.Contents[0].Key);
  }

  // 2. HEAD the first object if any (proves per-object read).
  const first = list.Contents?.[0];
  if (first?.Key) {
    const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: first.Key }));
    console.log(`✅ HEAD OK: "${first.Key}" (${(head.ContentLength ?? 0) / 1e6} MB)`);
  }

  console.log("\nR2 credentials are valid and can read the video bucket.");
  console.log("If you just rotated the key, the new token is working.");
}

main().catch((e) => {
  console.error("❌ R2 check FAILED:", e.message);
  console.error("   If you just rotated the key, confirm the new token has");
  console.error("   read access to the bucket and .env.local / Vercel are updated.");
  process.exit(1);
});