"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Check, Eye, Layers, RotateCcw, X } from "lucide-react";
import { istToday, recordTest } from "@/lib/learn/engine";
import { getLearnState, setLearnState } from "@/lib/learn/store";
import type { Card, Mcq } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { Rich } from "./rich";

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
  const label = title ?? (kind === "recall" ? "Check yourself" : "Viva rapid-fire");

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
        <p className="text-lg font-bold">Done: {items.length - missed.length} of {items.length} you knew</p>
        <p className="mt-1 text-sm text-muted-foreground">{missed.length ? "Re-read the parts behind the ones you missed, then try again." : "Solid. Move on."}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => { setI(0); setShown(false); setMissed([]); }} className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-foreground px-4 font-semibold">
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
    setShown(false);
    setI(i + 1);
  };
  return (
    <section className="rounded-2xl border-2 border-foreground bg-card p-4 sm:p-5" aria-label={label} aria-live="polite">
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
export function TestRunner({
  items,
  moduleId,
  label = "Module test",
  intro,
  onDone,
  autoStart = false,
}: {
  items: Mcq[];
  /** Where the score is saved (a module id, or a checkpoint key). */
  moduleId: string;
  label?: string;
  intro?: string[];
  onDone?: (right: number, total: number) => void;
  autoStart?: boolean;
}) {
  const [i, setI] = React.useState(autoStart ? 0 : -1);
  const [picks, setPicks] = React.useState<Record<number, number>>({});
  const [done, setDone] = React.useState(false);
  const right = items.filter((m, k) => picks[k] === m.answer).length;
  const top = React.useRef<HTMLDivElement>(null);
  const toTop = () => requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));

  function submit() {
    setDone(true);
    const s = getLearnState();
    if (s) setLearnState(recordTest(s, moduleId, right, items.length, istToday()));
    onDone?.(right, items.length);
    toTop();
  }

  if (i < 0 && !done) {
    return (
      <div ref={top} className="rounded-3xl border-2 border-foreground bg-card p-5 sm:p-6">
        <p className="text-2xl font-bold">{label}</p>
        <ul className="mt-3 space-y-1.5 text-[0.95rem] text-muted-foreground empty:hidden">
          {(intro ?? ["Pass mark: 80%. Your best score counts."]).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <button type="button" onClick={() => setI(0)} className="btn-sweep mt-5 inline-flex h-12 items-center gap-2 rounded-2xl border-2 border-foreground bg-primary px-6 font-bold text-primary-foreground hard-shadow-sm">
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
          <p className="mt-1 text-4xl font-black tabular-nums">
            {right} <span className="text-xl font-semibold">/ {items.length}</span>
          </p>
          <p className="mt-1 text-sm opacity-90">{right / items.length >= 0.8 ? "Strong. Look over the ones you missed, then move on." : "Go back to the sections behind the ones you missed, then re-test."}</p>
          <button type="button" onClick={() => { setPicks({}); setDone(false); setI(0); toTop(); }} className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-primary px-3 py-1.5 text-sm font-semibold text-primary">
            <RotateCcw className="size-4" aria-hidden /> Try again
          </button>
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
    <div ref={top} className="rounded-3xl border-2 border-foreground bg-card p-4 sm:p-6" aria-live="polite">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-semibold text-link">{label}</span>
        <span className="tabular-nums">
          {i + 1} of {items.length}
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
      <div className="mt-5 flex items-center justify-between gap-2">
        <button type="button" onClick={() => setI(i - 1)} disabled={i === 0} className="inline-flex h-11 items-center gap-1 rounded-xl border-2 border-foreground px-4 font-semibold disabled:opacity-40">
          <ArrowLeft className="size-4" aria-hidden /> Back
        </button>
        {last ? (
          <button type="button" onClick={submit} disabled={Object.keys(picks).length < items.length} className="inline-flex h-11 items-center gap-1 rounded-xl border-2 border-foreground bg-primary px-5 font-bold text-primary-foreground disabled:opacity-50">
            {Object.keys(picks).length < items.length ? `${items.length - Object.keys(picks).length} unanswered` : "Submit"}
          </button>
        ) : (
          <button type="button" onClick={() => setI(i + 1)} disabled={pick === undefined} className="inline-flex h-11 items-center gap-1 rounded-xl border-2 border-foreground bg-foreground px-5 font-semibold text-background disabled:opacity-40">
            Next <ArrowRight className="size-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
