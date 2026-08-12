import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  itemId: z.string().min(1).max(100),
  chosen: z.number().int(),
  correct: z.boolean(),
});

/**
 * POST /api/practice/quiz/attempt — persist one quiz answer on reveal so
 * /admin/triage can surface low-confidence quiz areas (per item, per user).
 * Owner-only RLS + rate-limited; failures are silent (a check, not a test).
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`quiz:attempt:${user.id}`, 120);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { error } = await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    item_id: parsed.data.itemId,
    chosen: parsed.data.chosen,
    correct: parsed.data.correct,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
