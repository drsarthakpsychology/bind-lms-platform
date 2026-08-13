import { createClient } from "@/lib/supabase/server";
import { RoundsDeck, SEED_CARDS } from "./rounds-deck";

export const dynamic = "force-dynamic";

/**
 * /practice/rounds — spaced-repetition cards (Part 6.5).
 * The daily deck = faculty-approved cards from the `cards` table (auto-drafted
 * from lesson transcripts, reviewed at /admin/cards) + the author-built seeds.
 * Daily queue capped at 25. "You're done" is shown and meant.
 */
export default async function RoundsPage() {
  const supabase = await createClient();
  // Students can read published + approved cards (RLS), then the seeds pad
  // the deck so a fresh cohort has content before any drafts are approved.
  const { data: published } = await supabase
    .from("cards")
    .select("front, back")
    .eq("status", "published")
    .eq("approved", true)
    .limit(25);

  const cards = [
    ...(published ?? []).map((c) => ({ front: String(c.front), back: String(c.back) })),
    ...SEED_CARDS,
  ].slice(0, 25);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Rounds</p>
      <h1 className="mt-1 text-h1">Today&apos;s cards</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Capped at 25 a day. A 200-card backlog is how people quit — you&apos;re done when the
        queue is empty.
      </p>

      <div className="mt-6">
        <RoundsDeck cards={cards} />
      </div>
    </div>
  );
}
