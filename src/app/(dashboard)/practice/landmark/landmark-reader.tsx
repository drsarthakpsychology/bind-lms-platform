"use client";

import { noteAnswer, useToolHistory } from "@/lib/history/client";
import * as React from "react";
import { haptic } from "@/lib/haptics";
import { AlertTriangle, GitCompare } from "lucide-react";
import type { LandmarkCase } from "@/lib/landmark/cases";
import { QuizCheck } from "@/components/practice/quiz-check";
import { arrangeCases } from "@/lib/cases/fresh";
import type { CaseContext } from "@/lib/cases/server";
import { clearCaseProgress, saveCaseProgress, useCaseProgress } from "@/lib/cases/progress-client";
import { CaseMarkTag, RecycleNote } from "@/components/cases/case-mark";

const EMPTY_CTX: CaseContext = { student: "", history: [], progress: { owner: null, rows: [] }, now: 0 };

/**
 * Landmark reader: read the case, then answer the quiz (a check, not a test).
 * Ethics-failure cases lead with the failure framing.
 *
 * The check is one question at a time via the shared QuizCheck flow (T22),
 * not a wall of every question and option on one scroll.
 *
 * Cases come in fresh-case order (src/lib/cases/fresh.ts): the one left open
 * first, then new this week, then new, read ones last. The order is fixed
 * when the page opens, so Next walks forward through it.
 */
export function LandmarkReader({ cases, ctx = EMPTY_CTX }: { cases: LandmarkCase[]; ctx?: CaseContext }) {
  const history = useToolHistory("landmark", ctx.history);
  const progress = useCaseProgress("landmark", ctx.progress);
  // The walk order, from the server's copy only, so it doesn't move under the reader.
  const [order] = React.useState(() => {
    const server = new Map(ctx.history.map((r) => [r.item, r]));
    const open = new Set(ctx.progress.rows.filter((r) => r.state !== null).map((r) => r.item));
    return arrangeCases(cases, (c) => c.id, { history: server, now: ctx.now, student: ctx.student, started: open }).list.map((x) => x.item);
  });
  const [idx, setIdx] = React.useState(0);
  const marks = arrangeCases(order, (c) => c.id, { history, now: ctx.now, student: ctx.student, started: progress.started });
  const markOf = new Map(marks.list.map((x) => [x.id, x.mark]));

  const c = order[idx];
  if (!c) return null;
  const recycled = markOf.get(c.id) === "done" && marks.recycled;

  function go(i: number) {
    const to = order[i];
    if (!to) return;
    setIdx(i);
    // Left open: this case comes back first next time until it is finished.
    saveCaseProgress("landmark", to.id, { open: true });
    haptic("tap");
  }

  return (
    <div className="space-y-4">
      {recycled ? <RecycleNote /> : null}
      <div className="flex items-center justify-between gap-2 text-small text-muted-foreground">
        <span>{c.domain.replace("_", " ")}</span>
        <CaseMarkTag mark={markOf.get(c.id) ?? "new"} />
      </div>

      {/* the case */}
      <div className="rounded-lg border-2 border-border bg-card p-5 hard-shadow-sm">
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
          <p className="mt-3 flex items-start gap-2 rounded-md border border-destructive bg-status-alert-bg p-3 text-small text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              <span className="font-semibold">The ethics failure: </span>
              {c.ethicsFailure}
            </span>
          </p>
        ) : null}

        {c.contested ? (
          <p className="mt-2 flex items-start gap-2 rounded-md border border-foreground bg-status-pending-bg p-3 text-small text-status-pending-fg">
            <GitCompare className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              <span className="font-semibold">What&apos;s contested: </span>
              {c.contested}
            </span>
          </p>
        ) : null}
      </div>

      {/* quiz: one question at a time (keyed per case so state resets). */}
      <div className="rounded-lg border-2 border-border bg-card p-5">
        <h3 className="text-base font-semibold">Check yourself</h3>
        <div className="mt-3">
          <QuizCheck
            key={c.id}
            items={c.quiz.map((q, qi) => ({
              id: `landmark-${c.id}-${qi}`,
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
        onClick={() => {
          noteAnswer("landmark", c.id, null);
          clearCaseProgress("landmark", c.id);
          go(idx + 1 < order.length ? idx + 1 : 0);
        }}
        className="w-full rounded-md border-2 border-border bg-primary px-4 py-2.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
      >
        Next case
      </button>

      <details className="rounded-md border-2 border-border bg-card">
        <summary className="flex min-h-11 cursor-pointer items-center px-4 text-small font-semibold">Choose a case</summary>
        <ul className="max-h-80 space-y-1 overflow-y-auto px-2 pb-2">
          {marks.list.map(({ item, mark }) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => go(order.indexOf(item))}
                aria-current={item.id === c.id ? "true" : undefined}
                className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-small ${item.id === c.id ? "bg-secondary font-semibold" : mark === "done" ? "text-muted-foreground" : ""}`}
              >
                <span className="min-w-0 truncate">{item.title}</span>
                <CaseMarkTag mark={mark} />
              </button>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
