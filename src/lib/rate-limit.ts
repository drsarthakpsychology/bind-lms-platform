import "server-only";

import { createAdminClient } from "@/lib/supabase/server";

/**
 * Durable, project-wide fixed-window rate limiter.
 *
 * Backed by the `rate_limits` table (Postgres), so the limit holds across
 * serverless instances — unlike a per-process Map, which multiplied quotas.
 *
 * The increment is atomic: `rate_limit_incr()` (a SECURITY DEFINER RPC) upserts
 * the bucket and increments within a single statement, so concurrent requests
 * can't lose-update the count and bypass the limit.
 *
 * Uses the admin client (service role) so the restrictive RLS policy on the
 * table doesn't interfere — this is server-only, never browser-reachable.
 */

const WINDOW_MS = 60 * 1000; // 1 minute

/**
 * Returns true if the key is allowed, false if it exceeded `limit` in the
 * window (or on any error — fail closed). Callers should 429 on false.
 */
export async function rateLimit(key: string, limit: number): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("rate_limit_incr", {
      p_key: key,
      p_limit: limit,
      p_window_ms: WINDOW_MS,
    });
    if (error) {
      console.error(`rateLimit(${key}) failed:`, error.message);
      return false;
    }
    return Boolean(data);
  } catch (e) {
    console.error("rateLimit error:", e instanceof Error ? e.message : e);
    return false;
  }
}
