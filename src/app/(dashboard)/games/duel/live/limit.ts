/** In-memory per-player limit for the poll endpoint (~1/s each; allows bursts). */
const hits = new Map<string, number[]>();
const WINDOW_MS = 10_000;
const MAX = 40;

export function rateLimitFast(key: string, now = Date.now()): boolean {
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX) {
    hits.set(key, list);
    return false;
  }
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return true;
}
