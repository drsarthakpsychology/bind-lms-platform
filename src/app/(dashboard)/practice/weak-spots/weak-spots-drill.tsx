"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Target, Zap } from "lucide-react";
import Link from "next/link";
import type { DrillItem } from "@/lib/practice/weak-spots";

/**
 * The weak-spots drill — 10 items generated on the spot from the student's
 * actual gaps (v5 §4). Each item: a scenario they keep missing, their weak
 * line vs the stronger alternative, and the why. Pick the stronger line;
 * score at the end.
 */
export function WeakSpotsDrill({ items }: { items: DrillItem[] }) {
  const [idx, setIdx] = React.useState(0);
  const [picked, setPicked] = React.useState<"weak" | "strong" | null>(null);
  const [revealed, setRevealed] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const item = items[idx];

  function pick(which: "weak" | "strong") {
    if (revealed) return;
    haptic("tap");
    setPicked(which);
    setRevealed(true);
    if (which === "strong") {
      setScore((s) => s + 1);
      haptic("success");
    }
  }

  function next() {
    setRevealed(false);
    setPicked(null);
    if (idx + 1 < items.length) {
      setIdx((i) => i + 1);
    } else {
      setDone(true);
      haptic("success");
    }
  }

  if (done) {
    return (
      <div className="rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
        <p className="flex items-center gap-2 text-base font-semibold">
          <Zap className="size-4 text-link" aria-hidden />
          Drill complete — {score} / {items.length}
        </p>
        <p className="mt-2 text-small text-muted-foreground">
          {score >= 8
            ? "Strong — you're closing these gaps. Back to the Consulting Room to prove it live."
            : score >= 5
              ? "Improving. Re-run the drill or take it into the Consulting Room today."
              : "These are exactly the misses your debriefs flag. Try the drill again, then run a session."}
        </p>
        <Link
          href="/practice/consulting-room"
          className="mt-4 inline-flex items-center gap-2 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
        >
          Run a case — prove it live →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-caption font-semibold text-muted-foreground">
          <Target className="size-3.5" aria-hidden />
          Your weak-spots drill · {idx + 1}/{items.length}
        </p>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-caption font-medium text-amber-800">
          {item.skill}
        </span>
      </div>

      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <p className="text-small font-medium">{item.scenario}</p>
        <p className="mt-4 text-caption font-semibold text-muted-foreground">
          What do you say next?
        </p>
        <div className="mt-2 space-y-2">
          {(["weak", "strong"] as const).map((which) => {
            const isPicked = picked === which;
            const correct = which === "strong";
            return (
              <button
                key={which}
                type="button"
                onClick={() => pick(which)}
                disabled={revealed}
                className={cn(
                  "block w-full rounded-md border-2 border-border px-3 py-2.5 text-left text-small transition-transform active:translate-y-px disabled:opacity-80",
                  which === "strong" && "bg-green-50",
                  isPicked && !revealed && "ring-2 ring-ring",
                  revealed && correct && "border-green-500 bg-green-100",
                  revealed && isPicked && !correct && "border-red-400 bg-red-100",
                )}
              >
                <span className="text-caption font-semibold text-muted-foreground">
                  {which === "weak" ? "What you said:" : "Try instead:"}
                </span>
                <span className="mt-0.5 block italic">“{which === "weak" ? item.weakLine : item.strongLine}”</span>
              </button>
            );
          })}
        </div>

        {revealed ? (
          <>
            <p className="mt-3 rounded-md border border-border bg-secondary/40 p-3 text-small">
              <span className="font-semibold text-muted-foreground">Why: </span>
              {item.why}
            </p>
            <button
              type="button"
              onClick={next}
              data-testid="drill-next"
              className="mt-3 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
            >
              {idx + 1 < items.length ? "Next" : "Finish"}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
