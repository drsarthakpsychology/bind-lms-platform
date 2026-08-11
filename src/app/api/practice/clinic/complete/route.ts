import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { istToday } from "@/lib/practice/streaks";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * POST /api/practice/clinic/complete — record a Two-Minute Clinic daily
 * completion. Marks the day in the streaks table (the same table /today
 * reads), so the daily habit keeps the streak alive.
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`clinic:complete:${user.id}`, 30);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const today = istToday();

  const { data: existing } = await supabase
    .from("streaks")
    .select("id, current_streak, longest_streak, last_active_date")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const sameDay = existing.last_active_date === today;
    const wasYesterday = !sameDay && existing.last_active_date
      ? istToday(new Date(new Date(existing.last_active_date).getTime() + 86400000))
      : false;
    const nextStreak = sameDay
      ? existing.current_streak
      : wasYesterday
        ? existing.current_streak + 1
        : 1;
    const { error } = await supabase
      .from("streaks")
      .update({
        current_streak: nextStreak,
        longest_streak: Math.max(existing.longest_streak, nextStreak),
        last_active_date: today,
      })
      .eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, streak: nextStreak });
  }

  const { error } = await supabase.from("streaks").insert({
    user_id: user.id,
    current_streak: 1,
    longest_streak: 1,
    last_active_date: today,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, streak: 1 });
}
