"use client";

import * as React from "react";
import { readReactionsOn, serverReactionsOn, subscribeReactions, writeReactionsOn } from "@/lib/reactions/prefs";
import { decide, newRun, type AnswerCtx, type Run } from "@/lib/reactions/trigger";
import { lastShownAt, showEndReaction, showReaction } from "./store";

export type { AnswerCtx };

export type ReactionApi = {
  /** Call from an answer handler, after the answer is marked. Never changes scoring. */
  onAnswer: (correct: boolean, ctx?: AnswerCtx) => void;
  /** A new session (play again): first-right and streaks start over. */
  reset: () => void;
  /**
   * A game or practice round has ended. Always shows a sticker (when reactions
   * are on): "won" gets a happy one, "lost" a sad one, "mixed" the crying thumbs up.
   */
  onFinish: (outcome: "won" | "lost" | "mixed") => void;
};

/**
 * Funny reactions for one quiz session. Each screen that calls this keeps its
 * own run (streak, misses in a row, first right); the 15 s throttle and the
 * on/off switch are shared app wide.
 */
export function useReaction(): ReactionApi {
  const run = React.useRef<Run>(newRun());
  return React.useMemo<ReactionApi>(
    () => ({
      onAnswer(correct, ctx = {}) {
        const d = decide(run.current, correct, ctx, { now: Date.now(), lastShownAt: lastShownAt(), rand: Math.random, enabled: readReactionsOn() });
        run.current = d.run;
        if (d.mood) showReaction(d.mood);
      },
      reset() {
        run.current = newRun();
      },
      onFinish(outcome) {
        if (!readReactionsOn()) return;
        showEndReaction(outcome === "won" ? "streak" : outcome === "lost" ? "wrong" : "near");
      },
    }),
    [],
  );
}

/** The "Funny reactions" switch, live (Settings, account menu and the mute button stay in step). */
export function useReactionsOn(): [boolean, (on: boolean) => void] {
  const on = React.useSyncExternalStore(subscribeReactions, readReactionsOn, serverReactionsOn);
  return [on, writeReactionsOn];
}
