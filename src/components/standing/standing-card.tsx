import Link from "next/link";
import { ArrowRight, Clock, PlayCircle, Trophy } from "lucide-react";
import { loadMyBoard } from "@/lib/standing/board";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { BOARDS } from "@/lib/standing/boards";

/**
 * "Your level": one compact card on Home (and beside the overall leaderboard).
 * Level and points come from quizzes and games, lectures watched and time on
 * VIBHA (see lib/standing/score.ts). Everyone starts at Level 1. The rank is
 * the overall leaderboard rank; the card opens that board.
 */
export async function StandingCard({ userId, linked = true }: { userId: string; linked?: boolean }) {
  let board: Awaited<ReturnType<typeof loadMyBoard>>;
  try {
    board = await loadMyBoard(userId);
  } catch {
    return null;
  }
  const cohorts = await loadMyCohorts(userId);
  const me = board.me;
  const level = me?.level ?? 1;
  const title = me?.title ?? "Curious Mind";
  const pct = me?.pct ?? 0;
  const group = cohorts.length ? cohorts.map((c) => c.name).join(" & ") : "everyone";

  const body = (
    <>
      <div className="flex items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-foreground bg-brand text-brand-foreground">
          <span className="text-center leading-none">
            <span className="block text-[0.6rem] font-semibold uppercase tracking-wide">Level</span>
            <span className="block text-2xl font-black tabular-nums">{level}</span>
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-link">Your level{cohorts.length ? ` · ${group}` : ""}</span>
          <span className="block text-lg font-bold leading-tight">{title}</span>
          <span className="mt-2 block h-2 overflow-hidden rounded-full border-2 border-foreground bg-background" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to the next level">
            <span className="block h-full bg-primary" style={{ width: `${pct}%` }} />
          </span>
          <span className="mt-1 block text-caption text-muted-foreground">
            {me?.nextTitle ? `${me.toNext} points to ${me.nextTitle}` : me ? "Top level reached" : "100 points to Observer"}
          </span>
        </span>
        {linked ? <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden /> : null}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { icon: Clock, v: `${me?.hours ?? 0} h`, l: "on VIBHA" },
          { icon: PlayCircle, v: `${me?.lectureHours ?? 0} h`, l: "lectures" },
          { icon: Trophy, v: me ? `#${me.rank}` : "-", l: `of ${board.rows.length || 1} overall` },
        ].map(({ icon: Icon, v, l }) => (
          <div key={l} className="rounded-xl bg-background px-2 py-2">
            <dt className="sr-only">{l}</dt>
            <dd>
              <span className="flex items-center justify-center gap-1 whitespace-nowrap text-[0.95rem] font-bold tabular-nums">
                <Icon className="size-3.5 shrink-0" aria-hidden /> {v}
              </span>
              <span className="text-caption text-muted-foreground">{l}</span>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
  if (!linked) return <div className="rounded-3xl border-2 border-foreground bg-card p-5">{body}</div>;
  return (
    <Link
      href={BOARDS.overall.href}
      className="group block rounded-3xl border-2 border-foreground bg-card p-5 transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
      aria-label={`Your level: Level ${level}, ${title}. Open the ${BOARDS.overall.label.toLowerCase()}.`}
    >
      {body}
    </Link>
  );
}
