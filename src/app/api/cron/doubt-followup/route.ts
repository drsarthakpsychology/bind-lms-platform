import { NextResponse } from "next/server";
import { runDoubtFollowups } from "./followup";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Daily (vercel.json "crons"): give recent doubt answers their in-app notice,
 * and send the ONE follow-up email for notices still unopened after 48 hours.
 * Vercel Cron calls this with `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const report = await runDoubtFollowups();
  return NextResponse.json(report);
}
