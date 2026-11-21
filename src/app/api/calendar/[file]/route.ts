import { calendarFeed, userOfToken } from "@/lib/clinic/calendar";
import { clinicDb } from "@/lib/clinic/db";
import { rateLimitFast } from "@/lib/rate-limit-fast";
import { ApiFail } from "@/lib/app-api/respond";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const plain = (status: number, text: string) => new Response(text, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });

/**
 * GET /api/calendar/<token>.ics: a student's schedule as a calendar file, for
 * Google Calendar and Apple Calendar to subscribe to. No sign-in: the secret
 * token in the link is the key (src/lib/clinic/calendar.ts). An unknown or
 * replaced token answers 404, the same as a wrong address.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }): Promise<Response> {
  const { file } = await ctx.params;
  const token = decodeURIComponent(file ?? "").replace(/\.ics$/i, "");
  if (!rateLimitFast(`cal:${token.slice(0, 16)}`, 30)) return plain(429, "Too many requests.");
  try {
    const db = clinicDb();
    const userId = await userOfToken(db, token);
    if (!userId) return plain(404, "This calendar link is not valid. Get a new one from the Schedule page.");
    const body = await calendarFeed(db, userId, Date.now());
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="vibha-schedule.ics"',
        // Private: the link is personal. Short, so a moved session shows soon.
        "Cache-Control": "private, max-age=300",
        "X-Robots-Tag": "noindex",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch (e) {
    if (e instanceof ApiFail && e.code === "unavailable") return plain(503, "Not switched on yet.");
    console.error("calendar feed failed:", e instanceof Error ? e.message : e);
    return plain(500, "Could not make the calendar right now.");
  }
}
