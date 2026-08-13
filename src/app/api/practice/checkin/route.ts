import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const checkinSchema = z.object({
  workload: z.number().int().min(1).max(5),
  energy: z.number().int().min(1).max(5),
  preparedness: z.number().int().min(1).max(5),
  freeLine: z.string().max(500).optional(),
  weekLabel: z.string().min(1).max(40),
});

/**
 * POST /api/practice/checkin — save a weekly non-clinical check-in.
 * Owner-write RLS. Admin reads ONLY the aggregate view (no identifiers).
 * 30 seconds, that's it.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`checkin:${user.id}`, 10);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = checkinSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { data, error } = await supabase
    .from("checkins")
    .insert({
      user_id: user.id,
      workload: parsed.data.workload,
      energy: parsed.data.energy,
      preparedness: parsed.data.preparedness,
      free_line: parsed.data.freeLine,
      week_label: parsed.data.weekLabel,
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id });
}
