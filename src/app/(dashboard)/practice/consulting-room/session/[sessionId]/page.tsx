import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { provisionalKeys } from "@/lib/practice/rubric";
import { isEnabled as aiEnabled } from "@/lib/ai/router";
import { SimSessionView } from "./session-view";

export const dynamic = "force-dynamic";

/**
 * /practice/consulting-room/session/[sessionId]
 * The live simulated-patient session. Server page loads the session + turns,
 * then hands off to the interactive client view.
 */
export default async function SimSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  // Malformed id → PostgREST 400, not a clean 404 (same guard as the lesson page).
  if (!/^[0-9a-f-]{36}$/i.test(sessionId)) {
    notFound();
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const admin = createAdminClient();
  const { data: session } = await admin
    .from("sim_sessions")
    .select("id, case_id, difficulty, status, started_at, user_id")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session || session.user_id !== user.id) notFound();

  const { data: caseRow } = await admin
    .from("sim_cases")
    .select("title, case_data")
    .eq("id", session.case_id)
    .maybeSingle();
  const caseData = (caseRow?.case_data ?? {}) as Record<string, unknown>;
  const identity = (caseData.identity ?? {}) as { name?: string; age?: number; occupation?: string };
  const patientName = identity.name ?? "the patient";
  const patientAge = identity.age;
  const patientContext = identity.occupation ?? "";
  const affectRules = (caseData.affect_rules as { tts_rate?: number; tts_pitch?: number }) ?? {};
  const patientGender = (caseData.identity as { gender?: "male" | "female" | "other" })?.gender;
  const voicePrefs = {
    rate: affectRules.tts_rate ?? 1,
    pitch: affectRules.tts_pitch ?? 1,
    lang: "en-IN",
    gender: patientGender === "male" || patientGender === "female" ? patientGender : undefined,
  };

  const { data: turns } = await admin
    .from("sim_turns")
    .select("id, role, content, content_type, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  // A3 — provisional scoring dimensions hide their NUMBER from students
  // (qualitative feedback only) until calibrated against faculty scores.
  const { data: rubricDims } = await admin
    .from("rubric_dimensions")
    .select("key, status");
  const provisionalDims = provisionalKeys(
    (rubricDims ?? []).map((d) => ({
      key: String(d.key),
      label: "",
      status: d.status as "provisional" | "validated",
      agreement: null,
      n_scored: 0,
    })),
  );

  // A1 retry — comparison strip data. If this session is a branch (created by
  // "Try this again"), load the parent's turns at the branch point + the
  // parent's debrief so the student sees attempt 1 vs attempt 2 side by side.
  const { data: branch } = await admin
    .from("sim_branches")
    .select("parent_session_id, branched_from_turn")
    .eq("new_session_id", sessionId)
    .maybeSingle();

  let branchInfo:
    | {
        parentSessionId: string;
        branchedFromTurn: number;
        parentTurns: Array<{ id: string; role: "student" | "patient"; content: string }>;
        parentScore?: { overall: number; quotes: Array<{ quote: string; better: string }> };
      }
    | undefined;

  if (branch && session.status !== "active") {
    const { data: parentTurns } = await admin
      .from("sim_turns")
      .select("role, content")
      .eq("session_id", branch.parent_session_id)
      .order("created_at", { ascending: true })
      .limit(branch.branched_from_turn * 2);
    const { data: parentScore } = await admin
      .from("sim_scores")
      .select("overall, quotes")
      .eq("session_id", branch.parent_session_id)
      .maybeSingle();
    branchInfo = {
      parentSessionId: branch.parent_session_id,
      branchedFromTurn: branch.branched_from_turn,
      parentTurns: (parentTurns ?? []).map((t, i) => ({
        id: `branch-${i}`,
        role: t.role as "student" | "patient",
        content: String(t.content),
      })),
      parentScore: parentScore
        ? {
            overall: Number(parentScore.overall),
            quotes: (parentScore.quotes as Array<{ quote: string; better: string }>) ?? [],
          }
        : undefined,
    };
  }

  return (
    // Edge-to-edge: the shell already renders this route full-bleed (immersive
    // path), so any padding wrapper here would inset the h-dvh conversation and
    // make it taller than the viewport. The SimSessionView owns the whole
    // screen — header, chat, composer, sheets.
    <SimSessionView
      sessionId={sessionId}
      patientName={patientName}
      patientAge={patientAge}
      patientContext={patientContext}
      difficulty={session.difficulty}
      fixtureMode={!aiEnabled()}
      startedAt={session.started_at as string | undefined}
      voicePrefs={voicePrefs}
      initialTurns={(turns ?? []).map((t) => ({
        id: String(t.id ?? `t-${t.created_at ?? 0}-${t.role}-${String(t.content).slice(0, 12)}`),
        role: t.role as "student" | "patient",
        content: String(t.content),
      }))}
      branchInfo={branchInfo}
      provisionalDims={provisionalDims}
    />
  );
}
