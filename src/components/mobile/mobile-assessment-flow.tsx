"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { MobileCompletionState } from "./mobile-completion-state";

/**
 * MobileAssessmentFlow — the generic sequential shell for any stepped
 * assessment (T23). One question/step at a time, with orientation
 * ("Question n of m" + a progress bar) and a single next action. The parent
 * supplies each step's interaction via `renderStep` and decides when the
 * flow is complete via `onDone`.
 *
 * Owns: current step index, progress, the Next/primary action, the
 * completion state. Does NOT own: scoring, persistence, or the per-step
 * interaction — the parent does (so MCQ, multi-select, free-text, ordering,
 * flashcard and scenario steps all reuse the same shell without the shell
 * knowing their data shapes).
 *
 * Contract:
 *   - `steps` is the list of step identifiers (the parent maps step → body).
 *   - `canAdvance(step)` gates Next (e.g. an answer must be picked).
 *   - `renderStep(step, stepIndex)` renders the single visible step.
 *   - `onComplete()` runs when Next is pressed on the final step; the parent
 *     then flips `finished` and gets the completion surface, OR the flow
 *     renders `completion` directly when `finished` is true.
 */
export function MobileAssessmentFlow({
  steps,
  current,
  onCurrentChange,
  finished,
  canAdvance,
  renderStep,
  completion,
  onComplete,
  nextLabel = "Next",
  finishLabel = "Finish",
  className,
}: {
  /** Step identifiers in order (ids only — the parent maps them to bodies). */
  steps: string[];
  current: number;
  onCurrentChange: (index: number) => void;
  /** Render the single visible step (the parent's one-cognitive-unit body). */
  renderStep: (step: string, index: number) => React.ReactNode;
  /** Gate the Next action for the current step (e.g. an answer must be chosen). */
  canAdvance?: (step: string, index: number) => boolean;
  /** True once the flow is finished — renders `completion`. */
  finished: boolean;
  /** The completion surface (MobileCompletionState or a score card). */
  completion?: React.ReactNode;
  /** Called when Finish is pressed on the final step — parent flips `finished`. */
  onComplete?: () => void;
  nextLabel?: string;
  finishLabel?: string;
  className?: string;
}) {
  const step = steps[current];
  const isLast = current === steps.length - 1;
  const advanceable = canAdvance ? canAdvance(step, current) : true;
  const progressPercent = Math.round(((current + (advanceable ? 1 : 0)) / steps.length) * 100);

  if (finished && completion) {
    return <div className={cn("space-y-4", className)}>{completion}</div>;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Compact orientation: where am I, how far through. */}
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-caption font-medium text-muted-foreground">
            Step{" "}
            <span className="text-numeric font-semibold text-link">{current + 1}</span> of{" "}
            {steps.length}
          </p>
          <p className="text-caption text-muted-foreground" aria-hidden>
            {Math.round(progressPercent)}%
          </p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
          <div
            className="h-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* The single visible step. */}
      <div>{renderStep(step, current)}</div>

      {/* One next action. Disabled until the step is answerable. */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          disabled={!advanceable}
          onClick={() => {
            if (isLast) {
              haptic("success");
              onComplete?.();
            } else {
              haptic("tap");
              onCurrentChange(current + 1);
            }
          }}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-px disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          {isLast ? finishLabel : nextLabel}
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

// Convenience completion state used by flows that want the standard recap.
export { MobileCompletionState };
