import "server-only";

/**
 * Per-(viewer, lesson) stream verdict cache.
 *
 * The stream proxy is the hot path: one request per 6-second segment. Each
 * request was doing ~4 serialized DB/auth round-trips (session, enrollment,
 * lesson resolution) before the first byte. The verdict is stable for the
 * lifetime of the stream token (5 minutes) — the token already HMAC-binds
 * (uid, lessonId, courseId, expiry), so a cached verdict is no wider a window
 * than the token itself.
 *
 * Cache key: `${uid}:${lessonId}`. TTL = 5 minutes (token life). Same
 * module-level-Map pattern as the fast rate limiter; a short TTL bounds growth
 * and an explicit sweep keeps the map small.
 */

const TTL_MS = 5 * 60 * 1000;

type Verdict = {
  ok: boolean;
  reason?: string;
  /** The resolved stream (null when the lesson has no media). */
  resolved: import("./proxy-client").ResolvedStream | null;
  /** Enrollment re-check passed. */
  authorized: boolean;
};

const cache = new Map<string, { v: Verdict; expiresAt: number }>();

export function getStreamVerdict(uid: string, lessonId: string): Verdict | null {
  const hit = cache.get(`${uid}:${lessonId}`);
  if (!hit) return null;
  if (hit.expiresAt <= Date.now()) {
    cache.delete(`${uid}:${lessonId}`);
    return null;
  }
  return hit.v;
}

export function setStreamVerdict(
  uid: string,
  lessonId: string,
  v: Verdict,
): void {
  cache.set(`${uid}:${lessonId}`, { v, expiresAt: Date.now() + TTL_MS });
  if (cache.size > 10_000) {
    const now = Date.now();
    for (const [k, entry] of cache) {
      if (entry.expiresAt <= now) cache.delete(k);
    }
  }
}
