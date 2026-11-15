import "server-only";
import { loadLecture } from "@/lib/course/lecture";
import { playbackMedia } from "@/lib/media/playback";
import { mintAppStreamToken, streamTtlSeconds } from "@/lib/media/app-stream-token";
import { appUrl } from "@/lib/app-url";
import { APP_RULES } from "./config";
import { APP_HEADERS, type StreamAccess } from "./contract";
import type { AppUser } from "./guard";
import { watermarkFor } from "./me";
import { ApiFail } from "./respond";

/**
 * Video access for the app. The checks are the website's (loadLecture runs
 * canAccessLesson and the live-status rule; playbackMedia); the token is
 * the app kind (src/lib/media/app-stream-token.ts). The address points at the
 * website's own stream proxy, which serves the same playlists, the same
 * per-viewer key and the same encrypted chunks.
 */
export async function appStreamAccess(input: { user: AppUser; lessonId: string; deviceCompromised: boolean; bindHeader: boolean; origin?: string }): Promise<StreamAccess> {
  const { user, lessonId } = input;
  if (input.deviceCompromised && APP_RULES.refuseVideoOnRootedDevice) throw new ApiFail("video_refused");

  const lecture = await loadLecture(user.profile, lessonId);
  if (!lecture.ok) throw new ApiFail(lecture.reason === "locked" ? "feature_locked" : lecture.reason === "forbidden" ? "forbidden" : "not_found");
  if (!lecture.lecture.hasVideo) throw new ApiFail("not_found", "This lecture has no video.");

  const media = await playbackMedia(lessonId, user.profile.id);
  if (!media.ok) throw new ApiFail("not_found", media.error);

  let minted: { token: string; exp: number };
  try {
    minted = mintAppStreamToken({
      userId: user.profile.id,
      lessonId,
      courseId: lecture.lecture.courseId,
      deviceId: user.deviceId,
      bindHeader: input.bindHeader,
      ttlSeconds: streamTtlSeconds(lecture.lecture.durationSeconds, APP_RULES.streamTtl),
    });
  } catch {
    throw new ApiFail("unavailable", "Video isn't set up on the server yet.");
  }

  // The server the app is talking to (so a test deployment streams from itself).
  const base = (input.origin && /^https?:\/\//.test(input.origin) ? input.origin : appUrl()).replace(/\/$/, "");
  const path = `/api/media/stream/${lessonId}`;
  const expiresIn = Math.max(0, Math.round((minted.exp - Date.now()) / 1000));
  return {
    url: `${base}${path}?st=${encodeURIComponent(minted.token)}`,
    mediaType: media.mediaType,
    headers: input.bindHeader ? { [APP_HEADERS.deviceId]: user.deviceId } : {},
    expiresIn,
    expiresAt: new Date(minted.exp).toISOString(),
    resumeSeconds: Math.max(0, Math.floor(media.resumeSeconds)),
    durationSeconds: lecture.lecture.durationSeconds,
    watermark: watermarkFor(user.profile, user.name),
    progressEverySeconds: APP_RULES.progressEverySeconds,
  };
}
