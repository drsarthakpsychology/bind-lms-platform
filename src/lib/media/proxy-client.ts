import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Server-side object resolution + streaming for the stream proxy.
 *
 * The proxy never hands the browser a storage URL — it fetches the object
 * server-side and streams it back through an authenticated channel. This file
 * centralises "given a lesson, what object lives where and in what form",
 * so both the R2 (S3) and Supabase Storage backends behave the same to the
 * proxy.
 */

export type ResolvedStream =
  | {
      isHls: true;
      provider: "r2" | "supabase";
      bucket: string;
      /** Master playlist object key. */
      key: string;
      /** Object prefix (everything before the segment filenames). */
      keyPrefix: string;
    }
  | {
      isHls: false;
      provider: "r2" | "supabase";
      bucket: string;
      key: string;
    };

/** Resolve a lesson's media object(s) server-side. Null if the lesson has none. */
export async function resolveLessonStream(lessonId: string): Promise<ResolvedStream | null> {
  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("video_storage_path, media_assets(master_playlist, key_prefix, provider)")
    .eq("id", lessonId)
    .single();

  if (!lesson) return null;

  const media = Array.isArray(lesson.media_assets)
    ? lesson.media_assets[0]
    : lesson.media_assets;

  // HLS asset (R2 or Supabase) recorded in media_assets.
  if (media?.master_playlist) {
    const provider = media.provider === "r2" ? "r2" : "supabase";
    const bucket = provider === "r2" ? (process.env.R2_BUCKET_NAME ?? "") : "videos";
    const keyPrefix = media.key_prefix ?? media.master_playlist.replace(/\/master\.m3u8$/, "");
    return { isHls: true, provider, bucket, key: media.master_playlist, keyPrefix };
  }

  // Legacy single-file video.
  if (lesson.video_storage_path) {
    // Detect the configured provider via env (per-asset media_assets.provider
    // governs HLS; legacy MP4s use the global setting).
    const configured = process.env.NEXT_PUBLIC_MEDIA_PROVIDER ?? "supabase";
    return {
      isHls: false,
      provider: configured === "r2" ? "r2" : "supabase",
      bucket: configured === "r2" ? (process.env.R2_BUCKET_NAME ?? "") : "videos",
      key: lesson.video_storage_path,
    };
  }

  return null;
}

type StreamResult =
  | { stream: ReadableStream; status?: number; rangeHeader?: string }
  | null;

/** Stream an object with optional HTTP Range support. */
export async function getObjectStream(
  provider: "r2" | "supabase",
  bucket: string,
  key: string,
  range?: string | null,
): Promise<StreamResult> {
  try {
    if (provider === "r2") {
      return await r2Stream(bucket, key, range);
    }
    return await supabaseStream(bucket, key, range);
  } catch (e) {
    console.error("getObjectStream failed:", e);
    return null;
  }
}

/** Fetch an object's full text (used for playlists). */
export async function getObjectText(
  provider: "r2" | "supabase",
  bucket: string,
  key: string,
): Promise<string | null> {
  try {
    if (provider === "r2") {
      const { getObjectTextR2 } = await import("./r2");
      return await getObjectTextR2(bucket, key);
    }
    const { getObjectTextSupabase } = await import("./supabase");
    return await getObjectTextSupabase(bucket, key);
  } catch (e) {
    console.error("getObjectText failed:", e);
    return null;
  }
}

/** Fetch an object's full bytes (used for encrypting segments in the proxy). */
export async function getObjectBuffer(
  provider: "r2" | "supabase",
  bucket: string,
  key: string,
): Promise<Buffer | null> {
  try {
    if (provider === "r2") {
      const { getObjectBufferR2 } = await import("./r2");
      return await getObjectBufferR2(bucket, key);
    }
    const { getObjectBufferSupabase } = await import("./supabase");
    return await getObjectBufferSupabase(bucket, key);
  } catch (e) {
    console.error("getObjectBuffer failed:", e);
    return null;
  }
}

/* ---- R2 (S3) ---- */
async function r2Stream(
  bucket: string,
  key: string,
  range?: string | null,
): Promise<StreamResult> {
  const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 env vars not set.");
  }
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  const cmd = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ...(range ? { Range: range } : {}),
  });
  const obj = await client.send(cmd);
  if (!obj.Body) return null;
  const body = obj.Body as ReadableStream;
  return {
    stream: body,
    ...(obj.ContentRange ? { rangeHeader: obj.ContentRange } : {}),
  };
}

/* ---- Supabase Storage ---- */
async function supabaseStream(
  bucket: string,
  key: string,
  range?: string | null,
): Promise<StreamResult> {
  const { createAdminClient } = await import("@/lib/supabase/server");
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(bucket)
    .download(key, range ? { transform: { width: 0 } } : undefined);
  // Supabase's .download() doesn't support Range; fetch the whole object.
  if (error || !data) throw new Error(error?.message ?? "Supabase download failed");
  const bytes = data.arrayBuffer ? await data.arrayBuffer() : await readBlob(data);
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(bytes));
      controller.close();
    },
  });
  return { stream };
}

async function readBlob(b: Blob): Promise<ArrayBuffer> {
  return b.arrayBuffer();
}
