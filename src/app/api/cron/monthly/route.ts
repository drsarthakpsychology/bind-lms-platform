import { NextResponse } from "next/server";
import { runMonthlyJob } from "@/lib/leagues/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * GET /api/cron/monthly: Vercel Cron on the 1st of each month. Issues the
 * monthly merit certificates (top 3 of each cohort) and the champion titles
 * ("Cortex Champion · Nov 2026") for the month that just ended. Idempotent.
 * Needs `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const report = await runMonthlyJob(new Date());
    return NextResponse.json({ ok: report.errors.length === 0, ...report });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
