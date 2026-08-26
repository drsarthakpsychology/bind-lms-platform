/** A Rounds card. Faculty-approved cards from the `cards` table join the seeds. */
export type SeedCard = { id?: string; front: string; back: string; type?: "flash" | "idiom" | "confusable" };

/**
 * Author-built starter cards; approved DB cards (lesson-transcript drafts)
 * are appended by the page.
 *
 * Lives OUTSIDE the "use client" deck so the server page can spread it — a
 * server component importing a data export from a client module gets a module
 * reference, not the array ("SEED_CARDS is not iterable").
 */
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
