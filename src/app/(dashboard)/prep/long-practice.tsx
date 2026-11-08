"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Bookmark, BookmarkCheck, Check, Eye, RotateCcw } from "lucide-react";
import { selfMark } from "@/lib/prep/long";
import { parseList, setInList, ticksKey, useIdList, useStored, writeStored } from "@/lib/prep/long-store";
import { cn } from "@/lib/utils";
import { btnInk, btnPlain, btnPrimary, card } from "./ui";

export type LongPracticeProps = {
  id: string;
  plan: string[];
  keyPoints: string[];
  pitfalls?: string[];
  /** The model answer, already rendered. */
  answer: React.ReactNode;
  study: { href: string; label: string } | null;
  prev: string | null;
  next: string | null;
};

const toggle =
  "inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground px-3 text-sm font-bold transition-transform duration-150 active:translate-y-px motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60";

/**
 * One long answer: the question, then the model answer, where marks are lost
 * and the key points to tick. No timer, no lock.
 */
export function LongPractice({ id, keyPoints, pitfalls, answer, study, prev, next }: LongPracticeProps) {
  const [shown, setShown] = React.useState(false);
  const ticksRaw = useStored(ticksKey(id));
  const ticks = React.useMemo(() => new Set(parseList<number>(ticksRaw, "number")), [ticksRaw]);
  const saved = useIdList("saved").includes(id);
  const again = useIdList("again").includes(id);
  const mark = selfMark(keyPoints.length, ticks);
  const answerRef = React.useRef<HTMLHeadingElement>(null);

  function reveal() {
    setShown(true);
    // Move focus to the answer once it is on screen.
    requestAnimationFrame(() => answerRef.current?.focus());
  }

  function tick(i: number, on: boolean) {
    const n = new Set(ticks);
    if (on) n.add(i);
    else n.delete(i);
    writeStored(ticksKey(id), n.size ? JSON.stringify([...n].sort((a, b) => a - b)) : null);
  }

  return (
    <div className="min-w-0 space-y-5">
      {!shown ? (
        <button type="button" className={cn(btnPrimary, "w-full text-base")} onClick={reveal}>
          <Eye className="size-4" aria-hidden /> Show model answer
        </button>
      ) : (
        <div className="min-w-0 space-y-5">
          <section aria-labelledby="model-answer" className={cn(card, "min-w-0 space-y-3 p-4 sm:p-5")}>
            <h2 id="model-answer" ref={answerRef} tabIndex={-1} className="text-h3 outline-none">
              Model answer
            </h2>
            {answer}
          </section>

          {pitfalls?.length ? (
            <section aria-labelledby="pitfalls" className="space-y-2 rounded-md border-2 border-status-alert-fg bg-status-alert-bg p-4 text-status-alert-fg">
              <h2 id="pitfalls" className="font-bold">
                Where marks are lost
              </h2>
              <ul className="list-disc space-y-1 pl-5 [overflow-wrap:anywhere]">
                {pitfalls.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {keyPoints.length ? (
            <fieldset className={cn(card, "min-w-0 space-y-2")}>
              <legend className="sr-only">Mark yourself: tick what you covered</legend>
              <p className="text-h3" aria-hidden>
                Mark yourself
              </p>
              <ul className="space-y-1.5">
                {keyPoints.map((k, i) => (
                  <li key={i}>
                    <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md px-1 py-2 hover:bg-secondary">
                      <input type="checkbox" checked={ticks.has(i)} onChange={(e) => tick(i, e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[var(--foreground)]" />
                      <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{k}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <p role="status" className="flex items-center gap-2 border-t-2 border-foreground/15 pt-3 font-bold">
                <Check className="size-4 shrink-0" aria-hidden /> {mark.text}
              </p>
            </fieldset>
          ) : null}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={saved} onClick={() => setInList("saved", id, !saved)} className={cn(toggle, saved ? "bg-foreground text-background" : "bg-card")}>
          {saved ? <BookmarkCheck className="size-4" aria-hidden /> : <Bookmark className="size-4" aria-hidden />}
          {saved ? "Saved" : "Save for later"}
        </button>
        <button
          type="button"
          aria-pressed={again}
          onClick={() => setInList("again", id, !again)}
          className={cn(toggle, again ? "bg-foreground text-background" : shown && mark.covered < mark.total ? "bg-primary text-primary-foreground" : "bg-card")}
        >
          <RotateCcw className="size-4" aria-hidden />
          {again ? "In Practise again" : "Practise again"}
        </button>
      </div>

      <nav aria-label="More long answers" className="grid grid-cols-2 gap-2.5">
        {prev ? (
          <Link href={prev} className={btnPlain}>
            <ArrowLeft className="size-4" aria-hidden /> Previous
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={next} className={btnInk}>
            Next <ArrowRight className="size-4" aria-hidden />
          </Link>
        ) : null}
      </nav>

      {study ? (
        <Link href={study.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-link hover:underline [overflow-wrap:anywhere]">
          <BookOpen className="size-4 shrink-0" aria-hidden /> {study.label}
        </Link>
      ) : null}
    </div>
  );
}
