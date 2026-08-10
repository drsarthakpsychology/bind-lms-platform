/**
 * Rounds (Part 6.5) — spaced repetition via ts-fsrs v5.
 *
 * FSRS models stability/difficulty/retrievability per card and hits
 * equivalent retention to SM-2 with materially fewer reviews. We cap the
 * daily queue at 25 — a 200-card backlog is how people quit.
 *
 * This wraps ts-fsrs so the scheduler logic is testable and provider-free.
 */

import { createEmptyCard, fsrs, Rating, type Card as FsrsCard } from "ts-fsrs";

export type CardRating = 1 | 2 | 3 | 4; // Again / Hard / Good / Easy

export interface CardState {
  stability: number;
  difficulty: number;
  due_at: string;
}

export interface ReviewResult extends CardState {
  rating: CardRating;
  reviewed_at: string;
}

let _fsrs: ReturnType<typeof fsrs> | null = null;
function getFSRS() {
  if (!_fsrs) _fsrs = fsrs();
  return _fsrs;
}

/** A brand-new card state (first review due now). */
export function newCardState(): CardState {
  const c = createEmptyCard();
  return { stability: c.stability, difficulty: c.difficulty, due_at: c.due.toISOString() };
}

/** Schedule a card after a review. Returns the updated state. */
export function reviewCard(current: CardState, rating: CardRating, now = new Date()): ReviewResult {
  const f = getFSRS();
  const card: FsrsCard = {
    ...createEmptyCard(),
    stability: current.stability,
    difficulty: current.difficulty,
    due: new Date(current.due_at),
  };
  const scheduling = f.repeat(card, now);
  const entry = scheduling[rating as keyof typeof scheduling] ?? scheduling[Rating.Good as keyof typeof scheduling];
  const chosen = entry as { card: { stability: number; difficulty: number; due: Date } };
  return {
    stability: chosen.card.stability,
    difficulty: chosen.card.difficulty,
    due_at: chosen.card.due.toISOString(),
    rating,
    reviewed_at: now.toISOString(),
  };
}

/**
 * The daily review queue: cards due today, capped at 25. Deterministic so it's
 * unit-testable. `cards` is the user's card states.
 */
export function dailyQueue(cards: CardState[], now = new Date()): CardState[] {
  const due = cards
    .filter((c) => new Date(c.due_at) <= now)
    .sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime());
  return due.slice(0, 25);
}
