"use client";

import * as React from "react";
import { HowToButton } from "@/components/help/how-to";
import { ArrowLeft, ArrowRight, Check, Eye, Layers, RotateCcw, X } from "lucide-react";
import { istToday, recordTest } from "@/lib/learn/engine";
import { getLearnState, setLearnState } from "@/lib/learn/store";
import type { Card, Mcq } from "@/lib/study/types";
import { noteAnswers, orderFor, useHistoryPrefetch } from "@/lib/history/client";
import type { HistoryTool } from "@/lib/history/order";
import { cn } from "@/lib/utils";
import { mcqKey } from "@/lib/study/test-grade";
import { ThumbBar } from "@/components/mobile/thumb-bar";
import { Rich } from "./rich";
import { useReaction } from "@/components/reactions/use-reaction";
import { EndReaction, HalftoneCorner, ScoreDial } from "@/components/reactions/graphics";
import { useUiV2 } from "@/components/learn-v2/ui-v2";
import { ProgressLine } from "@/components/learn-v2/parts";

/* New design (ui_v2): shared button shapes for the test and the cards. */
const v2Lime =
  "inline-flex min-h-[3.25rem] min-w-0 items-center justify-center gap-2 rounded-[var(--ds-radius)] border-2 border-foreground bg-primary px-6 type-body font-bold text-primary-foreground hard-shadow-sm outline-none transition-[transform,box-shadow] duration-[var(--ds-press)] ease-[var(--ds-ease)] focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:shadow-none";
const v2Quiet =
  "inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] px-5 type-body font-semibold outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)] disabled:opacity-40";
/** The verdict: a band the full width of the screen on phones, in ink. */
const v2Band = "-mx-5 bg-foreground px-5 py-6 text-background sm:mx-0 sm:rounded-[var(--ds-radius)] sm:px-6";

/**
 * Self-tests are never spread across the notes. Each one sits behind a small
 * start card and, once started, shows one question at a time.
 */

function ProgressBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full border-2 border-foreground bg-card" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className="h-full bg-brand transition-[width] duration-500" style={{ width: `${(value / Math.max(1, max)) * 100}%` }} />
    </div>
  );
}

