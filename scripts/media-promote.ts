#!/usr/bin/env tsx
/**
 * media-promote — promotes verified rows from `pending` → `ready`, and marks
 * rows whose object is missing/empty as `failed`. DISTINCT from media-doctor:
 * doctor only LOOKS; this TOUCHES. Run after the migration + media-doctor at
 * a quiet hour (pending rows are hidden from students until promoted).
 *
 *   npm run media-promote
 *
 * For every file-backed row in `pending`/`failed`: verify the object exists in
 * the recorded bucket and is non-zero → `ready`; otherwise → `failed`.
 * Idempotent. Reports what it changed.
 */

import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const envFile = ".env.local";

function loadEnvFile(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^"|"$/g, "");
  }
  return out;
}

const env = loadEnvFile(envFile);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("media-promote needs NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (.env.local).");
  process.exit(1);
}

const admin = createClient(url, key, { auth: { persistSession: false } });

async function objectSize(bucket: string, path: string): Promise<number | null> {
  try {
    const { data, error } = await admin.storage.from(bucket).info(path);
    if (error || !data) return null;
    const size = data.metadata?.size ?? data.size;
    return typeof size === "number" && size > 0 ? size : null;
  } catch {
    return null;
  }
}

let promoted = 0;
let failed = 0;

async function promoteTable(
  table: "materials" | "lessons" | "submission_files",
  statusCol: string,
  pathCol: string,
  bucketCol: string,
  defaultBucket: string,
  sizeCol: string | null, // column that stores the object size; null if the table has none
) {
  const { data: rows, error } = await admin
    .from(table)
    .select(`id, ${pathCol}, ${bucketCol}, ${statusCol}`);
  if (error) {
    console.error(`  ❌ could not read ${table}:`, error.message);
    process.exitCode = 1;
    return;
  }
  for (const row of (rows ?? []) as unknown as Array<Record<string, string | null>>) {
    if (!row[pathCol]) continue;
    const bucket = row[bucketCol] ?? defaultBucket;
    const size = await objectSize(bucket, row[pathCol]);
    const next = size === null ? "failed" : "ready";
    if (next === (row[statusCol] ?? "pending")) continue;
    const { error: up } = await admin
      .from(table)
      .update({
        [statusCol]: next,
        ...(size !== null && sizeCol ? { [sizeCol]: size } : {}),
      })
      .eq("id", row.id);
    if (up) {
      console.error(`  ❌ ${table} ${row.id}: ${up.message}`);
      process.exitCode = 1;
      continue;
    }
    if (next === "ready") promoted++;
    else failed++;
    console.log(`  ▶ ${table} ${row.id} → ${next}${size !== null ? ` (${size} bytes)` : ""}`);
  }
}

async function main() {
  console.log("media-promote — promote pending→ready, mark missing→failed\n");

  await promoteTable("materials", "status", "storage_path", "bucket", "materials", "size_bytes");
  await promoteTable("lessons", "video_status", "video_storage_path", "video_bucket", "videos", null);
  await promoteTable("submission_files", "status", "storage_path", "bucket", "submissions", "size_bytes");

  console.log(`\n${promoted} promoted to ready, ${failed} marked failed.`);
  if (failed > 0) {
    console.log("Run media-doctor to see which rows failed and why (object missing/empty).");
  }
  process.exit(process.exitCode ?? (failed > 0 ? 1 : 0));
}

main().catch((e) => {
  console.error("media-promote fatal:", e instanceof Error ? e.message : e);
  process.exit(1);
});
