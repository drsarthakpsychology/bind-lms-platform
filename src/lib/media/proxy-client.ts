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

/**
 * Resolve a lesson's media object(s) server-side from an already-fetched
 * lesson row. Null if the lesson has none.
 *
 * Location comes from RECORDED columns only — never inferred from
 * NEXT_PUBLIC_MEDIA_PROVIDER. That variable may decide where a NEW upload
 * goes; it has no business telling us where an existing object lives. Legacy
 * rows with no video_provider/video_bucket were all uploaded to Supabase's
 * `videos` bucket by video-upload.tsx, so they resolve there unconditionally.
 */
export function resolveLessonStreamFromRow(lesson: {
  video_storage_path: string | null;
  video_provider?: string | null;
  video_bucket?: string | null;
  media_assets?: Array<{ master_playlist: string | null; key_prefix: string | null; provider: string | null; bucket?: string | null }> | null;
}): ResolvedStream | null {
  const media = Array.isArray(lesson.media_assets)
    ? lesson.media_assets[0]
    : lesson.media_assets;

  // HLS asset (R2 or Supabase) recorded in media_assets. Bucket recorded on
  // the row where the asset lives; R2 legacy rows default to the R2 env bucket.
  if (media?.master_playlist) {
    const provider = media.provider === "r2" ? "r2" : "supabase";
    const bucket =
      media.bucket ??
      (provider === "r2" ? (process.env.R2_BUCKET_NAME ?? "") : "videos");
    const keyPrefix = media.key_prefix ?? media.master_playlist.replace(/\/master\.m3u8$/, "");
    return { isHls: true, provider, bucket, key: media.master_playlist, keyPrefix };
  }

  // Legacy single-file video. The DB row records where it lives; fall back to
  // the Supabase `videos` bucket only when the row predates the columns.
  if (lesson.video_storage_path) {
    return {
      isHls: false,
      provider: lesson.video_provider === "r2" ? "r2" : "supabase",
      bucket: lesson.video_bucket ?? "videos",
      key: lesson.video_storage_path,
    };
  }

  return null;
}

/**
 * Resolve a lesson's media object(s) server-side. Null if the lesson has none.
 * (Fetches the lesson row; prefer resolveLessonStreamFromRow when the row is
 * already in hand.)
 */
export async function resolveLessonStream(lessonId: string): Promise<ResolvedStream | null> {
  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select(
      "video_storage_path, video_provider, video_bucket, media_assets(master_playlist, key_prefix, provider, bucket)",
    )
    .eq("id", lessonId)
    .single();

  if (!lesson) return null;
  return resolveLessonStreamFromRow(lesson);
}

/**
 * Authorize + resolve a lesson in ONE database query, for the stream proxy
 * hot path. Returns the enrollment verdict AND the resolved stream from a
 * single lessons row (with course + media embed). Callers cache this per
 * (uid, lessonId).
 *
 * `isAdmin`/enrollment logic mirrors canAccessLesson but avoids the second
 * round-trip by folding the enrollment check into the same query's result.
 */
export async function authorizeAndResolveLesson(opts: {
  userId: string;
  role: "admin" | "student" | "alumni";
  scope?: "full" | "lectures_only";
  lessonId: string;
}): Promise<{ authorized: boolean; resolved: ResolvedStream | null }> {
  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select(
      "course_id, video_storage_path, video_provider, video_bucket, media_assets(master_playlist, key_prefix, provider, bucket), courses(is_published)",
    )
    .eq("id", opts.lessonId)
    .single();

  if (!lesson) {
    return { authorized: false, resolved: null };
  }

  const resolved = resolveLessonStreamFromRow(lesson);
  if (opts.role === "admin") {
    return { authorized: true, resolved };
  }

  // Student: course must be published AND enrolled.
  const course = Array.isArray(lesson.courses) ? lesson.courses[0] : lesson.courses;

  // Lecture-only scope: published lessons are the whole surface — no enrollment.
  if (opts.scope === "lectures_only") {
    return { authorized: Boolean(course?.is_published), resolved };
  }

  if (!course?.is_published) {
    return { authorized: false, resolved };
  }

  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("course_id")
    .eq("user_id", opts.userId)
    .eq("course_id", lesson.course_id)
    .maybeSingle();

  return { authorized: Boolean(enrollment), resolved };
}

type StreamResult =
  | {
      stream: ReadableStream;
      status?: number;
      rangeHeader?: string;
      contentLength?: string;
    }
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
    // Log enough to identify the file when something breaks — provider, bucket,
    // key — not just "Video unavailable".
    console.error("getObjectStream failed:", { provider, bucket, key, error: e instanceof Error ? e.message : e });
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
    // Ranged S3 reads return 206; a full read returns 200. Report whatever
    // upstream actually did so the proxy re-emits the correct status.
    status: obj.ContentRange ? 206 : 200,
    ...(obj.ContentRange ? { rangeHeader: obj.ContentRange } : {}),
    ...(obj.ContentLength ? { contentLength: String(obj.ContentLength) } : {}),
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

  // .download() cannot do HTTP ranges, and passing a `transform` option sends
  // the request to the IMAGE render endpoint — which fails for video. Every
  // browser <video> element sends a Range header, so the old code hit the
  // image endpoint on every load and could never play. Mint a short-lived
  // signed URL server-side and fetch it with the caller's Range header, so we
  // stream (206 with Content-Range) instead of buffering the whole object.
  const { data: signed, error: signErr } = await admin.storage
    .from(bucket)
    .createSignedUrl(key, 60);

  if (signErr || !signed?.signedUrl) {
    throw new Error(signErr?.message ?? "Could not sign object URL.");
  }

  const upstream = await fetch(signed.signedUrl, {
    headers: range ? { Range: range } : {},
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
    console.error("supabaseStream upstream failed:", upstream.status, bucket, key);
    return null;
  }
  if (!upstream.body) return null;

  return {
    stream: upstream.body,
    status: upstream.status,
    rangeHeader: upstream.headers.get("content-range") ?? undefined,
    contentLength: upstream.headers.get("content-length") ?? undefined,
  };
}
