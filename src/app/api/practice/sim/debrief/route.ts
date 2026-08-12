import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { scoreTranscript } from "@/lib/ai/scoring";
import { shouldInjectCorrection } from "@/lib/practice/sim-review";
import { rubricToCompetencyKeys } from "@/lib/practice/competency-map";
import { guardStudentCall } from "@/lib/ai/guards";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const debriefSchema = z.object({
  sessionId: z.string().uuid(),
  /** Bug 4: whether the student opened the hint — surfaced in the debrief. */
  hintUsed: z.boolean().optional(),
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
  // A8 — the nine no-disorder cases (by authored case_id): restraint is the
  // skill, the debrief explicitly praises staying the hand.
  const NO_DISORDER_IDS = new Set([
    "dep-grief-raj", "ado-normal-teen", "anx-exam", "no-disorder-sunita",
    "no-disorder-rohit-parent", "no-disorder-neelam-sent", "psy-mahesh",
    "anx-kavya", "soma-b12-pramod",
  ]);
  // Depth cases carry their authored case_id in case_data; also match by the
  // presentation wording so the v1 seeds with the same presentations count.
  const NO_DISORDER_TITLE_HINTS = [
    "four weeks ago",       // Raj — normal grief
    "exam anxiety within range",
    "panic attack after the medical scare",
    "possession that left him intact",
    "that was B12",
  ];
  const caseData = caseRow?.case_data as { case_id?: string } | null;
  const title = caseRow?.title ?? "";
  const isNoDisorder =
    NO_DISORDER_IDS.has(caseData?.case_id ?? "") ||
    NO_DISORDER_TITLE_HINTS.some((h) => title.toLowerCase().includes(h));

  // Load prior faculty corrections for few-shot (the feedback loop). Only
  // rows that actually changed a score are lessons — a pure note would render
  // as garbage (`"{}" should be scored as: {}`) inside the prompt.
  const { data: corrections } = await admin
    .from("scoring_corrections")
    .select("original, corrected, note")
    .order("created_at", { ascending: false })
    .limit(10);
  const priorCorrections = (corrections ?? [])
    .filter((c) => shouldInjectCorrection(c))
    .map((c) => ({
      original: String(c.original),
      corrected: String(c.corrected),
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
    isNoDisorder,
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

  // Credit the Skills Passport: the competencies this case exercised, with
  // the score as evidence (source 'sim'). Resolve competency key → id.
  const compKeys = rubricToCompetencyKeys(rubricTargets);
  if (compKeys.length > 0) {
    const { data: comps } = await admin
      .from("competencies")
      .select("id, key")
      .in("key", compKeys);
    const events = (comps ?? []).map((c) => ({
      user_id: user.id,
      competency_id: c.id,
      source: "sim" as const,
      source_ref: session.id,
      evidence: { overall: result.score, case_id: session.case_id, date: new Date().toISOString() },
    }));
    if (events.length > 0) await admin.from("competency_events").insert(events);
  }

  return NextResponse.json({
    score: result,
    quotes: result.quotes,
    missed_disclosures: result.missed_disclosures,
  });
}
