"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { dailyQueue, newCardState, reviewCard, type CardRating, type CardState } from "@/lib/practice/rounds";

/** Seed cards for the slice (real cards come from lesson transcripts → admin queue). */
const SEED_CARDS = [
  { front: "What are the two components of the Mental Healthcare Act 2017 that most affect your duty as a counsellor?", back: "Advance directives + nominated representative. Both mean you must document consent and respect the client's expressed wishes." },
  { front: "A client tells you they're 'fine' but can't sleep. What's the single best open question?", back: "'What does a bad night look like for you?' — it invites description, not a yes/no." },
  { front: "When is confidentiality absolute, and when is it breached?", back: "Absolute unless: imminent risk to self/others, child abuse (POCSO), or court order. Say the limits up front." },
  { front: "What does 'rolling with resistance' mean in motivational interviewing?", back: "Don't fight the client's resistance — reflect it, and let their own argument for change emerge." },
  { front: "Why is premature reassurance the #1 novice error in a first session?", back: "It closes exploration. The client stops testing whether you can hold their distress, and the real problem stays hidden." },
  { front: "What's the difference between mood and affect?", back: "Mood is the sustained inner feeling the client reports; affect is the observable expression. A client can report depressed mood with flat affect — or cheerfully deny low mood while showing labile affect." },
  // --- v5 Part 1: Idiom-of-distress cards ---
  { front: "What are the common medical differentials for a patient reporting 'kamzori' (weakness)?", back: "Anaemia, nutritional deficiency (B12), chronic disease (TB, diabetes, thyroid), or dhat-associated distress in young men." },
  { front: "A patient says 'dil ghabrata hai' (heart flutters). Why shouldn't you assume it's anxiety?", back: "The heart is the Indian seat of emotion — it is as likely to be grief or arrhythmia as it is to be a panic attack. Check the physical first." },
  { front: "What does 'not feeling fresh' usually mean in common Indian English?", back: "Often describes incomplete bowel evacuation (constipation). If you write 'low mood' and move on, you've missed the clinical picture." },
];

export function RoundsDeck() {
  // Card states are seeded; in production they come from the DB (cards +
  // card_reviews). This slice demonstrates the scheduler + UI.
  const [queue] = React.useState<CardState[]>(() => dailyQueue(SEED_CARDS.map(() => newCardState())));
  const [idx, setIdx] = React.useState(0);
  const [showBack, setShowBack] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const card = queue[idx];
  const seed = SEED_CARDS[idx];

  function rate(r: CardRating) {
    if (!card) return;
    haptic("tap");
    // In production, reviewCard(current, r) persists to card_reviews. Here we
    // just advance — the queue is fixed for the slice.
    void reviewCard(card, r);
    setShowBack(false);
    if (idx + 1 >= queue.length) {
      setDone(true);
      haptic("success");
    } else {
      setIdx(idx + 1);
    }
  }

  if (done) {
    return (
      <div className="rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
        <h2 className="text-base font-semibold">You&apos;re done for today</h2>
        <p className="mt-2 text-small text-muted-foreground">
          {queue.length} card{queue.length === 1 ? "" : "s"} reviewed. That&apos;s the whole
          queue — see you tomorrow.
        </p>
      </div>
    );
  }

  if (!card) {
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
        <span>Card {idx + 1} of {queue.length}</span>
        <span>{queue.length} due · capped at 25</span>
      </div>

      <div className="min-h-[200px] rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
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
