import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  // Seed item slug, e.g. "sct-1".
  item_id: z.string().min(1),
  response: z.number().int().min(-2).max(2),
  scored: z.number().min(0).max(1),
  seconds_spent: z.number().int().min(0),
  // Carried so the route can create the sct_items row on first write (the
  // arena runs on static ALL_SEED_SCT_ITEMS).
  vignette: z.string().optional(),
  hypothesis: z.string().optional(),
  new_information: z.string().optional(),
});

/**
 * POST /api/practice/sct/attempt — persist a completed judgment call.
 * One row per (item, user) via the table's unique constraint. The static
 * seed item is upserted into sct_items keyed by slug on first write, so the
 * FK resolves without a separate seeding pass. Owner-scoped; RLS on
 * sct_attempts enforces it.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`sct:attempt:${user.id}`, 60);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const admin = createAdminClient();

  // Resolve the seed item slug → uuid; upsert the row on first write.
  const { data: existing } = await admin
    .from("sct_items")
    .select("id")
    .eq("slug", parsed.data.item_id)
    .maybeSingle();

  let itemId: string;
  if (existing) {
    itemId = existing.id;
  } else {
    const { data: created } = await admin
      .from("sct_items")
      .insert({
        slug: parsed.data.item_id,
        vignette: parsed.data.vignette ?? "Seed SCT item",
        hypothesis: parsed.data.hypothesis ?? "Hypothesis",
        new_information: parsed.data.new_information ?? "",
        status: "published",
        approved: true,
      })
      .select("id")
      .single();
    itemId = created?.id ?? parsed.data.item_id; // fall back; FK will catch if invalid
  }

  const { error } = await supabase
    .from("sct_attempts")
    .upsert(
      {
        item_id: itemId,
        user_id: user.id,
        response: parsed.data.response,
        scored: parsed.data.scored,
        seconds_spent: parsed.data.seconds_spent,
      },
      { onConflict: "item_id,user_id" },
    );

  if (error) {
    if (error.code === "23503") {
      console.warn("[SCT attempt] FK violation on item_id:", itemId);
      return NextResponse.json({ ok: true, warning: "item not in DB; logged locally" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
