import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { loadMyBoard } from "@/lib/standing/board";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { LEVELS } from "@/lib/learn/engine";
import { POINTS } from "@/lib/standing/score";
import { StandingCard } from "@/components/standing/standing-card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Levels and hours" };
export const dynamic = "force-dynamic";

/**
 * The cohort board: everyone's level, points and hours, first name and
 * initial only. With nobody started, everyone shows Level 1.
 */
export default async function LeaderboardPage() {
  const session = await getSession();
  if (session.status !== "ok") return null;
  const userId = session.profile.id;
  const [{ rows }, cohorts] = await Promise.all([loadMyBoard(userId), loadMyCohorts(userId)]);
  const group = cohorts.length ? cohorts.map((c) => c.name).join(" & ") : "All students";

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <Link href="/practice" className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-semibold">
        <ArrowLeft className="size-4" aria-hidden /> Practice
      </Link>
      <header>
        <p className="text-eyebrow text-link">Levels and hours</p>
        <h1 className="text-h1">{group}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everyone starts at Level 1. Points come from what you do, not just time online.</p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section aria-label="The board" className="min-w-0">
          <ol className="divide-y-2 divide-foreground/10 overflow-hidden rounded-2xl border-2 border-foreground bg-card">
            {rows.slice(0, 100).map((r) => {
              const me = r.userId === userId;
              return (
                <li key={r.userId} className={cn("flex items-center gap-3 px-4 py-3", me && "bg-primary text-primary-foreground")} aria-current={me ? "true" : undefined}>
                  <span className="w-8 shrink-0 text-right text-sm font-bold tabular-nums">#{r.rank}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">
                      {r.name}
                      {me ? " (you)" : ""}
                    </span>
                    <span className={cn("block text-caption", me ? "opacity-80" : "text-muted-foreground")}>
                      Level {r.level} · {r.title}
                    </span>
                  </span>
                  <span className="text-right text-sm tabular-nums">
                    <span className="block font-bold">{r.points} pts</span>
                    <span className={cn("block text-caption", me ? "opacity-80" : "text-muted-foreground")}>{r.hours} h on VIBHA</span>
                  </span>
                </li>
              );
            })}
            {!rows.length ? <li className="px-4 py-6 text-sm text-muted-foreground">Nobody has started yet. Everyone is Level 1.</li> : null}
          </ol>
        </section>

        <aside className="space-y-4">
          <StandingCard userId={userId} />
          <section className="rounded-2xl border-2 border-foreground bg-card p-4 text-sm">
            <h2 className="font-bold">How points work</h2>
            <ul className="mt-2 space-y-1.5 text-muted-foreground">
              <li>Notes, self-checks, tests and games: the XP you earn</li>
              <li>Lectures: {POINTS.perLectureMinute} point a minute watched, {POINTS.perLectureDone} for each one finished</li>
              <li>Time on VIBHA: {POINTS.perHour} points an hour</li>
            </ul>
            <h3 className="mt-3 font-bold">Levels</h3>
            <ol className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-caption text-muted-foreground">
              {LEVELS.map((l, i) => (
                <li key={l.title}>
                  {i + 1}. {l.title} <span className="tabular-nums">({l.at})</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}
