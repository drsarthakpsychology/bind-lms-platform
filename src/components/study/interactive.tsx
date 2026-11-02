"use client";

import * as React from "react";
import { Check, Eye, RotateCcw, X } from "lucide-react";
import { istToday, recordTest } from "@/lib/learn/engine";
import { getLearnState, setLearnState } from "@/lib/learn/store";
import type { Card, Mcq } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { Rich } from "./rich";

/** Recall check: answer aloud first, then reveal. */
export function RecallCheck({ items }: { items: Card[] }) {
  const [open, setOpen] = React.useState<number[]>([]);
  return (
    <section className="rounded-2xl border-2 border-dashed border-foreground bg-card p-4 sm:p-5" aria-label="Recall check">
      <p className="text-[0.7rem] font-black tracking-wide text-link uppercase">Recall check · cover the page and answer aloud</p>
      <ol className="mt-3 space-y-3">
        {items.map((c, i) => {
          const shown = open.includes(i);
          return (
            <li key={i} className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-foreground text-sm font-black">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold leading-snug">
                  <Rich text={c.q} />
                </p>
                {c.a ? (
                  shown ? (
                    <p className="mt-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
                      <Rich text={c.a} />
                    </p>
                  ) : (
                    <button type="button" onClick={() => setOpen([...open, i])} className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border-2 border-foreground px-3 py-1 text-xs font-black">
                      <Eye className="size-3.5" aria-hidden /> Show answer
                    </button>
                  )
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Viva flash cards: say it, then flip. */
export function VivaCards({ items }: { items: Card[] }) {
  const [flipped, setFlipped] = React.useState<number[]>([]);
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-muted-foreground">
        {flipped.length} of {items.length} checked
      </p>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-2.5 sm:grid-cols-2">
        {items.map((c, i) => {
          const on = flipped.includes(i);
          return (
            <li key={i}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setFlipped(on ? flipped.filter((x) => x !== i) : [...flipped, i])}
                className={cn("flex h-full min-h-24 w-full flex-col justify-between gap-2 rounded-2xl border-2 border-foreground p-3 text-left transition-colors", on ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}
              >
                <span className="font-bold leading-snug">
                  <Rich text={c.q} />
                </span>
                {on ? (
                  <span className="text-sm font-semibold leading-snug">
                    <Rich text={c.a} />
                  </span>
                ) : (
                  <span className="text-xs font-black text-muted-foreground">Tap to see the answer</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** A set of single-best-answer questions. Answer all, then submit; the module test saves its best score. */
export function McqSet({ items, moduleId }: { items: Mcq[]; moduleId?: string }) {
  const [picks, setPicks] = React.useState<Record<number, number>>({});
  const [done, setDone] = React.useState(false);
  const answered = Object.keys(picks).length;
  const right = items.filter((m, i) => picks[i] === m.answer).length;

  function submit() {
    setDone(true);
    if (moduleId) {
      const s = getLearnState();
      if (s) setLearnState(recordTest(s, moduleId, right, items.length, istToday()));
    }
    requestAnimationFrame(() => document.getElementById("test-result")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }

  return (
    <div className="space-y-4">
      {done ? (
        <div id="test-result" className="rounded-3xl border-2 border-foreground bg-foreground p-5 text-background" role="status">
          <p className="text-[0.7rem] font-black tracking-wide text-primary uppercase">Your score</p>
          <p className="mt-1 text-4xl font-black">
            {right} <span className="text-xl">/ {items.length}</span>
          </p>
          <p className="mt-1 text-sm">
            {right / items.length >= 0.8 ? "Strong. Go through the ones you missed below, then move on." : "Go back to the sections behind the ones you missed, then re-test. That gap is exactly what the re-test is for."}
          </p>
          <button
            type="button"
            onClick={() => {
              setPicks({});
              setDone(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border-2 border-primary px-3 py-1.5 text-sm font-black text-primary"
          >
            <RotateCcw className="size-4" aria-hidden /> Try again
          </button>
        </div>
      ) : null}

      <ol className="space-y-4">
        {items.map((m, i) => {
          const pick = picks[i];
          return (
            <li key={i} className="rounded-2xl border-2 border-foreground bg-card p-4">
              <p className="font-bold leading-snug">
                <span className="mr-1.5 font-black text-link">{i + 1}.</span>
                <Rich text={m.q} />
              </p>
              <div className="mt-3 grid gap-2" role="radiogroup" aria-label={`Question ${i + 1}`}>
                {m.options.map((o, j) => {
                  const chosen = pick === j;
                  const isRight = j === m.answer;
                  return (
                    <button
                      key={j}
                      type="button"
                      role="radio"
                      aria-checked={chosen}
                      disabled={done}
                      onClick={() => setPicks({ ...picks, [i]: j })}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left text-sm font-semibold transition-colors",
                        !done && (chosen ? "border-foreground bg-brand text-brand-foreground" : "border-foreground/40 hover:border-foreground"),
                        done && isRight && "border-foreground bg-primary text-primary-foreground",
                        done && chosen && !isRight && "border-status-alert-fg bg-status-alert-bg text-status-alert-fg",
                        done && !chosen && !isRight && "border-foreground/20 opacity-70",
                      )}
                    >
                      <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-current text-xs font-black">
                        {done && isRight ? <Check className="size-3.5" aria-hidden /> : done && chosen ? <X className="size-3.5" aria-hidden /> : String.fromCharCode(97 + j)}
                      </span>
                      <Rich text={o} />
                    </button>
                  );
                })}
              </div>
              {done && m.why ? (
                <p className="mt-3 rounded-xl bg-muted px-3 py-2 text-sm leading-snug">
                  <Rich text={m.why} />
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      {!done ? (
        <div className="sticky bottom-3 z-10 rounded-2xl border-2 border-foreground bg-card p-3 hard-shadow-md">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold">
              {answered} of {items.length} answered
            </p>
            <button
              type="button"
              disabled={answered < items.length}
              onClick={submit}
              className="h-11 rounded-xl border-2 border-foreground bg-primary px-5 font-black text-primary-foreground disabled:opacity-50"
            >
              {answered < items.length ? "Answer all to submit" : "Submit test"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
