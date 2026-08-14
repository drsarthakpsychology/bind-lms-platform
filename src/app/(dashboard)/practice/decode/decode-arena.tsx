"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Check, Eye, Lightbulb } from "lucide-react";
import { scoreDecode, type IdiomEntry } from "@/lib/decode/idioms";

/**
 * Mode 1 — Decode. The phrase appears; the student picks EVERY plausible
 * meaning (multi-select). Scored against the idiom bank with partial credit.
 * Missing the physical readings scores harder than missing the emotional ones.
 */
export function DecodeArena({ entries }: { entries: IdiomEntry[] }) {
  const [idx, setIdx] = React.useState(0);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [revealed, setRevealed] = React.useState(false);

  const entry = entries[idx];
  if (!entry) return null;

  function toggle(m: string) {
    haptic("tap");
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  }

  function reveal() {
    haptic("success");
    setRevealed(true);
  }

  function next() {
    setSelected(new Set());
    setRevealed(false);
    setIdx((i) => Math.min(entries.length - 1, i + 1));
    haptic("tap"); // state change: next phrase
  }

  const meanings = entry.possible_meanings.map((m) => m.reading);
  const result = revealed ? scoreDecode(entry, [...selected]) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-small text-muted-foreground">
        <span>Phrase {idx + 1} of {entries.length}</span>
        <span>Pick every meaning that could be true</span>
      </div>

      {/* the phrase */}
      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <p className="text-eyebrow text-muted-foreground">The patient says</p>
        <p className="mt-1 text-h3">&ldquo;{entry.phrase}&rdquo;</p>
      </div>

      {/* multi-select meanings */}
      <div className="rounded-md border-2 border-border bg-card p-5">
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {meanings.map((m) => {
            const picked = selected.has(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggle(m)}
                disabled={revealed}
                aria-pressed={picked}
                className={cn(
                  "flex items-center gap-2 rounded-md border-2 border-border px-3 py-2 text-left text-small transition-transform active:translate-y-px disabled:opacity-70",
                  picked ? "bg-primary text-primary-foreground" : "bg-background",
                )}
              >
                {picked ? <Check className="size-3.5 shrink-0" aria-hidden /> : null}
                {m}
              </button>
            );
          })}
        </div>

        {!revealed ? (
          <button
            type="button"
            onClick={reveal}
            disabled={selected.size === 0}
            className="mt-4 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
          >
            Reveal what it could mean
          </button>
        ) : null}
      </div>

      {/* reveal */}
      {revealed && result ? (
        <div className="space-y-3">
          <div className="rounded-md border-2 border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">Score: {result.score}/{result.max}</p>
              <p className="text-caption text-muted-foreground">
                {Math.round((result.score / result.max) * 100)}% — physical readings are weighted
              </p>
            </div>
            {result.missedPhysical.length > 0 ? (
              <p className="mt-2 flex items-center gap-1.5 rounded-md border border-amber-400 bg-amber-50 p-2 text-small text-amber-800">
                <Lightbulb className="size-4 shrink-0" aria-hidden />
                You missed the physical readings: {result.missedPhysical.join(", ")}. Over-psychologising
                is the habit this drill exists to break.
              </p>
            ) : null}
          </div>

          <div className="rounded-md border-2 border-border bg-card p-5">
            <p className="flex items-center gap-1.5 text-base font-semibold">
              <Eye className="size-4" aria-hidden /> The disambiguating questions
            </p>
            <p className="mt-1 text-caption text-muted-foreground">
              {entry.disambiguating_questions.join("  ·  ")}
            </p>
            <p className="mt-3 rounded-md border border-border bg-secondary/60 p-3 text-small">
              <span className="font-semibold text-muted-foreground">The trap: </span>{entry.trap}
            </p>
            <p className="mt-2 text-caption text-muted-foreground">Sources: {entry.sources.join(", ")}</p>
          </div>

          <button
            type="button"
            onClick={next}
            disabled={idx + 1 >= entries.length}
            className="w-full rounded-md border-2 border-border bg-primary px-4 py-2.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
          >
            {idx + 1 < entries.length ? "Next phrase" : "Done for today"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
