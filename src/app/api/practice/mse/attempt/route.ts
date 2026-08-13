import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const payloadSchema = z.object({
  // Levels 1/2/4 carry a seed/db stimulus slug; Level 5 is session-based and
  // sends null (it references source_session_id instead).
  stimulus_id: z.string().min(1).nullable(),
  level: z.enum(["1", "2", "4", "5"]),
  domain: z.string().optional(),
  started_at: z.string().datetime({ offset: true }),
  completed_at: z.string().datetime({ offset: true }),
  score: z.number().min(0).max(1).optional(),
  tags: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
  observations: z.number().int().min(0).optional(),
  picked: z.array(z.string()).optional(),
  expert: z.array(z.string()).optional(),
  amber: z.array(z.string()).optional(),
  source_session_id: z.string().uuid().optional(),
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * POST /api/practice/mse/attempt — persist a completed MSE level attempt.
 * The static seed stimuli (mse-* / obs-* / mse4-*) are upserted into
 * mse_stimuli keyed by slug (scripts/upsert-mse-stimuli.ts), so this resolves
 * the slug to the row uuid. Level 5 attempts (MSE from a live interview)
 * reference the sim session, not a stimulus, so stimulus_id stays null.
 * Owner-scoped; RLS on mse_attempts enforces it.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`mse:attempt:${user.id}`, 60);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const admin = createAdminClient();

  // Level 5 attempts are session-based: no mse_stimulus row exists for them.
  const isSessionLevel = parsed.data.level === "5";

  // Resolve a seed slug (mse-1, obs-1, mse4-*) — or an already-uuid id — to
  // the actual mse_stimuli row id.
  let stimulusId: string | null = null;
  if (!isSessionLevel && parsed.data.stimulus_id) {
    if (UUID_RE.test(parsed.data.stimulus_id)) {
      stimulusId = parsed.data.stimulus_id;
    } else {
      const { data: stimulus } = await admin
        .from("mse_stimuli")
        .select("id")
        .eq("slug", parsed.data.stimulus_id)
        .maybeSingle();
      stimulusId = stimulus?.id ?? parsed.data.stimulus_id; // fall back; FK will catch if invalid
    }
  }

  // The per-level detail (labels, observations, picked/expert/amber) rides in
  // the tags jsonb column; level/domain/window live in their own columns.
  const { error } = await supabase.from("mse_attempts").insert({
    user_id: user.id,
    stimulus_id: stimulusId,
    level: parsed.data.level,
    domain: parsed.data.domain ?? null,
    started_at: parsed.data.started_at,
    completed_at: parsed.data.completed_at,
    source_session_id: parsed.data.source_session_id ?? null,
    tags: {
      labels: parsed.data.labels ?? [],
      observations: parsed.data.observations ?? null,
      picked: parsed.data.picked ?? [],
      expert: parsed.data.expert ?? [],
      amber: parsed.data.amber ?? [],
    },
    score: parsed.data.score ?? null,
  });

  if (error) {
    // If FK fails due to an unknown stimulus (not yet seeded), don't block the
    // student — an attempt is a check, not a test.
    if (error.code === "23503") {
      console.warn("[MSE attempt] FK violation on stimulus_id:", stimulusId);
      return NextResponse.json({ ok: true, warning: "stimulus not in DB; logged locally" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
