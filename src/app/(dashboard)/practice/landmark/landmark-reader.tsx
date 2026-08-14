"use client";

import * as React from "react";
import Link from "next/link";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, GitCompare } from "lucide-react";
import type { LandmarkCase } from "@/lib/landmark/cases";
import { MobileCompletionState } from "@/components/mobile/mobile-completion-state";

/**
 * Landmark reader — read the case, then answer the quiz (a check, not a test).
 * Ethics-failure cases lead with the failure framing.
 */
export function LandmarkReader({ cases }: { cases: LandmarkCase[] }) {
  const [idx, setIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [showAnswers, setShowAnswers] = React.useState(false);

  const c = cases[idx];

  if (!c) {
    return (
      <div className="rounded-md border-2 border-border bg-card hard-shadow-sm">
        <MobileCompletionState
          title="You've read them all"
          description={`${cases.length} landmark cases — what was believed, and what held up.`}
          secondary="The ethics failures are why consent procedures exist."
          action={
            <Link
              href="/practice"
              className="inline-flex min-h-11 items-center rounded-md border-2 border-foreground bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
            >
              Back to practice tools
            </Link>
          }
        />
      </div>
    );
  }

  function pick(qi: number, oi: number) {
    haptic("tap");
    setAnswers((a) => ({ ...a, [qi]: oi }));
  }

  const correctCount = c.quiz.filter((q, i) => answers[i] === q.correct).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-small text-muted-foreground">
        <span>{c.domain.replace("_", " ")} · case {idx + 1} of {cases.length}</span>
      </div>

      {/* the case */}
      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <h2 className="text-base font-semibold">{c.title}</h2>
        <p className="mt-3 text-small">{c.story}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-background p-3">
            <p className="text-caption font-semibold text-muted-foreground">Believed then</p>
            <p className="mt-1 text-small">{c.believedThen}</p>
          </div>
          <div className="rounded-md border border-border bg-background p-3">
            <p className="text-caption font-semibold text-muted-foreground">Understood now</p>
            <p className="mt-1 text-small">{c.understandNow}</p>
          </div>
        </div>

        {c.ethicsFailure ? (
          <p className="mt-3 flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-small text-red-800">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              <span className="font-semibold">The ethics failure: </span>
              {c.ethicsFailure}
            </span>
          </p>
        ) : null}

        {c.contested ? (
          <p className="mt-2 flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-small text-amber-800">
            <GitCompare className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              <span className="font-semibold">What&apos;s contested: </span>
              {c.contested}
            </span>
          </p>
        ) : null}
      </div>

      {/* quiz */}
      <div className="rounded-md border-2 border-border bg-card p-5">
        <h3 className="text-base font-semibold">Check yourself</h3>
        <div className="mt-3 space-y-4">
          {c.quiz.map((q, qi) => (
            <div key={qi}>
              <p className="text-small font-medium">{q.question}</p>
              <div className="mt-2 space-y-1.5">
                {q.options.map((o, oi) => {
                  const picked = answers[qi] === oi;
                  const correct = q.correct === oi;
                  const show = showAnswers;
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => pick(qi, oi)}
                      disabled={show}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md border-2 border-border px-3 py-2 text-left text-small transition-transform active:translate-y-px disabled:opacity-70",
                        picked && !show && "bg-primary text-primary-foreground",
                        show && correct && "bg-green-100 text-green-800",
                        show && picked && !correct && "bg-red-100 text-red-700",
                      )}
                    >
                      {o}
                      {show && correct ? <CheckCircle2 className="ml-auto size-3.5 shrink-0" aria-hidden /> : null}
                    </button>
                  );
                })}
              </div>
              {showAnswers ? <p className="mt-1 text-caption text-muted-foreground">{q.rationale}</p> : null}
            </div>
          ))}
        </div>

        {!showAnswers ? (
          <button
            type="button"
            onClick={() => { setShowAnswers(true); haptic("success"); }}
            className="mt-4 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
          >
            Reveal answers & rationale
          </button>
        ) : (
          <p className="mt-3 text-small text-muted-foreground" aria-live="polite">
            {correctCount} / {c.quiz.length} correct
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => { setIdx((i) => i + 1); setAnswers({}); setShowAnswers(false); haptic("tap"); }}
        className="w-full rounded-md border-2 border-border bg-card px-4 py-2.5 text-small font-medium text-muted-foreground hard-shadow-sm transition-transform active:translate-y-px"
      >
        {idx + 1 < cases.length ? "Next case" : "Finish"}
      </button>
    </div>
  );
}
