import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Zap, Mic2, Flame } from "lucide-react";

export const dynamic = "force-dynamic";

/**
 * /today — the front door (v5.1 Part B). One primary card (the single next
 * thing, with a reason), two chips (quick / deep), and a streak line.
 * Everything else lives behind "All practice".
 */
export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Streak (simplified: from the streaks table, else 0).
  const { data: streak } = await supabase
    .from("streaks")
    .select("current_streak")
    .eq("user_id", user.id)
    .maybeSingle();

  // An unfinished sim session → the recommended thing.
  const { data: activeSession } = await supabase
    .from("sim_sessions")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  const currentStreak = Number(streak?.current_streak ?? 0);

  const primary = activeSession
    ? {
        href: `/practice/consulting-room/session/${activeSession.id}`,
        title: "Resume your session",
        reason: "You have an unfinished consultation with a patient who's waiting.",
        badge: "In progress",
        time: "12 min",
        cta: "Resume",
      }
    : {
        href: "/practice/decode",
        title: "Presenting Complaint Decoder",
        reason: currentStreak >= 2
          ? "You're on a streak — keep the daily habit sharp."
          : "Start the day with the drill that changes how you hear patients.",
        badge: "Daily",
        time: "4 min",
        cta: "Decode",
      };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Today</p>
      <h1 className="mt-1 text-h1">
        {currentStreak > 0 ? `${currentStreak}-day streak. ` : ""}One thing next.
      </h1>

      {/* streak line */}
      <p className="mt-1 flex items-center gap-1.5 text-small text-muted-foreground">
        <Flame className="size-4 text-primary" aria-hidden />
        {currentStreak > 0
          ? `${currentStreak} days in a row — the practice is compounding.`
          : "Every day you practise, a future client is better served."}
      </p>

      {/* primary card */}
      <Link
        href={primary.href}
        className="mt-6 block rounded-md border-2 border-border bg-card p-6 hard-shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-px"
      >
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-primary px-2 py-0.5 text-caption font-semibold text-primary-foreground">
            {primary.badge}
          </span>
          <span className="text-caption text-muted-foreground">{primary.time}</span>
        </div>
        <p className="mt-3 text-h3 font-semibold">{primary.title}</p>
        <p className="mt-1 text-small text-muted-foreground">{primary.reason}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-small font-medium text-primary">
          {primary.cta} <ArrowRight className="size-4" aria-hidden />
        </span>
      </Link>

      {/* quick / deep chips */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          href="/practice/two-minute-clinic"
          className="flex items-center gap-3 rounded-md border-2 border-border bg-card p-4 transition-transform hover:-translate-y-0.5 active:translate-y-px"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-secondary text-primary">
            <Zap className="size-4" aria-hidden />
          </span>
          <span>
            <span className="block text-small font-semibold">Something quick</span>
            <span className="block text-caption text-muted-foreground">Two-Minute Clinic · 2 min</span>
          </span>
        </Link>
        <Link
          href="/practice/consulting-room"
          className="flex items-center gap-3 rounded-md border-2 border-border bg-card p-4 transition-transform hover:-translate-y-0.5 active:translate-y-px"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-secondary text-primary">
            <Mic2 className="size-4" aria-hidden />
          </span>
          <span>
            <span className="block text-small font-semibold">Something deep</span>
            <span className="block text-caption text-muted-foreground">Consulting Room · 12 min</span>
          </span>
        </Link>
      </div>

      <Link
        href="/practice"
        className="mt-6 inline-flex items-center gap-1 text-small font-medium text-primary hover:underline"
      >
        All practice tools <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  );
}
