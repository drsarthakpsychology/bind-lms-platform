import { NextResponse } from "next/server";
import { runStandingJob } from "@/lib/leagues/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * GET /api/cron/standing — Vercel Cron, Monday and Thursday 13:30 UTC
 * (19:00 IST). On Mondays it closes last week's leagues first. Then it saves
 * points, sends each student one short standing update, snapshots ranks and
 * awards milestones. Idempotent. Needs `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const report = await runStandingJob(new Date());
    return NextResponse.json({ ok: report.errors.length === 0, ...report });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
