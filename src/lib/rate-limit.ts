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
 * `windowMs` defaults to one minute.
 */
export async function rateLimit(key: string, limit: number, windowMs: number = WINDOW_MS): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("rate_limit_incr", {
      p_key: key,
      p_limit: limit,
      p_window_ms: windowMs,
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

/**
 * Like rateLimit, but says WHY a request isn't allowed: "limited" (really over
 * the limit) vs "unavailable" (the counter couldn't be read — e.g. a database
 * without the rate_limits step). Login uses this so a counter outage never
 * shows people "Too many attempts" when they've made one attempt.
 */
export async function rateLimitResult(key: string, limit: number, windowMs: number = WINDOW_MS): Promise<"allowed" | "limited" | "unavailable"> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("rate_limit_incr", { p_key: key, p_limit: limit, p_window_ms: windowMs });
    if (error) {
      console.error(`rateLimitResult(${key}) unavailable:`, error.message);
      return "unavailable";
    }
    return data ? "allowed" : "limited";
  } catch (e) {
    console.error("rateLimitResult error:", e instanceof Error ? e.message : e);
    return "unavailable";
  }
}
