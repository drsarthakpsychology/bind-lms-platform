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
export async function GET() {
  const checks: Record<string, "ok" | "error"> = {};

  // Database reachability.
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("profiles").select("id").limit(1);
    checks.database = !error ? "ok" : "error";
  } catch {
    checks.database = "error";
  }

  // Storage reachability (media provider).
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.storage.from("videos").list("", { limit: 1 });
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
