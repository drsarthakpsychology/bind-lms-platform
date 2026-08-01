/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * This is a per-process limiter — fine for a single serverless instance on
 * the free tier. If the app scales to multiple instances, swap this for a
 * shared store (Upstash Redis / Cloudflare KV). Documented trade-off, not a
 * hidden limitation.
 */

const WINDOW_MS = 60 * 1000; // 1 minute

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Trim expired buckets so the map doesn't grow unbounded. */
function sweep() {
  const now = Date.now();
  for (const [k, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(k);
  }
}

/**
 * Returns true if the key is allowed, false if it exceeded `limit` in the
 * window. Callers should 429 on false.
 */
export function rateLimit(key: string, limit: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    if (buckets.size > 10_000) sweep();
    return true;
  }

  bucket.count += 1;
  return bucket.count <= limit;
}
