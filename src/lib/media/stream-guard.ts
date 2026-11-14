/**
 * Pure checks for the stream proxy (src/app/api/media/stream). Kept free of
 * `server-only` so they are unit-tested.
 */

/** File types the proxy serves out of a lecture's folder. */
const MEDIA_FILE = /\.(m3u8|ts|m4s|mp4|aac|vtt)$/i;
const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

/**
 * The part of the URL after the lesson id. Empty (the master playlist) or the
 * key endpoint are fine; anything else must be a plain relative path to a
 * media file inside the lecture's folder: no `..`, no empty or hidden
 * segments, no backslashes, at most four levels, a media extension.
 */
export function safeStreamRest(rest: string): boolean {
  if (rest === "" || rest === "__key__") return true;
  if (rest.length > 300 || rest.includes("\\") || rest.includes("..")) return false;
  const parts = rest.split("/");
  if (parts.length > 4 || !parts.every((p) => SEGMENT.test(p))) return false;
  return MEDIA_FILE.test(rest);
}

/**
 * The chunk fast path skips the database session check. It is only allowed
 * for the same browser session that passed the full check on this server:
 * the request must carry the session cookie that was current then. A stream
 * URL copied to another browser or another account falls back to the full
 * check, which rejects it.
 */
export function warmChunkAllowed(
  warm: { ok: boolean; session?: string | null } | null,
  sessionCookie: string | undefined,
): boolean {
  return Boolean(warm?.ok && warm.session && sessionCookie && warm.session === sessionCookie);
}
