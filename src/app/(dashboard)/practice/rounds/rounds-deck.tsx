"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { newCardState, reviewCard, type CardRating, type CardState } from "@/lib/practice/rounds";
import { ROUNDS_COMPETENCY_KEYS, recordCompetencyEvent } from "@/lib/practice/competency-client";

/** A Rounds card. Faculty-approved cards from the `cards` table join the seeds. */
export type SeedCard = { id?: string; front: string; back: string; type?: "flash" | "idiom" | "confusable" };

/** Author-built starter cards; approved DB cards (lesson-transcript drafts)
 *  are appended by the page. */
export const SEED_CARDS: SeedCard[] = [
  { front: "What are the two components of the Mental Healthcare Act 2017 that most affect your duty as a counsellor?", back: "Advance directives + nominated representative. Both mean you must document consent and respect the client's expressed wishes." },
  { front: "A client tells you they're 'fine' but can't sleep. What's the single best open question?", back: "'What does a bad night look like for you?' — it invites description, not a yes/no." },
  { front: "When is confidentiality absolute, and when is it breached?", back: "Absolute unless: imminent risk to self/others, child abuse (POCSO), or court order. Say the limits up front." },
  { front: "What does 'rolling with resistance' mean in motivational interviewing?", back: "Don't fight the client's resistance — reflect it, and let their own argument for change emerge." },
  { front: "Why is premature reassurance the #1 novice error in a first session?", back: "It closes exploration. The client stops testing whether you can hold their distress, and the real problem stays hidden." },
  { front: "What's the difference between mood and affect?", back: "Mood is the sustained inner feeling the client reports; affect is the observable expression. A client can report depressed mood with flat affect — or cheerfully deny low mood while showing labile affect.", type: "confusable" },
  // --- v5 Part 1: Idiom-of-distress cards ---
  { front: "What are the common medical differentials for a patient reporting 'kamzori' (weakness)?", back: "Anaemia, nutritional deficiency (B12), chronic disease (TB, diabetes, thyroid), or dhat-associated distress in young men.", type: "idiom" },
  { front: "A patient says 'dil ghabrata hai' (heart flutters). Why shouldn't you assume it's anxiety?", back: "The heart is the Indian seat of emotion — it is as likely to be grief or arrhythmia as it is to be a panic attack. Check the physical first.", type: "idiom" },
  { front: "What does 'not feeling fresh' usually mean in common Indian English?", back: "Often describes incomplete bowel evacuation (constipation). If you write 'low mood' and move on, you've missed the clinical picture.", type: "idiom" },
];

export function RoundsDeck({ cards = SEED_CARDS, states }: { cards?: SeedCard[]; states?: (CardState | undefined)[] }) {
  // The due queue, capped at 25. Each entry carries its card so the deck stays
  // associated even though dailyQueue filters + sorts (not parallel arrays).
  const [deck] = React.useState(() => {
    const entries = cards.map((card, i) => ({ card, state: states?.[i] ?? newCardState() }));
    const now = new Date();
    return entries
      .filter((e) => new Date(e.state.due_at) <= now)
      .sort((a, b) => a.state.due_at.localeCompare(b.state.due_at))
      .slice(0, 25);
  });
  const [idx, setIdx] = React.useState(0);
  const [showBack, setShowBack] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const current = deck[idx];
  const seed = current?.card;
  const cardState = current?.state;

  /** Persist a review for a DB-backed card (seeds have no id; FSRS math is
   *  recomputed server-side at /api/practice/rounds/review). */
  async function persistReview(card: SeedCard, rating: CardRating) {
    if (!card.id || !cardState) return;
    await fetch("/api/practice/rounds/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        card_id: card.id,
        rating,
        current: { stability: cardState.stability, difficulty: cardState.difficulty, due_at: cardState.due_at },
      }),
    }).catch(() => {}); // silent; a check, not a test
  }

  function rate(r: CardRating) {
    if (!current) return;
    haptic("tap");
    void reviewCard(current.state, r);
    void persistReview(seed!, r);
    setShowBack(false);
    if (idx + 1 >= deck.length) {
      setDone(true);
      // Credit the completed daily session into the Skills Passport.
      void recordCompetencyEvent("rounds", ROUNDS_COMPETENCY_KEYS, 4, `${deck.length} cards reviewed`).catch(() => {});
      haptic("success");
    } else {
      setIdx(idx + 1);
      haptic(r === 1 ? "warning" : "tap"); // state change: next card
    }
  }

  if (done) {
    return (
      <div className="rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
        <h2 className="text-base font-semibold">You&apos;re done for today</h2>
        <p className="mt-2 text-small text-muted-foreground">
          {deck.length} card{deck.length === 1 ? "" : "s"} reviewed. That&apos;s the whole
          queue — see you tomorrow.
        </p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
        <h2 className="text-base font-semibold">No cards due</h2>
        <p className="mt-2 text-small text-muted-foreground">
          Nothing due today. New cards land here once faculty approves them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-small text-muted-foreground">
        <span>Card {idx + 1} of {deck.length}</span>
        <span>{deck.length} due · capped at 25</span>
      </div>

      <div className="min-h-[200px] rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
        {seed.type ? (
          <p className="mb-2 inline-block rounded-full border border-border px-2 py-0.5 text-caption font-semibold text-muted-foreground">
            {seed.type === "idiom" ? "🔤 Idiom of distress" : seed.type === "confusable" ? "⚖️ Confusable pair" : "Flash"}
          </p>
        ) : null}
        <p className="text-base font-medium">{seed.front}</p>
        {showBack ? (
          <p className="mt-4 rounded-md border border-border bg-secondary/60 p-3 text-small">{seed.back}</p>
        ) : (
          <button
            type="button"
            onClick={() => { setShowBack(true); haptic("tap"); }}
            className="mt-4 rounded-md border-2 border-border bg-background px-4 py-2 text-small font-medium text-muted-foreground transition-transform active:translate-y-px"
          >
            Show answer
          </button>
        )}
      </div>

      {showBack ? (
        <div className="grid grid-cols-4 gap-2">
          {([1, 2, 3, 4] as CardRating[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => rate(r)}
              className="rounded-md border-2 border-border bg-primary px-3 py-2 text-caption font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
            >
              {r === 1 ? "Again" : r === 2 ? "Hard" : r === 3 ? "Good" : "Easy"}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
