import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { correctionSchema, buildCorrectionRow } from "@/lib/practice/sim-review";

export const runtime = "nodejs";

/**
 * POST /api/admin/sim-corrections
 *
 * Faculty saves a review comment / score correction on an AI-scored sim
 * session. Persisted to scoring_corrections; score-changing rows feed the
 * few-shot feedback loop on future debriefs (see src/lib/ai/scoring.ts).
 * Admin-only — RLS also blocks non-admins on the table itself.
 */
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = correctionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", detail: parsed.error.flatten() }, { status: 400 });
  }

  const adminClient = createAdminClient();

  // The session must exist and be scored before a correction is meaningful.
  const { data: session } = await adminClient
    .from("sim_sessions")
    .select("id, user_id")
    .eq("id", parsed.data.sessionId)
    .maybeSingle();
  if (!session) return NextResponse.json({ error: "Session not found." }, { status: 404 });

  const { data: score } = await adminClient
    .from("sim_scores")
    .select("overall")
    .eq("session_id", session.id)
    .maybeSingle();
  if (!score) return NextResponse.json({ error: "Session not scored yet." }, { status: 400 });

  const row = buildCorrectionRow(parsed.data, admin.id);
  const { error } = await adminClient.from("scoring_corrections").insert(row);
  if (error) {
    return NextResponse.json({ error: "Failed to save correction." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, feedsLoop: typeof row.corrected === "number" });
}
