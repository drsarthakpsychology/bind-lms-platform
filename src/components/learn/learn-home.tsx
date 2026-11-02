"use client";

import * as React from "react";
import Link from "next/link";
import { Flame, Lock, RotateCcw, Snowflake, Star, Timer, Zap } from "lucide-react";
import { BADGES, DAILY_GOALS, dueItems, emptyState, istToday, levelFor, liveStreak, type LearnState } from "@/lib/learn/engine";
import { initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import type { Unit } from "@/lib/learn/types";
import { cn } from "@/lib/utils";
import { ChaiSays, type ChaiMood } from "./chai";
import { ViewToggle } from "./view-toggle";
import s from "./learn.module.css";

const EMPTY = emptyState();

function greeting(st: LearnState, today: string, due: number): { mood: ChaiMood; text: string } {
  const streak = liveStreak(st.streak, today);
  const doneToday = st.daily.day === today && st.daily.xp > 0;
  if (!st.answered) return { mood: "happy", text: "Hi, I'm Chai! Five minutes a day turns into real clinical knowledge. Start with the first lesson." };
  if (st.daily.day === today && st.daily.goalHit) return { mood: "cheer", text: "Daily goal done. Anything more today is bonus XP!" };
  if (due >= 5) return { mood: "think", text: `${due} questions are due for review. Reviewing at the right time is how they stick.` };
  if (streak > 0 && !doneToday) return { mood: "think", text: `Your ${streak}-day streak is waiting. One lesson keeps it alive.` };
  if (st.streak.lastDay && streak === 0) return { mood: "sad", text: "Your streak reset. That's fine. Start a new one today." };
  return { mood: "happy", text: "Pick up where you left off. You're doing great." };
}

/** Next playable lesson across the whole path. */
function nextLesson(units: Unit[], st: LearnState) {
  for (const u of units) for (const l of u.lessons) if (!(st.lessons[l.id]?.stars > 0)) return { unit: u, lesson: l };
  return null;
}

export function LearnHome({ units, serverState, save }: { units: Unit[]; serverState: LearnState | null; save: (s: LearnState) => Promise<unknown> }) {
  initLearnStore(serverState, save);
  const st = useLearnState(serverState ?? EMPTY);
  const today = istToday();
  const lvl = levelFor(st.xp);
  const streak = liveStreak(st.streak, today);
  const due = dueItems(st, today).length;
  const dayXp = st.daily.day === today ? st.daily.xp : 0;
  const goalPct = Math.min(100, Math.round((dayXp / st.dailyGoal) * 100));
  const g = greeting(st, today, due);
  const up = nextLesson(units, st);
  const shownBadges = Object.entries(BADGES);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-2xl border-2 border-foreground bg-card p-3">
          <p className="flex items-center gap-1.5 text-2xl font-black">
            <Flame className={cn("size-6", streak > 0 && s.flame)} aria-hidden /> {streak}
          </p>
          <p className="text-caption text-muted-foreground">day streak{st.streak.freezes ? ` · ${st.streak.freezes}` : ""}{st.streak.freezes ? <Snowflake className="ml-0.5 inline size-3" aria-label="freezes" /> : null}</p>
        </div>
        <div className="rounded-2xl border-2 border-foreground bg-card p-3">
          <p className="flex items-center gap-1.5 text-2xl font-black">
            <Zap className="size-6" aria-hidden /> {st.xp}
          </p>
          <p className="text-caption text-muted-foreground">total XP</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border-2 border-foreground bg-card p-3">
          <div className="absolute inset-x-0 bottom-0 bg-primary transition-[height] duration-700" style={{ height: `${goalPct}%` }} aria-hidden />
          <div className="relative">
            <p className="text-2xl font-black">
              {dayXp}
              <span className="text-sm">/{st.dailyGoal}</span>
            </p>
            <p className="text-caption">today&apos;s goal</p>
          </div>
        </div>
      </div>

      {/* Level bar */}
      <div className="rounded-2xl border-2 border-foreground bg-foreground p-4 text-background">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-black">
            <span className="text-primary">Level {lvl.level}</span> · {lvl.title}
          </p>
          <p className="text-caption opacity-80">{lvl.nextTitle ? `${lvl.toNext} XP to ${lvl.nextTitle}` : "Top level reached"}</p>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-background/20">
          <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${lvl.pct}%` }} />
        </div>
      </div>

      <ChaiSays mood={g.mood} size={84}>
        {g.text}
      </ChaiSays>

      {/* Primary actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        {up ? (
          <Link
            href={`/practice/learn/play?lesson=${up.lesson.id}`}
            className="btn-sweep flex flex-col justify-center rounded-2xl border-2 border-foreground bg-primary p-4 text-primary-foreground hard-shadow-md sm:col-span-1"
          >
            <span className="text-eyebrow">Up next</span>
            <span className="text-lg font-black leading-tight">{up.lesson.title}</span>
            <span className="text-caption">{up.unit.title}</span>
          </Link>
        ) : (
          <div className="rounded-2xl border-2 border-foreground bg-primary p-4 font-black text-primary-foreground">Every lesson cleared! Go for 3 stars.</div>
        )}
        <Link
          href="/practice/learn/play?mode=review"
          className={cn("flex items-center gap-3 rounded-2xl border-2 border-foreground p-4 hard-shadow-sm", due ? "bg-brand text-brand-foreground" : "bg-card")}
        >
          <RotateCcw className="size-6 shrink-0" aria-hidden />
          <span>
            <span className="block font-black">Review</span>
            <span className="text-caption">{due ? `${due} due today` : "Nothing due"}</span>
          </span>
        </Link>
        <Link href="/practice/learn/play?mode=blitz" className="flex items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-4 hard-shadow-sm">
          <Timer className="size-6 shrink-0" aria-hidden />
          <span>
            <span className="block font-black">60-second blitz</span>
            <span className="text-caption">{st.blitzBest ? `Best: ${st.blitzBest}` : "Beat the clock"}</span>
          </span>
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-h2">Your path</h2>
        <ViewToggle />
      </div>

      {/* The path: units with lesson nodes */}
      <ol className="space-y-5">
        {units.map((u, ui) => {
          const stars = u.lessons.reduce((a, l) => a + (st.lessons[l.id]?.stars ?? 0), 0);
          const max = u.lessons.length * 3;
          return (
            <li key={u.id} className="overflow-hidden rounded-3xl border-2 border-foreground bg-card hard-shadow-sm">
              <div
                className={cn(
                  "flex items-center justify-between gap-3 border-b-2 border-foreground px-4 py-3",
                  u.tone === "lime" ? "bg-primary text-primary-foreground" : u.tone === "blue" ? "bg-brand text-brand-foreground" : "bg-foreground text-background",
                )}
              >
                <div className="min-w-0">
                  <p className="font-pix text-[0.65rem] uppercase opacity-90">Unit {ui + 1}</p>
                  <h3 className="truncate text-lg font-black">{u.title}</h3>
                  <p className="truncate text-caption opacity-90">{u.tagline}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full border-2 border-current px-2 py-0.5 text-sm font-black">
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
                          href={`/practice/learn/play?lesson=${l.id}`}
                          className={cn(
                            "flex h-full flex-col gap-1 rounded-2xl border-2 border-foreground p-3 transition-transform hover:-translate-y-0.5 active:translate-y-0.5",
                            isNext ? cn("bg-primary text-primary-foreground hard-shadow-sm", s.pulse) : done ? "bg-background" : "bg-card",
                          )}
                        >
                          <span className="font-pix text-[0.62rem] uppercase text-link">Lesson {li + 1}</span>
                          <span className="font-black leading-tight">{l.title}</span>
                          <span className="text-caption text-muted-foreground">{l.items.length} questions</span>
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
                          <span className="font-black leading-tight">{l.title}</span>
                          <span className="text-caption">Clear lesson {li} first</span>
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

      {/* Badges */}
      <section>
        <h2 className="text-h2">Badges</h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {shownBadges.map(([id, b]) => {
            const has = st.badges.includes(id);
            return (
              <li key={id} className={cn("rounded-2xl border-2 p-3", has ? "border-foreground bg-brand text-brand-foreground" : "border-dashed border-foreground/30 text-muted-foreground")}>
                <span className="text-xl" aria-hidden>
                  {has ? b.icon : "?"}
                </span>
                <p className="font-black leading-tight">{b.title}</p>
                <p className="text-caption">{b.text}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Settings */}
      <section className="rounded-2xl border-2 border-foreground bg-card p-4">
        <p className="font-black">Daily goal</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DAILY_GOALS.map((goal) => (
            <button
              key={goal}
              type="button"
              aria-pressed={st.dailyGoal === goal}
              onClick={() => setLearnState({ ...st, dailyGoal: goal })}
              className={cn("rounded-full border-2 border-foreground px-4 py-1.5 text-sm font-bold", st.dailyGoal === goal ? "bg-foreground text-background" : "bg-background")}
            >
              {goal === 20 ? "Casual · 20 XP" : goal === 40 ? "Regular · 40 XP" : "Serious · 60 XP"}
            </button>
          ))}
        </div>
        <p className="mt-2 text-caption text-muted-foreground">
          {st.answered ? `${st.correct} of ${st.answered} answered right (${Math.round((st.correct / st.answered) * 100)}%). Best combo ${st.bestCombo}.` : "Every 7-day streak earns a streak freeze (max 2)."}
        </p>
      </section>
    </div>
  );
}
