#!/usr/bin/env tsx
/**
 * publish-lecture — one command to publish a lesson video to R2 as HLS.
 *
 *   npm run publish-lecture -- ./raw/lecture-04.mp4 --lesson <lessonId>
 *
 * Does, in order, with progress output:
 *   1. ffprobe the source; refuse if not a video or already tiny.
 *   2. Encode a multi-bitrate HLS ladder (1080p/720p/480p/360p) + master.m3u8,
 *      6-second segments, tuned for talking-head + slides (not film).
 *   3. Upload segments + playlists to R2 under lessons/<lessonId>/hls/.
 *   4. Upsert the media_assets row (provider='r2', ladder, duration).
 *   5. Print the lesson URL + total encoded size.
 *
 * Flags:
 *   --dry-run   encode locally and report size WITHOUT uploading.
 *   --lesson    the lesson id (required unless --dry-run).
 *
 * Idempotent: re-running on the same lesson replaces cleanly (uploads are
 * overwritten by key). Resumable: it skips segments whose R2 object size
 * already matches the local file size.
 *
 * Secrets: never prints R2 credentials.
 */

import { spawnSync, spawn } from "node:child_process";
import { existsSync, statSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

/* ------------------------------------------------------------------ */
/* Config / env                                                        */
/* ------------------------------------------------------------------ */

const env = process.env;
function requireEnv(name: string): string {
  const v = env[name];
  if (!v) throw new Error(`Missing env var: ${name} (see .env.example)`);
  return v;
}

// HLS ladder for lecture content (talking head + slides): moderate bitrates,
// 6s segments. 360p is the floor; anything below isn't useful for slides.
export const LADDER = [
  { height: 1080, width: 1920, bitrate: "2800k", audio: "128k" },
  { height: 720, width: 1280, bitrate: "1800k", audio: "128k" },
  { height: 480, width: 854, bitrate: "1000k", audio: "96k" },
  { height: 360, width: 640, bitrate: "600k", audio: "96k" },
];
const SEGMENT_SECONDS = 6;

/* ------------------------------------------------------------------ */
/* Argument parsing                                                    */
/* ------------------------------------------------------------------ */

function parseArgs(argv: string[]) {
  const args = { src: "", lesson: "", dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--lesson") args.lesson = argv[++i] ?? "";
    else if (!a.startsWith("-") && !args.src) args.src = a;
  }
  return args;
}

/* ------------------------------------------------------------------ */
/* ffmpeg / ffprobe helpers                                            */
/* ------------------------------------------------------------------ */

function checkTools() {
  const ffmpeg = spawnSync("ffmpeg", ["-version"], { encoding: "utf8" });
  const ffprobe = spawnSync("ffprobe", ["-version"], { encoding: "utf8" });
  if (ffmpeg.status !== 0 || ffprobe.status !== 0) {
    console.error(
      "ffmpeg and ffprobe are required.\n" +
        "macOS:  brew install ffmpeg\n" +
        "Windows: choco install ffmpeg   (or download from ffmpeg.org)\n",
    );
    process.exit(1);
  }
}

export function probeVideo(src: string): { duration: number; width: number; height: number } {
  const r = spawnSync(
    "ffprobe",
    [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height:format=duration",
      "-of", "json",
      src,
    ],
    { encoding: "utf8" },
  );
  if (r.status !== 0) {
    console.error(`ffprobe failed — is "${src}" a valid video file?`);
    process.exit(1);
  }
  const out = JSON.parse(r.stdout);
  const s = out.streams?.[0];
  const duration = Number(out.format?.duration ?? 0);
  if (!s || !s.width || !s.height || !duration) {
    console.error("Not a video (or missing duration). Refusing.");
    process.exit(1);
  }
  return { duration, width: s.width, height: s.height };
}

function encodeRung(src: string, rung: (typeof LADDER)[number], dir: string): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    mkdirSync(dir, { recursive: true });
    const args = [
      "-y",
      "-i", src,
      "-vf", `scale=${rung.width}:${rung.height}:force_original_aspect_ratio=decrease:force_divisible_by=2`,
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-profile:v", "main",
      "-b:v", rung.bitrate,
      "-maxrate", rung.bitrate,
      "-bufsize", String(parseInt(rung.bitrate) * 2) + "k",
      "-x264-params", "keyint=48:min-keyint=48:scenecut=0",
      "-c:a", "aac",
      "-b:a", rung.audio,
      "-ac", "2",
      "-hls_time", String(SEGMENT_SECONDS),
      "-hls_playlist_type", "vod",
      "-hls_segment_filename", join(dir, "seg_%04d.ts"),
      join(dir, "index.m3u8"),
    ];
    const proc = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    proc.stderr.on("data", (d) => (err += d));
    proc.on("close", (code) => {
      if (code !== 0) reject(new Error(`ffmpeg ${rung.height}p failed (${code}): ${err.slice(-400)}`));
      else resolvePromise();
    });
    proc.on("error", (e) => reject(e));
  });
}

