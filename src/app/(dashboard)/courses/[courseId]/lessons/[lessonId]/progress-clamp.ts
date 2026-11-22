/**
 * Plausibility rules for a lecture progress ping (pure, unit-tested).
 *
 * `watched_seconds` is the resume position the player reports every ~10 s.
 * The client's numbers are not trusted:
 * - The position is bounded by the lecture length from media_assets when it is
 *   known, else by the client's duration, else by MAX_LECTURE_SECONDS.
 * - When the stored row has an `updated_at` (optional migration
 *   progress_updated_at.sql), the position may only move forward by the wall
 *   time since the last ping at up to MAX_PLAYBACK_RATE, plus a slack. Seeking
 *   back is always allowed. Without the column this bound is skipped.
 * - The very first save for a lecture (no stored row) is treated as a start
 *   from position 0 a moment ago: it may be at most FIRST_SAVE_MAX_SECONDS.
 *   Without this one post with position = length marked a lecture watched.
 *   A real player saves within about 10 seconds of starting, so a genuine
 *   first save is far below the bound; the next saves then grow normally.
 * - Completion is computed here from the server duration when known. It is
 *   sticky: a later ping never un-completes a lecture.
 */

export const MAX_LECTURE_SECONDS = 6 * 60 * 60;
export const MAX_PLAYBACK_RATE = 2;
export const SEEK_SLACK_SECONDS = 60;
export const COMPLETE_RATIO = 0.9;
/** The first save of a lecture: a few pings of real playback plus a seek's slack. */
export const FIRST_SAVE_MAX_SECONDS = SEEK_SLACK_SECONDS * 2;

export type ProgressInput = {
  watchedSeconds: number;
  clientDuration: number;
  /** media_assets.duration_seconds, when the lecture has one. */
  serverDuration: number | null;
  prev: { watchedSeconds: number; isCompleted: boolean; updatedAt: string | null } | null;
  now: number;
};

const finite = (n: unknown) => (typeof n === "number" && Number.isFinite(n) && n > 0 ? n : 0);

export function clampProgress(i: ProgressInput): { watchedSeconds: number; isCompleted: boolean } {
  const serverDuration = finite(i.serverDuration);
  const duration = serverDuration || Math.min(finite(i.clientDuration), MAX_LECTURE_SECONDS);
  let watched = Math.min(finite(i.watchedSeconds), duration || MAX_LECTURE_SECONDS);

  if (!i.prev) {
    watched = Math.min(watched, FIRST_SAVE_MAX_SECONDS);
  } else if (i.prev.updatedAt) {
    const last = Date.parse(i.prev.updatedAt);
    if (Number.isFinite(last)) {
      const elapsed = Math.max(0, (i.now - last) / 1000);
      const ceiling = finite(i.prev.watchedSeconds) + elapsed * MAX_PLAYBACK_RATE + SEEK_SLACK_SECONDS;
      watched = Math.min(watched, ceiling);
    }
  }
  watched = Math.floor(watched);

  const reached = duration > 0 && watched / duration >= COMPLETE_RATIO;
  return { watchedSeconds: watched, isCompleted: Boolean(i.prev?.isCompleted) || reached };
}
