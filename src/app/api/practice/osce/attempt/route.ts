import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStudentApi } from "@/lib/auth/api-guard";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimitWrite } from "@/lib/rate-limit";
import { SEED_OSCE_STATIONS } from "@/lib/practice/osce";
import { scoreStation } from "@/lib/practice/osce-cards";

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
  checklist: z.array(checklistItemSchema).min(1).max(60),
  global_rating: z.number().int().min(0).max(5),
  /** Ignored: the score is worked out here from the station, never taken from the browser. */
  scores: scoresSchema.optional(),
});

/**
 * POST /api/practice/osce/attempt: persist a completed OSCE station
 * self-assessment so /admin/osce-review (future) and weak-spots can read
 * per-station history. Owner-scoped; RLS on osce_attempts enforces it.
 */
export async function POST(req: Request) {
  const access = await requireStudentApi({ path: "/practice/osce", flag: "osce" });
  if (!access.ok) return access.response;
  const profile = access.profile;
  const user = profile;

  const allowed = await rateLimitWrite(`osce:attempt:${user.id}`, 60);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  // Score on the server: only which items were ticked and the student's own
  // overall rating come from the browser; the weights are the station's.
  const def = SEED_OSCE_STATIONS.find((x) => x.id === parsed.data.slug);
  if (!def) return NextResponse.json({ error: "station not found" }, { status: 404 });
  const scored = scoreStation(def, parsed.data.checklist.filter((c) => c.done).map((c) => c.item), parsed.data.global_rating);
  const started = Date.parse(parsed.data.started_at);
  const completed = Date.parse(parsed.data.completed_at);
  if (!(completed >= started) || completed > Date.now() + 60_000) return NextResponse.json({ error: "invalid times" }, { status: 400 });

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

  // Written by the server only, for the signed-in student (2026_11_22_status.sql).
  const { error } = await admin.from("osce_attempts").insert({
    user_id: user.id,
    station_id: station.id,
    transcript: [], // voice mode not wired yet; always empty array for text mode
    scores: { checklist_fraction: scored.checklist_fraction, global_rating: scored.global_rating, composite: scored.composite },
    global_rating: scored.rating,
    mode: parsed.data.mode,
    started_at: parsed.data.started_at,
    completed_at: parsed.data.completed_at,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, scores: { checklist_fraction: scored.checklist_fraction, composite: scored.composite } });
}