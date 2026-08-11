"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { scoreQuiz, type QuizItem } from "@/lib/quiz/quiz";

/**
 * Reusable quiz-as-check component. Every item carries a sourced rationale.
 * Used by lessons, landmark cases, ethics scenarios and decode sessions.
 */
export function QuizCheck({ items }: { items: QuizItem[] }) {
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [revealed, setRevealed] = React.useState(false);

  function pick(id: string, oi: number) {
    if (revealed) return;
    haptic("tap");
    setAnswers((a) => ({ ...a, [id]: oi }));
  }

  const result = revealed ? scoreQuiz(items, answers) : null;

  return (
    <div className="space-y-4">
      {items.map((q) => (
        <div key={q.id} className="rounded-md border-2 border-border bg-card p-4">
          {q.excerpt ? (
            <p className="mb-2 rounded-md border border-border bg-secondary/40 p-2 text-caption italic text-muted-foreground">
              {q.excerpt}
            </p>
          ) : null}
          <p className="text-small font-medium">
            <span className="mr-2 rounded-full bg-secondary px-2 py-0.5 text-caption font-semibold text-muted-foreground">
              {q.type.replace(/_/g, " ")}
            </span>
            {q.prompt}
          </p>
          <div className="mt-2 space-y-1.5">
            {q.options.map((o, oi) => {
              const picked = answers[q.id] === oi;
              const correct = q.correct === oi;
              const show = revealed;
              return (
                <button
                  key={oi}
                  type="button"
                  onClick={() => pick(q.id, oi)}
                  disabled={show}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md border-2 border-border px-3 py-2 text-left text-small transition-transform active:translate-y-px disabled:opacity-70",
                    picked && !show && "bg-primary text-primary-foreground",
                    show && correct && "bg-green-100 text-green-800",
                    show && picked && !correct && "bg-red-100 text-red-700",
                  )}
                >
                  <span>{o}</span>
                  {q.isStandardCare && oi === 0 ? (
                    <span className={cn("ml-auto text-caption", picked || show ? "" : "text-muted-foreground")}>standard of care</span>
                  ) : null}
                  {show && correct ? <CheckCircle2 className="ml-auto size-3.5 shrink-0" aria-hidden /> : null}
                </button>
              );
            })}
          </div>
          {revealed ? (
            <p className="mt-2 text-caption text-muted-foreground">
              <span className="font-semibold">Why: </span>{q.rationale} <span className="text-caption">({q.source})</span>
            </p>
          ) : null}
        </div>
      ))}

      {!revealed ? (
        <button
          type="button"
          onClick={() => {
            setRevealed(true);
            haptic("success");
            // Persist the attempts (low-confidence areas surface in /admin/triage).
            for (const item of items) {
              const chosen = answers[item.id];
              if (chosen == null) continue;
              fetch("/api/practice/quiz/attempt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId: item.id, chosen, correct: chosen === item.correct }),
              }).catch(() => {});
            }
          }}
          disabled={Object.keys(answers).length < items.length}
          className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
        >
          Check answers
        </button>
      ) : (
        <p className="text-small text-muted-foreground">
          {result ? `${result.correct} / ${result.total} correct. A check, not a test — the rationale is the lesson.` : ""}
        </p>
      )}
    </div>
  );
}
