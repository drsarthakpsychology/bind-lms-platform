import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { reviewCard, type CardRating } from "@/lib/practice/rounds";

export const runtime = "nodejs";

const schema = z.object({
  card_id: z.string().uuid(),
  rating: z.number().int().min(1).max(4),
  // The student's current scheduler state for this card (server recomputes
  // the next state — FSRS math is authoritative, never trusted from the client).
  current: z.object({
    stability: z.number().min(0),
    difficulty: z.number().min(0),
    due_at: z.string().datetime({ offset: true }),
  }),
});

/**
 * POST /api/practice/rounds/review — persist a Rounds card rating.
 * Computes the next FSRS state server-side and upserts the user's
 * card_reviews row (unique card+user). Owner-scoped; RLS enforces it.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`rounds:review:${user.id}`, 120);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const next = reviewCard(parsed.data.current, parsed.data.rating as CardRating);

  const { error } = await supabase
    .from("card_reviews")
    .upsert(
      {
        card_id: parsed.data.card_id,
        user_id: user.id,
        stability: next.stability,
        difficulty: next.difficulty,
        retrievability: 0,
        due_at: next.due_at,
        rating: next.rating,
        reviewed_at: next.reviewed_at,
      },
      { onConflict: "card_id,user_id" },
    );

  if (error) {
    // A card not in the DB (FK miss) shouldn't block the deck — a check, not a test.
    if (error.code === "23503") {
      return NextResponse.json({ ok: true, warning: "card not in DB" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, due_at: next.due_at });
}
