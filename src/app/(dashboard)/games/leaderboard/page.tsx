import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Crown, Flame } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { getSession } from "@/lib/auth/session";
import { loadQuizBoard } from "@/lib/learn/leaderboard";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { BOARDS, scopeLine } from "@/lib/standing/boards";
import { BoardHeader, BoardSwitch } from "@/components/standing/board-switch";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: BOARDS.quiz.label };
export const dynamic = "force-dynamic";

/**
 * Quiz leaderboard: this week's quiz and game XP, your cohort only. Top 10
 * plus you and your neighbours. The overall board is one tap away.
 */
export default async function QuizLeaderboardPage() {
  await requireFeature("learn");
  const session = await getSession();
  if (session.status !== "ok") return null;
  const userId = session.profile.id;
  const [{ rows, myRank, total }, cohorts] = await Promise.all([loadQuizBoard(userId), loadMyCohorts(userId).catch(() => [])]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/games" className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-semibold">
          <ArrowLeft className="size-4" aria-hidden /> Games
        </Link>
        <BoardSwitch active="quiz" />
      </div>

      <BoardHeader board="quiz" scope={scopeLine(cohorts.map((c) => c.name))} />

      <section aria-label={BOARDS.quiz.label}>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-caption text-muted-foreground">Last 7 days. Starts fresh every week.</p>
          {myRank ? (
            <p className="shrink-0 text-sm font-bold tabular-nums">
              You: #{myRank} of {total}
            </p>
          ) : null}
        </div>
        <ol className="overflow-hidden rounded-2xl border-2 border-foreground bg-card">
          {rows.length ? (
            rows.map((r) => (
              <li
                key={`${r.rank}-${r.name}`}
                aria-current={r.me ? "true" : undefined}
                className={cn("flex items-center gap-3 border-b-2 border-foreground/10 px-4 py-2.5 last:border-b-0", r.me && "bg-primary text-primary-foreground")}
              >
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-full border-2 border-foreground font-pix text-xs", r.rank === 1 ? "bg-brand text-brand-foreground" : "bg-background text-foreground")}>
                  {r.rank === 1 ? <Crown className="size-4" aria-label="First" /> : r.rank}
                </span>
                <span className="min-w-0 flex-1 truncate font-bold">
                  {r.name}
                  {r.me ? " (you)" : ""}
                </span>
                <span className="flex items-center gap-1 text-caption" title="Day streak">
                  <Flame className="size-3.5" aria-hidden /> {r.streak}
                  <span className="sr-only">day streak</span>
                </span>
                <span className="w-20 text-right font-pix text-xs tabular-nums">{r.weekXp} XP</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">No one has played yet this week. First place is yours to take.</li>
          )}
        </ol>
      </section>

      <Link href={BOARDS.overall.href} className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-foreground p-4">
        <span className="min-w-0 flex-1">
          <span className="block font-bold">{BOARDS.overall.label}</span>
          <span className="text-sm text-muted-foreground">{BOARDS.overall.explainer} All time.</span>
        </span>
        <ArrowRight className="size-5 shrink-0" aria-hidden />
      </Link>
    </div>
  );
}
