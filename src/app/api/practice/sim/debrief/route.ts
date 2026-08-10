import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { scoreTranscript } from "@/lib/ai/scoring";
import { guardStudentCall } from "@/lib/ai/guards";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const debriefSchema = z.object({
  sessionId: z.string().uuid(),
});

/**
 * POST /api/practice/sim/debrief
 * Score a completed sim session. Runs the debrief model call ONCE and stores
 * the result in sim_scores (never re-runs for the same session).
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`sim:debrief:${user.id}`, 5);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = debriefSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const admin = createAdminClient();

  // Load the session + its turns.
  const { data: session } = await admin
    .from("sim_sessions")
    .select("id, case_id, user_id, difficulty, status")
    .eq("id", parsed.data.sessionId)
    .maybeSingle();
  if (!session || session.user_id !== user.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Already scored? Return the stored one.
  const { data: existingScore } = await admin
    .from("sim_scores")
    .select("rubric, quotes, missed_disclosures")
    .eq("session_id", session.id)
    .maybeSingle();
  if (existingScore) {
    return NextResponse.json({
      score: existingScore.rubric,
      quotes: existingScore.quotes,
      missed_disclosures: existingScore.missed_disclosures,
      cached: true,
    });
  }

  const { data: turns } = await admin
    .from("sim_turns")
    .select("role, content")
    .eq("session_id", session.id)
    .order("created_at", { ascending: true });

  if (!turns || turns.length < 2) {
    return NextResponse.json({ error: "not enough turns to score" }, { status: 400 });
  }

  // Load the case for rubric targets.
  const { data: caseRow } = await admin
    .from("sim_cases")
    .select("title, case_data")
    .eq("id", session.case_id)
    .maybeSingle();
  const rubricTargets = (caseRow?.case_data as { rubric_targets?: string[] })?.rubric_targets ?? [];

  // Load prior faculty corrections for few-shot (the feedback loop).
  const { data: corrections } = await admin
    .from("scoring_corrections")
    .select("original, corrected, note")
    .order("created_at", { ascending: false })
    .limit(10);
  const priorCorrections = (corrections ?? []).map((c) => ({
    original: c.original as unknown as string,
    corrected: c.corrected as unknown as string,
    note: c.note as string | undefined,
  }));

  try {
    guardStudentCall("debrief_scoring", { enabled: process.env.AI_ENABLED !== "false" });
  } catch (e) {
    return NextResponse.json(
      { error: "AI unavailable", detail: (e as Error).message },
      { status: 503 },
    );
  }

  const result = await scoreTranscript({
    caseTitle: caseRow?.title ?? "Sim case",
    caseDifficulty: session.difficulty,
    rubricTargets,
    transcript: (turns ?? []).map((t) => ({
      role: t.role === "student" ? ("student" as const) : ("patient" as const),
      content: String(t.content),
    })),
    priorCorrections,
  });

  // Store the score once.
  await admin.from("sim_scores").insert({
    session_id: session.id,
    user_id: user.id,
    case_id: session.case_id,
    rubric: result,
    quotes: result.quotes,
    missed_disclosures: result.missed_disclosures,
    overall: result.score,
  });

  // Mark the session complete.
  await admin.from("sim_sessions").update({ status: "complete", ended_at: new Date().toISOString() }).eq("id", session.id);

  return NextResponse.json({
    score: result,
    quotes: result.quotes,
    missed_disclosures: result.missed_disclosures,
  });
}
