import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Internal cron endpoint (Part 3.4) — hit by GitHub Actions with a
 * CRON_SECRET bearer token. Never leave this open: it must 401 without the
 * token, and it only performs idempotent maintenance (no data mutation of
 * student content).
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  if (!expected || auth !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const task = new URL(req.url).searchParams.get("task");

  switch (task) {
    case "keepalive": {
      // A trivial read to keep the free Postgres instance from the 7-day pause.
      return NextResponse.json({ ok: true, task, at: new Date().toISOString() });
    }
    case "prune-logs": {
      // Retention: drop ai_usage_log + provider_health rows older than 30 days.
      // Use the service role client (server-side only).
      const { createAdminClient } = await import("@/lib/supabase/server");
      const admin = createAdminClient();
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { error: usageErr, count } = await admin
        .from("ai_usage_log")
        .delete()
        .lt("created_at", cutoff);
      const { error: healthErr } = await admin
        .from("provider_health")
        .delete()
        .lt("updated_at", cutoff);
      if (usageErr || healthErr) {
        return NextResponse.json({ ok: false, error: usageErr?.message ?? healthErr?.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true, task, pruned_usage: count ?? 0 });
    }
    case "infra-snapshot": {
      // Write a daily usage snapshot for /admin/infra history.
      const { createAdminClient } = await import("@/lib/supabase/server");
      const admin = createAdminClient();
      const { data } = await admin.rpc("infra_metrics");
      const { error } = await admin.from("infra_snapshots").insert({ snapshot: data ?? {} });
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, task, written: true });
    }
    case "send-reminders": {
      // TODO(provider): daily digest via Resend when a template + key exist.
      // Honest stub — the cron fires, records that it isn't configured, and
      // does not pretend to send mail.
      const { createAdminClient } = await import("@/lib/supabase/server");
      const admin = createAdminClient();
      await admin.from("ai_usage_log").insert({
        workload: "cron",
        provider: "reminders",
        tokens_in: 0,
        tokens_out: 0,
        status: "error",
      });
      return NextResponse.json({ ok: true, task, status: "not_configured" });
    }
    default:
      return NextResponse.json({ error: "unknown task" }, { status: 400 });
  }
}
