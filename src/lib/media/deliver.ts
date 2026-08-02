import "server-only";

import { getObjectStream } from "@/lib/media/proxy-client";

/**
 * Shared streaming for the media delivery routes.
 *
 * Round-13: every file type (course material, lesson video, segment) streams
 * through ONE implementation with correct HTTP semantics — forwards Range,
 * returns 206 + Content-Range + Content-Length when ranged, Accept-Ranges:
 * bytes always, and never buffers a whole object into memory. The routes keep
 * their own entry points and auth layers (video keeps its stream token,
 * materials its session check) but share this transport.
 *
 * The one deliberate exception is a student's OWN submission file, which is
 * served via a short-lived signed URL (their own work — no lock). That path
 * lives in the submissions route, not here.
 */

export type StreamedFile = {
  /** HTTP status to emit: 206 for a ranged read, 200 otherwise. */
  status: number;
  headers: Record<string, string>;
  stream: ReadableStream;
};

/**
 * Stream a stored object with Range support. Resolves the object server-side
 * from the recorded provider/bucket/key; the client never sees a storage URL.
 */
export async function streamFile(
  provider: "r2" | "supabase",
  bucket: string,
  key: string,
  range: string | null,
  contentType: string,
): Promise<StreamedFile | null> {
  const obj = await getObjectStream(provider, bucket, key, range);
  if (!obj) return null;

  return {
    status: obj.status ?? 200,
    headers: {
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store",
      ...(obj.rangeHeader ? { "Content-Range": obj.rangeHeader } : {}),
      ...(obj.contentLength ? { "Content-Length": obj.contentLength } : {}),
    },
    stream: obj.stream,
  };
}

/** Content type for a material kind. */
export function contentTypeForKind(kind: string, format?: string | null): string {
  switch (kind) {
    case "document":
      return format === "pdf" ? "application/pdf" : "application/octet-stream";
    case "audio":
      return format === "mp3" ? "audio/mpeg" : "audio/mp4";
    case "image":
      return format === "png" ? "image/png" : format === "webp" ? "image/webp" : "image/jpeg";
    default:
      return "application/octet-stream";
  }
}
