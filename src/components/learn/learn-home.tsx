"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BarChart3, Flame, GraduationCap, Lock, MessagesSquare, RotateCcw, Route, Search, Star, Timer, Zap } from "lucide-react";
import { BADGES, DAILY_GOALS, dueItems, emptyState, istToday, levelFor, liveStreak, type LearnState } from "@/lib/learn/engine";
import { initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import type { Unit } from "@/lib/learn/types";
import { cn } from "@/lib/utils";
import { Chai } from "./chai";
import { ViewToggle } from "./view-toggle";
import s from "./learn.module.css";

const EMPTY = emptyState();
type Save = (s: LearnState) => Promise<unknown>;

/** Next playable lesson across the whole path. */
function nextLesson(units: Unit[], st: LearnState) {
  for (const u of units) for (const l of u.lessons) if (!(st.lessons[l.id]?.stars > 0)) return { unit: u, lesson: l };
  return null;
}

/** The one game to play right now: due reviews first, then the next quiz, then Coach. */
function playNow(units: Unit[], st: LearnState, due: number) {
  if (due > 0) return { href: "/games/play?mode=review", title: `Review ${due} question${due === 1 ? "" : "s"}`, why: "These are about to slip. Reviewing now is the fastest way to keep them.", icon: RotateCcw };
  const up = nextLesson(units, st);
  if (up) return { href: `/games/play?lesson=${up.lesson.id}`, title: `Quiz: ${up.lesson.title}`, why: `Next on your quiz path (${up.unit.title}).`, icon: Zap };
  return { href: "/games/coach", title: "Coach: mixed round", why: "Chai brings back what you mix up until it sticks.", icon: GraduationCap };
}

const GAMES = [
  { href: "/games/coach", title: "Coach", text: "Chai teaches, asks, and repeats what you mix up.", icon: GraduationCap, tone: "ink" },
  { href: "/games/quizzes", title: "Quiz path", text: "Short quizzes by topic. Earn stars.", icon: Route, tone: "white" },
  { href: "/games/detective", title: "Clinic detective", text: "Name the medicine or disorder from clues.", icon: Search, tone: "blue" },
  { href: "/games/scenarios", title: "What would you do?", text: "Tricky patient moments, real consequences.", icon: MessagesSquare, tone: "white" },
  { href: "/games/terms", title: "Say it clinically", text: "Everyday words into case-sheet language.", icon: Star, tone: "white" },
  { href: "/games/play?mode=blitz", title: "60-second blitz", text: "As many as you can in a minute.", icon: Timer, tone: "lime" },
] as const;

const TONE: Record<string, string> = {
  ink: "bg-foreground text-background",
  blue: "bg-brand text-brand-foreground",
  lime: "bg-primary text-primary-foreground",
  plain: "bg-background text-foreground",
  white: "bg-card text-foreground",
};

function Stats({ st }: { st: LearnState }) {
  const today = istToday();
  const streak = liveStreak(st.streak, today);
  const lvl = levelFor(st.xp);
  const dayXp = st.daily.day === today ? st.daily.xp : 0;
  const goalPct = Math.min(100, Math.round((dayXp / st.dailyGoal) * 100));
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <div className="rounded-2xl border-2 border-foreground bg-card p-3">
        <p className="flex items-center gap-1.5 text-xl font-bold tabular-nums sm:text-2xl">
          <Flame className={cn("size-5", streak > 0 && s.flame)} aria-hidden /> {streak}
        </p>
        <p className="text-xs text-muted-foreground">day streak</p>
      </div>
      <div className="rounded-2xl border-2 border-foreground bg-card p-3">
        <p className="text-xl font-bold tabular-nums sm:text-2xl">Lv {lvl.level}</p>
        <p className="truncate text-xs text-muted-foreground">{st.xp} XP · {lvl.title}</p>
      </div>
      <div className="relative overflow-hidden rounded-2xl border-2 border-foreground bg-card p-3">
        <div className="absolute inset-x-0 bottom-0 bg-primary transition-[height] duration-700" style={{ height: `${goalPct}%` }} aria-hidden />
        <div className="relative">
          <p className="text-xl font-bold tabular-nums sm:text-2xl">
            {dayXp}
            <span className="text-sm font-medium">/{st.dailyGoal}</span>
          </p>
          <p className="text-xs">today&apos;s goal</p>
        </div>
      </div>
    </div>
  );
}

