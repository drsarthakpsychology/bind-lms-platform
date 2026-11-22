import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimitFast } from "@/lib/rate-limit-fast";
import { optedOut, parseFunnel } from "@/lib/funnel/rules";

export const runtime = "nodejs";

const NONE = () => new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });

/**
 * POST /api/funnel: one private step on the public site (page seen, a Request
 * button pressed, the form opened, started, sent or failed). Stores no
 * personal details. The IP is used only in memory, for a minute, to stop
 * floods; it is never saved. Always answers 204 so a visitor never sees an
 * error, including before 2026_11_22_funnel.sql has run.
 */
export async function POST(req: Request) {
  if (optedOut(req.headers)) return NONE();
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!rateLimitFast(`funnel:${ip}`, 60)) return NONE();

  const text = await req.text().catch(() => "");
  if (text.length > 2000) return NONE();
  let body: unknown = null;
  try {
    body = JSON.parse(text);
  } catch {
    return NONE();
  }
  const step = parseFunnel(body);
  if (!step) return NONE();
  if (!rateLimitFast(`funnel-visit:${step.visit}`, 40)) return NONE();

  try {
    await createAdminClient()
      .from("funnel_events")
      .insert({ visit: step.visit, event: step.event, path: step.path, detail: step.detail, ref_host: step.refHost })
      .abortSignal(AbortSignal.timeout(3000));
  } catch {
    /* table not created yet, or the database is slow: skip this step */
  }
  return NONE();
}