/** Recall check or viva cards: start, then one card at a time (say it, reveal, next). */
export function CardDeck({
  items,
  kind,
  onDone,
  title,
  autoStart = false,
}: {
  items: Card[];
  kind: "recall" | "viva";
  onDone?: (knew: number, total: number) => void;
  title?: string;
  autoStart?: boolean;
}) {
  const [i, setI] = React.useState(autoStart ? 0 : -1);
  const [shown, setShown] = React.useState(false);
  const [missed, setMissed] = React.useState<number[]>([]);
  const [rounds, setRounds] = React.useState(0);
  const reaction = useReaction();
  const label = title ?? (kind === "recall" ? "Check yourself" : "Viva rapid-fire");
  const v2 = useUiV2();

  if (v2 && i < 0) {
    return (
      <section className="flex flex-col gap-3 border-t border-[var(--ds-hairline)] pt-6" aria-label={label}>
        <h2 className="type-h3">{label}</h2>
        <p className="type-body text-muted-foreground">Cover the notes, say each answer out loud, then check.</p>
        <button type="button" onClick={() => setI(0)} className={cn(v2Quiet, "w-full md:w-fit")}>
          Start <ArrowRight className="size-4" aria-hidden />
        </button>
      </section>
    );
  }
  if (v2 && i >= items.length) {
    const knew = items.length - missed.length;
    return (
      <section className={v2Band} role="status">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="text-foreground">
            <ScoreDial right={knew} total={items.length} label="known" />
          </div>
          <EndReaction right={knew} total={items.length} seed={rounds} tone="dark" className="min-w-0 flex-1 basis-56" />
        </div>
        <p className="mt-4 type-h3">
          {knew} of {items.length} you knew
        </p>
        <p className="mt-1 type-small opacity-80">{missed.length ? "Re-read the parts behind the ones you missed, then try again." : "Solid. Move on."}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => { reaction.reset(); setRounds((n) => n + 1); setI(0); setShown(false); setMissed([]); }} className="inline-flex min-h-12 items-center gap-2 rounded-[var(--ds-radius)] border-[1.5px] border-background/40 px-5 type-body font-semibold">
            <RotateCcw className="size-4" aria-hidden /> Again
          </button>
          {onDone ? (
            <button type="button" onClick={() => onDone(knew, items.length)} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[var(--ds-radius)] border-2 border-primary bg-primary px-5 type-body font-bold text-primary-foreground sm:flex-none">
              Continue <ArrowRight className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  if (i < 0) {
    return (
      <section className="rounded-2xl border-2 border-dashed border-foreground bg-card p-4 sm:p-5" aria-label={label}>
        <p className="flex items-center gap-2 text-sm font-semibold text-link">
          <Layers className="size-4" aria-hidden /> {label}
        </p>
        <p className="mt-1 text-[0.95rem] text-muted-foreground">
          {items.length} question{items.length === 1 ? "" : "s"}. Cover the notes, say each answer out loud, then check.
        </p>
        <button type="button" onClick={() => setI(0)} className="mt-3 inline-flex h-11 items-center gap-2 rounded-xl border-2 border-foreground bg-foreground px-4 font-semibold text-background">
          Start <ArrowRight className="size-4" aria-hidden />
        </button>
      </section>
    );
  }

  if (i >= items.length) {
    return (
      <section className="rounded-2xl border-2 border-foreground bg-card p-5 text-center" role="status">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <ScoreDial right={items.length - missed.length} total={items.length} label="known" />
          <EndReaction right={items.length - missed.length} total={items.length} seed={rounds} className="min-w-0 basis-56" />
        </div>
        <p className="mt-4 text-lg font-bold">Done: {items.length - missed.length} of {items.length} you knew</p>
        <p className="mt-1 text-sm text-muted-foreground">{missed.length ? "Re-read the parts behind the ones you missed, then try again." : "Solid. Move on."}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => { reaction.reset(); setRounds((n) => n + 1); setI(0); setShown(false); setMissed([]); }} className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-foreground px-4 font-semibold">
            <RotateCcw className="size-4" aria-hidden /> Again
          </button>
          {onDone ? (
            <button type="button" onClick={() => onDone(items.length - missed.length, items.length)} className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-foreground bg-primary px-4 font-semibold text-primary-foreground">
              Continue <ArrowRight className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  const c = items[i];
  const next = (knew: boolean) => {
    if (!knew) setMissed([...missed, i]);
    reaction.onAnswer(knew);
    setShown(false);
    setI(i + 1);
  };
  if (v2) {
    return (
      <section className="flex flex-col gap-4" aria-label={label} aria-live="polite">
        <div className="flex items-center justify-between gap-3 type-small text-muted-foreground">
          <span className="font-semibold">{label}</span>
          <span className="type-num">
            {i + 1} of {items.length}
          </span>
        </div>
        <ProgressLine pct={(i / Math.max(1, items.length)) * 100} label={label} className="h-1" />
        <p className="type-h3 [overflow-wrap:anywhere]">
          <Rich text={c.q} />
        </p>
        {shown ? (
          <>
            {c.a ? (
              <p className="rounded-[var(--ds-radius)] bg-[var(--ds-tint)] p-4 type-body [overflow-wrap:anywhere]">
                <Rich text={c.a} />
              </p>
            ) : (
              <p className="type-small text-muted-foreground">The answer is in the notes above.</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => next(false)} className={v2Quiet}>
                Not yet
              </button>
              <button type="button" onClick={() => next(true)} className={cn(v2Quiet, "border-foreground bg-foreground text-background active:bg-foreground")}>
                I knew it
              </button>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => setShown(true)} className={cn(v2Quiet, "w-full md:w-fit")}>
            <Eye className="size-4" aria-hidden /> Show answer
          </button>
        )}
      </section>
    );
  }
  return (
    <section className="relative isolate overflow-hidden rounded-2xl border-2 border-foreground bg-card p-4 sm:p-5" aria-label={label} aria-live="polite">
      <HalftoneCorner />
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span className="font-semibold text-link">{label}</span>
        <span className="tabular-nums">
          {i + 1} of {items.length}
        </span>
      </div>
      <div className="mt-2">
        <ProgressBar value={i} max={items.length} />
      </div>
      <p className="mt-4 text-lg font-semibold leading-snug">
        <Rich text={c.q} />
      </p>
      {shown ? (
        <>
          {c.a ? (
            <p className="mt-3 rounded-xl bg-primary px-3 py-2.5 leading-relaxed text-primary-foreground">
              <Rich text={c.a} />
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">The answer is in the notes above.</p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => next(false)} className="h-11 rounded-xl border-2 border-foreground font-semibold">
              Not yet
            </button>
            <button type="button" onClick={() => next(true)} className="h-11 rounded-xl border-2 border-foreground bg-foreground font-semibold text-background">
              I knew it
            </button>
          </div>
        </>
      ) : (
        <button type="button" onClick={() => setShown(true)} className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl border-2 border-foreground px-4 font-semibold">
          <Eye className="size-4" aria-hidden /> Show answer
        </button>
      )}
    </section>
  );
}

/** The module test: a start screen, one question at a time, then the score and a review. */
/** A stable id for a study question in the answer history (its text, hashed). */
export { mcqKey };

const TEST_INTRO = ["Pass mark: 80%. Your best score counts."];

export function TestRunner({
  items: given,
  moduleId,
  label = "Module test",
  intro,
  onDone,
  autoStart = false,
  historyTool = "module-test",
  retry,
  scoreOf,
  grade,
}: {
  items: Mcq[];
  /** Where the score is saved (a module id, or a checkpoint key). */
  moduleId: string;
  label?: string;
  intro?: string[];
  onDone?: (right: number, total: number) => void;
  autoStart?: boolean;
  /** Where answers are remembered (src/lib/history): each start opens on questions not yet seen, then missed ones. */
  historyTool?: HistoryTool;
  /** The questions for "Try again" (default: all of them, in history order). An empty list means nothing is left to retry. */
  retry?: () => Mcq[];
  /** The score to save and report, from this round's (default: this round's). Called after the answers are remembered. */
  scoreOf?: (round: { right: number; total: number }) => { right: number; total: number };
  /** Module tests: the server grades the picks and keeps the result (the certificate counts it). */
  grade?: (moduleId: string, picks: Record<string, number>) => Promise<unknown>;
}) {
  useHistoryPrefetch(historyTool);
  const [items, setItems] = React.useState(given);
  // Set when "Try again" has nothing left to ask (every question already right).
  const [allRight, setAllRight] = React.useState(false);
  const sent = React.useRef(false);
  const reorder = () => {
    const next = retry ? retry() : orderFor(historyTool, given, (m) => mcqKey(moduleId, m));
    if (!next.length) return false;
    setItems(next);
    return true;
  };
  const [i, setI] = React.useState(autoStart ? 0 : -1);
  const [picks, setPicks] = React.useState<Record<number, number>>({});
  const [done, setDone] = React.useState(false);
  const [attempt, setAttempt] = React.useState(0);
  const right = items.filter((m, k) => picks[k] === m.answer).length;
  const top = React.useRef<HTMLDivElement>(null);
  const v2 = useUiV2();
  const toTop = () => requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

  function submit() {
    // One save per sitting, however fast the button is tapped.
    if (sent.current) return;
    sent.current = true;
    setDone(true);
    noteAnswers(historyTool, items.map((m, k) => ({ item: mcqKey(moduleId, m), correct: picks[k] === m.answer })));
    const score = scoreOf ? scoreOf({ right, total: items.length }) : { right, total: items.length };
    const s = getLearnState();
    if (s) setLearnState(recordTest(s, moduleId, score.right, score.total, istToday()));
    if (grade) {
      const sent: Record<string, number> = {};
      items.forEach((m, k) => {
        if (picks[k] !== undefined) sent[mcqKey(moduleId, m)] = picks[k];
      });
      void grade(moduleId, sent).catch(() => undefined);
    }
    onDone?.(score.right, score.total);
    toTop();
  }

  if (v2 && i < 0 && !done) {
    return (
      <div ref={top} className="flex scroll-mt-shell flex-col gap-3">
        <h2 className="type-h2">{label}</h2>
        <ul className="flex flex-col gap-1 type-body text-muted-foreground empty:hidden">
          {(intro ?? TEST_INTRO).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <button type="button" onClick={() => { reorder(); setI(0); }} className={cn(v2Lime, "mt-2 w-full md:w-fit md:min-w-60")}>
          Start <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    );
  }

  if (v2 && done) {
    return (
      <div ref={top} className="flex scroll-mt-shell flex-col gap-6">
        <div className={v2Band} role="status">
          <p className="type-small font-semibold text-primary">Your score</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="text-foreground">
              <ScoreDial right={right} total={items.length} />
            </div>
            <EndReaction right={right} total={items.length} seed={attempt} tone="dark" className="min-w-0 flex-1 basis-56" />
          </div>
          <p className="sr-only">
            {right} / {items.length}
          </p>
          <p className="mt-3 type-body opacity-90">{right / items.length >= 0.8 ? "Strong. Look over the ones you missed, then move on." : "Go back to the sections behind the ones you missed, then re-test."}</p>
          {allRight ? (
            <p className="mt-3 type-small font-semibold text-primary">Every question here is right now.</p>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!reorder()) return setAllRight(true);
                sent.current = false;
                setAttempt((n) => n + 1);
                setPicks({});
                setDone(false);
                setI(0);
                toTop();
              }}
              className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-[var(--ds-radius)] border-[1.5px] border-primary px-5 type-body font-semibold text-primary"
            >
              <RotateCcw className="size-4" aria-hidden /> {retry ? "Try the missed ones again" : "Try again"}
            </button>
          )}
        </div>
        <details className="group border-y border-[var(--ds-hairline)]" open={right < items.length}>
          <summary className="flex min-h-14 cursor-pointer list-none items-center type-body font-semibold [&::-webkit-details-marker]:hidden">Review your answers</summary>
          <ol className="flex flex-col divide-y divide-[var(--ds-hairline)] border-t border-[var(--ds-hairline)]">
            {items.map((m, k) => {
              const ok = picks[k] === m.answer;
              return (
                <li key={k} className="flex gap-3 py-4">
                  <span className={cn("mt-1 grid size-5 shrink-0 place-items-center rounded-full", ok ? "bg-primary text-primary-foreground" : "bg-status-alert-bg text-status-alert-fg")}>
                    {ok ? <Check className="size-3" aria-hidden /> : <X className="size-3" aria-hidden />}
                    <span className="sr-only">{ok ? "Right" : "Wrong"}</span>
                  </span>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <p className="type-body font-semibold [overflow-wrap:anywhere]">
                      <Rich text={m.q} />
                    </p>
                    <p className="type-small [overflow-wrap:anywhere]">
                      <span className="font-semibold">Answer:</span> <Rich text={m.options[m.answer]} />
                      {!ok && picks[k] !== undefined ? (
                        <span className="text-muted-foreground"> · you chose <Rich text={m.options[picks[k]]} /></span>
                      ) : null}
                    </p>
                    {m.why ? (
                      <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">
                        <Rich text={m.why} />
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </details>
      </div>
    );
  }

  if (v2) {
    const m = items[i];
    const pick = picks[i];
    const last = i === items.length - 1;
    const left = items.length - Object.keys(picks).length;
    return (
      <div ref={top} className="flex scroll-mt-shell flex-col gap-4" aria-live="polite">
        <div className="flex items-center justify-between gap-3 type-small text-muted-foreground">
          <span className="font-semibold">{label}</span>
          <span className="flex items-center gap-1">
            <span className="type-num">
              {i + 1} of {items.length}
            </span>
            {(intro ?? TEST_INTRO).length ? <HowToButton id="module-test" label="How it works" title={label} steps={intro ?? TEST_INTRO} className="-my-2 text-foreground" /> : null}
          </span>
        </div>
        <ProgressLine pct={(i / Math.max(1, items.length)) * 100} label={label} className="h-1" />
        <p className="pt-2 type-h3 [overflow-wrap:anywhere]">
          <Rich text={m.q} />
        </p>
        {/* Options as large rows: the whole row is the target. */}
        <div className="grid gap-3" role="radiogroup" aria-label={`Question ${i + 1}`}>
          {m.options.map((o, j) => (
            <button
              key={j}
              type="button"
              role="radio"
              aria-checked={pick === j}
              onClick={() => setPicks({ ...picks, [i]: j })}
              className={cn(
                "flex min-h-14 items-center gap-3 rounded-[var(--ds-radius)] border-[1.5px] px-4 py-3 text-left type-body outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring",
                pick === j ? "border-foreground bg-[var(--ds-tint)] font-semibold" : "border-[var(--ds-card-line)] hover:border-foreground",
              )}
            >
              <span aria-hidden className={cn("grid size-6 shrink-0 place-items-center rounded-full type-caption", pick === j ? "bg-foreground text-background" : "border-[1.5px] border-[var(--ds-card-line)] text-muted-foreground")}>
                {String.fromCharCode(65 + j)}
              </span>
              <span className="min-w-0 [overflow-wrap:anywhere]">
                <Rich text={o} />
              </span>
            </button>
          ))}
        </div>
        <ThumbBar label="Move through the test" className="border-t border-[var(--ds-hairline)] md:mt-4" inlineClassName="md:justify-between md:gap-3">
          <button type="button" onClick={() => setI(i - 1)} disabled={i === 0} aria-label="Back" className="inline-flex size-[3.25rem] shrink-0 items-center justify-center gap-2 rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] bg-background type-body font-semibold disabled:opacity-40 md:w-auto md:px-5">
            <ArrowLeft className="size-5" aria-hidden /> <span className="hidden md:inline">Back</span>
          </button>
          {last ? (
            <button type="button" onClick={submit} disabled={left > 0} className={cn(v2Lime, "flex-1 md:min-w-60 md:flex-none")}>
              {left > 0 ? `${left} unanswered` : "Submit"}
            </button>
          ) : (
            <button type="button" onClick={() => setI(i + 1)} disabled={pick === undefined} className={cn(v2Lime, "flex-1 md:min-w-60 md:flex-none")}>
              Next <ArrowRight className="size-5" aria-hidden />
            </button>
          )}
        </ThumbBar>
      </div>
    );
  }

  if (i < 0 && !done) {
    return (
      <div ref={top} className="rounded-3xl border-2 border-foreground bg-card p-5 sm:p-6">
        <p className="text-2xl font-bold">{label}</p>
        <ul className="mt-3 space-y-1.5 text-[0.95rem] text-muted-foreground empty:hidden">
          {(intro ?? TEST_INTRO).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <button type="button" onClick={() => { reorder(); setI(0); }} className="btn-sweep mt-5 inline-flex h-12 items-center gap-2 rounded-2xl border-2 border-foreground bg-primary px-6 font-bold text-primary-foreground hard-shadow-sm">
          Start <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div ref={top} className="space-y-4">
        <div className="rounded-3xl border-2 border-foreground bg-foreground p-5 text-background" role="status">
          <p className="text-sm font-semibold text-primary">Your score</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="text-foreground">
              <ScoreDial right={right} total={items.length} />
            </div>
            <EndReaction right={right} total={items.length} seed={attempt} tone="dark" className="min-w-0 flex-1 basis-56" />
          </div>
          <p className="sr-only">
            {right} / {items.length}
          </p>
          <p className="mt-1 text-sm opacity-90">{right / items.length >= 0.8 ? "Strong. Look over the ones you missed, then move on." : "Go back to the sections behind the ones you missed, then re-test."}</p>
          {allRight ? (
            <p className="mt-3 text-sm font-semibold text-primary">Every question here is right now.</p>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!reorder()) return setAllRight(true);
                sent.current = false;
                setAttempt((n) => n + 1);
                setPicks({});
                setDone(false);
                setI(0);
                toTop();
              }}
              className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-primary px-3 py-1.5 text-sm font-semibold text-primary"
            >
              <RotateCcw className="size-4" aria-hidden /> {retry ? "Try the missed ones again" : "Try again"}
            </button>
          )}
        </div>
        <details className="rounded-2xl border-2 border-foreground bg-card p-4" open={right < items.length}>
          <summary className="cursor-pointer font-semibold">Review your answers</summary>
          <ol className="mt-3 space-y-3">
            {items.map((m, k) => {
              const ok = picks[k] === m.answer;
              return (
                <li key={k} className="rounded-xl border-2 border-foreground/15 p-3">
                  <p className="font-semibold leading-snug">
                    <span className={cn("mr-1.5 inline-grid size-5 place-items-center rounded-full align-[-3px]", ok ? "bg-primary text-primary-foreground" : "bg-status-alert-bg text-status-alert-fg")}>
                      {ok ? <Check className="size-3" aria-hidden /> : <X className="size-3" aria-hidden />}
                    </span>
                    <Rich text={m.q} />
                  </p>
                  <p className="mt-1.5 text-sm">
                    <span className="font-semibold">Answer:</span> <Rich text={m.options[m.answer]} />
                    {!ok && picks[k] !== undefined ? (
                      <span className="text-muted-foreground"> · you chose <Rich text={m.options[picks[k]]} /></span>
                    ) : null}
                  </p>
                  {m.why ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      <Rich text={m.why} />
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </details>
      </div>
    );
  }

  const m = items[i];
  const pick = picks[i];
  const last = i === items.length - 1;
  return (
    <div ref={top} className="relative isolate overflow-hidden rounded-3xl border-2 border-foreground bg-card p-4 sm:p-6" aria-live="polite">
      <HalftoneCorner />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-semibold text-link">{label}</span>
        <span className="flex items-center gap-1">
          <span className="tabular-nums">
            {i + 1} of {items.length}
          </span>
          {/* The start card's words, during the test. */}
          {(intro ?? TEST_INTRO).length ? <HowToButton id="module-test" label="How it works" title={label} steps={intro ?? TEST_INTRO} className="-my-2 text-foreground" /> : null}
        </span>
      </div>
      <div className="mt-2">
        <ProgressBar value={i} max={items.length} />
      </div>
      <p className="mt-4 text-lg font-semibold leading-snug">
        <Rich text={m.q} />
      </p>
      <div className="mt-4 grid gap-2" role="radiogroup" aria-label={`Question ${i + 1}`}>
        {m.options.map((o, j) => (
          <button
            key={j}
            type="button"
            role="radio"
            aria-checked={pick === j}
            onClick={() => setPicks({ ...picks, [i]: j })}
            className={cn("flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-colors", pick === j ? "border-foreground bg-brand text-brand-foreground" : "border-foreground/30 hover:border-foreground")}
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-current text-xs font-semibold">{String.fromCharCode(97 + j)}</span>
            <Rich text={o} />
          </button>
        ))}
      </div>
      {/* Phones: Back and Next sit low, where the thumb is (ThumbBar). */}
      <ThumbBar label="Move through the test" className="md:mt-5" inlineClassName="md:justify-between md:gap-2">
        <button type="button" onClick={() => setI(i - 1)} disabled={i === 0} className="inline-flex h-12 shrink-0 items-center gap-1 rounded-xl border-2 border-foreground bg-card px-4 font-semibold disabled:opacity-40 md:h-11">
          <ArrowLeft className="size-4" aria-hidden /> Back
        </button>
        {last ? (
          <button type="button" onClick={submit} disabled={Object.keys(picks).length < items.length} className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-1 rounded-xl border-2 border-foreground bg-primary px-5 font-bold text-primary-foreground disabled:opacity-50 md:h-11 md:flex-none">
            {Object.keys(picks).length < items.length ? `${items.length - Object.keys(picks).length} unanswered` : "Submit"}
          </button>
        ) : (
          <button type="button" onClick={() => setI(i + 1)} disabled={pick === undefined} className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-1 rounded-xl border-2 border-foreground bg-primary px-5 font-bold text-primary-foreground disabled:opacity-40 md:h-11 md:flex-none md:bg-foreground md:font-semibold md:text-background">
            Next <ArrowRight className="size-4" aria-hidden />
          </button>
        )}
      </ThumbBar>
    </div>
  );
}
