"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { AlertTriangle, GitCompare } from "lucide-react";
import type { LandmarkCase } from "@/lib/landmark/cases";
import { QuizCheck } from "@/components/practice/quiz-check";

/**
 * Landmark reader — read the case, then answer the quiz (a check, not a test).
 * Ethics-failure cases lead with the failure framing.
 *
 * The check is one question at a time via the shared QuizCheck flow (T22) —
 * not a wall of every question and option on one scroll.
 */
export function LandmarkReader({ cases }: { cases: LandmarkCase[] }) {
  const [idx, setIdx] = React.useState(0);

  const c = cases[idx];
  if (!c) return null;

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

      {/* quiz — one question at a time (keyed per case so state resets). */}
      <div className="rounded-md border-2 border-border bg-card p-5">
        <h3 className="text-base font-semibold">Check yourself</h3>
        <div className="mt-3">
          <QuizCheck
            key={idx}
            items={c.quiz.map((q, qi) => ({
              id: `landmark-${idx}-${qi}`,
              type: "best_response" as const,
              prompt: q.question,
              options: q.options,
              correct: q.correct,
              rationale: q.rationale,
              source: c.title,
            }))}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => { setIdx((i) => Math.min(cases.length - 1, i + 1)); haptic("tap"); }}
        disabled={idx + 1 >= cases.length}
        className="w-full rounded-md border-2 border-border bg-primary px-4 py-2.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
      >
        {idx + 1 < cases.length ? "Next case" : "You've read them all"}
      </button>
    </div>
  );
}
