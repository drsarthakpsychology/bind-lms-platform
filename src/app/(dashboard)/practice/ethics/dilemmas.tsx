"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Gavel, Scale, CheckCircle2 } from "lucide-react";
import { MobileChoiceList } from "@/components/mobile/mobile-choice-list";
import type { EthicDilemma } from "@/lib/practice/ethics";

/**
 * Dilemma flow — commit to an action BEFORE seeing the consequence.
 * That's the skill the clinic never gives you time for.
 */
export function DilemmaFlow({ dilemmas }: { dilemmas: EthicDilemma[] }) {
  const [idx, setIdx] = React.useState(0);
  const [chosen, setChosen] = React.useState<number | null>(null);
  const [finished, setFinished] = React.useState(false);

  const d = dilemmas[idx];
  if (!d) return null;

  function pick(optionIdx: number) {
    if (chosen !== null) return;
    haptic("tap");
    setChosen(optionIdx);
    if (dilemmas[idx].options[optionIdx].correct) haptic("success");
  }

  function next() {
    if (idx + 1 >= dilemmas.length) {
      setFinished(true);
      haptic("success");
    } else {
      setChosen(null);
      setIdx((i) => i + 1);
    }
  }

  const done = chosen !== null;
  const correct = chosen !== null && d.options[chosen].correct;
  const correctIndex = d.options.findIndex((o) => o.correct);

  if (finished) {
    return (
      <div className="rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
        <p className="flex items-center gap-2 text-base font-semibold">
          <CheckCircle2 className="size-4" aria-hidden /> {dilemmas.length} dilemmas complete
        </p>
        <p className="mt-2 text-small text-muted-foreground">
          The law has teeth — every choice here maps to MHA 2017, POCSO, or RCI scope.
        </p>
        <button
          type="button"
          onClick={() => { setIdx(0); setChosen(null); setFinished(false); haptic("tap"); }}
          className="mt-4 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
        >
          Run the dilemmas again
        </button>
      </div>
    );
  }

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

        <div className="mt-4">
          <MobileChoiceList
            options={d.options.map((o) => o.label)}
            correct={[correctIndex]}
            picked={chosen !== null ? [chosen] : []}
            revealed={done}
            onPick={pick}
            label="Action options"
          />
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
            className="mt-4 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
          >
            {idx + 1 < dilemmas.length ? "Next dilemma" : "Finish"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
