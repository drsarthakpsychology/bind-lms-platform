"use client";

import * as React from "react";
import { BackLink } from "@/components/study/back";
import { useRouter } from "next/navigation";
import { Flame, Zap } from "lucide-react";
import { BADGES, answerXp, dueItems, emptyState, finishLesson, istToday, levelFor, type LearnState, type Payout } from "@/lib/learn/engine";
import { BLITZ_ITEMS, findItem, findLesson } from "@/lib/learn/content";
import type { Item } from "@/lib/learn/types";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Chai, ChaiSays, type ChaiMood } from "./chai";
import { ItemView, seeded } from "./items";
import { setLearnState, useLearnState, initLearnStore } from "@/lib/learn/store";
import { useExplainView, ViewToggle } from "./view-toggle";
import s from "./learn.module.css";

const RIGHT = ["Nice!", "Spot on.", "Exactly.", "You've got it.", "Clinician brain!", "Sharp.", "Yes!", "Perfect."];
const COMBO = ["On a roll!", "Combo!", "Can't stop you.", "Hot streak!"];
const WRONG = ["Close. Here's the key point.", "Good try. Remember this one:", "Tricky one. Look:", "Not quite. This is the bit to keep:"];

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}
function nowSeconds() {
  return Date.now() / 1000;
}

const EMPTY = emptyState();

type Mode = { kind: "lesson"; lessonId: string } | { kind: "review" } | { kind: "blitz" };

export function Player({ mode, serverState, save }: { mode: Mode; serverState: LearnState | null; save: (s: LearnState) => Promise<unknown> }) {
  initLearnStore(serverState, save);
  const state = useLearnState(serverState ?? EMPTY);
  if (mode.kind === "blitz") return <Blitz state={state} />;
  return <LessonRun mode={mode} state={state} />;
}

