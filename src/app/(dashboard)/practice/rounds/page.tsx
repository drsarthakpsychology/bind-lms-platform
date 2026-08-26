import { createClient } from "@/lib/supabase/server";
import type { CardState } from "@/lib/practice/rounds";
import { RoundsDeck } from "./rounds-deck";
import { SEED_CARDS } from "@/lib/practice/rounds-seeds";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/rounds — spaced-repetition cards (Part 6.5).
 * The daily deck = faculty-approved cards from the `cards` table (auto-drafted
 * from lesson transcripts, reviewed at /admin/cards) + the author-built seeds.
 * Each DB card carries the student's own FSRS state from card_reviews, so
 * "due" is real; seeds schedule fresh each visit. Daily queue capped at 25.
 * "You're done" is shown and meant.
 */
export default async function RoundsPage() {
  await requireFeature("rounds");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Students can read published + approved cards (RLS).
  const { data: published } = await supabase
    .from("cards")
    .select("id, front, back")
    .eq("status", "published")
    .eq("approved", true)
    .limit(25);

  const dbCards = (published ?? []).map((c) => ({
    id: c.id as string,
    front: String(c.front),
    back: String(c.back),
  }));

  // The student's own scheduler state per DB card.
  const cardIds = dbCards.map((c) => c.id);
  const { data: reviews } =
    user && cardIds.length
      ? await supabase
          .from("card_reviews")
          .select("card_id, stability, difficulty, due_at")
          .eq("user_id", user.id)
          .in("card_id", cardIds)
      : { data: [] };
  const reviewByCard = new Map((reviews ?? []).map((r) => [r.card_id as string, r]));

  const cards = [...dbCards, ...SEED_CARDS].slice(0, 25);
  const states: (CardState | undefined)[] = [
    ...dbCards.map((c) => {
      const r = reviewByCard.get(c.id);
      return r
        ? { stability: Number(r.stability), difficulty: Number(r.difficulty), due_at: r.due_at as string }
        : undefined;
    }),
    ...SEED_CARDS.map(() => undefined),
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Rounds</p>
      <h1 className="mt-1 text-h1">Today&apos;s cards</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Capped at 25 a day. A 200-card backlog is how people quit — you&apos;re done when the
        queue is empty.
      </p>

      <div className="mt-6">
        <RoundsDeck cards={cards} states={states} />
      </div>
    </div>
  );
}
