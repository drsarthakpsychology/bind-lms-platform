"use client";

import * as React from "react";
import { startHowTo, useHowTo } from "@/components/help/how-to";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, BookOpen, Check, Crown, Flame, LoaderCircle, RotateCcw, Timer, Trophy, Users, X, Zap } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { BLITZ_MS, COMBO_STEPS, emptyRun, multiplier, type RunState } from "@/lib/games/blitz/engine";
import type { BlitzPrompt } from "@/lib/games/blitz/questions";
import type { Bests, FinishResult } from "@/lib/games/blitz/server";
import { CountUp } from "@/lib/games/ui/count-up";
import { btnPrimary, btnSecondary, card, chip } from "@/lib/games/ui/styles";
import fx from "@/lib/games/ui/fx.module.css";
import { answerBlitz, finishBlitz, startBlitz } from "./actions";
import { creditPlay, istToday, recordBlitzRound, type LearnState } from "@/lib/learn/engine";
import { getLearnState, initLearnStore, setLearnState } from "@/lib/learn/store";
import { useReaction } from "@/components/reactions/use-reaction";
import { EndReaction } from "@/components/reactions/graphics";

type Phase = "ready" | "countdown" | "run" | "finishing" | "done";
type Miss = { prompt: string; answer: string; why: string; learn: { label: string; href: string } };
type Reveal = { picked: number; answer: number; right: boolean };
type Done = Extract<FinishResult, { ok: true }>;

/** How long the right answer stays on screen before the next question. */
// Long enough to see the answer land (and read the right one after a miss), short enough to keep the pace.
const HOLD_RIGHT_MS = 420;
const HOLD_WRONG_MS = 1100;

function nextStep(combo: number): number | null {
  return COMBO_STEPS.find((s) => s > combo) ?? null;
}

