"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { CONFUSABLE_PAIRS, scoreConfusable } from "@/lib/mse/confusable";

/**
 * Level 3 — the confusable pairs. Mood vs affect, thought form vs content,
 * illusion vs hallucination, obsession vs delusion, flight vs tangential,
 * akathisia vs anxiety. The distinctions students actually fail.
 */
export function ConfusableDrill({ onComplete }: { onComplete?: () => void } = {}) {
  const [pairIdx, setPairIdx] = React.useState(0);
  const [itemIdx, setItemIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, "a" | "b">>({});
  const [revealed, setRevealed] = React.useState(false);

  const pair = CONFUSABLE_PAIRS[pairIdx];
  const item = pair.items[itemIdx];
  const key = `${pair.id}:${itemIdx}`;

  function pick(which: "a" | "b") {
    if (revealed) return;
    haptic("tap");
    setAnswers((a) => ({ ...a, [key]: which }));
    setRevealed(true);
    if (which === item.correct) haptic("success");
  }

  function next() {
    setRevealed(false);
    if (itemIdx + 1 < pair.items.length) {
      setItemIdx((i) => i + 1);
    } else if (pairIdx + 1 < CONFUSABLE_PAIRS.length) {
      setPairIdx((p) => p + 1);
      setItemIdx(0);
    }
  }

  const done = pairIdx >= CONFUSABLE_PAIRS.length - 1 && itemIdx >= pair.items.length - 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-small text-muted-foreground">
        <span>Pair {pairIdx + 1}/{CONFUSABLE_PAIRS.length} · item {itemIdx + 1}/{pair.items.length}</span>
        <span className="text-caption">
          {CONFUSABLE_PAIRS[pairIdx].a} vs {CONFUSABLE_PAIRS[pairIdx].b}
        </span>
      </div>

      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <p className="text-small">{item.prompt}</p>
        <p className="mt-3 text-caption font-semibold text-muted-foreground">Which is it?</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["a", "b"] as const).map((which) => {
            const label = which === "a" ? pair.a : pair.b;
            const picked = answers[key] === which;
            const correct = item.correct === which;
            return (
              <button
                key={which}
                type="button"
                onClick={() => pick(which)}
                disabled={revealed}
                className={cn(
                  "rounded-md border-2 border-border px-3 py-2.5 text-small font-medium transition-transform active:translate-y-px disabled:opacity-70",
                  picked && !revealed && "bg-primary text-primary-foreground",
                  revealed && correct && "bg-green-100 text-green-800",
                  revealed && picked && !correct && "bg-red-100 text-red-700",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
        {revealed ? (
          <p className="mt-3 rounded-md border border-border bg-secondary/40 p-3 text-small">
            <span className="font-semibold text-muted-foreground">The rule: </span>
            {pair.rule}
          </p>
        ) : null}
        {revealed && !done ? (
          <button
            type="button"
            onClick={next}
            className="mt-3 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
          >
            Next item
          </button>
        ) : null}
        {revealed && done ? (
          <div className="mt-3 space-y-2">
            <p className="text-small font-medium">
              Done — {scoreConfusable(CONFUSABLE_PAIRS.flatMap((p) => p.items), answers)} /{" "}
              {CONFUSABLE_PAIRS.flatMap((p) => p.items).length} correct.
            </p>
            {onComplete ? (
              <button
                type="button"
                onClick={onComplete}
                className="rounded-md border-2 border-border bg-primary px-4 py-1.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
              >
                Mark Level 3 complete
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
