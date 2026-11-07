"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, DoorOpen, FlaskConical, Hospital, Layers, LayoutGrid, Lock, Pill, ScanEye, Star, Swords, Timer, Trophy, Zap, type LucideIcon } from "lucide-react";
import { BADGES, DAILY_GOALS, emptyState, type LearnState } from "@/lib/learn/engine";
import { initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import type { Unit } from "@/lib/learn/types";
import { cn } from "@/lib/utils";
import { BOARDS } from "@/lib/standing/boards";
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

type Tone = "lime" | "blue" | "ink";
type Game = { href: string; title: string; text: string; tag: string; icon: LucideIcon; tone: Tone };

/**
 * Only real games (plan section 8): timed, competitive or animated. Each has
 * one line that says what it is and when to play it, a tag and its own
 * colour, so the hub reads at a glance. Daily case lives in Practice; Coach
 * and the quiz path live in Smart practice (Exam Prep).
 */
const SOLO: Game[] = [
  { href: "/games/blitz", title: "Blitz", text: "60 seconds of fast facts. For a spare minute.", tag: "60 sec", icon: Timer, tone: "lime" },
  { href: "/games/sort", title: "Criteria sort", text: "Sort criteria into look-alike disorders. After a Study topic.", tag: "16 cards", icon: LayoutGrid, tone: "blue" },
  { href: "/games/mse", title: "MSE Lab", text: "Tag every finding in a short interview. Before an MSE.", tag: "Tag it", icon: ScanEye, tone: "ink" },
  { href: "/games/ward", title: "Ward Week", text: "One patient, five sessions. Your choices change the ending.", tag: "5 days", icon: Hospital, tone: "lime" },
  { href: "/games/rx", title: "Rx Detective", text: "Medicines, receptors and risky mixes. Before a pharmacology test.", tag: "3 lives", icon: Pill, tone: "blue" },
];

const WITH_OTHERS: Game[] = [
  { href: "/games/duel", title: "Differential duel", text: "Ranked 1v1 on look-alike diagnoses. Live or against the bot.", tag: "1v1", icon: Swords, tone: "ink" },
  { href: "/games/escape", title: "Team Escape Room", text: "Race other teams through linked clues to discharge the patient.", tag: "Teams", icon: DoorOpen, tone: "blue" },
  { href: "/games/comorbid", title: "Comorbid", text: "A card duel. Build a diagnosis; block your rival with rule-outs.", tag: "Cards", icon: Layers, tone: "lime" },
];

const TONE: Record<Tone, string> = {
  ink: "bg-foreground text-background",
  blue: "bg-brand text-brand-foreground",
  lime: "bg-primary text-primary-foreground",
};

function GameTile({ g }: { g: Game }) {
  const Icon = g.icon;
  return (
    <li className="min-w-0">
      <Link
        href={g.href}
        className="group/game flex h-full min-w-0 overflow-hidden rounded-2xl border-2 border-foreground bg-card outline-none transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-0.5 hover:hard-shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-y-px active:shadow-none sm:flex-col"
      >
        {/* The game's mark: its colour, its icon and its tag. */}
        <span aria-hidden className={cn("relative flex w-24 shrink-0 items-center justify-center border-r-2 border-foreground sm:h-28 sm:w-full sm:border-r-0 sm:border-b-2", TONE[g.tone])}>
          <span className="absolute inset-0 opacity-15 [background-image:radial-gradient(currentColor_1px,transparent_1.5px)] [background-size:12px_12px]" />
          <Icon className="relative size-9 transition-transform duration-fast ease-snappy motion-safe:group-hover/game:-rotate-6 motion-safe:group-hover/game:scale-110 sm:size-11" />
          <span className="absolute bottom-1.5 left-1.5 -rotate-3 whitespace-nowrap rounded-md border-2 border-foreground bg-card px-1.5 py-1 font-pix text-[0.6rem] uppercase leading-none text-foreground sm:bottom-auto sm:top-2 sm:left-2">
            {g.tag}
          </span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1 p-3 sm:p-4">
          <span className="flex items-center justify-between gap-2">
            <span className="min-w-0 text-lg font-bold leading-tight [overflow-wrap:anywhere]">{g.title}</span>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-fast group-hover/game:translate-x-0.5" aria-hidden />
          </span>
          <span className="text-sm leading-snug text-muted-foreground [overflow-wrap:anywhere]">{g.text}</span>
        </span>
      </Link>
    </li>
  );
}

function GameGroup({ id, title, games }: { id: string; title: string; games: Game[] }) {
  return (
    <section aria-labelledby={id} className="space-y-3">
      <h2 id={id} className="text-h3">
        {title}
      </h2>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g) => (
          <GameTile key={g.href} g={g} />
        ))}
      </ul>
    </section>
  );
}

/** /games: the real games, solo and with others. Nothing else competes. */
export function LearnHome({ showLab = false }: { showLab?: boolean }) {
  return (
    <div className={cn("mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 lg:py-10", s.texture)}>
      <header className="flex items-center gap-4">
        <Chai mood="happy" size={64} className="shrink-0" />
        <div className="min-w-0">
          <p className="text-eyebrow text-link">Games</p>
          <h1 className="text-h1">Play it to remember it</h1>
        </div>
      </header>

      <GameGroup id="solo" title="Solo" games={SOLO} />
      <GameGroup id="with-others" title="With others" games={WITH_OTHERS} />

      <nav aria-label="More from Games" className="flex flex-wrap gap-x-5 gap-y-1 border-t-2 border-foreground/15 pt-4 text-sm">
        <Link href={BOARDS.quiz.href} className="inline-flex min-h-11 items-center gap-1.5 font-bold text-link underline-offset-4 hover:underline">
          <Trophy className="size-4" aria-hidden /> {BOARDS.quiz.label}
        </Link>
        <Link href="/prep/smart" className="inline-flex min-h-11 items-center gap-1.5 font-bold text-link underline-offset-4 hover:underline">
          <Zap className="size-4" aria-hidden /> Coach and quizzes are in Smart practice
        </Link>
        {showLab ? (
          <Link href="/games/lab" className="inline-flex min-h-11 items-center gap-1.5 font-bold text-link underline-offset-4 hover:underline">
            <FlaskConical className="size-4" aria-hidden /> Psychology Lab
          </Link>
        ) : null}
      </nav>
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
      <Link href="/prep/smart" className="inline-flex min-h-11 items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-bold">
        <ArrowLeft className="size-4" aria-hidden /> Smart practice
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
