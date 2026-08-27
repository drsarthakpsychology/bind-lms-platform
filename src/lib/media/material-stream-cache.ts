import "server-only";

/**
 * Per-(viewer, material) stream verdict cache — the materials analogue of the
 * video stream-cache.
 *
 * The material proxy is a hot path too: a PDF or slide deck is fetched as many
 * byte-range requests (and the page re-mounts the viewer often). Each request
 * used to run ~4 DB round-trips (session, material+course embed, enrollment,
 * then a second material read for provider/bucket) before the first byte.
 * The verdict — can this viewer see this file, and where does it live — is
 * stable for minutes, so it is cached here with a short TTL.
 *
 * Cache key: `${uid}:${materialId}`. TTL = 5 minutes. Same module-level-Map
 * pattern as stream-cache / the fast rate limiter; a short TTL bounds growth.
 */

const TTL_MS = 5 * 60 * 1000;

export type MaterialStreamVerdict =
  | {
      ok: true;
      file: {
        kind: string;
        format: string | null;
        storage_path: string;
        provider: "r2" | "supabase";
        bucket: string;
      };
    }
  | { ok: false; reason: string; status?: number };

const cache = new Map<string, { v: MaterialStreamVerdict; expiresAt: number }>();

export function getMaterialStreamVerdict(
  uid: string,
  materialId: string,
): MaterialStreamVerdict | null {
  const hit = cache.get(`${uid}:${materialId}`);
  if (!hit) return null;
  if (hit.expiresAt <= Date.now()) {
    cache.delete(`${uid}:${materialId}`);
    return null;
  }
  return hit.v;
}

export function setMaterialStreamVerdict(
  uid: string,
  materialId: string,
  v: MaterialStreamVerdict,
): void {
  cache.set(`${uid}:${materialId}`, { v, expiresAt: Date.now() + TTL_MS });
  if (cache.size > 10_000) {
    const now = Date.now();
    for (const [k, entry] of cache) {
      if (entry.expiresAt <= now) cache.delete(k);
    }
  }
}
