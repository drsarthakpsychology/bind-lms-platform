import type { Metadata } from "next";
import { ArrowRight, Clock, Crown, Flame } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { loadMyBoard, type StandingRow } from "@/lib/standing/board";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { LEVELS } from "@/lib/learn/engine";
import { POINTS } from "@/lib/standing/score";
import { BOARDS, scopeLine } from "@/lib/standing/boards";
import { StandingCard } from "@/components/standing/standing-card";
import { BoardHeader, BoardSwitch } from "@/components/standing/board-switch";
import { cn } from "@/lib/utils";
import { leaveWithoutSession } from "@/lib/auth/session-redirect";

export const metadata: Metadata = { title: BOARDS.overall.label };
export const dynamic = "force-dynamic";

const SHOWN = 100;

/**
 * Overall leaderboard (/leaderboard/overall): level points from lectures,
 * quizzes and time on VIBHA,
 * all time, your cohort only. Top three on a podium. First name and initial
 * only; everyone starts at Level 1. The weekly quiz board is one tap away.
 */
export default async function OverallLeaderboardPage() {
  const session = await getSession();
  if (session.status !== "ok") return leaveWithoutSession(session);
  const userId = session.profile.id;
  const [{ rows, me }, cohorts] = await Promise.all([loadMyBoard(userId), loadMyCohorts(userId)]);
  const podium = rows.slice(0, 3);
  const meBelow = me && rows.findIndex((r) => r.userId === userId) >= SHOWN ? me : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BoardSwitch active="overall" />
      <BoardHeader board="overall" scope={scopeLine(cohorts.map((c) => c.name))} />

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
        <section aria-label={BOARDS.overall.label} className="min-w-0">
          <ol className="divide-y-2 divide-foreground/10 overflow-hidden rounded-2xl border-2 border-foreground bg-card">
            {rows.slice(0, SHOWN).map((r) => (
              <Row key={r.userId} r={r} me={r.userId === userId} />
            ))}
            {meBelow ? <Row r={meBelow} me /> : null}
            {!rows.length ? <li className="px-4 py-6 text-sm text-muted-foreground">Nobody has started yet. Everyone is Level 1.</li> : null}
          </ol>
        </section>

        <aside className="space-y-4">
          <StandingCard userId={userId} linked={false} />
          <section className="rounded-2xl border-2 border-foreground bg-card p-4 text-sm">
            <h2 className="flex items-center gap-2 font-bold"><Clock className="size-4" aria-hidden /> What counts</h2>
            <ul className="mt-2 space-y-1.5 text-muted-foreground">
              <li>Quizzes, games and notes checks: the XP you earn</li>
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
          <Link href={BOARDS.quiz.href} className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-foreground p-4">
            <span className="min-w-0 flex-1">
              <span className="block font-bold">{BOARDS.quiz.label}</span>
              <span className="text-sm text-muted-foreground">{BOARDS.quiz.explainer} This week.</span>
            </span>
            <ArrowRight className="size-5 shrink-0" aria-hidden />
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ r, me }: { r: StandingRow; me: boolean }) {
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
        <span className="block font-bold">{r.points} pts</span>
        <span className={`block text-caption ${me ? "opacity-80" : "text-muted-foreground"}`}>{r.hours} h on VIBHA</span>
      </span>
    </li>
  );
}
