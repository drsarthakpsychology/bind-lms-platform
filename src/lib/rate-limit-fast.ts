/**
 * Fast per-process fixed-window rate limiter.
 *
 * Used for high-volume hot paths (the stream segment proxy) where a DB write
 * per request would be wasteful. Per-process is acceptable there because it's
 * a generous abuse throttle, not a hard security boundary. The DB-backed
 * limiter (rate-limit.ts) is authoritative for low-volume security-critical
 * endpoints.
 *
 * Pure module (no server-only) so it's unit-testable.
 */

const WINDOW_MS = 60 * 1000; // 1 minute

const memBuckets = new Map<string, { count: number; resetAt: number }>();

/** Returns true if the key is allowed, false if it exceeded `limit` in the window. */
export function rateLimitFast(key: string, limit: number): boolean {
  const now = Date.now();
  const b = memBuckets.get(key);
  if (!b || b.resetAt <= now) {
    memBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    if (memBuckets.size > 20_000) {
      for (const [k, v] of memBuckets) {
        if (v.resetAt <= now) memBuckets.delete(k);
      }
    }
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}
