"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { MSE_LEVEL_META, MSE_LEVELS, type MseLevel } from "@/lib/mse/ladder";
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
export function MseLadder() {
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

  return (
    <div className="space-y-6">
      {/* Ladder header */}
      <div className="flex flex-wrap gap-2">
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
              className={cn(
                "flex items-center gap-2 rounded-md border-2 border-border px-3 py-2 text-caption font-medium transition-transform active:translate-y-px",
                isActive ? "bg-primary text-primary-foreground hard-shadow-sm" : "bg-card text-muted-foreground",
                !isUnlocked && "opacity-40",
              )}
              title={isUnlocked ? meta.title : "Complete the previous level to unlock"}
            >
              <span className="font-semibold">L{lvl}</span>
              <span>{meta.title}</span>
              {done[lvl] ? <span aria-label="done">✓</span> : null}
            </button>
          );
        })}
      </div>

      {/* Level body */}
      <div className="space-y-4">
        {active === "1" ? <ObserveLevel onComplete={() => markDone("1")} /> : null}
        {active === "2" ? <DomainLevel onComplete={() => markDone("2")} /> : null}
        {active === "3" ? <ConfusableDrill onComplete={() => markDone("3")} /> : null}
        {active === "4" ? <FullMseLevel onComplete={() => markDone("4")} /> : null}
        {active === "5" ? <LiveMseLevel onComplete={() => markDone("5")} /> : null}
      </div>

      {/* Small-things reference + drill */}
      <div className="mt-8 rounded-md border-2 border-border bg-card p-4">
        <h2 className="text-sm font-semibold">The small things — the checklist novices never run</h2>
        <p className="mt-1 text-small text-muted-foreground">
          Eye contact when the topic changed · the leg that stopped moving · the
          pause before &quot;no&quot; · the past tense used about oneself. Reference card
          + drill, usable at any level.
        </p>
        <div className="mt-3">
          <SmallThingsDrill />
        </div>
      </div>

      {/* Check what stuck — sourced quiz items after the ladder */}
      <div className="mt-8 rounded-md border-2 border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Check what stuck</h2>
        <p className="mt-1 text-small text-muted-foreground">
          A quick check, not a test — every item carries its source.
        </p>
        <div className="mt-3">
          <QuizCheck items={QUIZ_BANK.slice(0, 6)} />
        </div>
      </div>
    </div>
  );
}