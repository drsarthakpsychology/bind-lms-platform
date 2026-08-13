import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const sortedFactorSchema = z.object({
  factorId: z.string().min(1),
  bucket: z.enum(["presenting", "predisposing", "precipitating", "perpetuating", "protective", "distractor"]).nullable(),
});

const schema = z.object({
  // Seed case slug (e.g. "form-1") for stages 1-3; null for Stage 4 (own
  // transcript), which references source_sim_session_id instead.
  case_id: z.string().min(1).nullable(),
  case_title: z.string().optional(),
  source_sim_session_id: z.string().uuid().optional(),
  sorted_factors: z.array(sortedFactorSchema),
  narrative: z.string(),
  diff: z.object({
    missing: z.array(z.string()),
    present: z.array(z.string()),
  }),
  score: z.number().min(0).max(1).optional(),
  started_at: z.string().datetime({ offset: true }),
  completed_at: z.string().datetime({ offset: true }),
});

/**
 * POST /api/practice/formulation/attempt — persist a completed Formulation
 * Forge pass. The seed case (static SEED_FORMULATION) is upserted into
 * formulation_cases keyed by slug on first write, so the FK resolves without
 * a separate seeding pass. Own-transcript attempts (Stage 4) are session-
 * based: case_id null, source_sim_session_id set. Owner-scoped; RLS on
 * formulation_attempts enforces it.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`formulation:attempt:${user.id}`, 60);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const admin = createAdminClient();

  // Resolve the seed case slug → uuid; upsert the case row on first write so
  // the FK has a real target (the Forge runs on static content).
  let caseId: string | null = null;
  if (parsed.data.case_id) {
    const { data: existing } = await admin
      .from("formulation_cases")
      .select("id")
      .eq("slug", parsed.data.case_id)
      .maybeSingle();
    if (existing) {
      caseId = existing.id;
    } else {
      const { data: created } = await admin
        .from("formulation_cases")
        .insert({
          slug: parsed.data.case_id,
          title: parsed.data.case_title ?? "Formulation case",
          prompt: "Sort the factors into the 5P grid. Leave distractors out.",
          factors: [],
          distractors: [],
          model_answer: {},
          status: "published",
        })
        .select("id")
        .single();
      caseId = created?.id ?? parsed.data.case_id; // fall back; FK will catch if invalid
    }
  }

  const { error } = await supabase.from("formulation_attempts").insert({
    user_id: user.id,
    case_id: caseId,
    source_sim_session_id: parsed.data.source_sim_session_id ?? null,
    sorted_factors: parsed.data.sorted_factors,
    narrative: parsed.data.narrative,
    diff: parsed.data.diff,
    score: parsed.data.score ?? null,
    status: "complete",
    started_at: parsed.data.started_at,
    completed_at: parsed.data.completed_at,
  });

  if (error) {
    if (error.code === "23503") {
      console.warn("[Formulation attempt] FK violation on case_id:", caseId);
      return NextResponse.json({ ok: true, warning: "case not in DB; logged locally" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
