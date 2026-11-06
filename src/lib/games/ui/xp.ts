"use client";

import { gainXp, istToday, type LearnState } from "@/lib/learn/engine";
import { getLearnState, setLearnState } from "@/lib/learn/store";

/** Add game XP to the student's Learn state (saved by the Learn store). */
export function awardXp(amount: number, fallback: LearnState) {
  if (amount <= 0) return;
  const cur = getLearnState() ?? fallback;
  setLearnState(gainXp(cur, Math.round(amount), istToday()));
}
