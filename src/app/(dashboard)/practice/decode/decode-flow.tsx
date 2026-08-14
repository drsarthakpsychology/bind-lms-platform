"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DecodeArena } from "./decode-arena";
import { FunnelDrill } from "./funnel-drill";
import { SevenReadings } from "./seven-readings";
import { CfiDrill } from "./cfi-drill";
import { QuizCheck } from "@/components/practice/quiz-check";
import type { QuizItem } from "@/lib/quiz/quiz";
import type { IdiomEntry } from "@/lib/decode/idioms";

const MODES = [
  { key: "decode", label: "Decode" },
  { key: "funnel", label: "Funnel" },
  { key: "readings", label: "Seven Readings" },
  { key: "cfi", label: "CFI" },
  { key: "check", label: "Check" },
] as const;

/**
 * The Presenting Complaint Decoder as a single-task flow (progressive
 * disclosure, T18/T22): one drill visible at a time behind a segmented
 * control, instead of five full drills stacked on one scroll surface.
 * The flagship DecodeArena is the default; each subsequent mode is one tap
 * away, and the "Mode n of 5" eyebrow keeps the learner oriented.
 */
export function DecodeFlow({ set, quiz }: { set: IdiomEntry[]; quiz: QuizItem[] }) {
  const [mode, setMode] = React.useState(0);

  return (
    <div className="space-y-4">
      <p className="text-caption text-muted-foreground">
        Mode{" "}
        <span className="text-numeric font-semibold text-link">{mode + 1}</span> of{" "}
        {MODES.length}
      </p>

      <div
        className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
        role="tablist"
        aria-label="Decoder modes"
      >
        {MODES.map((m, i) => (
          <button
            key={m.key}
            type="button"
            role="tab"
            aria-selected={mode === i}
            onClick={() => setMode(i)}
            className={cn(
              "shrink-0 rounded-full border-2 px-3 py-1.5 text-caption font-medium transition-transform active:translate-y-px",
              mode === i
                ? "border-foreground bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* One drill at a time — the only content competing for attention. */}
      <div>
        {mode === 0 ? <DecodeArena entries={set} /> : null}
        {mode === 1 ? <FunnelDrill entry={set[1] ?? set[0]} /> : null}
        {mode === 2 ? <SevenReadings entry={set[2] ?? set[0]} /> : null}
        {mode === 3 ? <CfiDrill /> : null}
        {mode === 4 ? <QuizCheck items={quiz} /> : null}
      </div>
    </div>
  );
}
