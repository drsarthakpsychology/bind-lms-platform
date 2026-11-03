import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Crown, Flame, TrendingUp, Trophy } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { loadMyBoard, type StandingRow } from "@/lib/standing/board";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { LEVELS } from "@/lib/learn/engine";
import { POINTS, rankRows } from "@/lib/standing/score";
import { StandingCard } from "@/components/standing/standing-card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Rankings" };
export const dynamic = "force-dynamic";

/**
 * Rankings — where everyone in your cohort stands. The all-time board (level,
 * points, hours) and this week's board side by side, with the top three on a
 * podium. First name and initial only; everyone starts at Level 1.
 */
export default async function RankingsPage() {
  const session = await getSession();
  if (session.status !== "ok") return null;
  const userId = session.profile.id;
  const [{ rows }, cohorts] = await Promise.all([loadMyBoard(userId), loadMyCohorts(userId)]);
  const group = cohorts.length ? cohorts.map((c) => c.name).join(" & ") : "All students";

  // This week's board: same people, ranked by points earned this week.
  const weekly = rankRows(rows.map((r) => ({ ...r, points: r.weekXp }))).filter((r) => r.points > 0);
  const podium = rows.slice(0, 3);
  const myWeek = weekly.find((r) => r.userId === userId);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      <Link href="/practice" className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-semibold">
        <ArrowLeft className="size-4" aria-hidden /> Practice
      </Link>
      <header>
        <p className="text-eyebrow text-link">Rankings</p>
        <h1 className="text-h1">{group}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Everyone starts at Level 1. Points come from what you do — notes, games, lectures and time on VIBHA — not just being online.</p>
      </header>

      {/* Podium */}
      {podium.some((p) => p.points > 0) ? (
        <section aria-label="Top three" className="grid grid-cols-3 gap-2 sm:gap-4">
          {[1, 0, 2].map((slot) => {
            const r = podium[slot];
            if (!r) return <div key={slot} />;
            const tall = slot === 0;
            return (
              <div key={r.userId} className={cn("flex flex-col items-center justify-end", tall ? "" : "pt-6")}>
                <span className={cn("grid place-items-center rounded-full border-2 border-foreground font-pix", tall ? "size-16 bg-primary text-primary-foreground" : "size-12 bg-card")}>
                  {slot === 0 ? <Crown className="size-7" aria-hidden /> : <span className="text-lg font-bold">#{r.rank}</span>}
                </span>
                <span className="mt-1 max-w-full truncate text-center text-sm font-bold">{r.name}</span>
                <span className="text-caption text-muted-foreground">Lvl {r.level} · {r.points} pts</span>
                <span className={cn("mt-1 w-full rounded-t-xl border-2 border-b-0 border-foreground", tall ? "h-16 bg-primary" : "h-10 bg-muted")} aria-hidden />
              </div>
            );
          })}
        </section>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-6">
          {/* This week */}
          <section aria-label="This week">
            <h2 className="mb-2 flex items-center gap-2 text-h3 font-bold">
              <TrendingUp className="size-5 text-link" aria-hidden /> This week
            </h2>
            {weekly.length ? (
              <ol className="divide-y-2 divide-foreground/10 overflow-hidden rounded-2xl border-2 border-foreground bg-card">
                {weekly.slice(0, 15).map((r) => (
                  <Row key={r.userId} r={r} me={r.userId === userId} right={`${r.points} this week`} />
                ))}
                {myWeek && myWeek.rank > 15 ? <Row r={myWeek} me right={`${myWeek.points} this week`} /> : null}
              </ol>
            ) : (
              <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-5 text-sm text-muted-foreground">No points yet this week. Do a few notes or watch a lecture to get on the board.</p>
            )}
          </section>

          {/* All time */}
          <section aria-label="All time">
            <h2 className="mb-2 flex items-center gap-2 text-h3 font-bold">
              <Trophy className="size-5 text-link" aria-hidden /> All time
            </h2>
            <ol className="divide-y-2 divide-foreground/10 overflow-hidden rounded-2xl border-2 border-foreground bg-card">
              {rows.slice(0, 100).map((r) => (
                <Row key={r.userId} r={r} me={r.userId === userId} right={`${r.points} pts`} sub={`${r.hours} h on VIBHA`} />
              ))}
              {!rows.length ? <li className="px-4 py-6 text-sm text-muted-foreground">Nobody has started yet. Everyone is Level 1.</li> : null}
            </ol>
          </section>
        </div>

        <aside className="space-y-4">
          <StandingCard userId={userId} />
          <section className="rounded-2xl border-2 border-foreground bg-card p-4 text-sm">
            <h2 className="flex items-center gap-2 font-bold"><Clock className="size-4" aria-hidden /> How points work</h2>
            <ul className="mt-2 space-y-1.5 text-muted-foreground">
              <li>Notes, self-checks, tests and games: the XP you earn</li>
              <li>Lectures: {POINTS.perLectureMinute} point a minute watched, {POINTS.perLectureDone} for each one finished</li>
              <li>Time on VIBHA: {POINTS.perHour} points an hour</li>
            </ul>
            <h3 className="mt-3 flex items-center gap-2 font-bold"><Flame className="size-4" aria-hidden /> Levels</h3>
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

function Row({ r, me, right, sub }: { r: StandingRow; me: boolean; right: string; sub?: string }) {
  return (
    <li className={cn("flex items-center gap-3 px-4 py-3", me && "bg-primary text-primary-foreground")} aria-current={me ? "true" : undefined}>
      <span className="w-8 shrink-0 text-right text-sm font-bold tabular-nums">#{r.rank}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">
          {r.name}
          {me ? " (you)" : ""}
        </span>
        <span className={`block text-caption ${me ? "opacity-80" : "text-muted-foreground"}`}>Level {r.level} · {r.title}</span>
      </span>
      <span className="text-right text-sm tabular-nums">
        <span className="block font-bold">{right}</span>
        {sub ? <span className={`block text-caption ${me ? "opacity-80" : "text-muted-foreground"}`}>{sub}</span> : null}
      </span>
    </li>
  );
}
