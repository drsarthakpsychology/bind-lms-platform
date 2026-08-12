"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { SMALL_THINGS } from "@/lib/mse/small-things";

/**
 * The small things checklist (v5 Part 2.2) as a drill: a moment in an
 * interview is shown, the student says what it means (read), then the move.
 * Novices never notice these; this trains the noticing.
 */
export function SmallThingsDrill() {
  const [idx, setIdx] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);

  const item = SMALL_THINGS[idx % SMALL_THINGS.length];
  const done = idx >= SMALL_THINGS.length;

  function next() {
    setRevealed(false);
    setIdx((i) => i + 1);
    haptic("tap");
  }

  return (
    <div className="space-y-3">
      {!done ? (
        <div className="rounded-md border-2 border-border bg-background p-4">
          <p className="text-caption font-semibold text-muted-foreground">
            The small things · {idx + 1}/{SMALL_THINGS.length} · {item.skill}
          </p>
          <p className="mt-2 text-small leading-relaxed">
            &quot;{item.moment}&quot;
          </p>

          {!revealed ? (
            <div className="mt-3">
              <p className="text-caption text-muted-foreground">
                Take a beat — what did you actually just see?
              </p>
              <button
                type="button"
                onClick={() => {
                  setRevealed(true);
                  haptic("success");
                }}
                className="mt-2 rounded-md border-2 border-border bg-primary px-4 py-1.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
              >
                Reveal the read
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="rounded-md border border-border bg-secondary/40 p-3 text-small">
                <span className="font-semibold text-muted-foreground">What it means: </span>
                {item.read}
              </p>
              <p className="rounded-md border border-border bg-background p-3 text-small">
                <span className="font-semibold text-muted-foreground">The move: </span>
                {item.move}
              </p>
              <button
                type="button"
                onClick={next}
                className="rounded-md border-2 border-border bg-primary px-4 py-1.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
              >
                Next observation
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-md border-2 border-border bg-background p-4 text-small text-muted-foreground">
          Every small thing you practice here is a real second-channel of the
          MSE. Module reviews love the ones nobody notices — the past tense, the
          pause, the look at the family member.
        </div>
      )}

      {/* Reference card — the full checklist, always visible */}
      <details className="rounded-md border border-border bg-background p-3">
        <summary className="cursor-pointer text-caption font-medium text-muted-foreground">
          The reference card — pull this up mid-exam
        </summary>
        <ul className="mt-2 space-y-1.5">
          {SMALL_THINGS.map((s) => (
            <li key={s.id} className={cn("text-small", idx > SMALL_THINGS.indexOf(s) && "text-muted-foreground/60")}>
              <span className="font-medium">{s.moment}</span>
              <span className="text-muted-foreground"> — {s.read}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}