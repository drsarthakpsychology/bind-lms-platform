"use client";

import * as React from "react";
import { Check, RotateCcw, Trophy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";
import { sfx } from "./sfx";

/**
 * A short challenge at the foot of a scene: a few questions about what the
 * scene shows, one at a time, scored on the first try. Every answer is
 * explained in words, and the score is written out, never colour alone.
 */
export type ChallengeQ = { q: string; options: string[]; answer: number; why: string };

const optCls = "min-h-11 w-full rounded-md border-2 px-3 py-2 text-left text-sm font-semibold transition-transform duration-fast active:translate-x-px active:translate-y-px";

export function QuickChallenge({ title, items, kind, onWin }: { title: string; items: ChallengeQ[]; kind: string; onWin?: () => void }) {
  const [i, setI] = React.useState(0);
  const [picked, setPicked] = React.useState<number[]>([]); // wrong picks on this question, then the right one
  const [score, setScore] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const it = items[Math.min(i, items.length - 1)];
  const solved = picked.includes(it.answer);
  const finished = i >= items.length;
  const pick = (k: number) => {
    if (solved || picked.includes(k)) return;
    const right = k === it.answer;
    if (right && picked.length === 0) setScore((x) => x + 1);
    setPicked((p) => [...p, k]);
    sfx(right ? "good" : "bad");
    trackLearn({ type: "widget", kind, item: `challenge-${i}-${right ? "right" : "wrong"}` });
  };
  const next = () => {
    const n = i + 1;
    setI(n);
    setPicked([]);
    if (n >= items.length) {
      if (score === items.length) onWin?.();
      trackLearn({ type: "widget", kind, score: score / items.length });
    }
  };
  const again = () => {
    setI(0);
    setPicked([]);
    setScore(0);
  };
  if (!open) {
    return (
      <button type="button" className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-foreground bg-[var(--status-pending-bg)] px-3 text-sm font-semibold" onClick={() => setOpen(true)}>
        <Trophy className="size-4" aria-hidden /> Quick challenge: {title}
      </button>
    );
  }
  return (
    <section className="mt-3 rounded-xl border-2 border-foreground p-3" aria-label={`Quick challenge: ${title}`}>
      <div className="flex items-center justify-between gap-2 text-sm font-semibold">
        <span className="flex items-center gap-1.5"><Trophy className="size-4" aria-hidden /> {title}</span>
        <span className="tabular-nums" aria-live="polite">Score {score}</span>
      </div>
      {finished ? (
        <div className="vibha-pop mt-2">
          <p className="font-semibold">{score === items.length ? `Full marks: ${score} of ${items.length} first time.` : `You got ${score} of ${items.length} first time.`}</p>
          <button type="button" className={cn(optCls, "mt-2 inline-flex w-auto items-center gap-2 border-foreground bg-card")} onClick={again}><RotateCcw className="size-4" aria-hidden /> Try again</button>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-[0.95rem] font-semibold">Question {i + 1}. {it.q}</p>
          <div className="mt-2 grid gap-1.5" role="group" aria-label="Answers">
            {it.options.map((o, k) => {
              const wrong = picked.includes(k) && k !== it.answer;
              const right = solved && k === it.answer;
              return (
                <button key={o} type="button" aria-pressed={picked.includes(k)} disabled={solved && !right} onClick={() => pick(k)} className={cn(optCls, right ? "vibha-pop border-foreground bg-[var(--status-success-bg)]" : wrong ? "border-foreground/40 bg-[var(--status-alert-bg)] line-through" : "border-foreground bg-card hover:-translate-y-0.5", solved && !right ? "opacity-60" : "")}>
                  <span className="inline-flex items-center gap-1.5">{right ? <Check className="size-4" aria-hidden /> : wrong ? <X className="size-4" aria-hidden /> : null}{o}</span>
                </button>
              );
            })}
          </div>
          {picked.length ? (
            <p className="mt-2 text-[0.95rem]" role="status" aria-live="polite">
              <span className="font-semibold">{solved ? (picked.length === 1 ? "Right first time. " : "Right. ") : "Not quite, try another. "}</span>
              {solved ? it.why : ""}
            </p>
          ) : null}
          {solved ? <button type="button" className={cn(optCls, "mt-2 w-auto border-foreground bg-foreground text-background")} onClick={next}>{i + 1 < items.length ? "Next question" : "See your score"}</button> : null}
        </div>
      )}
    </section>
  );
}
