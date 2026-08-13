import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { getExpertMseForCase } from "@/lib/mse/mse-stories";

export const runtime = "nodejs";

/**
 * GET /api/practice/mse/transcripts
 * The student's own completed Consulting Room sessions, each with its case
 * title — the raw material for Level 5 (MSE from live interview). A student
 * can only ever see their OWN sessions (scoped to user_id server-side).
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`mse:transcripts:${user.id}`, 30);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const admin = createAdminClient();

  // Completed sim sessions owned by this student.
  const { data: sessions } = await admin
    .from("sim_sessions")
    .select("id, difficulty, started_at, ended_at, case_id, user_id")
    .eq("user_id", user.id)
    .eq("status", "complete")
    .order("ended_at", { ascending: false })
    .limit(20);

  if (!sessions || sessions.length === 0) {
    return NextResponse.json({ transcripts: [], count: 0 });
  }

  const caseIds = [...new Set(sessions.map((s) => s.case_id))];
  const { data: cases } = await admin
    .from("sim_cases")
    .select("id, title, case_data")
    .in("id", caseIds)
    .order("title");

  const titleById = new Map((cases ?? []).map((c) => [c.id, c.title ?? "Sim case"]));

  // Load turns for the most recent session only (the Level 5 flow starts from
  // one selected session; the UI reloads per selection via a query param).
  const first = sessions[0];

  // Which session to expand fully. Default the most recent; a query param
  // selects another of the student's own sessions.
  const params = new URL(req.url).searchParams;
  const requestedId = params.get("sessionId");
  const expandSession = requestedId
    ? (sessions.find((s) => s.id === requestedId) ?? first)
    : first;

  const { data: turns } = await admin
    .from("sim_turns")
    .select("role, content, created_at")
    .eq("session_id", expandSession.id)
    .order("created_at", { ascending: true })
    .limit(80);

  const fullTitle = titleById.get(expandSession.case_id) ?? "Sim case";
  const expert = getExpertMseForCase(fullTitle);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { caseKey: _k, small_things, ...expertDomains } = expert ?? {
    caseKey: "", small_things: [],
    appearance: [], behavior: [], speech: [], mood: [], affect: [],
    thought_process: [], thought_content: [], perception: [], cognition: [],
    insight: [], judgment: [],
  };

  return NextResponse.json({
    transcripts: sessions.map((s) => ({
      sessionId: s.id,
      title: titleById.get(s.case_id) ?? "Sim case",
      difficulty: s.difficulty,
      endedAt: s.ended_at,
    })),
    full: {
      sessionId: expandSession.id,
      title: fullTitle,
      turns: (turns ?? []).map((t) => ({ role: t.role, content: String(t.content) })),
      // The patient's actual presentation, keyed by authored case title — the
      // ground truth Level 5 scores against. Null when the case isn't coded yet.
      expert: expertDomains as Record<string, string[]>,
      smallThings: small_things as string[],
    },
    count: sessions.length,
  });
}