export function BlitzGame({ bests, serverState, save }: { bests: Bests; serverState: LearnState | null; save: (s: LearnState) => Promise<unknown> }) {
  initLearnStore(serverState, save);
  const reduce = useReducedMotion();
  const anim = (cls: string) => (reduce === false ? cls : undefined);
  const [phase, setPhase] = React.useState<Phase>("ready");
  const [count, setCount] = React.useState(3);
  const [q, setQ] = React.useState<BlitzPrompt | null>(null);
  const [run, setRun] = React.useState<RunState>(emptyRun);
  const [left, setLeft] = React.useState(BLITZ_MS);
  const [reveal, setReveal] = React.useState<Reveal | null>(null);
  const [gain, setGain] = React.useState<{ n: number; key: number } | null>(null);
  const [burst, setBurst] = React.useState<{ mult: number; key: number } | null>(null);
  const [misses, setMisses] = React.useState<Miss[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState<Done | null>(null);
  const [shown, setShown] = React.useState(bests);
  // The clock is kept on the server and cannot pause: no how-to button while it runs.
  useHowTo("blitz", { hideWhile: phase === "countdown" || phase === "run" });
  const reaction = useReaction();

  const token = React.useRef<string | null>(null);
  const endAt = React.useRef(0);
  const inflight = React.useRef<Promise<unknown> | null>(null);
  const finishing = React.useRef(false);
  const timers = React.useRef<number[]>([]);
  /** Bumped each round, so a late reply from the last round is ignored. */
  const gen = React.useRef(0);

  const later = React.useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const finish = React.useCallback(async () => {
    if (finishing.current) return;
    finishing.current = true;
    setPhase("finishing");
    setLeft(0);
    await inflight.current?.catch(() => null);
    const t = token.current;
    if (!t) {
      setPhase("done");
      return;
    }
    const res = await finishBlitz(t).catch(() => ({ ok: false as const, error: "Connection lost. Your round could not be saved." }));
    if (res.ok) {
      setDone(res);
      setRun(res.state);
      setShown(res.bests);
      const ls = getLearnState();
      if (ls) {
        const next = recordBlitzRound(creditPlay(ls, res.xpSaved ? res.xp : 0, istToday()), res.state.correct);
        if (next !== ls) setLearnState(next);
      }
      haptic(res.newBest ? "success" : "tap");
    } else setError(res.error);
    setPhase("done");
  }, []);

  // The clock (local, re-synced to the server after every answer).
  React.useEffect(() => {
    if (phase !== "run") return;
    const id = window.setInterval(() => {
      const l = Math.max(0, endAt.current - Date.now());
      setLeft(l);
      if (l <= 0) {
        window.clearInterval(id);
        void finish();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, finish]);

  const begin = React.useCallback(async () => {
    setError(null);
    const res = await startBlitz().catch(() => ({ ok: false as const, error: "Connection lost. Try again." }));
    if (!res.ok) {
      setError(res.error);
      setPhase("ready");
      return;
    }
    token.current = res.token;
    endAt.current = Date.now() + res.msLeft;
    setLeft(res.msLeft);
    setQ(res.question);
    setPhase("run");
  }, []);

  const start = React.useCallback(() => {
    startHowTo("blitz");
    // Drop anything still scheduled from the last round.
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    gen.current += 1;
    finishing.current = false;
    setBusy(false);
    token.current = null;
    setRun(emptyRun());
    setMisses([]);
    setDone(null);
    setReveal(null);
    setBurst(null);
    setGain(null);
    setLeft(BLITZ_MS);
    setError(null);
    haptic("tap");
    if (reduce !== false) {
      void begin();
      setPhase("countdown");
      setCount(0);
      return;
    }
    setPhase("countdown");
    setCount(3);
    later(() => setCount(2), 600);
    later(() => setCount(1), 1200);
    later(() => void begin(), 1800);
  }, [begin, later, reduce]);

  const answer = React.useCallback(
    (choice: number) => {
      if (phase !== "run" || !q || busy || reveal || !token.current) return;
      setBusy(true);
      const asked = q;
      const mine = gen.current;
      const p = answerBlitz(token.current, asked.n, choice).then((res) => {
        if (mine !== gen.current) return;
        setBusy(false);
        if (!res.ok) {
          if (res.over) void finish();
          else setError(res.error);
          return;
        }
        setError(null);
        token.current = res.token;
        // Trust the server clock when the two drift apart.
        const serverEnd = Date.now() + res.msLeft;
        if (Math.abs(serverEnd - endAt.current) > 400) endAt.current = serverEnd;
        setRun(res.state);
        setReveal({ picked: choice, answer: res.answer, right: res.right });
        // The clock runs: counted, never a pop-up. The end screen gets the reaction.
        reaction.onAnswer(res.right, { timed: true });
        if (res.right) {
          haptic("tap");
          setGain((g) => ({ n: res.gained, key: (g?.key ?? 0) + 1 }));
          if (res.levelUp) {
            haptic("success");
            setBurst((b) => ({ mult: multiplier(res.state.combo), key: (b?.key ?? 0) + 1 }));
            later(() => setBurst(null), 950);
          }
        } else {
          haptic("warning");
          setMisses((m) => [...m, { prompt: asked.prompt, answer: asked.options[res.answer], why: res.why, learn: res.learn }]);
        }
        later(
          () => {
            setReveal(null);
            if (res.next) setQ(res.next);
            else void finish();
          },
          res.right ? HOLD_RIGHT_MS : HOLD_WRONG_MS,
        );
      }).catch(() => {
        // Lost connection: free the buttons so the same question can be tried again.
        if (mine !== gen.current) return;
        setBusy(false);
        setError("Connection lost. Tap your answer again.");
      });
      inflight.current = p;
    },
    [phase, q, busy, reveal, finish, later, reaction],
  );

  // Desktop keys: 1 to 4 answer, T/F for true or false, Enter or Space starts.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if ((phase === "ready" || phase === "done") && (e.key === "Enter" || e.key === " ") && t?.tagName !== "BUTTON" && t?.tagName !== "A") {
        e.preventDefault();
        start();
        return;
      }
      if (phase !== "run" || !q) return;
      const k = e.key.toLowerCase();
      if (q.kind === "tf" && (k === "t" || k === "f")) {
        e.preventDefault();
        answer(k === "t" ? 0 : 1);
        return;
      }
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) {
        e.preventDefault();
        answer(n - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, q, answer, start]);

  if (phase === "ready") return <Ready bests={shown} error={error} onStart={start} />;
  if (phase === "done" || phase === "finishing") return <Result done={done} run={run} misses={misses} bests={shown} error={error} pending={phase === "finishing"} onAgain={start} />;

  const secs = Math.ceil(left / 1000);
  const urgent = phase === "run" && left <= 10_000;
  const mult = multiplier(run.combo);
  const step = nextStep(run.combo);

  return (
    <div className="relative mx-auto w-full max-w-2xl space-y-4">
      {/* Clock, score and combo */}
      <div className={cn(card, "space-y-3 p-3 hard-shadow-sm sm:p-4")}>
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2" aria-label={`${secs} seconds left`}>
            <Timer className={cn("size-6", urgent && anim(fx.pulse))} aria-hidden />
            <span className="font-pix text-3xl tabular-nums sm:text-4xl">{secs}</span>
            <span className="text-sm font-bold">s</span>
          </p>
          <div className="relative text-right">
            <p className="text-xs font-bold text-muted-foreground">Score</p>
            <CountUp value={run.score} duration={0.35} className="font-pix text-3xl tabular-nums sm:text-4xl" />
            {gain && (
              <span key={gain.key} className={cn("absolute -top-3 right-0 font-pix text-lg text-link", reduce === false ? fx.burst : "sr-only")}>
                +{gain.n}
              </span>
            )}
          </div>
        </div>
        <div className="h-3 overflow-hidden rounded-sm border-2 border-foreground bg-background" aria-hidden>
          <div className={cn("h-full origin-left transition-transform duration-100 ease-linear", urgent ? "bg-destructive" : "bg-primary")} style={{ transform: `scaleX(${Math.max(0, Math.min(1, left / BLITZ_MS))})` }} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn(chip, mult > 1 ? "bg-foreground text-background" : "bg-card")} aria-label={`Combo ${run.combo}, points times ${mult}`}>
            <Flame className="size-4" aria-hidden /> {run.combo} in a row
          </span>
          <span key={mult} className={cn(chip, mult > 1 ? "bg-primary text-primary-foreground" : "bg-background", mult > 1 && anim(fx.pop))}>
            <Zap className="size-4" aria-hidden /> x{mult}
          </span>
          {step && (
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground" aria-label={`${step - run.combo} more for x${multiplier(step)}`}>
              {Array.from({ length: step - (COMBO_STEPS.filter((s) => s < step).pop() ?? 0) }, (_, i) => {
                const base = COMBO_STEPS.filter((s) => s < step).pop() ?? 0;
                return <span key={i} className={cn("size-2.5 rounded-[2px] border-2 border-foreground", base + i < run.combo ? "bg-primary" : "bg-background")} />;
              })}
              <span className="ml-1">x{multiplier(step)}</span>
            </span>
          )}
          <span className="ml-auto text-sm font-semibold tabular-nums">
            <Check className="mr-0.5 inline size-4" aria-hidden />
            {run.correct}/{run.answered}
          </span>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-md border-2 border-foreground bg-status-pending-bg px-3 py-2 text-sm font-semibold">
          {error}
        </p>
      )}

      {phase === "countdown" || !q ? (
        <div className={cn(card, "grid min-h-64 place-items-center p-8 text-center")}>
          {count > 0 ? (
            <p key={count} className={cn("font-pix text-8xl tabular-nums", anim(fx.pop))} aria-live="assertive">
              {count}
            </p>
          ) : (
            <p className="flex items-center gap-2 font-bold">
              <LoaderCircle className="size-5 animate-spin" aria-hidden /> Get ready
            </p>
          )}
        </div>
      ) : (
        <Question q={q} reveal={reveal} disabled={busy || !!reveal} onAnswer={answer} />
      )}

      {burst && (
        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center" aria-live="assertive">
          <span key={`r${burst.key}`} className={cn("absolute size-48 rounded-full border-4 border-foreground", reduce === false ? fx.ring : "hidden")} aria-hidden />
          <p key={burst.key} className={cn("relative rounded-lg border-2 border-foreground bg-primary px-6 py-3 text-center text-primary-foreground hard-shadow-lg", reduce === false && fx.combo)}>
            <span className="block font-pix text-6xl leading-none sm:text-7xl">x{burst.mult}</span>
            <span className="mt-1 block text-sm font-bold uppercase tracking-wide">Combo</span>
          </p>
        </div>
      )}
    </div>
  );
}

