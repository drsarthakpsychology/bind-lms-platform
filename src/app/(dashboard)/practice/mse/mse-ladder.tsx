"use client";

import * as React from "react";
import { Check, ChevronDown, Lock } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { MSE_LEVEL_META, MSE_LEVELS, type MseLevel } from "@/lib/mse/ladder";
import type { MseStimulus } from "@/lib/practice/mse";
import type { FullMseStimulus } from "@/lib/mse/mse4-stimuli";
import { MSE_COMPETENCY_KEYS, recordCompetencyEvent } from "@/lib/practice/competency-client";
import { ConfusableDrill } from "./confusable-drill";
import { ObserveLevel } from "./level-observe";
import { DomainLevel } from "./level-domain";
import { FullMseLevel } from "./level-full-mse";
import { LiveMseLevel } from "./level-live-mse";
import { SmallThingsDrill } from "./small-things-drill";
import { QuizCheck } from "@/components/practice/quiz-check";
import { QUIZ_BANK } from "@/lib/quiz/quiz-bank";

/** Which completion state each level needs before the next unlocks. Levels
 *  1-4 complete locally when the student finishes a round; Level 5 depends on
 *  a completed Consulting Room session (checked live by the component). */
export interface MseLadderContent {
  observe?: Array<{ id: string; content: string; why?: string }>;
  domain?: MseStimulus[];
  fullMse?: FullMseStimulus[];
}

export function MseLadder({ content }: { content?: MseLadderContent }) {
  const [active, setActive] = React.useState<MseLevel>("1");
  const [done, setDone] = React.useState<Record<MseLevel, boolean>>({
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
  });
  const [credited, setCredited] = React.useState<Record<MseLevel, boolean>>({
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
  });

  function markDone(level: MseLevel) {
    setDone((d) => ({ ...d, [level]: true }));
    haptic("success");
    // Credit the level's competencies into the Skills Passport (once).
    if (!credited[level]) {
      const keys = MSE_COMPETENCY_KEYS[level] ?? [];
      if (keys.length > 0) {
        setCredited((c) => ({ ...c, [level]: true }));
        recordCompetencyEvent("mse", keys, 5, `MSE level ${level} completed`).catch(() => {
          setCredited((c) => ({ ...c, [level]: false })); // retry on next completion
        });
      }
    }
    if (level !== "5") setActive(level === "1" ? "2" : level === "2" ? "3" : level === "3" ? "4" : "5");
  }

  const ordered = MSE_LEVELS;
  // Progressive disclosure: the reference + retention check only appear once a
  // level has completed, so they never compete with the active level's task.
  const anyDone = ordered.some((lvl) => done[lvl]);

  // Keyboard: arrow keys move between unlocked levels, Enter opens.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const idx = ordered.indexOf(active);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        for (let i = idx + 1; i < ordered.length; i++) {
          if (done[ordered[i - 1]] || i === 0) { setActive(ordered[i]); haptic("tap"); return; }
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (idx > 0) { setActive(ordered[idx - 1]); haptic("tap"); }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, done, ordered]);

  return (
    <div className="space-y-6">
      {/* Ladder header */}
      {/* Phones: one row that scrolls sideways; wider screens wrap. */}
      <div className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {ordered.map((lvl, i) => {
          const meta = MSE_LEVEL_META[lvl];
          const isActive = active === lvl;
          const isUnlocked = i === 0 || done[ordered[i - 1]]; // sequential: level n unlocks once n-1 is done
          return (
            <button
              key={lvl}
              type="button"
              onClick={() => {
                if (!isUnlocked) return;
                haptic("tap");
                setActive(lvl);
              }}
              aria-pressed={isActive}
              aria-disabled={!isUnlocked || undefined}
              className={cn(
                "relative flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-md border-2 px-3 py-2 text-small font-semibold whitespace-nowrap transition-[transform,box-shadow] duration-fast ease-snappy",
                isActive ? "border-foreground bg-brand text-brand-foreground hard-shadow-xs" : isUnlocked ? "border-foreground bg-card text-foreground active:translate-y-px" : "cursor-not-allowed border-dashed border-foreground/40 bg-transparent text-muted-foreground",
              )}
              title={isUnlocked ? meta.title : "Finish the level before to open this one"}
            >
              <span aria-hidden className={cn("grid size-6 place-items-center rounded-full border-2 border-current font-mono text-[0.7rem]", done[lvl] && "border-foreground bg-primary text-primary-foreground")}>
                {done[lvl] ? <Check className="size-3.5" strokeWidth={3} /> : !isUnlocked ? <Lock className="size-3" /> : lvl}
              </span>
              <span>{meta.title}</span>
              <span className="sr-only">{done[lvl] ? " (done)" : !isUnlocked ? " (locked)" : ""}</span>
            </button>
          );
        })}
      </div>

      {/* Level body */}
      <div className="space-y-4">
        {active === "1" ? <ObserveLevel onComplete={() => markDone("1")} stimuli={content?.observe} /> : null}
        {active === "2" ? <DomainLevel onComplete={() => markDone("2")} stimuli={content?.domain} /> : null}
        {active === "3" ? <ConfusableDrill onComplete={() => markDone("3")} /> : null}
        {active === "4" ? <FullMseLevel onComplete={() => markDone("4")} stimuli={content?.fullMse} /> : null}
        {active === "5" ? <LiveMseLevel onComplete={() => markDone("5")} /> : null}
      </div>

      {/* Small-things reference + drill: revealed only after a level completes. */}
      {anyDone ? (
        <details className="group rounded-md border-2 border-border bg-card">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
            <span className="min-w-0">
              <h2 className="text-sm font-semibold">The small things novices miss</h2>
            </span>
            <ChevronDown
              className="size-5 shrink-0 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="px-4 pb-4">
            <SmallThingsDrill />
          </div>
        </details>
      ) : null}

      {/* Check what stuck: revealed only after a level completes. */}
      {anyDone ? (
        <details className="group rounded-md border-2 border-border bg-card">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
            <span className="min-w-0">
              <h2 className="text-sm font-semibold">Quick check</h2>
            </span>
            <ChevronDown
              className="size-5 shrink-0 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="px-4 pb-4">
            <QuizCheck items={QUIZ_BANK.slice(0, 6)} />
          </div>
        </details>
      ) : null}
    </div>
  );
}