import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * What the player needs besides the token: HLS or a single MP4, and where to
 * resume. Shared by the website's POST /api/media/playback and the app's
 * POST /api/app/v1/lectures/:id/stream. The caller has already checked
 * access (canAccessLesson).
 */
export type PlaybackMedia = { ok: true; mediaType: "hls" | "mp4"; resumeSeconds: number } | { ok: false; status: 404; error: string };

export async function playbackMedia(lessonId: string, userId: string): Promise<PlaybackMedia> {
  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, video_storage_path, video_provider, video_bucket, media_assets(master_playlist, key_prefix, provider, bucket)")
    .eq("id", lessonId)
    .single();

  if (!lesson) return { ok: false, status: 404, error: "Lesson not found." };

  // Determine the media shape:
  //  - A media_assets row (R2 migration done) → HLS master playlist.
  //  - Otherwise → legacy raw video (single MP4).
  const media = Array.isArray(lesson.media_assets) ? lesson.media_assets[0] : lesson.media_assets;
  // Only a real master playlist means HLS. A freshly-uploaded SOURCE row has
  // key_prefix set but master_playlist null. It must resolve as a plain MP4,
  // not run hls.js against a raw file.
  const masterKey = media?.master_playlist ?? null;
  const key = masterKey ?? lesson.video_storage_path;
  if (!key) return { ok: false, status: 404, error: "This lesson has no media." };

  // Resume position for this viewer (may be 0).
  const { data: progress } = await supabase.from("progress").select("watched_seconds").eq("user_id", userId).eq("lesson_id", lessonId).maybeSingle();

  return { ok: true, mediaType: masterKey ? "hls" : "mp4", resumeSeconds: progress?.watched_seconds ?? 0 };
}
