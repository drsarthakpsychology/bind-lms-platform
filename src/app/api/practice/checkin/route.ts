import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStudentApi } from "@/lib/auth/api-guard";
import { createAdminClient } from "@/lib/supabase/server";
import { istWeekMonday } from "@/lib/practice/streaks";
import { withRetry } from "@/lib/save/retry";
import { rateLimitWrite } from "@/lib/rate-limit";

export const runtime = "nodejs";

const checkinSchema = z.object({
  workload: z.number().int().min(1).max(5),
  energy: z.number().int().min(1).max(5),
  preparedness: z.number().int().min(1).max(5),
  freeLine: z.string().max(500).optional(),
  /** Ignored: the week is the server's India week (a tab left open over Sunday midnight sent last week's). */
  weekLabel: z.string().max(40).optional(),
});

/**
 * POST /api/practice/checkin: save a weekly non-clinical check-in.
 * Owner-write RLS. Admin reads ONLY the aggregate view (no identifiers).
 * 30 seconds, that's it.
 */
export async function POST(req: Request) {
  const access = await requireStudentApi({ path: "/record", flag: "checkin" });
  if (!access.ok) return access.response;
  const profile = access.profile;
  const user = profile;

  const allowed = await rateLimitWrite(`checkin:${user.id}`, 10);
  if (!allowed) return NextResponse.json({ error: "Wait a minute and try again." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = checkinSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  // Upsert so a re-submit within the same week (or a double-click) updates the
  // same row instead of inserting a duplicate that skews the cohort aggregate
  // (unique index checkins_user_week_unique backs this).
  //
  // Written with the service role: checkins has no UPDATE policy for students,
  // so the second save in a week (the upsert's update half) was refused by row
  // level security. The user id comes from the verified session. The week is
  // the current India-time week, worked out here, not taken from the page.
  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json({ error: "Couldn't save. Try again." }, { status: 503 });
  }
  const { data, error } = await withRetry(() =>
    admin
      .from("checkins")
      .upsert(
        {
          user_id: user.id,
          workload: parsed.data.workload,
          energy: parsed.data.energy,
          preparedness: parsed.data.preparedness,
          free_line: parsed.data.freeLine ?? null,
          week_label: istWeekMonday(),
        },
        { onConflict: "user_id,week_label" },
      )
      .select("id")
      .single(),
  );
  if (error) {
    console.error("checkin: write failed:", error.code, error.message);
    return NextResponse.json({ error: "Couldn't save. Try again." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
