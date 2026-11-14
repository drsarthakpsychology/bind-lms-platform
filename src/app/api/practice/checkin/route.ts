import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStudentApi } from "@/lib/auth/api-guard";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { leagueWeek } from "@/lib/leagues/week";

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
  const supabase = await createClient();
  const access = await requireStudentApi({ path: "/record", flag: "checkin" });
  if (!access.ok) return access.response;
  const profile = access.profile;
  const user = profile;

  const allowed = await rateLimit(`checkin:${user.id}`, 10);
  if (!allowed) return NextResponse.json({ error: "Wait a minute and try again." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = checkinSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  // Upsert so a re-submit within the same week (or a double-click) updates the
  // same row instead of inserting a duplicate that skews the cohort aggregate
  // (unique index checkins_user_week_unique backs this).
  const { data, error } = await supabase
    .from("checkins")
    .upsert(
      {
        user_id: user.id,
        workload: parsed.data.workload,
        energy: parsed.data.energy,
        preparedness: parsed.data.preparedness,
        free_line: parsed.data.freeLine,
        week_label: leagueWeek(),
      },
      { onConflict: "user_id,week_label" },
    )
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: "Could not save. Please try again." }, { status: 500 });

  return NextResponse.json({ id: data.id });
}
