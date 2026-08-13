import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const checklistItemSchema = z.object({
  item: z.string().min(1),
  weight: z.number().int().positive(),
  done: z.boolean(),
});

const scoresSchema = z.object({
  checklist_fraction: z.number().min(0).max(1),
  global_rating: z.number().min(0).max(1),
  composite: z.number().min(0).max(1),
});

const schema = z.object({
  slug: z.string().min(1).max(50),
  mode: z.literal("text"),
  started_at: z.string().datetime({ offset: true }),
  completed_at: z.string().datetime({ offset: true }),
  checklist: z.array(checklistItemSchema).min(1),
  global_rating: z.number().int().min(0).max(5),
  scores: scoresSchema,
});

/**
 * POST /api/practice/osce/attempt — persist a completed OSCE station
 * self-assessment so /admin/osce-review (future) and weak-spots can read
 * per-station history. Owner-scoped; RLS on osce_attempts enforces it.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`osce:attempt:${user.id}`, 60);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const admin = createAdminClient();

  // Resolve the station by slug → uuid (the FK is station_id uuid).
  const { data: station, error: stationErr } = await admin
    .from("osce_stations")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();
  if (stationErr || !station) {
    return NextResponse.json({ error: "station not found" }, { status: 404 });
  }

  const { error } = await supabase.from("osce_attempts").insert({
    user_id: user.id,
    station_id: station.id,
    transcript: [], // voice mode not wired yet; always empty array for text mode
    scores: parsed.data.scores,
    global_rating: parsed.data.scores.global_rating * 5, // back to 0..5 scale for storage
    mode: parsed.data.mode,
    started_at: parsed.data.started_at,
    completed_at: parsed.data.completed_at,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}