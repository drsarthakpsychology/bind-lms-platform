import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * GET /api/health
 *
 * Lightweight, unauthenticated health check. Returns JSON with the status of
 * each dependency (database, storage) WITHOUT leaking sensitive detail — no
 * connection strings, no env values, no stack traces.
 *
 * Used by the uptime cron (keeps the Supabase free project from pausing and
 * alerts on outages).
 */

/** Each dependency check is bounded — a hung Supabase call must not hang the
 *  health endpoint itself (that would defeat uptime monitoring). */
const CHECK_TIMEOUT_MS = 4_000;

function withTimeout<T>(p: PromiseLike<T>): Promise<T> {
  return Promise.race([
    Promise.resolve(p),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("dependency check timed out")), CHECK_TIMEOUT_MS),
    ),
  ]);
}

export async function GET() {
  const checks: Record<string, "ok" | "error"> = {};

  // Database reachability.
  try {
    const supabase = createAdminClient();
    const { error } = await withTimeout(supabase.from("profiles").select("id").limit(1));
    checks.database = !error ? "ok" : "error";
  } catch {
    checks.database = "error";
  }

  // Storage reachability (media provider).
  try {
    const supabase = createAdminClient();
    const { data } = await withTimeout(supabase.storage.from("videos").list("", { limit: 1 }));
    checks.storage = Array.isArray(data) ? "ok" : "error";
  } catch {
    checks.storage = "error";
  }

  const allOk = Object.values(checks).every((s) => s === "ok");
  return NextResponse.json(
    { status: allOk ? "ok" : "degraded", checks, ts: new Date().toISOString() },
    { status: allOk ? 200 : 503 },
  );
}
