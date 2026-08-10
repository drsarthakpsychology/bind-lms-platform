"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Gavel, Scale } from "lucide-react";
import type { EthicDilemma } from "@/lib/practice/ethics";

/**
 * Dilemma flow — commit to an action BEFORE seeing the consequence.
 * That's the skill the clinic never gives you time for.
 */
export function DilemmaFlow({ dilemmas }: { dilemmas: EthicDilemma[] }) {
  const [idx, setIdx] = React.useState(0);
  const [chosen, setChosen] = React.useState<number | null>(null);

  const d = dilemmas[idx];
  if (!d) return null;

  function pick(optionIdx: number) {
    if (chosen !== null) return;
    haptic("tap");
    setChosen(optionIdx);
    if (dilemmas[idx].options[optionIdx].correct) haptic("success");
  }

  function next() {
    setChosen(null);
    setIdx((i) => Math.min(dilemmas.length - 1, i + 1));
  }

  const done = chosen !== null;
  const correct = chosen !== null && d.options[chosen].correct;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-small text-muted-foreground">
        <span>Dilemma {idx + 1} of {dilemmas.length}</span>
        <span className="flex items-center gap-1">
          <Gavel className="size-3.5" aria-hidden />
          <span className="rounded-full bg-secondary px-2 py-0.5 text-caption font-medium">{d.tag}</span>
        </span>
      </div>

      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <p className="text-eyebrow text-muted-foreground">{d.setting}</p>
        <h2 className="mt-1 text-base font-semibold">{d.vignette}</h2>

        <div className="mt-4 space-y-2">
          {d.options.map((o, i) => {
            const picked = chosen === i;
            const reveal = done && picked;
            return (
              <button
                key={i}
                type="button"
                onClick={() => pick(i)}
                disabled={done}
                className={cn(
                  "w-full rounded-md border-2 border-border bg-background px-3 py-2.5 text-left text-small transition-transform active:translate-y-px disabled:opacity-60",
                  reveal && o.correct && "border-green-600 bg-green-50",
                  reveal && !o.correct && "border-red-400 bg-red-50",
                )}
              >
                <span className="font-semibold">{o.label}</span>
                {reveal ? (
                  <span className={cn("mt-1 block text-caption", o.correct ? "text-green-700" : "text-red-600")}>
                    {o.correct ? "✓ The right call" : "✗ Not this one"}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {done ? (
        <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
          <h3 className={cn("flex items-center gap-2 text-base font-semibold", correct ? "text-green-700" : "text-red-600")}>
            <Scale className="size-4" aria-hidden />
            {correct ? "Right call" : "Consequence"}
          </h3>
          <p className="mt-2 text-small">{d.options[chosen].consequence}</p>
          <p className="mt-3 rounded-md border border-border bg-secondary/60 p-3 text-small">
            <span className="font-semibold text-muted-foreground">The law: </span>
            {d.law}
          </p>
          <button
            type="button"
            onClick={next}
            disabled={idx + 1 >= dilemmas.length && correct}
            className="mt-4 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
          >
            {idx + 1 < dilemmas.length ? "Next dilemma" : "Done"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