function Question({ q, reveal, disabled, onAnswer }: { q: BlitzPrompt; reveal: Reveal | null; disabled: boolean; onAnswer: (i: number) => void }) {
  const reduce = useReducedMotion();
  return (
    <section key={q.n} className={cn("space-y-3", reduce === false && fx.rise)} aria-label={`Question ${q.n + 1}`}>
      <div className={cn(card, "p-4 sm:p-5", reveal && !reveal.right && reduce === false && fx.shake)}>
        <p className="text-eyebrow text-link">{q.kind === "tf" ? "True or false" : "Pick one"}</p>
        <h2 className="mt-1 text-xl font-bold leading-snug sm:text-2xl">{q.prompt}</h2>
      </div>
      <div className={cn("grid gap-2", q.kind === "tf" ? "grid-cols-2" : "sm:grid-cols-2")}>
        {q.options.map((o, i) => {
          const isAnswer = reveal && i === reveal.answer;
          const isWrongPick = reveal && !reveal.right && i === reveal.picked;
          return (
            <button
              key={`${q.n}:${o}`}
              type="button"
              disabled={disabled}
              onClick={() => onAnswer(i)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md border-2 border-foreground px-3 py-3 text-left font-semibold leading-snug transition-[transform,background-color] duration-150 active:translate-y-px disabled:cursor-default",
                q.kind === "tf" ? "min-h-20 justify-center text-xl" : "min-h-14",
                isAnswer ? "bg-status-success-bg hard-shadow-xs" : isWrongPick ? "bg-status-alert-bg text-status-alert-fg" : "bg-card hover:-translate-y-0.5 hard-shadow-xs",
              )}
            >
              {q.kind === "pick" && <span className="hidden size-6 shrink-0 place-items-center rounded border-2 border-current font-pix text-xs lg:grid">{i + 1}</span>}
              {isAnswer && <Check className="size-5 shrink-0" aria-label="Right answer" />}
              {isWrongPick && <X className="size-5 shrink-0" aria-label="Your answer, wrong" />}
              <span className={cn(q.kind === "pick" && "min-w-0 flex-1")}>{o}</span>
              {q.kind === "tf" && <span className="hidden font-pix text-xs opacity-70 lg:inline">({i === 0 ? "T" : "F"})</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function BestLine({ bests }: { bests: Bests }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <p className={cn(card, "flex items-center gap-3 p-3")}>
        <Trophy className="size-5 shrink-0" aria-hidden />
        <span>
          <span className="block text-xs font-bold text-muted-foreground">Your best</span>
          <span className="font-pix text-2xl tabular-nums">{bests.mine || "None yet"}</span>
        </span>
      </p>
      <p className={cn(card, "flex items-center gap-3 p-3")}>
        <Users className="size-5 shrink-0" aria-hidden />
        <span className="min-w-0">
          <span className="block text-xs font-bold text-muted-foreground">{bests.cohort?.scope === "everyone" ? "Best of everyone" : "Batch best"}</span>
          {bests.cohort ? (
            <span className="block truncate">
              <span className="font-pix text-2xl tabular-nums">{bests.cohort.score}</span> <span className="text-sm font-semibold">{bests.cohort.you ? "You hold it" : bests.cohort.name}</span>
            </span>
          ) : (
            <span className="text-sm font-semibold">Nobody yet. Be the first.</span>
          )}
        </span>
      </p>
    </div>
  );
}

function Ready({ bests, error, onStart }: { bests: Bests; error: string | null; onStart: () => void }) {
  const cohort = bests.cohort;
  return (
    <div className="mx-auto w-full max-w-2xl space-y-3">
      {/* One game card: the mark, the scores to beat, then Start inside it. */}
      <section aria-labelledby="blitz-ready" className={cn(card, "overflow-hidden hard-shadow-md")}>
        <div className="relative flex items-center gap-3 border-b-2 border-foreground bg-primary p-4 text-primary-foreground">
          <span aria-hidden className="absolute inset-0 opacity-15 [background-image:radial-gradient(currentColor_1px,transparent_1.5px)] [background-size:12px_12px]" />
          <span aria-hidden className="relative grid size-14 shrink-0 -rotate-6 place-items-center rounded-full border-2 border-foreground bg-card text-foreground hard-shadow-xs">
            <Timer className="size-7" />
          </span>
          <h2 id="blitz-ready" className="relative text-h3 leading-tight">
            Beat the clock
          </h2>
        </div>
        <dl className="grid grid-cols-2 divide-x-2 divide-foreground">
          <div className="min-w-0 p-4">
            <dt className="flex items-center gap-1.5 text-caption font-bold text-muted-foreground">
              <Trophy className="size-4" aria-hidden /> Your best
            </dt>
            <dd className={cn("mt-1 tabular-nums", bests.mine ? "font-pix text-3xl leading-none" : "text-body-strong")}>{bests.mine || "None yet"}</dd>
          </div>
          <div className="min-w-0 p-4">
            <dt className="flex items-center gap-1.5 text-caption font-bold text-muted-foreground">
              <Users className="size-4" aria-hidden /> {cohort?.scope === "everyone" ? "Best of everyone" : "Batch best"}
            </dt>
            {cohort ? (
              <dd className="mt-1 min-w-0">
                <span className="font-pix text-3xl leading-none tabular-nums">{cohort.score}</span>
                <span className="block truncate text-small font-semibold">{cohort.you ? "You hold it" : cohort.name}</span>
              </dd>
            ) : (
              <dd className="mt-1 text-body-strong">Be the first</dd>
            )}
          </div>
        </dl>
        <div className="border-t-2 border-foreground p-4">
          <button type="button" className={cn(btnPrimary, "min-h-14 w-full text-lg")} onClick={onStart}>
            <Zap className="size-5" aria-hidden /> Start the clock <span className="hidden text-sm font-normal lg:inline">(Enter)</span>
          </button>
        </div>
      </section>
      {!bests.stored && <p className="text-sm text-muted-foreground">Scores aren&apos;t being saved yet. You can still play.</p>}
      {error && (
        <p role="alert" className="rounded-md border-2 border-foreground bg-status-alert-bg px-3 py-2 text-sm font-semibold text-status-alert-fg">
          {error}
        </p>
      )}
    </div>
  );
}

function Result({ done, run, misses, bests, error, pending, onAgain }: { done: Done | null; run: RunState; misses: Miss[]; bests: Bests; error: string | null; pending: boolean; onAgain: () => void }) {
  const reduce = useReducedMotion();
  const anim = (cls: string) => (reduce === false ? cls : undefined);
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <section className={cn(card, "relative overflow-hidden p-6 text-center hard-shadow-md", done?.newBest ? "bg-status-success-bg" : "bg-card", anim(fx.land))} aria-label="Round result">
        <p className={cn("mx-auto inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-foreground px-3 py-1 font-pix text-lg uppercase text-background", anim(fx.stamp))}>
          <Timer className="size-5" aria-hidden /> Time
        </p>
        {pending ? (
          <p className="mt-4 flex items-center justify-center gap-2 font-semibold">
            <LoaderCircle className="size-5 animate-spin" aria-hidden /> Checking your round
          </p>
        ) : (
          <>
            <p className="mt-4">
              <CountUp value={run.score} duration={1.1} className="font-pix text-6xl tabular-nums" />
              <span className="ml-1 text-sm font-bold">points</span>
            </p>
            <p className="mt-1 text-sm font-semibold">
              {run.correct} right of {run.answered} · best combo {run.best}
            </p>
            <EndReaction right={run.correct} total={Math.max(run.answered, 1)} seed={run.score} className="mx-auto mt-4 w-fit max-w-full justify-center" />
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {done?.newBest && (
                <span className={cn(chip, "bg-primary text-primary-foreground", anim(fx.pop))}>
                  <Crown className="size-4" aria-hidden /> New best
                </span>
              )}
              {done && done.xp > 0 && <span className={cn(chip, "bg-card", anim(fx.pop))}>+{done.xp} XP</span>}
            </div>
          </>
        )}
      </section>

      {error && (
        <p role="alert" className="rounded-md border-2 border-foreground bg-status-alert-bg px-3 py-2 text-sm font-semibold text-status-alert-fg">
          {error}
        </p>
      )}

      {!pending && <BestLine bests={bests} />}

      {misses.length > 0 && (
        <section className={cn(card, "p-4")} aria-labelledby="missed">
          <h2 id="missed" className="text-h3">
            What you missed ({misses.length})
          </h2>
          <ul className="mt-3 space-y-3">
            {misses.map((m, i) => (
              <li key={i} className={cn("rounded-md border-2 border-dashed border-foreground p-3", anim(fx.stagger))} style={{ "--i": Math.min(i, 8) } as React.CSSProperties}>
                <p className="font-semibold leading-snug">{m.prompt}</p>
                <p className="mt-1 text-sm">
                  <Check className="mr-1 inline size-4" aria-hidden />
                  <span className="font-bold">Answer: {m.answer}.</span> {m.why}
                </p>
                <Link href={m.learn.href} className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-bold text-link underline-offset-4 hover:underline">
                  <BookOpen className="size-4" aria-hidden /> Learn this: {m.learn.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <button type="button" className={cn(btnPrimary, "min-h-12")} onClick={onAgain} disabled={pending}>
          <RotateCcw className="size-4" aria-hidden /> Play again <span className="hidden text-sm font-normal lg:inline">(Enter)</span>
        </button>
        <Link href="/games" className={btnSecondary}>
          <ArrowLeft className="size-4" aria-hidden /> Back to Games
        </Link>
      </div>
    </div>
  );
}
