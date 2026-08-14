"use client";

import * as React from "react";
import { CheckCircle2, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MobileChoiceList — the single-option-row interaction used by every drill.
 *
 * Extracted because the correct/wrong reveal states (border/check/x) are
 * duplicated verbatim in QuizCheck, DilemmaFlow, WeakSpotsDrill,
 * OutOfDepthDrill, ConfusableDrill and LandmarkReader. One list, one reveal
 * language:
 *
 *   - idle: bordered rows, hover accent, 44px min tap height
 *   - revealed: the correct row keeps its ink border + a check;
 *     the picked-wrong row dims + an x; unpicked rows fade.
 *   - `single` renders a radio group; `multi` renders checkboxes
 *     (aria-checked, no selection state change after reveal).
 *
 * The parent owns `options` (labels), `correct` (indices that are correct),
 * `picked` (indices the user chose), and `revealed`. That keeps it a pure
 * view — scoring + persistence stay with the flow that owns the data.
 */
export function MobileChoiceList({
  options,
  correct,
  picked,
  revealed,
  onPick,
  label,
  multi = false,
  className,
}: {
  options: string[];
  /** Indices (in `options`) that are correct. */
  correct: number[];
  /** Indices the user has picked. */
  picked: number[];
  revealed: boolean;
  onPick: (index: number) => void;
  label: string;
  multi?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("space-y-2", className)}
      role={multi ? "group" : "radiogroup"}
      aria-label={label}
    >
      {options.map((option, idx) => {
        const isPicked = picked.includes(idx);
        const isCorrect = correct.includes(idx);
        const showCorrect = revealed && isCorrect;
        const showWrong = revealed && isPicked && !isCorrect;
        return (
          <button
            key={idx}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={isPicked}
            onClick={() => onPick(idx)}
            disabled={revealed}
            className={cn(
              "flex min-h-11 w-full items-start gap-3 rounded-md border-2 px-3 py-2.5 text-left text-small transition-transform active:translate-y-px",
              !revealed && "border-border bg-card hover:bg-accent",
              showCorrect && "border-foreground bg-primary/15",
              showWrong && "border-border bg-muted",
              revealed && !isPicked && !isCorrect && "border-border/50 bg-card opacity-60",
            )}
          >
            <span className="min-w-0 flex-1">{option}</span>
            {showCorrect ? (
              <CheckCircle2 className="size-4 shrink-0 text-foreground" aria-label="Correct" />
            ) : null}
            {showWrong ? (
              <CircleX className="size-4 shrink-0 text-muted-foreground" aria-label="Your answer" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
