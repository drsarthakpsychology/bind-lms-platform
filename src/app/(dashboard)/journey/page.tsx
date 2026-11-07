import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, Flame, GraduationCap, PlayCircle, Sparkles, Target, Trophy } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server";
import { loadMyBoard } from "@/lib/standing/board";
import { normalise, levelFor, liveStreak } from "@/lib/learn/engine";
import { istToday } from "@/lib/practice/streaks";
import { hoursOf } from "@/lib/standing/score";
import { BOARDS } from "@/lib/standing/boards";

export const metadata: Metadata = { title: "My journey" };
export const dynamic = "force-dynamic";

/**
 * My journey: the student's own numbers in one place: hours on VIBHA, time
 * in lectures, lectures finished, their level and rank, notes and games
 * progress, and practice done. All real, blank when there's nothing yet.
 */
export default async function JourneyPage() {
  const session = await getSession();
  if (session.status !== "ok") return null;
  const userId = session.profile.id;
  const admin = createAdminClient();

  const [board, { data: learnRow }, { data: lessons }, practice] = await Promise.all([
    loadMyBoard(userId).catch(() => ({ rows: [], me: null })),
    admin.from("learn_progress").select("state").eq("user_id", userId).maybeSingle(),
    admin.from("progress").select("watched_seconds, is_completed").eq("user_id", userId).limit(2000),
    Promise.all([
      admin.from("sim_sessions").select("id", { count: "exact", head: true }).eq("user_id", userId),
      admin.from("sct_attempts").select("id", { count: "exact", head: true }).eq("user_id", userId),
      admin.from("mse_attempts").select("id", { count: "exact", head: true }).eq("user_id", userId),
      admin.from("osce_attempts").select("id", { count: "exact", head: true }).eq("user_id", userId),
      admin.from("formulation_attempts").select("id", { count: "exact", head: true }).eq("user_id", userId),
    ]),
  ]);

  const me = board.me;
  const st = learnRow?.state ? normalise(learnRow.state) : null;
  const level = me?.level ?? (st ? levelFor(st.xp).level : 1);
  const title = me?.title ?? (st ? levelFor(st.xp).title : "Curious Mind");
  const pct = me?.pct ?? (st ? levelFor(st.xp).pct : 0);
  const streak = st ? liveStreak(st.streak, istToday()) : 0;
  const accuracy = st && st.answered ? Math.round((st.correct / st.answered) * 100) : null;

  const watchedSeconds = (lessons ?? []).reduce((a, l) => a + (l.watched_seconds ?? 0), 0);
  const lecturesDone = (lessons ?? []).filter((l) => l.is_completed).length;
  const lecturesStarted = (lessons ?? []).filter((l) => (l.watched_seconds ?? 0) > 0).length;
  const practiceCount = practice.reduce((a, r) => a + (r.count ?? 0), 0);

  const hoursOnline = me?.hours ?? 0;
  const lectureHours = me?.lectureHours ?? hoursOf(watchedSeconds);

  const stats: { icon: React.ReactNode; label: string; value: string; sub?: string }[] = [
    { icon: <Clock className="size-5" aria-hidden />, label: "Time on VIBHA", value: `${hoursOnline} h`, sub: "all your time here" },
    { icon: <PlayCircle className="size-5" aria-hidden />, label: "In lectures", value: `${lectureHours} h`, sub: `${lecturesStarted} started` },
    { icon: <GraduationCap className="size-5" aria-hidden />, label: "Lectures finished", value: String(lecturesDone) },
    { icon: <Flame className="size-5" aria-hidden />, label: "Day streak", value: streak ? `${streak} 🔥` : "None yet", sub: "days in a row" },
    { icon: <BookOpen className="size-5" aria-hidden />, label: "Quiz points", value: st ? String(st.xp) : "0", sub: accuracy !== null ? `${accuracy}% right` : undefined },
    { icon: <Target className="size-5" aria-hidden />, label: "Practice done", value: String(practiceCount), sub: "sessions and drills" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
      <header>
        <p className="text-eyebrow text-link">My journey</p>
        <h1 className="text-h1">How far you&apos;ve come</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everything you&apos;ve done on VIBHA, in one place. The more you learn, the more this fills up.</p>
      </header>

      {/* Level banner */}
      <section className="rounded-3xl border-2 border-foreground bg-brand p-5 text-brand-foreground sm:p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl border-2 border-foreground bg-primary text-primary-foreground">
            <span className="text-center leading-none">
              <span className="block text-[0.6rem] font-semibold uppercase tracking-wide">Level</span>
              <span className="block text-3xl font-black tabular-nums">{level}</span>
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-sm font-semibold opacity-90">
              <Sparkles className="size-4" aria-hidden /> {title}
            </p>
            {me ? <p className="text-sm opacity-90">{me.points} points{me.rank ? ` · #${me.rank} on the overall leaderboard` : ""}</p> : null}
            <div className="mt-2 h-2.5 overflow-hidden rounded-full border-2 border-foreground bg-card/40">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(pct * 100)}%` }} aria-hidden />
            </div>
          </div>
        </div>
        <Link href={BOARDS.overall.href} className="mt-4 inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-4 py-1.5 text-sm font-bold text-foreground">
          <Trophy className="size-4" aria-hidden /> {BOARDS.overall.label}
        </Link>
      </section>

      {/* Numbers */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border-2 border-foreground bg-card p-4">
            <span className="flex items-center gap-2 text-muted-foreground">{s.icon}</span>
            <p className="mt-2 text-2xl font-black tabular-nums">{s.value}</p>
            <p className="text-sm font-semibold">{s.label}</p>
            {s.sub ? <p className="text-caption text-muted-foreground">{s.sub}</p> : null}
          </div>
        ))}
      </section>

      <p className="text-caption text-muted-foreground">Your numbers are private to you and your faculty.</p>
    </div>
  );
}
