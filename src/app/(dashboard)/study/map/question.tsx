"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { seeded } from "@/components/learn/items";
import { cn } from "@/lib/utils";
import { AnswerStamp, HalftoneCorner } from "@/components/reactions/graphics";

/** What the browser needs to show a one-tap question. */
export type QView = {
  id: string;
  kind: "mcq" | "tf";
  text: string;
  vignette?: string;
  options?: string[];
  topic: string;
};

export type Pick = number | boolean | null;

const option =
  "relative flex min-h-12 w-full items-center gap-3 rounded-lg border-2 border-foreground bg-card px-4 py-3 text-left text-base font-semibold transition-transform duration-150 motion-reduce:transition-none enabled:active:translate-y-px focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:cursor-default";
const key = "grid size-7 shrink-0 place-items-center rounded-md border-2 border-current text-xs font-bold";

/**
 * One question. Without `answer`, it only shows what is picked (placement).
 * With `answer`, picks lock and right/wrong is shown with an icon and a word.
 */
export function QuestionView({
  q,
  picked,
  onPick,
  answer,
  headingRef,
}: {
  q: QView;
  picked: Pick;
  onPick: (p: number | boolean) => void;
  answer?: number | boolean;
  headingRef?: React.Ref<HTMLHeadingElement>;
}) {
  const locked = answer !== undefined;
  const order = React.useMemo(() => (q.options ? seeded(q.options.map((o, i) => ({ o, i })), q.id) : []), [q]);
  const choices: { label: string; value: number | boolean }[] = q.kind === "tf" ? [{ label: "True", value: true }, { label: "False", value: false }] : order.map(({ o, i }) => ({ label: o, value: i }));

  return (
    <div className="space-y-4">
      {q.vignette ? <p className="rounded-md border-2 border-dashed border-foreground/40 bg-muted px-4 py-3 text-sm">{q.vignette}</p> : null}
      {q.kind === "tf" ? <p className="text-eyebrow text-link">True or false?</p> : null}
      <div className="relative isolate">
        <HalftoneCorner className="-top-3 size-24" />
        <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold leading-tight outline-none sm:text-2xl">
          {q.text}
        </h2>
      </div>
      <div role="radiogroup" aria-label="Answers" className={cn("grid gap-2.5", q.kind === "tf" && "grid-cols-2")}>
        {choices.map((c, k) => {
          const isPicked = picked === c.value;
          const state = locked ? (c.value === answer ? "right" : isPicked ? "wrong" : "idle") : isPicked ? "picked" : "idle";
          return (
            <button
              key={String(c.value)}
              type="button"
              role="radio"
              aria-checked={isPicked}
              disabled={locked}
              onClick={() => onPick(c.value)}
              className={cn(
                option,
                q.kind === "tf" && "justify-center text-lg",
                state === "picked" && "bg-brand text-brand-foreground",
                state === "right" && "bg-primary text-primary-foreground",
                state === "wrong" && "bg-foreground text-background",
              )}
            >
              {locked && isPicked ? <AnswerStamp ok={c.value === answer} /> : null}
              {q.kind === "mcq" ? (
                <span className={key} aria-hidden>
                  {state === "right" ? <Check className="size-4" /> : state === "wrong" ? <X className="size-4" /> : k + 1}
                </span>
              ) : state === "right" ? (
                <Check className="size-5" aria-hidden />
              ) : state === "wrong" ? (
                <X className="size-5" aria-hidden />
              ) : null}
              <span className={cn("min-w-0", q.kind === "mcq" && "flex-1")}>{c.label}</span>
              {state === "right" ? <span className="sr-only">(right answer)</span> : state === "wrong" ? <span className="sr-only">(your answer, wrong)</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
