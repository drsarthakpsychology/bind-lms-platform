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
      // Write a daily usage snapshot for /admin/infra history + prune to the
      // last 90 rows so the table can't grow unbounded (free-tier discipline).
      const { createAdminClient } = await import("@/lib/supabase/server");
      const admin = createAdminClient();
      const { data } = await admin.rpc("infra_metrics");
      const { error } = await admin.from("infra_snapshots").insert({ snapshot: data ?? {} });
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      const { data: older } = await admin
        .from("infra_snapshots")
        .select("id")
        .order("taken_at", { ascending: false })
        .range(90, 10000);
      if (older && older.length > 0) {
        await admin.from("infra_snapshots").delete().in("id", older.map((r) => r.id));
      }
      return NextResponse.json({ ok: true, task, written: true, pruned: older?.length ?? 0 });
    }
    case "alumni-transition": {
      // A10: on cohort end, flip students to alumni for permanent read-only
      // access. Idempotent — only touches rows with cohort_ended_at <= now.
      const { createAdminClient } = await import("@/lib/supabase/server");
      const admin = createAdminClient();
      const now = new Date().toISOString();
      const { data, error } = await admin
        .from("profiles")
        .update({ role: "alumni" })
        .eq("role", "student")
        .lte("cohort_ended_at", now);
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, task, transitioned: (data ?? []).length });
    }
        case "release-scheduled": {
      // A2 scheduled release: flip any scheduled module whose release_at has
      // arrived to published (the GitHub Actions cron runs this daily).
      const { createAdminClient } = await import("@/lib/supabase/server");
      const admin = createAdminClient();
      const now = new Date().toISOString();
      const { data, error } = await admin
        .from("modules")
        .update({ state: "published", release_at: null })
        .eq("state", "scheduled")
        .lte("release_at", now);
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, task, released: (data ?? []).length });
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
