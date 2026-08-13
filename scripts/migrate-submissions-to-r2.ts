#!/usr/bin/env tsx
/**
 * migrate-submissions-to-r2 — move audio/PDF submission files + PDF materials
 * from Supabase Storage to Cloudflare R2 (v3 Part 3.2).
 *
 * Supabase Free gives 1 GB file storage + 5 GB egress; 30 students submitting
 * audio for 12 weeks exhausts both. R2 egress is free at any volume.
 *
 * Finds rows whose provider = 'supabase' and bucket in ('submissions',
 * 'materials'), downloads each from Supabase, uploads to R2, and flips the
 * row's provider/bucket to R2. Does NOT delete Supabase originals — delete
 * manually after confirming playback.
 *
 *   npm run migrate-submissions-r2 -- --dry-run
 *   npm run migrate-submissions-r2
 */
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const env = process.env;
function requireEnv(name: string): string {
  const v = env[name];
  if (!v) throw new Error(`Missing env var: ${name} (see .env.example)`);
  return v;
}

const R2_BUCKET = env.R2_CONTENT_BUCKET ?? "vibha-content";

function makeS3() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${requireEnv("CLOUDFLARE_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

async function downloadFromSupabase(
  storage: ReturnType<ReturnType<typeof createClient>["storage"]["from"]>,
  bucket: string,
  path: string,
): Promise<Buffer> {
  const { data, error } = await storage.download(path);
  if (error) throw new Error(`supabase download ${bucket}/${path}: ${error.message}`);
  return Buffer.from(await (data as Blob).arrayBuffer());
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const supabase = createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"));
  const s3 = makeS3();

  // 1. Submission files still on Supabase.
  const { data: files } = await supabase
    .from("submission_files")
    .select("id, submission_id, storage_path, provider, bucket")
    .eq("provider", "supabase");
  console.log(`submission_files on Supabase: ${(files ?? []).length}`);

  // 2. Materials (PDFs/docs) still on Supabase.
  const { data: materials } = await supabase
    .from("materials")
    .select("id, storage_path, provider, bucket, kind")
    .eq("provider", "supabase")
    .in("kind", ["pdf", "document", "file"]);
  console.log(`materials on Supabase: ${(materials ?? []).length}`);

  if (dryRun) {
    console.log("dry-run — nothing migrated");
    return;
  }

  let moved = 0;
  for (const f of (files ?? []) as Array<{ id: string; storage_path: string; bucket?: string }>) {
    const bucket = f.bucket ?? "submissions";
    try {
      const buf = await downloadFromSupabase(supabase.storage.from(bucket), bucket, f.storage_path);
      const key = f.storage_path; // keep the same logical key under R2
      await s3.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: buf }));
      const { error } = await supabase
        .from("submission_files")
        .update({ provider: "r2", bucket: R2_BUCKET })
        .eq("id", f.id);
      if (error) throw error;
      moved++;
      console.log(`  moved submission file ${f.id} → r2:${key}`);
    } catch (e) {
      console.error(`  ! submission file ${f.id}: ${(e as Error).message}`);
    }
  }

  for (const m of (materials ?? []) as Array<{ id: string; storage_path: string; bucket?: string }>) {
    const bucket = m.bucket ?? "materials";
    try {
      const buf = await downloadFromSupabase(supabase.storage.from(bucket), bucket, m.storage_path);
      const key = m.storage_path;
      await s3.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: buf }));
      const { error } = await supabase
        .from("materials")
        .update({ provider: "r2", bucket: R2_BUCKET })
        .eq("id", m.id);
      if (error) throw error;
      moved++;
      console.log(`  moved material ${m.id} → r2:${key}`);
    } catch (e) {
      console.error(`  ! material ${m.id}: ${(e as Error).message}`);
    }
  }

  console.log(`done — ${moved} files migrated to R2 (${R2_BUCKET})`);
}

main();
