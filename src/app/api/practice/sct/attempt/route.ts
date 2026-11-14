import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStudentApi } from "@/lib/auth/api-guard";
import { createAdminClient } from "@/lib/supabase/server";
import { ALL_SEED_SCT_ITEMS, scoreSctResponse, simulatedPanel, type SctResponse } from "@/lib/practice/sct";
import { rateLimitWrite } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  // Seed item slug, e.g. "sct-1".
  item_id: z.string().min(1),
  response: z.number().int().min(-2).max(2),
  // Ignored: the server scores the call itself (kept so old clients still validate).
  scored: z.number().min(0).max(1).optional(),
  seconds_spent: z.number().int().min(0).max(86_400),
  // Carried so the route can create the sct_items row on first write (the
  // arena runs on static ALL_SEED_SCT_ITEMS).
  vignette: z.string().optional(),
  hypothesis: z.string().optional(),
  new_information: z.string().optional(),
});

/**
 * POST /api/practice/sct/attempt: persist a completed judgment call.
 * One row per (item, user) via the table's unique constraint. The static
 * seed item is upserted into sct_items keyed by slug on first write, so the
 * FK resolves without a separate seeding pass. Owner-scoped; RLS on
 * sct_attempts enforces it.
 */
export async function POST(req: Request) {
  const access = await requireStudentApi({ path: "/practice/judgment", flag: "judgment" });
  if (!access.ok) return access.response;
  const profile = access.profile;
  const user = profile;

  const allowed = await rateLimitWrite(`sct:attempt:${user.id}`, 60);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  // Only the arena's own seed items exist. The item text, the panel and the
  // score all come from the server copy: a student cannot publish a new item
  // or send their own score.
  const seed = ALL_SEED_SCT_ITEMS.find((i) => i.id === parsed.data.item_id);
  if (!seed) return NextResponse.json({ error: "unknown item" }, { status: 404 });
  const scored = scoreSctResponse(parsed.data.response as SctResponse, simulatedPanel(seed.id));

  const admin = createAdminClient();

  // Resolve the seed item slug → uuid; create the row on first write.
  const { data: existing } = await admin
    .from("sct_items")
    .select("id")
    .eq("slug", seed.id)
    .maybeSingle();

  let itemId: string;
  if (existing) {
    itemId = existing.id;
  } else {
    const { data: created } = await admin
      .from("sct_items")
      .insert({
        slug: seed.id,
        vignette: seed.vignette,
        hypothesis: seed.hypothesis,
        new_information: seed.new_information,
        status: "published",
        approved: true,
      })
      .select("id")
      .single();
    if (!created?.id) return NextResponse.json({ ok: true, warning: "item not in DB; logged locally" });
    itemId = created.id;
  }

  // Written by the server (students cannot write sct_attempts directly).
  const { error } = await admin
    .from("sct_attempts")
    .upsert(
      {
        item_id: itemId,
        user_id: user.id,
        response: parsed.data.response,
        scored,
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