/** /games: one thing to play now, then the full set of games. */
export function LearnHome({ units, serverState, save }: { units: Unit[]; serverState: LearnState | null; save: Save }) {
  initLearnStore(serverState, save);
  const st = useLearnState(serverState ?? EMPTY);
  const due = dueItems(st, istToday()).length;
  const now = playNow(units, st, due);
  const NowIcon = now.icon;

  return (
    <div className={cn("mx-auto max-w-4xl space-y-8 px-4 py-6 sm:px-6 lg:py-10", s.texture)}>
      <header className="flex items-center gap-4">
        <Chai mood="happy" size={72} className="shrink-0" />
        <div className="min-w-0">
          <p className="text-eyebrow text-link">Games</p>
          <h1 className="text-h1">Practise what you studied</h1>
          <p className="text-sm text-muted-foreground">Short rounds that make it stick. Five minutes counts.</p>
        </div>
      </header>

      <Stats st={st} />

      <Link href={now.href} className="btn-sweep flex items-center gap-4 rounded-3xl border-2 border-foreground bg-primary p-5 text-primary-foreground hard-shadow-md transition-transform active:translate-y-0.5">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-foreground bg-card text-foreground">
          <NowIcon className="size-6" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-wide opacity-80">Play now</span>
          <span className="block text-xl font-bold leading-tight">{now.title}</span>
          <span className="block text-sm opacity-85">{now.why}</span>
        </span>
        <ArrowRight className="size-6 shrink-0" aria-hidden />
      </Link>

      <section aria-labelledby="all-games">
        <h2 id="all-games" className="text-lg font-bold">
          All games
        </h2>
        <ul className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((g) => {
            const Icon = g.icon;
            return (
              <li key={g.href}>
                {/* Calm white cards; the colour lives in the icon chip, so the one lime "Play now" card stays the clear first action. */}
                <Link href={g.href} className="group flex h-full items-start gap-3 rounded-2xl border-2 border-foreground bg-card p-4 transition-transform hover:-translate-y-0.5 active:translate-y-0.5">
                  <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl border-2 border-foreground", TONE[g.tone === "white" ? "plain" : g.tone])}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold leading-tight">{g.title}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{g.text}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <Link href="/games/progress" className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-foreground p-4">
        <BarChart3 className="size-5 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block font-bold">Progress, badges and leaderboard</span>
          <span className="text-sm text-muted-foreground">Mastery by topic, what you mix up, this week&apos;s ranking</span>
        </span>
        <ArrowRight className="size-5 shrink-0" aria-hidden />
      </Link>
    </div>
  );
}

/** /games/quizzes: the quiz path, badges and the daily goal. */
export function QuizPath({ units, serverState, save }: { units: Unit[]; serverState: LearnState | null; save: Save }) {
  initLearnStore(serverState, save);
  const st = useLearnState(serverState ?? EMPTY);
  const up = nextLesson(units, st);
  const shownBadges = Object.entries(BADGES);

  return (
    <div className={cn("mx-auto max-w-4xl space-y-8 px-4 py-6 sm:px-6 lg:py-10", s.texture)}>
      <Link href="/games" className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-bold">
        <ArrowLeft className="size-4" aria-hidden /> Games
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-eyebrow text-link">Quiz path</p>
          <h1 className="text-h1">Short quizzes, topic by topic</h1>
          <p className="text-sm text-muted-foreground">Each lesson opens after the one before. Three stars for a clean round.</p>
        </div>
        <ViewToggle />
      </div>

      <ol className="space-y-5">
        {units.map((u, ui) => {
          const stars = u.lessons.reduce((a, l) => a + (st.lessons[l.id]?.stars ?? 0), 0);
          const max = u.lessons.length * 3;
          return (
            <li key={u.id} className="overflow-hidden rounded-3xl border-2 border-foreground bg-card">
              <div className={cn("flex items-center justify-between gap-3 border-b-2 border-foreground px-4 py-3", u.tone === "lime" ? "bg-primary text-primary-foreground" : u.tone === "blue" ? "bg-brand text-brand-foreground" : "bg-foreground text-background")}>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Unit {ui + 1}</p>
                  <h2 className="truncate text-lg font-bold">{u.title}</h2>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full border-2 border-current px-2 py-0.5 text-sm font-semibold tabular-nums">
                  <Star className="size-4" aria-hidden /> {stars}/{max}
                </span>
              </div>
              <ul className="flex gap-3 overflow-x-auto p-4 [scrollbar-width:none]">
                {u.lessons.map((l, li) => {
                  const done = st.lessons[l.id];
                  const prevDone = li === 0 || (st.lessons[u.lessons[li - 1].id]?.stars ?? 0) > 0;
                  const isNext = up?.lesson.id === l.id;
                  return (
                    <li key={l.id} className="w-44 shrink-0">
                      {prevDone ? (
                        <Link
                          href={`/games/play?lesson=${l.id}&from=/games/quizzes`}
                          className={cn("flex h-full flex-col gap-1 rounded-2xl border-2 border-foreground p-3 transition-transform hover:-translate-y-0.5", isNext ? cn("bg-primary text-primary-foreground", s.pulse) : done ? "bg-background" : "bg-card")}
                        >
                          <span className="text-xs font-semibold text-link">Lesson {li + 1}</span>
                          <span className="font-bold leading-tight">{l.title}</span>
                          <span className="text-xs text-muted-foreground">{l.items.length} questions</span>
                          <span className="mt-auto text-lg tracking-wider" aria-label={`${done?.stars ?? 0} of 3 stars`}>
                            {[0, 1, 2].map((k) => (
                              <span key={k} className={k < (done?.stars ?? 0) ? "" : "opacity-20"}>
                                ★
                              </span>
                            ))}
                          </span>
                        </Link>
                      ) : (
                        <div className="flex h-full flex-col gap-1 rounded-2xl border-2 border-dashed border-foreground/40 p-3 text-muted-foreground">
                          <Lock className="size-4" aria-hidden />
                          <span className="font-bold leading-tight">{l.title}</span>
                          <span className="text-xs">Clear lesson {li} first</span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>

      <section aria-labelledby="badges">
        <h2 id="badges" className="text-lg font-bold">
          Badges
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {shownBadges.map(([id, b]) => {
            const has = st.badges.includes(id);
            return (
              <li key={id} className={cn("rounded-2xl border-2 p-3", has ? "border-foreground bg-brand text-brand-foreground" : "border-dashed border-foreground/30 text-muted-foreground")}>
                <span className="text-xl" aria-hidden>
                  {has ? b.icon : "?"}
                </span>
                <p className="font-bold leading-tight">{b.title}</p>
                <p className="text-xs">{b.text}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <p className="font-bold">Daily goal</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DAILY_GOALS.map((goal) => (
            <button
              key={goal}
              type="button"
              aria-pressed={st.dailyGoal === goal}
              onClick={() => setLearnState({ ...st, dailyGoal: goal })}
              className={cn("rounded-full border-2 border-foreground px-4 py-1.5 text-sm font-semibold", st.dailyGoal === goal ? "bg-foreground text-background" : "bg-background")}
            >
              {goal === 20 ? "Casual · 20 XP" : goal === 40 ? "Regular · 40 XP" : "Serious · 60 XP"}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