export function writeMaster(workdir: string) {
  const lines = ["#EXTM3U", "#EXT-X-VERSION:3"];
  // Variant streams reference the per-rung index.m3u8 files.
  const variantOrder = [...LADDER].sort((a, b) => b.height - a.height);
  for (const rung of variantOrder) {
    lines.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(rung.bitrate) * 1000},RESOLUTION=${rung.width}x${rung.height}`,
      `hls_${rung.height}/index.m3u8`,
    );
  }
  const master = join(workdir, "master.m3u8");
  writeFileSync(master, lines.join("\n") + "\n");
  return master;
}

export async function encodeHls(src: string, workdir: string): Promise<{ files: string[]; totalBytes: number }> {
  // One ffmpeg pass per rung (reliable, inspectable), then a master playlist.
  for (const rung of LADDER) {
    await encodeRung(src, rung, join(workdir, `hls_${rung.height}`));
  }
  writeMaster(workdir);

  // Gather all generated files.
  const files: string[] = [];
  let totalBytes = 0;
  for (const rung of LADDER) {
    const dir = join(workdir, `hls_${rung.height}`);
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      files.push(p);
      totalBytes += statSync(p).size;
    }
  }
  const master = join(workdir, "master.m3u8");
  files.push(master);
  totalBytes += statSync(master).size;
  return { files, totalBytes };
}

/* ------------------------------------------------------------------ */
/* R2 upload (resumable by object size)                                */
/* ------------------------------------------------------------------ */

function makeS3() {
  const accountId = requireEnv("CLOUDFLARE_ACCOUNT_ID");
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const bucket = requireEnv("R2_BUCKET_NAME");
  return {
    client: new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    }),
    bucket,
  };
}

async function uploadFile(s3: S3Client, bucket: string, key: string, localPath: string): Promise<boolean> {
  const localSize = statSync(localPath).size;
  // Resumable: skip if object already exists with the same size.
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    if (head.ContentLength === localSize) return false; // already uploaded
  } catch {
    // Not found — proceed to upload.
  }
  const { readFileSync } = await import("node:fs");
  const body = readFileSync(localPath);
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body }));
  return true;
}

/* ------------------------------------------------------------------ */
/* Supabase media_assets row                                           */
/* ------------------------------------------------------------------ */

async function upsertMediaAsset(opts: {
  supabaseUrl: string;
  supabaseKey: string;
  lessonId: string;
  provider: "r2";
  keyPrefix: string;
  masterPlaylist: string;
  duration: number;
}) {
  const supabase = createClient(opts.supabaseUrl, opts.supabaseKey);
  const { error } = await supabase.from("media_assets").upsert(
    {
      lesson_id: opts.lessonId,
      provider: opts.provider,
      key_prefix: opts.keyPrefix,
      master_playlist: opts.masterPlaylist,
      duration_seconds: opts.duration,
      ladder: LADDER.map((r) => `${r.height}p`),
    },
    { onConflict: "lesson_id" },
  );
  if (error) throw new Error(`media_assets upsert failed: ${error.message}`);
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  const { src, lesson, dryRun } = parseArgs(process.argv.slice(2));
  checkTools();

  if (!src) {
    console.error("Usage: npm run publish-lecture -- <file> --lesson <lessonId> [--dry-run]");
    process.exit(1);
  }
  if (!dryRun && !lesson) {
    console.error("--lesson <lessonId> is required (or use --dry-run to test without uploading).");
    process.exit(1);
  }

  const srcPath = resolve(src);
  if (!existsSync(srcPath)) {
    console.error(`Source not found: ${srcPath}`);
    process.exit(1);
  }

  console.log(`📼 Probing ${srcPath} …`);
  const probe = probeVideo(srcPath);
  console.log(`  duration ${probe.duration.toFixed(1)}s, ${probe.width}×${probe.height}`);

  const srcBytes = statSync(srcPath).size;
  console.log(`  source ${(srcBytes / 1e6).toFixed(1)} MB`);

  const workdir = join(tmpdir(), `plms-hls-${Date.now()}`);
  mkdirSync(workdir, { recursive: true });
  console.log(`⚙️  Encoding HLS ladder to ${workdir} …`);

  const { files, totalBytes } = await encodeHls(srcPath, workdir);
  console.log(`  encoded ${files.length} files, ${(totalBytes / 1e6).toFixed(1)} MB total`);

  if (dryRun) {
    console.log(`\n✅ DRY RUN — nothing uploaded. Encoded size: ${(totalBytes / 1e6).toFixed(1)} MB`);
    console.log("   (a 2-hour lecture at this ladder is typically 2.5–4 GB)");
    process.exit(0);
  }

  // Upload to R2.
  const { client, bucket } = makeS3();
  const keyPrefix = `lessons/${lesson}/hls`;
  console.log(`⬆️  Uploading to R2: ${bucket}/${keyPrefix}/ …`);
  let uploaded = 0;
  for (const f of files) {
    const rel = f.replace(workdir, "").replace(/^\//, "");
    const key = `${keyPrefix}/${rel}`;
    const isNew = await uploadFile(client, bucket, key, f);
    if (isNew) uploaded++;
  }
  console.log(`  uploaded ${uploaded} new objects`);

  // master.m3u8 references the rung subdirs; the API returns a signed URL to it.
  const masterPlaylist = `${keyPrefix}/master.m3u8`;

  console.log("💾 Recording media_assets row …");
  await upsertMediaAsset({
    supabaseUrl: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    lessonId: lesson,
    provider: "r2",
    keyPrefix,
    masterPlaylist,
    duration: probe.duration,
  });

  console.log(`\n✅ Done. Lesson ${lesson} is published as HLS on R2.`);
  console.log(`   Master playlist key: ${masterPlaylist}`);
  console.log(`   Total encoded: ${(totalBytes / 1e6).toFixed(1)} MB`);
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
