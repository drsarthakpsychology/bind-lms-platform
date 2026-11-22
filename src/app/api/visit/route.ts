import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimitResult } from "@/lib/rate-limit";
import { clampToNow, trimOverlap } from "@/lib/analytics/visit-slice";

export const runtime = "nodejs";
// A visit slice is small: never hold the request for minutes.
export const maxDuration = 15;

const schema = z.object({
  path: z.string().min(1).max(300).startsWith("/"),
  enteredAt: z.string().datetime(),
  seconds: z.number().int().min(0).max(1800),
});

/** Slices a real browser sends: one every 2 minutes per tab, plus one per page change. */
const SLICES_PER_MINUTE = 12;

const done = () => new NextResponse(null, { status: 204 });

/**
 * POST /api/visit: one slice of time on one page (sent every 2 minutes while
 * the tab is open, and when the student leaves the page). Feeds hours on
 * VIBHA, the admin Activity page and "Active now". Students only.
 *
 * Honest hours: rate limited per student, a slice cannot end in the future,
 * and time already stored (another tab, a replay) is trimmed off, so the
 * same minute never counts twice.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (session.status !== "ok") return done();
  if (session.profile.role !== "student") return done();

  const text = await req.text().catch(() => "");
  let body: unknown = null;
  try {
    body = JSON.parse(text);
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 400 });

  const { path, enteredAt, seconds } = parsed.data;
  const entered = new Date(enteredAt).getTime();
  const now = Date.now();
  // Reject clocks far in the future or slices older than a day.
  if (entered > now + 60_000 || entered < now - 86400000) return new NextResponse(null, { status: 400 });

  const userId = session.profile.id;
  if ((await rateLimitResult(`visit:${userId}`, SLICES_PER_MINUTE)) === "limited") return new NextResponse(null, { status: 429 });

  let slice = clampToNow({ enteredMs: entered, seconds }, now);
  if (!slice) return done();

  try {
    const db = createAdminClient();
    const startIso = new Date(slice.enteredMs).toISOString();
    const endIso = new Date(slice.enteredMs + slice.seconds * 1000).toISOString();
    const { data: overlaps, error: readErr } = await db
      .from("page_visits")
      .select("left_at")
      .eq("user_id", userId)
      .lt("entered_at", endIso)
      // A stored slice is at most 30 minutes long, so this bounds the index scan.
      .gte("entered_at", new Date(slice.enteredMs - 1800_000).toISOString())
      .gt("left_at", startIso)
      .order("left_at", { ascending: false })
      .limit(1);
    if (readErr) {
      console.error("visit overlap read:", readErr.message);
      return done();
    }
    slice = trimOverlap(slice, (overlaps ?? []).map((r: { left_at: string | null }) => (r.left_at ? Date.parse(r.left_at) : 0)));
    if (!slice) return done();

    const { error } = await db.from("page_visits").insert({
      user_id: userId,
      path: path.split("?")[0],
      entered_at: new Date(slice.enteredMs).toISOString(),
      left_at: new Date(slice.enteredMs + slice.seconds * 1000).toISOString(),
      duration_seconds: slice.seconds,
    });
    if (error) console.error("visit insert:", error.message);
  } catch (e) {
    console.error("visit:", e instanceof Error ? e.message : e);
  }
  return done();
}
