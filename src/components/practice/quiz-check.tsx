"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, CircleX } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { scoreQuiz, type QuizItem } from "@/lib/quiz/quiz";
import { hashSeed, identityOrder, seededShuffle } from "@/lib/quiz/shuffle";
import { MobileCompletionState } from "@/components/mobile/mobile-completion-state";

/**
 * Reusable quiz-as-check component. Every item carries a sourced rationale.
 * Used by lessons, landmark cases, ethics scenarios and decode sessions.
 *
 * Mobile-first: ONE question at a time (a guided flow, not a wall of boxes).
 * Pick → immediate feedback ("Correct." / "Needs another look." + why + source)
 * → Next. A compact "Question n of m" progress line keeps the learner oriented.
 * The final step shows the score. No card-inside-card; the question card is the
 * only bordered container.
 *
 * Options are shuffled deterministically (seeded by the item id) so the correct
 * answer is not always position one. The shuffled order maps rendered index →
 * authored index, so scoring + persistence stay on authored indices.
 */
export function QuizCheck({ items }: { items: QuizItem[] }) {
  const [current, setCurrent] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [revealed, setRevealed] = React.useState(false);
  const [finished, setFinished] = React.useState(false);

  // Deterministic per-item option order — seeded by the item id, so it is
  // hydration-safe and stable across re-renders without setState-in-effect.
  const orders = React.useMemo(() => {
    const result: Record<string, number[]> = {};
    for (const q of items) {
      result[q.id] = seededShuffle(identityOrder(q.options.length), hashSeed(q.id));
    }
    return result;
  }, [items]);

  if (items.length === 0) return null;

  const q = items[current];
  const order = orders[q.id];
  const picked = answers[q.id];
  const isCorrect = revealed && picked === q.correct;
  const isLast = current === items.length - 1;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / items.length) * 100);

  function pick(authoredIdx: number) {
    if (revealed || finished) return;
    haptic("tap");
    setAnswers((a) => ({ ...a, [q.id]: authoredIdx }));
    setRevealed(true);
    // Persist the attempt (low-confidence areas surface in /admin/triage).
    fetch("/api/practice/quiz/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: q.id, chosen: authoredIdx, correct: authoredIdx === q.correct }),
    }).catch(() => {});
  }

  function next() {
    if (isLast) {
      setFinished(true);
      haptic("success");
    } else {
      setRevealed(false);
      setCurrent((c) => c + 1);
    }
  }

  if (finished) {
    const result = scoreQuiz(items, answers);
    // The same completion language as lessons/drills/debrief (T29) — one
    // "you finished this" beat instead of a per-screen shrug.
    return (
      <MobileCompletionState
        title="Check complete"
        description={
          result.correct === result.total
            ? `${result.correct} of ${result.total} correct. Clean sweep — the sources below every answer are the lesson.`
            : `${result.correct} of ${result.total} correct. A check, not a test — re-read the rationale on the ones you missed.`
        }
        icon={
          <span className="text-numeric text-h2 font-bold text-foreground">
            {result.correct}/{result.total}
          </span>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Compact orientation: where am I, how far through. */}
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-caption font-medium text-muted-foreground">
            Question{" "}
            <span className="text-numeric font-semibold text-link">{current + 1}</span> of{" "}
            {items.length}
          </p>
          <p className="text-caption text-muted-foreground">{answeredCount} answered</p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
          <div
            className="h-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="rounded-lg border-2 border-foreground bg-card p-4 hard-shadow-sm">
        {q.excerpt ? (
          <p className="mb-3 rounded-md border border-border bg-secondary/40 p-2.5 text-caption italic text-muted-foreground">
            {q.excerpt}
          </p>
        ) : null}

        <p className="text-body-strong text-foreground">{q.prompt}</p>

        <div className="mt-3 space-y-2" role="radiogroup" aria-label={q.prompt}>
          {order.map((authoredIdx) => {
            const isPicked = picked === authoredIdx;
            const isCorrectOption = q.correct === authoredIdx;
            return (
              <button
                key={authoredIdx}
                type="button"
                role="radio"
                aria-checked={isPicked}
                onClick={() => pick(authoredIdx)}
                disabled={revealed}
                className={cn(
                  "flex min-h-11 w-full items-start gap-3 rounded-md border-2 px-3 py-2.5 text-left text-small transition-transform active:translate-y-px",
                  !revealed && "border-border bg-card hover:bg-accent",
                  revealed && isCorrectOption && "border-foreground bg-primary/15",
                  revealed && isPicked && !isCorrectOption && "border-border bg-muted",
                  revealed && !isPicked && !isCorrectOption && "border-border/50 bg-card opacity-60",
                )}
              >
                <span className="min-w-0 flex-1">{q.options[authoredIdx]}</span>
                {revealed && isCorrectOption ? (
                  <CheckCircle2 className="size-4 shrink-0 text-foreground" aria-label="Correct" />
                ) : null}
                {revealed && isPicked && !isCorrectOption ? (
                  <CircleX className="size-4 shrink-0 text-muted-foreground" aria-label="Your answer" />
                ) : null}
              </button>
            );
          })}
        </div>

        {revealed ? (
          <div className="mt-3">
            <p className="text-small font-semibold text-foreground">
              {isCorrect ? "Correct." : "Needs another look."}
            </p>
            <p className="mt-1 text-small text-muted-foreground">
              <span className="font-semibold">Why: </span>
              {q.rationale} <span className="text-caption">({q.source})</span>
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-end">
        {revealed ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-px"
          >
            {isLast ? "See results" : "Next question"}
            <ArrowRight className="size-4" aria-hidden />
          </button>
        ) : (
          <p className="text-caption text-muted-foreground">Choose an answer to continue.</p>
        )}
      </div>
    </div>
  );
}
