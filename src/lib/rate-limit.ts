import "server-only";

import { createAdminClient } from "@/lib/supabase/server";

/**
 * Durable, project-wide fixed-window rate limiter.
 *
 * Backed by the `rate_limits` table (Postgres), so the limit holds across
 * serverless instances — unlike a per-process Map, which multiplied quotas.
 *
 * Semantics: a fixed window anchored to the first request in a bucket. Each
 * call reads the bucket; if the window has elapsed it resets the count to 1,
 * otherwise it increments and returns `true` while `count <= limit`.
 *
 * Uses the admin client (service role) so the restrictive RLS policy on the
 * table doesn't interfere — this is server-only, never browser-reachable.
 */

const WINDOW_MS = 60 * 1000; // 1 minute

/**
 * Returns true if the key is allowed, false if it exceeded `limit` in the
 * window. Callers should 429 on false.
 */
export async function rateLimit(key: string, limit: number): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const now = Date.now();

    // Fetch the bucket.
    const { data, error } = await admin
      .from("rate_limits")
      .select("count, reset_at")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      // Fail open if the DB is unreachable? No — fail CLOSED so a rate-limit
      // outage can't be used to bypass the limit. But a transient error here
      // would 500 every media request. Compromise: on error, deny (429) only
      // if the DB is actually down; log and allow a single retry. For the
      // media hot path we log and allow (see below).
      console.error(`rateLimit(${key}) read failed:`, error.message);
      return false;
    }

    // No bucket yet → create one (count=1) and allow.
    if (!data) {
      const { error: insErr } = await admin.from("rate_limits").insert({
        key,
        count: 1,
        reset_at: new Date(now + WINDOW_MS).toISOString(),
      });
      if (insErr) {
        console.error(`rateLimit(${key}) insert failed:`, insErr.message);
        return false;
      }
      return true;
    }

    // Window elapsed → reset to 1 and allow.
    const resetAt = new Date(data.reset_at).getTime();
    if (resetAt <= now) {
      const { error: updErr } = await admin
        .from("rate_limits")
        .update({ count: 1, reset_at: new Date(now + WINDOW_MS).toISOString() })
        .eq("key", key);
      if (updErr) {
        console.error(`rateLimit(${key}) reset failed:`, updErr.message);
        return false;
      }
      return true;
    }

    // Increment; allow while within limit.
    const next = (data.count ?? 0) + 1;
    if (next > limit) return false;
    const { error: incErr } = await admin
      .from("rate_limits")
      .update({ count: next })
      .eq("key", key);
    if (incErr) {
      console.error(`rateLimit(${key}) increment failed:`, incErr.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("rateLimit error:", e instanceof Error ? e.message : e);
    return false;
  }
}