/* ================================================================ lesson */
function LessonRun({ mode, state }: { mode: Exclude<Mode, { kind: "blitz" }>; state: LearnState }) {
  const router = useRouter();
  const view = useExplainView();
  const found = mode.kind === "lesson" ? findLesson(mode.lessonId) : null;

  // The question list is fixed when the run starts.
  const [queue, setQueue] = React.useState<Item[]>(() => {
    if (found) return found.lesson.items;
    return dueItems(state, istToday())
      .map((id) => findItem(id))
      .filter((x): x is Item => Boolean(x))
      .slice(0, 12);
  });
  const [total] = React.useState(() => queue.length);
  const [i, setI] = React.useState(0);
  const [locked, setLocked] = React.useState(false);
  const [last, setLast] = React.useState<{ correct: boolean; answer: string; line: string; gain: number } | null>(null);
  const [combo, setCombo] = React.useState(0);
  const [maxCombo, setMaxCombo] = React.useState(0);
  const [answers, setAnswers] = React.useState<{ id: string; correct: boolean }[]>([]);
  const [retried, setRetried] = React.useState<string[]>([]);
  const [result, setResult] = React.useState<Payout | null>(null);
  const [confetti, setConfetti] = React.useState<{ x: number; d: number; c: string }[]>([]);

  if (!queue.length) {
    return (
      <div className="mx-auto max-w-xl space-y-6 px-4 py-10 text-center">
        <Chai mood="sleep" size={140} />
        <h1 className="text-h1">{mode.kind === "review" ? "Nothing to review right now." : "Lesson not found."}</h1>
        <p className="text-muted-foreground">
          {mode.kind === "review" ? "Questions you miss come back here on the right day. Do a lesson and check back tomorrow." : ""}
        </p>
        <BackLink className="inline-flex h-12 items-center rounded-2xl border-2 border-foreground bg-primary px-6 font-bold text-primary-foreground hard-shadow-sm">
          Back
        </BackLink>
      </div>
    );
  }

  const item = queue[i];
  const isRetry = i >= total;
  const progress = Math.min(100, Math.round((Math.min(i + (locked ? 1 : 0), total) / total) * 100));

  function onDone(correct: boolean, answer: string) {
    setLocked(true);
    if (!isRetry) setAnswers((a) => [...a, { id: item.id, correct }]);
    if (correct) {
      const c = combo + 1;
      setCombo(c);
      setMaxCombo((m) => Math.max(m, c));
      haptic("success");
      setLast({ correct, answer, line: c >= 3 && c % 3 === 0 ? pick(COMBO) : pick(RIGHT), gain: isRetry ? 0 : answerXp(c) });
    } else {
      setCombo(0);
      haptic("warning");
      setLast({ correct, answer, line: pick(WRONG), gain: 0 });
      // Learn it now: a missed question comes back once at the end.
      if (!retried.includes(item.id)) {
        setRetried((r) => [...r, item.id]);
        setQueue((q) => [...q, item]);
      }
    }
  }

  function next() {
    setLast(null);
    setLocked(false);
    if (i + 1 < queue.length) {
      setI(i + 1);
      return;
    }
    // Finish: pay out.
    const unit = found ? found.unit : null;
    const { state: nextState, payout } = finishLesson(
      state,
      {
        lessonId: found ? found.lesson.id : "review",
        kind: mode.kind === "review" ? "review" : "lesson",
        answers,
        maxCombo,
        unitLessons: unit?.lessons.map((l) => l.id),
        reviewRight: mode.kind === "review" ? answers.filter((a) => a.correct).length : undefined,
      },
      istToday(),
      Math.random(),
    );
    setLearnState(nextState);
    setResult(payout);
    if (payout.stars >= 2 || payout.levelUp || payout.newBadges.length) {
      setConfetti(Array.from({ length: 40 }, () => ({ x: Math.random() * 100, d: Math.random() * 0.8, c: pick(["var(--primary)", "var(--brand)", "var(--background)"]) })));
      haptic("success");
    }
  }

  if (result) {
    return <Summary result={result} state={state} confetti={confetti} title={found ? found.lesson.title : "Review"} onAgain={() => router.refresh()} />;
  }

  const mood: ChaiMood = !last ? (combo >= 3 ? "happy" : "idle") : last.correct ? (combo >= 3 ? "cheer" : "happy") : "sad";

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-2xl flex-col px-4 pt-4 pb-6">
      {/* Top: close, progress, combo */}
      <div className="flex items-center gap-3">
        <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-foreground bg-muted" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className={cn("flex items-center gap-1 rounded-full border-2 border-foreground px-2.5 py-1 text-sm font-semibold", combo >= 3 ? "bg-foreground text-primary" : "bg-card")} aria-label={`Combo ${combo}`}>
          <Flame className={cn("size-4", combo >= 3 && s.flame)} aria-hidden /> {combo}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-eyebrow text-muted-foreground">{isRetry ? "One more go at this" : found ? found.lesson.title : `Review · ${Math.min(i + 1, total)} of ${total}`}</p>
        <ViewToggle />
      </div>

      <div key={`${item.id}-${i}`} className={cn("mt-5 flex-1", s.rise)}>
        <ItemView item={item} locked={locked} onDone={onDone} />
      </div>

      {/* Feedback sheet */}
      {last ? (
        <div
          role="status"
          className={cn(
            "sticky bottom-[calc(var(--nav-h,0px)+0.5rem)] mt-5 rounded-3xl border-2 border-foreground p-4 hard-shadow-md lg:bottom-4",
            last.correct ? "bg-primary text-primary-foreground" : "bg-foreground text-background",
            s.rise,
          )}
        >
          <div className="flex items-start gap-3">
            <Chai mood={mood} size={60} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-lg font-bold">
                {last.line}
                {last.gain ? <span className={cn("rounded-full bg-foreground px-2 py-0.5 text-xs text-primary", s.pulse)}>+{last.gain} XP</span> : null}
              </p>
              {!last.correct ? (
                <p className="mt-1 text-sm font-bold">
                  Answer: <span className="font-semibold">{last.answer}</span>
                </p>
              ) : null}
              <p className="mt-1.5 text-sm leading-relaxed">{view === "clinician" ? item.clinician : item.student}</p>
            </div>
          </div>
          <button
            type="button"
            autoFocus
            onClick={next}
            className={cn(
              "mt-3 h-12 w-full rounded-2xl border-2 border-foreground text-base font-bold hard-shadow-sm active:translate-y-0.5",
              last.correct ? "bg-foreground text-primary" : "bg-primary text-primary-foreground",
            )}
          >
            {i + 1 < queue.length ? "Continue" : "Finish"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* =============================================================== summary */
export function Summary({
  result,
  state,
  confetti,
  title,
  onAgain,
}: {
  result: Payout;
  state: LearnState;
  confetti: { x: number; d: number; c: string }[];
  title: string;
  onAgain: () => void;
}) {
  const [chestOpen, setChestOpen] = React.useState(!result.chest);
  const lvl = levelFor(state.xp);
  const shown = chestOpen ? result.lines : result.lines.filter((l) => !l.label.toLowerCase().includes("chest"));
  const sum = shown.reduce((a, l) => a + l.xp, 0);
  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-8 text-center">
      {confetti.length ? (
        <div className={s.confetti} aria-hidden>
          {confetti.map((c, k) => (
            <i key={k} style={{ left: `${c.x}%`, animationDelay: `${c.d}s`, background: c.c }} />
          ))}
        </div>
      ) : null}
      <Chai mood={result.stars >= 2 || result.levelUp ? "cheer" : result.stars === 0 ? "sad" : "happy"} size={150} />
      <div>
        <p className="text-eyebrow text-link">{title} complete</p>
        <p className="mt-2 text-4xl tracking-widest" aria-label={`${result.stars} of 3 stars`}>
          {[0, 1, 2].map((k) => (
            <span key={k} className={cn("inline-block", k < result.stars ? "text-foreground" : "text-foreground/20", k < result.stars && s.pulse)} style={{ animationDelay: `${k * 0.2}s` }}>
              ★
            </span>
          ))}
        </p>
      </div>

      {result.chest && !chestOpen ? (
        <button
          type="button"
          onClick={() => {
            haptic("success");
            setChestOpen(true);
          }}
          className="mx-auto flex flex-col items-center gap-2 rounded-3xl border-2 border-foreground bg-brand px-8 py-5 text-brand-foreground hard-shadow-md"
        >
          <span className={cn("text-5xl", s.chest)} aria-hidden>
            🎁
          </span>
          <span className="font-bold">Tap to open your chest</span>
        </button>
      ) : null}

      <ul className="space-y-2 text-left">
        {shown.map((l, k) => (
          <li key={l.label} className={cn("flex items-center justify-between rounded-2xl border-2 border-foreground bg-card px-4 py-2.5 font-bold", s.rise)} style={{ animationDelay: `${k * 0.12}s` }}>
            <span>{l.label}</span>
            <span className={cn("font-pix", l.label.includes("Jackpot") && "rounded-full bg-primary px-2 text-primary-foreground")}>+{l.xp}</span>
          </li>
        ))}
        <li className="flex items-center justify-between rounded-2xl border-2 border-foreground bg-foreground px-4 py-3 text-lg font-bold text-primary">
          <span className="flex items-center gap-2">
            <Zap className="size-5" aria-hidden /> Total
          </span>
          <span className="font-pix">+{sum} XP</span>
        </li>
      </ul>

      {result.levelUp ? (
        <div className={cn("rounded-3xl border-2 border-foreground bg-primary p-5 text-primary-foreground hard-shadow-md", s.pulse)}>
          <p className="text-eyebrow">Level up!</p>
          <p className="text-3xl font-black">
            Level {result.levelUp.to}: {result.levelUp.title}
          </p>
        </div>
      ) : null}

      {result.newBadges.filter((b) => BADGES[b]).length ? (
        <div className="rounded-3xl border-2 border-foreground bg-card p-4">
          <p className="text-eyebrow text-link">New badge{result.newBadges.length > 1 ? "s" : ""}</p>
          <ul className="mt-2 flex flex-wrap justify-center gap-2">
            {result.newBadges
              .filter((b) => BADGES[b])
              .map((b) => (
                <li key={b} className={cn("rounded-2xl border-2 border-foreground bg-brand px-3 py-2 text-brand-foreground", s.pulse)}>
                  <span className="mr-1" aria-hidden>
                    {BADGES[b].icon}
                  </span>
                  <b>{BADGES[b].title}</b>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      <div className="flex items-center justify-center gap-4 text-sm font-bold">
        <span className="flex items-center gap-1">
          <Flame className={cn("size-5", s.flame)} aria-hidden /> {result.streak.count}-day streak
          {result.streak.usedFreeze ? " (freeze used)" : ""}
        </span>
        <span>
          Level {lvl.level} · {lvl.toNext ? `${lvl.toNext} XP to ${lvl.nextTitle}` : "Max level"}
        </span>
      </div>

      {result.goalHit ? <ChaiSays mood="cheer">Daily goal done! Come back tomorrow to keep your streak.</ChaiSays> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <BackLink className="flex h-14 items-center justify-center rounded-2xl border-2 border-foreground bg-primary text-lg font-bold text-primary-foreground hard-shadow-md">
          Continue
        </BackLink>
        <button type="button" onClick={onAgain} className="h-14 rounded-2xl border-2 border-foreground bg-card text-lg font-bold hard-shadow-sm">
          Practise again
        </button>
      </div>
    </div>
  );
}

/* ================================================================= blitz */
const BLITZ_SECONDS = 60;

function Blitz({ state }: { state: LearnState }) {
  const [phase, setPhase] = React.useState<"ready" | "run" | "done">("ready");
  const [deck, setDeck] = React.useState<Item[]>([]);
  const [i, setI] = React.useState(0);
  const [left, setLeft] = React.useState(BLITZ_SECONDS);
  const [answers, setAnswers] = React.useState<{ id: string; correct: boolean }[]>([]);
  const [combo, setCombo] = React.useState(0);
  const [maxCombo, setMaxCombo] = React.useState(0);
  const [flash, setFlash] = React.useState<"right" | "wrong" | null>(null);
  const [payout, setPayout] = React.useState<Payout | null>(null);
  const endAt = React.useRef(0);
  const answersRef = React.useRef<{ id: string; correct: boolean }[]>([]);
  const comboRef = React.useRef(0);
  const [bestBefore, setBestBefore] = React.useState(0);

  const finish = React.useCallback(() => {
    setPhase("done");
    const { state: next, payout: p } = finishLesson(state, { lessonId: "blitz", kind: "blitz", answers: answersRef.current, maxCombo: comboRef.current }, istToday(), Math.random());
    setLearnState(next);
    setPayout(p);
  }, [state]);

  React.useEffect(() => {
    if (phase !== "run") return;
    const t = setInterval(() => {
      const l = Math.max(0, Math.ceil(endAt.current - nowSeconds()));
      setLeft(l);
      if (l <= 0) {
        clearInterval(t);
        finish();
      }
    }, 200);
    return () => clearInterval(t);
  }, [phase, finish]);

  function start() {
    const shuffled = [...BLITZ_ITEMS].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setI(0);
    answersRef.current = [];
    setBestBefore(state.blitzBest);
    setAnswers([]);
    setCombo(0);
    setMaxCombo(0);
    comboRef.current = 0;
    endAt.current = nowSeconds() + BLITZ_SECONDS;
    setLeft(BLITZ_SECONDS);
    setPayout(null);
    setPhase("run");
  }

  function answer(correct: boolean) {
    const item = deck[i];
    answersRef.current = [...answersRef.current, { id: item.id, correct }];
    setAnswers(answersRef.current);
    const c = correct ? combo + 1 : 0;
    setCombo(c);
    const m = Math.max(maxCombo, c);
    setMaxCombo(m);
    comboRef.current = m;
    setFlash(correct ? "right" : "wrong");
    haptic(correct ? "tap" : "warning");
    setTimeout(() => setFlash(null), 180);
    setI((n) => (n + 1) % deck.length);
  }

  if (phase === "ready") {
    return (
      <div className="mx-auto max-w-xl space-y-6 px-4 py-10 text-center">
        <Chai mood="think" size={140} />
        <h1 className="text-h1">60-second blitz</h1>
        <p className="text-muted-foreground">As many right answers as you can in a minute. True/false and quick picks from everything you&apos;ve studied.</p>
        {state.blitzBest ? <p className="font-pix text-sm">Your best: {state.blitzBest}</p> : null}
        <button type="button" onClick={start} className="btn-sweep h-14 w-full rounded-2xl border-2 border-foreground bg-primary text-lg font-bold text-primary-foreground hard-shadow-md">
          Start
        </button>
        <BackLink className="block text-sm font-bold underline-offset-4 hover:underline">
          Back
        </BackLink>
      </div>
    );
  }

  if (phase === "done") {
    const right = answers.filter((a) => a.correct).length;
    const missed = answers.filter((a) => !a.correct).map((a) => findItem(a.id)).filter(Boolean) as Item[];
    return (
      <div className="mx-auto max-w-xl space-y-6 px-4 py-8 text-center">
        <Chai mood={right >= 10 ? "cheer" : "happy"} size={130} />
        <p className="font-pix text-6xl">{right}</p>
        <p className="text-lg font-bold">correct in 60 seconds{right > bestBefore ? " · New best!" : ""}</p>
        {payout ? <p className="font-pix">+{payout.xp} XP</p> : null}
        {missed.length ? (
          <div className="space-y-2 text-left">
            <p className="text-eyebrow text-link">Worth another look (added to your review)</p>
            {missed.slice(0, 5).map((m) => (
              <p key={m.id} className="rounded-2xl border-2 border-foreground bg-card p-3 text-sm">
                <b>{m.kind === "tf" ? m.statement : m.kind === "mcq" ? m.prompt : ""}</b>
                <br />
                {m.student}
              </p>
            ))}
          </div>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={start} className="h-14 rounded-2xl border-2 border-foreground bg-primary text-lg font-bold text-primary-foreground hard-shadow-md">
            Go again
          </button>
          <BackLink className="flex h-14 items-center justify-center rounded-2xl border-2 border-foreground bg-card text-lg font-bold hard-shadow-sm">
            Done
          </BackLink>
        </div>
      </div>
    );
  }

  const item = deck[i];
  return (
    <div className={cn("mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl flex-col px-4 py-6 transition-colors", flash === "right" && "bg-primary/30", flash === "wrong" && "bg-foreground/15")}>
      <div className="flex items-center justify-between">
        <span className="font-pix text-3xl">{left}s</span>
        <span className="flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1 font-bold">
          <Flame className={cn("size-4", combo >= 3 && s.flame)} aria-hidden /> {combo}
        </span>
        <span className="font-pix text-xl">{answers.filter((a) => a.correct).length} ✓</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-foreground">
        <div className="h-full bg-brand transition-[width] duration-200" style={{ width: `${(left / BLITZ_SECONDS) * 100}%` }} />
      </div>
      <div key={`${item.id}-${answers.length}`} className={cn("mt-8 flex-1", s.rise)}>
        {item.kind === "tf" ? (
          <>
            <h2 className="text-2xl font-bold leading-tight">{item.statement}</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[true, false].map((v) => (
                <button key={String(v)} type="button" onClick={() => answer(v === item.answer)} className="h-24 rounded-2xl border-2 border-foreground bg-card text-2xl font-bold hard-shadow-sm active:translate-y-1">
                  {v ? "True" : "False"}
                </button>
              ))}
            </div>
          </>
        ) : item.kind === "mcq" ? (
          <>
            <h2 className="text-xl font-bold leading-tight">{item.prompt}</h2>
            <div className="mt-5 grid gap-2.5">
              {seeded(item.options.map((o, k) => ({ o, k })), item.id).map(({ o, k }) => (
                <button key={o} type="button" onClick={() => answer(k === item.answer)} className="rounded-2xl border-2 border-foreground bg-card px-4 py-3 text-left font-semibold hard-shadow-sm active:translate-y-0.5">
                  {o}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

