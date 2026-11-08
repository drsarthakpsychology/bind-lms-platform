"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";

/**
 * Shared pieces for widgets that show a process in steps. Every step and
 * its words are on screen at once (nothing to page through); tapping a
 * step only moves the picture to it. A signal journey that plays after a
 * tap holds each leg for at least its reading time.
 */

/** Reading pace: about 250 ms a word (roughly 240 words a minute), and never less than 3 s a step. */
export const WORD_MS = 250;
export const MIN_STEP_MS = 3000;

export function wordCount(text?: string | null) {
  if (!text) return 0;
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

/** How long a step whose words are `text` stays up. `min` raises the floor (for example to let an animation finish). */
export function readingMs(text?: string | null, min = MIN_STEP_MS) {
  return Math.max(min, MIN_STEP_MS, wordCount(text) * WORD_MS);
}

export type Step = { id: string; name: string; text?: React.ReactNode };

/**
 * Every step, numbered, with its words. The chosen step is the one the
 * picture shows; a screen reader hears which one when it changes.
 */
export function StepPicker({ steps, i, onPick, kind, label = "Steps" }: { steps: Step[]; i: number; onPick: (k: number) => void; kind?: string; label?: string }) {
  const used = React.useRef(false);
  return (
    <>
      <ol className="mt-3 grid gap-1.5" aria-label={label}>
        {steps.map((s, k) => (
          <li key={s.id}>
            <button
              type="button"
              aria-pressed={k === i}
              onClick={() => {
                if (!used.current && kind) trackLearn({ type: "widget", kind });
                used.current = true;
                onPick(k);
              }}
              className={cn(
                "flex min-h-11 w-full items-start gap-2.5 rounded-md border-2 px-3 py-2 text-left transition-colors duration-fast",
                k === i ? "border-foreground bg-muted" : "border-foreground/25 bg-card hover:border-foreground",
              )}
            >
              <span aria-hidden className={cn("mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-foreground text-xs font-bold", k === i ? "bg-primary text-primary-foreground" : "bg-card")}>
                {k + 1}
              </span>
              <span className="min-w-0 [overflow-wrap:anywhere]">
                <span className="block font-semibold leading-snug">{s.name}</span>
                {s.text ? <span className="mt-0.5 block text-[0.92rem] leading-relaxed text-foreground/80">{s.text}</span> : null}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="sr-only" role="status" aria-live="polite">
        {steps[i] ? `Showing ${i + 1}: ${steps[i].name}` : ""}
      </p>
    </>
  );
}
