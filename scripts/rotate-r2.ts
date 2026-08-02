#!/usr/bin/env tsx
/**
 * rotate-r2 — automate the R2 key rotation as far as Cloudflare allows.
 *
 *   npm run rotate-r2
 *
 * Honest boundary: Cloudflare does NOT allow an R2 S3 token to mint a new R2
 * token — S3 credentials can't create credentials. The ONE manual step is
 * creating the new token in the dashboard (R2 → Manage R2 API Tokens → Create
 * token, Object Read on the video bucket). Everything after that is automated:
 *
 *   1. Verify the CURRENT key works (baseline) — stops if it doesn't.
 *   2. Tell you exactly what to create and what to paste back.
 *   3. Accept the NEW key (paste, or set R2_NEW_ACCESS_KEY_ID / R2_NEW_SECRET).
 *   4. Verify the NEW key can read the bucket.
 *   5. Swap .env.local to the new key (backup of the old is written to
 *      .env.local.r2-rotate-backup — gitignored).
 *   6. Print the Vercel env vars to set (production secrets live in the
 *      dashboard, not the repo).
 *
 * Secrets are never printed.
 */
import { existsSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const rl = createInterface({ input: process.stdin, output: process.stdout });
function q(prompt: string): Promise<string> {
  return new Promise((resolve) => rl.question(prompt, resolve));
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

function makeClient(accessKeyId: string, secretAccessKey: string, accountId: string) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function verify(client: S3Client, bucket: string): Promise<boolean> {
  try {
    const r = await client.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 5 }));
    return r.KeyCount !== undefined;
  } catch {
    return false;
  }
}

async function main() {
  const env = { ...loadEnvFile(".env.local"), ...process.env };
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const bucket = env.R2_BUCKET_NAME;
  if (!accountId || !bucket) {
    console.error("Missing CLOUDFLARE_ACCOUNT_ID / R2_BUCKET_NAME in .env.local");
    process.exit(1);
  }

  console.log("=== R2 key rotation (automated) ===\n");

  // 1. Baseline: current key works?
  const oldKey = env.R2_ACCESS_KEY_ID;
  const oldSecret = env.R2_SECRET_ACCESS_KEY;
  if (!oldKey || !oldSecret) {
    console.error("Current R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY not found in .env.local");
    process.exit(1);
  }
  const oldOk = await verify(makeClient(oldKey, oldSecret, accountId), bucket);
  console.log(`[1] Current key → ${oldOk ? "WORKS (baseline OK)" : "FAILS — stopping (fix .env.local first)"}`);
  if (!oldOk) process.exit(1);

  // 2. Instruction.
  console.log(`
[2] Create the NEW token in the Cloudflare dashboard (the one manual step):
    https://dash.cloudflare.com → R2 → Manage R2 API Tokens → Create token
    Permissions: Object Read on bucket "${bucket}" (Object Write too if you
    publish lectures with this token).

[3] Provide the new token. Options:
    a) Paste the Access Key ID, press Enter.
    b) Or set R2_NEW_ACCESS_KEY_ID and R2_NEW_SECRET_ACCESS_KEY in the shell.
`);

  let newKey = process.env.R2_NEW_ACCESS_KEY_ID ?? "";
  let newSecret = process.env.R2_NEW_SECRET_ACCESS_KEY ?? "";
  if (!newKey) {
    const id = (await q("   New Access Key ID: ")).trim();
    const sec = (await q("   New Secret Access Key: ")).trim();
    newKey = id;
    newSecret = sec;
  }
  rl.close();

  if (!newKey || !newSecret) {
    console.error("No new key provided. Aborting — old key untouched.");
    process.exit(1);
  }

  // 4. Verify the new key.
  const newOk = await verify(makeClient(newKey, newSecret, accountId), bucket);
  console.log(`[4] New key → ${newOk ? "WORKS ✓" : "FAILS — check the token's bucket permission"}`);
  if (!newOk) process.exit(1);

  // 5. Swap .env.local (backup old first).
  const backup = ".env.local.r2-rotate-backup";
  copyFileSync(".env.local", backup);
  console.log(`[5] Backed up old key to ${backup} (gitignored). Swapping .env.local…`);

  const lines = readFileSync(".env.local", "utf8").split("\n");
  const out = lines.map((l) => {
    if (/^R2_ACCESS_KEY_ID=/.test(l)) return `R2_ACCESS_KEY_ID=${newKey}`;
    if (/^R2_SECRET_ACCESS_KEY=/.test(l)) return `R2_SECRET_ACCESS_KEY=${newSecret}`;
    return l;
  });
  // Append if not present.
  let text = out.join("\n");
  if (!text.includes("R2_ACCESS_KEY_ID=")) text += `\nR2_ACCESS_KEY_ID=${newKey}\n`;
  if (!text.includes("R2_SECRET_ACCESS_KEY=")) text += `R2_SECRET_ACCESS_KEY=${newSecret}\n`;
  writeFileSync(".env.local", text + "\n");

  console.log("[6] .env.local updated. Set these in Vercel (Project → Settings → Env Vars):");
  console.log("    R2_ACCESS_KEY_ID = (the new ID you just provided)");
  console.log("    R2_SECRET_ACCESS_KEY = (the new secret)");
  console.log("\nThen delete the OLD token in the Cloudflare dashboard to complete rotation.");
  console.log("Run `npm run verify-r2` to confirm the new key end-to-end.");
}

main().catch((e) => {
  console.error("rotate-r2 failed:", e.message);
  process.exit(1);
});
