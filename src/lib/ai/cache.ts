/**
 * AI response cache — trims API calls on repeated requests (§37 capacity).
 *
 * Two layers:
 *   1. In-memory LRU (fast, zero network) — keyed by a content hash of the
 *      request; TTL'd. This handles the common case (same student re-asks, or
 *      the same grounded question in quick succession).
 *   2. Supabase ai_response_cache (optional, lazy server import) — persists
 *      across serverless instances on Vercel so a common tutor question asked
 *      by many students hits the cache once.
 *
 * The cache is OPT-IN at the call site: only cache requests that are
 * deterministic and safe to share (e.g. the grounded tutor answer for a
 * question — the same for every student). Never cache per-user or sensitive
 * responses. Never cache student data.
 *
 * server-only (uses the service-role client for persistence). The in-memory
 * layer is pure and safe to use anywhere.
 */
import { createHash } from "node:crypto";

const TTL_MS = 24 * 60 * 60 * 1000; // 24h

interface Entry { text: string; model?: string; expiresAt: number; }

/** In-memory cache (module-level, shared across requests in one instance). */
const memory = new Map<string, Entry>();
const MAX_ENTRIES = 500;

/** Build a stable cache key from the request parts (never includes user id). */
export function cacheKeyFor(workload: string, question: string, provider: string, tier?: string): string {
  return createHash("sha256")
    .update(`${workload}|${question.trim().toLowerCase()}|${provider}|${tier ?? ""}`)
    .digest("hex");
}

/** Read from the in-memory layer (fast path). Returns {text, model} or null. */
export function readMemoryCache(key: string): { text: string; model?: string } | null {
  const e = memory.get(key);
  if (!e) return null;
  if (Date.now() > e.expiresAt) {
    memory.delete(key);
    return null;
  }
  return { text: e.text, model: e.model };
}

/** Write to the in-memory layer. */
export function writeMemoryCache(key: string, text: string, model?: string): void {
  memory.set(key, { text, model, expiresAt: Date.now() + TTL_MS });
  if (memory.size > MAX_ENTRIES) {
    // Evict the oldest (Map iteration order = insertion order).
    const oldest = memory.keys().next().value;
    if (oldest !== undefined) memory.delete(oldest);
  }
}

/**
 * Read from the persisted cache (Supabase). Lazy server import; returns null
 * on any error (cache is an optimization, never a correctness dependency).
 */
export async function readPersistedCache(key: string): Promise<{ text: string; model?: string } | null> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/server");
    const admin = createAdminClient();
    const { data } = await admin
      .from("ai_response_cache")
      .select("response_text, model, expires_at")
      .eq("cache_key", key)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();
    if (!data) return null;
    return { text: String(data.response_text), model: data.model ? String(data.model) : undefined };
  } catch {
    return null;
  }
}

/** Write to the persisted cache (fire-and-forget). */
export async function writePersistedCache(
  key: string,
  workload: string,
  provider: string,
  text: string,
  model?: string,
): Promise<void> {
  try {
    const { createAdminClient } = await import("@/lib/supabase/server");
    const admin = createAdminClient();
    await admin.from("ai_response_cache").upsert(
      {
        cache_key: key,
        workload,
        provider,
        response_text: text,
        model: model ?? null,
        expires_at: new Date(Date.now() + TTL_MS).toISOString(),
      },
      { onConflict: "cache_key" },
    );
  } catch {
    // Best-effort; never fail the request over caching.
  }
}

/**
 * Combined read: memory first, then persisted. Returns {text, model, hit}.
 */
export async function readCached(key: string): Promise<{ text: string; model?: string; hit: "memory" | "db" | "none" }> {
  const mem = readMemoryCache(key);
  if (mem) return { text: mem.text, model: mem.model, hit: "memory" };
  const db = await readPersistedCache(key);
  if (db) {
    writeMemoryCache(key, db.text, db.model); // warm the fast path
    return { text: db.text, model: db.model, hit: "db" };
  }
  return { text: "", hit: "none" };
}

/** Combined write (memory + persisted). */
export async function writeCached(key: string, workload: string, provider: string, text: string, model?: string): Promise<void> {
  writeMemoryCache(key, text, model);
  await writePersistedCache(key, workload, provider, text, model);
}
