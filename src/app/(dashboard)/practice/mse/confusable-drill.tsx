"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import {
  CONFUSABLE_PAIRS,
  MULTI_TERM_DRILLS,
  scoreConfusable,
  scoreMultiTerm,
} from "@/lib/mse/confusable";

/**
 * Level 3 — the confusable pairs + the set distinctions. Mood vs affect,
 * thought form vs content, akathisia vs anxiety, and the sets students fail
 * together: blunted/flat/restricted/labile, poverty of speech vs content,
 * psychomotor retardation vs sedation vs low motivation, insight as graded,
 * and the full flight/tangential/circumstantial/loosening set.
 */
export function ConfusableDrill({ onComplete }: { onComplete?: () => void } = {}) {
  // Phase 0 = pairs; phase 1 = multi-term drills.
  const [phase, setPhase] = React.useState<0 | 1>(0);
  const [pairIdx, setPairIdx] = React.useState(0);
  const [itemIdx, setItemIdx] = React.useState(0);
  const [drillIdx, setDrillIdx] = React.useState(0);
  const [multiIdx, setMultiIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, "a" | "b">>({});
  const [multiAnswers, setMultiAnswers] = React.useState<Record<string, string>>({});
  const [revealed, setRevealed] = React.useState(false);
  const [multiPicked, setMultiPicked] = React.useState<string | null>(null);
  const [multiDoneAll, setMultiDoneAll] = React.useState(false);

  // Focus management (brief §11.5): after advancing, move focus to the next
  // item's first answer button so keyboard users never lose their place.
  const answerRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!revealed) answerRef.current?.focus();
  }, [pairIdx, itemIdx, drillIdx, multiIdx, revealed, phase]);

  const pair = CONFUSABLE_PAIRS[pairIdx];
  const item = pair.items[itemIdx];
  const key = `${pair.id}:${itemIdx}`;
  const pairDone = pairIdx >= CONFUSABLE_PAIRS.length - 1 && itemIdx >= pair.items.length - 1;

  const drill = MULTI_TERM_DRILLS[drillIdx];
  const drillItem = drill.items[multiIdx];
  const drillLast = multiIdx >= drill.items.length - 1;
  const drillSetLast = drillIdx >= MULTI_TERM_DRILLS.length - 1;

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
    } else {
      setPhase(1);
      setMultiIdx(0);
      setRevealed(false);
    }
  }

  function pickMulti(label: string) {
    if (revealed) return;
    haptic("tap");
    setMultiPicked(label);
    setMultiAnswers((a) => ({ ...a, [drillItem.prompt]: label }));
    setRevealed(true);
    if (label === drillItem.correct) haptic("success");
  }

  function nextMulti() {
    setRevealed(false);
    setMultiPicked(null);
    if (multiIdx + 1 < drill.items.length) {
      setMultiIdx((i) => i + 1);
    } else if (drillIdx + 1 < MULTI_TERM_DRILLS.length) {
      setDrillIdx((d) => d + 1);
      setMultiIdx(0);
    } else {
      setMultiDoneAll(true);
    }
  }

  // ---- Phase 0: pairs ----
  if (phase === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-small text-muted-foreground">
          <span>Pair {pairIdx + 1}/{CONFUSABLE_PAIRS.length} · item {itemIdx + 1}/{pair.items.length}</span>
          <span className="text-caption">
            {pair.a} vs {pair.b}
          </span>
        </div>

        <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
          <p className="text-small">{item.prompt}</p>
          <p className="mt-3 text-caption font-semibold text-muted-foreground">Which is it?</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["a", "b"] as const).map((which, wi) => {
              const label = which === "a" ? pair.a : pair.b;
              const picked = answers[key] === which;
              const correct = item.correct === which;
              return (
                <button
                  key={which}
                  ref={wi === 0 ? answerRef : undefined}
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
          {revealed && !pairDone ? (
            <button
              type="button"
              onClick={next}
              className="mt-3 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
            >
              Next item
            </button>
          ) : null}
          {revealed && pairDone ? (
            <button
              type="button"
              onClick={() => { setPhase(1); setMultiIdx(0); setRevealed(false); haptic("tap"); }}
              className="mt-3 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
            >
              Now the set distinctions →
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  // ---- Phase 1: multi-term drills ----
  if (multiDoneAll) {
    const allItems = MULTI_TERM_DRILLS.flatMap((d) => d.items);
    return (
      <div className="space-y-4">
        <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
          <p className="text-base font-medium">
            Level 3 done — {scoreConfusable(CONFUSABLE_PAIRS.flatMap((p) => p.items), answers)} /{" "}
            {CONFUSABLE_PAIRS.flatMap((p) => p.items).length} pair items and{" "}
            {scoreMultiTerm(allItems, multiAnswers)} / {allItems.length} set items correct.
          </p>
          {onComplete ? (
            <button
              type="button"
              onClick={() => { haptic("success"); onComplete?.(); }}
              className="mt-3 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
            >
              Mark Level 3 complete
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-small text-muted-foreground">
        <span>Set {multiIdx + 1}/{drill.items.length} · {drill.id.replace(/-/g, " ")}</span>
        <span className="text-caption">{drill.terms.join(" / ")}</span>
      </div>

      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <p className="text-small">{drillItem.prompt}</p>
        <p className="mt-3 text-caption font-semibold text-muted-foreground">Which label fits?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {drill.terms.map((label) => {
            const picked = multiPicked === label;
            const correct = drillItem.correct === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => pickMulti(label)}
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
            {drill.rule}
          </p>
        ) : null}
        {revealed ? (
          <button
            type="button"
            onClick={nextMulti}
            className="mt-3 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
          >
            {drillLast && drillSetLast ? "Finish" : "Next item"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
