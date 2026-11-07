"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Flame, Target, Trophy, Zap } from "lucide-react";
import { addDays, BADGES, emptyState, istToday, levelFor, liveStreak, type LearnState } from "@/lib/learn/engine";
import { domainMastery, topConfusions } from "@/lib/learn/adaptive";
import { DOMAINS } from "@/lib/learn/concepts";
import { initLearnStore, useLearnState } from "@/lib/learn/store";
import { BOARDS } from "@/lib/standing/boards";
import { cn } from "@/lib/utils";
import { ChaiSays } from "./chai";
import s from "./learn.module.css";

const EMPTY = emptyState();

/** My progress: mastery by topic, XP history, mix-ups, badges, and my quiz rank. */
export function ProgressView({
  serverState,
  save,
  myRank,
  total,
}: {
  serverState: LearnState | null;
  save: (s: LearnState) => Promise<unknown>;
  myRank: number | null;
  total: number;
}) {
  initLearnStore(serverState, save);
  const st = useLearnState(serverState ?? EMPTY);
  const today = istToday();
  const lvl = levelFor(st.xp);
  const days = Array.from({ length: 14 }, (_, k) => addDays(today, k - 13));
  const maxDay = Math.max(10, ...days.map((d) => st.history[d] ?? 0));
  const domains = DOMAINS.map((d) => ({ ...d, m: domainMastery(st.coach, d.id) })).sort((a, b) => a.m.pct - b.m.pct);
  const weakest = domains.find((d) => d.m.seen > 0) ?? domains[0];
  const conf = topConfusions(st.coach, 5);
  const accuracy = st.answered ? Math.round((st.correct / st.answered) * 100) : null;

  return (
    <div className={cn("mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6")}>
      <h1 className="text-h1">My progress</h1>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {[
          { icon: <Zap className="size-5" />, v: st.xp, l: `XP · Level ${lvl.level}` },
          { icon: <Flame className={cn("size-5", s.flame)} />, v: liveStreak(st.streak, today), l: `day streak (best ${st.streak.best})` },
          { icon: <Target className="size-5" />, v: accuracy === null ? "None" : `${accuracy}%`, l: `accuracy · ${st.answered} answered` },
          { icon: <Trophy className="size-5" />, v: myRank ? `#${myRank}` : "None", l: `quiz rank this week, of ${total}` },
        ].map((x) => (
          <div key={x.l} className="rounded-2xl border-2 border-foreground bg-card p-3">
            <p className="flex items-center gap-1.5 text-2xl font-bold">
              {x.icon} {x.v}
            </p>
            <p className="text-caption text-muted-foreground">{x.l}</p>
          </div>
        ))}
      </div>

      <ChaiSays mood={weakest.m.seen ? "think" : "happy"} size={72}>
        {weakest.m.seen
          ? `Your weakest area right now is ${weakest.title} (${weakest.m.pct}%). A 10-concept Coach session there will help most.`
          : "Start a Coach session and I'll map your strengths."}
      </ChaiSays>

      {/* XP, last 14 days */}
      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <h2 className="font-bold">XP, last 14 days</h2>
        <div className="mt-3 flex h-32 items-end gap-1.5" role="img" aria-label="XP per day for the last 14 days">
          {days.map((d) => {
            const v = st.history[d] ?? 0;
            return (
              <div key={d} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <div className={cn("w-full rounded-t-md border-2 border-foreground", d === today ? "bg-primary" : "bg-brand")} style={{ height: `${Math.max(v ? 6 : 2, (v / maxDay) * 100)}%`, opacity: v ? 1 : 0.25 }} title={`${d}: ${v} XP`} />
                <span className="text-[0.6rem] text-muted-foreground">{d.slice(8)}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mastery by topic */}
      <section>
        <h2 className="text-h2">Mastery by topic</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {[...domains].sort((a, b) => b.m.pct - a.m.pct).map((d) => (
            <li key={d.id}>
              <Link href={`/games/coach?domain=${d.id}`} className="block rounded-2xl border-2 border-foreground bg-card p-3 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold">
                    <span aria-hidden>{d.icon}</span> {d.title}
                  </span>
                  <span className="font-pix text-xs">{d.m.pct}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full border-2 border-foreground">
                  <div className="h-full bg-primary" style={{ width: `${d.m.pct}%` }} />
                </div>
                <p className="mt-1 text-caption text-muted-foreground">
                  {d.m.mastered} mastered · {d.m.seen}/{d.m.total} started
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {conf.length ? (
        <section className="rounded-2xl border-2 border-foreground bg-foreground p-4 text-background">
          <h2 className="font-bold text-primary">Things you mix up</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {conf.map((x) => (
              <li key={x.a.id + x.b.id}>
                <b>{x.a.term}</b> ↔ <b>{x.b.term}</b> <span className="opacity-70">· {x.times}×</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-caption opacity-80">Coach mixes these into your sessions until you stop confusing them.</p>
        </section>
      ) : null}

      {/* Quiz leaderboard: its own page, one tap away */}
      <Link href={BOARDS.quiz.href} className="flex items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-4 transition-transform hover:-translate-y-0.5 active:translate-y-0.5">
        <Trophy className="size-6 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block font-bold">{BOARDS.quiz.label}</span>
          <span className="text-sm text-muted-foreground">
            {BOARDS.quiz.explainer} {myRank ? `You are #${myRank} this week.` : "This week."}
          </span>
        </span>
        <ArrowRight className="size-5 shrink-0" aria-hidden />
      </Link>

      <section>
        <h2 className="text-h2">Badges</h2>
        <p className="mt-1 text-sm">
          {st.badges.filter((b) => BADGES[b]).length} of {Object.keys(BADGES).length} earned
        </p>
      </section>
    </div>
  );
}
