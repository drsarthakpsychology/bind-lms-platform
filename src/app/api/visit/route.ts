import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const schema = z.object({
  path: z.string().min(1).max(300).startsWith("/"),
  enteredAt: z.string().datetime(),
  seconds: z.number().int().min(0).max(1800),
});

/**
 * POST /api/visit: one slice of time on one page (sent every 2 minutes while
 * the tab is open, and when the student leaves the page). Feeds hours on
 * VIBHA, the admin Activity page and "Active now". Students only.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (session.status !== "ok") return new NextResponse(null, { status: 204 });
  if (session.profile.role !== "student") return new NextResponse(null, { status: 204 });

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
  // Reject clocks far in the future or slices older than a day.
  if (entered > Date.now() + 60_000 || entered < Date.now() - 86400000) return new NextResponse(null, { status: 400 });

  await createAdminClient()
    .from("page_visits")
    .insert({
      user_id: session.profile.id,
      path: path.split("?")[0],
      entered_at: new Date(entered).toISOString(),
      left_at: new Date(entered + seconds * 1000).toISOString(),
      duration_seconds: seconds,
    });
  return new NextResponse(null, { status: 204 });
}
