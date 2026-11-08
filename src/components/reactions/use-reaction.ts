"use client";

import * as React from "react";
import { readReactionsOn, serverReactionsOn, subscribeReactions, writeReactionsOn } from "@/lib/reactions/prefs";
import { decide, newRun, type AnswerCtx, type Run } from "@/lib/reactions/trigger";
import { lastShownAt, showReaction } from "./store";

export type { AnswerCtx };

export type ReactionApi = {
  /** Call from an answer handler, after the answer is marked. Never changes scoring. */
  onAnswer: (correct: boolean, ctx?: AnswerCtx) => void;
  /** A new session (play again): first-right and streaks start over. */
  reset: () => void;
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
    }),
    [],
  );
}

/** The "Funny reactions" switch, live (Settings, account menu and the mute button stay in step). */
export function useReactionsOn(): [boolean, (on: boolean) => void] {
  const on = React.useSyncExternalStore(subscribeReactions, readReactionsOn, serverReactionsOn);
  return [on, writeReactionsOn];
}
