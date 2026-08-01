#!/usr/bin/env tsx
/**
 * migrate-supabase-to-r2 — move existing Supabase Storage videos to R2 as HLS.
 *
 *   npm run migrate-supabase-to-r2
 *
 * Finds lessons with a video_storage_path (Supabase) and no media_assets row,
 * downloads each to a temp file, encodes it through the same HLS pipeline as
 * publish-lecture, uploads to R2, and upserts the media_assets row.
 *
 * Does NOT delete Supabase originals — you delete those manually after
 * confirming playback.
 *
 * Flags:
 *   --lesson <id>   migrate only one lesson
 *   --dry-run       report what WOULD migrate without doing it
 */

import { existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { encodeHls, LADDER, writeMaster, probeVideo } from "./publish-lecture";

const env = process.env;
function requireEnv(name: string): string {
  const v = env[name];
  if (!v) throw new Error(`Missing env var: ${name} (see .env.example)`);
  return v;
}

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

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const onlyLesson = args.includes("--lesson") ? args[args.indexOf("--lesson") + 1] : "";

  const supabase = createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"));

  // Find lessons with a legacy video path and no media_assets row.
  let q = supabase
    .from("lessons")
    .select("id, title, video_storage_path, media_assets(id)")
    .not("video_storage_path", "is", null);
  if (onlyLesson) q = q.eq("id", onlyLesson);
  const { data: lessons, error } = await q;
  if (error) throw new Error(`Query failed: ${error.message}`);

  const toMigrate = (lessons ?? []).filter((l) => !l.media_assets?.length);
  console.log(`Found ${toMigrate.length} lesson(s) to migrate.`);
  if (dryRun) {
    for (const l of toMigrate) console.log(`  would migrate: ${l.id} (${l.title})`);
    process.exit(0);
  }

  const s3 = makeS3();
  const bucket = requireEnv("R2_BUCKET_NAME");

  for (const lesson of toMigrate) {
    console.log(`\n▶ ${lesson.title} (${lesson.id})`);
    // Download the Supabase object.
    const admin = createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"));
    const { data } = await admin.storage.from("videos").download(lesson.video_storage_path);
    if (!data) {
      console.error(`  ⚠ could not download ${lesson.video_storage_path}`);
      continue;
    }
    const workdir = join(tmpdir(), `plms-migrate-${lesson.id}`);
    mkdirSync(workdir, { recursive: true });
    const localFile = join(workdir, "source.bin");
    const { writeFileSync } = await import("node:fs");
    writeFileSync(localFile, Buffer.from(await data.arrayBuffer()));

    console.log("  encoding HLS …");
    await encodeHls(localFile, workdir);
    writeMaster(workdir);

    const keyPrefix = `lessons/${lesson.id}/hls`;
    // Upload each generated file.
    const { readdirSync } = await import("node:fs");
    for (const rung of LADDER) {
      const dir = join(workdir, `hls_${rung.height}`);
      if (!existsSync(dir)) continue;
      for (const f of readdirSync(dir)) {
        const p = join(dir, f);
        const { readFileSync } = await import("node:fs");
        await s3.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: `${keyPrefix}/hls_${rung.height}/${f}`,
            Body: readFileSync(p),
          }),
        );
      }
    }
    const masterLocal = join(workdir, "master.m3u8");
    const { readFileSync } = await import("node:fs");
    await s3.send(
      new PutObjectCommand({ Bucket: bucket, Key: `${keyPrefix}/master.m3u8`, Body: readFileSync(masterLocal) }),
    );

    // Upsert media_assets.
    const dur = probeVideo(localFile).duration;
    const { error: upErr } = await supabase.from("media_assets").upsert(
      {
        lesson_id: lesson.id,
        provider: "r2",
        key_prefix: keyPrefix,
        master_playlist: `${keyPrefix}/master.m3u8`,
        duration_seconds: dur,
        ladder: LADDER.map((r) => `${r.height}p`),
      },
      { onConflict: "lesson_id" },
    );
    if (upErr) console.error(`  ⚠ media_assets upsert failed: ${upErr.message}`);

    console.log(`  ✅ migrated ${lesson.id} → ${keyPrefix}/master.m3u8`);
  }

  console.log("\nDone. Supabase originals NOT deleted — delete manually after confirming playback.");
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
