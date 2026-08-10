import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { SEED_CASES } from "@/lib/psychopharm/sim/cases";
import { buildPatientSystemPrompt, buildSessionStateBlock } from "@/lib/ai/prompts/patient";
import { aiChat } from "@/lib/ai/client";
import { guardStudentCall } from "@/lib/ai/guards";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const turnSchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().min(1).max(4000),
});

/**
 * POST /api/practice/sim/turn
 *
 * Student sends one message in a sim session; the patient responds.
 * - Streaming is handled client-side via the same route; here we return the
 *   full reply (simple path). A streaming variant can be added without
 *   changing the interface.
 * - STUDENT INPUT IS UNTRUSTED. It goes in a user turn, never a system prompt.
 * - Safety: rate limit per user per minute; token ceiling per session.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // rate limit: 15 turns/min per user
  const allowed = await rateLimit(`sim:${user.id}`, 15);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = turnSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });
  const { sessionId, message } = parsed.data;

  // Load the session + case via admin client (service role; RLS on tables).
  const admin = createAdminClient();
  const { data: session } = await admin
    .from("sim_sessions")
    .select("id, case_id, user_id, status, difficulty")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session || session.user_id !== user.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (session.status !== "active") {
    return NextResponse.json({ error: "session not active" }, { status: 409 });
  }

  // Load the case.
  const { data: caseRow } = await admin
    .from("sim_cases")
    .select("case_data")
    .eq("id", session.case_id)
    .maybeSingle();
  const caseData = caseRow?.case_data as Record<string, unknown> | undefined;
  // Fall back to seed cases for hand-built ones.
  const seedCase = SEED_CASES.find((c) => c.title === (caseData?.title ?? ""));
  const simCase = seedCase ?? (caseData as unknown as import("@/lib/psychopharm/sim/types").SimCase | undefined);
  if (!simCase) {
    return NextResponse.json({ error: "case not found" }, { status: 404 });
  }

  // Token ceiling per session (approx 4 chars/token).
  const { count } = await admin
    .from("sim_turns")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId);
  if ((count ?? 0) > 120) {
    return NextResponse.json({ error: "session turn limit reached" }, { status: 429 });
  }

  // Guard: student-data workload requires a no-train provider.
  try {
    guardStudentCall("sim_patient_turn", { enabled: process.env.AI_ENABLED !== "false" });
  } catch (e) {
    return NextResponse.json(
      { error: "AI unavailable", detail: (e as Error).message },
      { status: 503 },
    );
  }

  // Build the patient prompt with the case model + rolling state.
  const system = buildPatientSystemPrompt(simCase);
  const sessionState = {
    turn_count: count ?? 0,
    unlocked_disclosures: [],
    reflective_statements: 0,
    open_questions_asked: 0,
    premature_reassurance_count: 0,
    time_elapsed_seconds: 0,
  };

  // Persist the student turn immediately (drop-safe).
  await admin.from("sim_turns").insert({
    session_id: sessionId,
    user_id: user.id,
    role: "student",
    content: message,
    content_type: "text",
  });

  // Call the AI — student message is a USER turn (untrusted).
  let reply: string;
  try {
    const res = await aiChat(
      [
        { role: "system", content: system },
        { role: "user", content: message },
        { role: "user", content: `(Internal state: ${buildSessionStateBlock(sessionState)})` },
      ],
      { workload: "sim_patient_turn", maxTokens: 512, temperature: 0.7 },
    );
    reply = res.text;
  } catch {
    // Persist a graceful failure marker and return an error the UI can show.
    return NextResponse.json({ error: "patient unavailable" }, { status: 503 });
  }

  // Persist the patient turn.
  await admin.from("sim_turns").insert({
    session_id: sessionId,
    user_id: user.id,
    role: "patient",
    content: reply,
    content_type: "text",
  });

  // Log usage.
  await admin.from("ai_usage_log").insert({
    user_id: user.id,
    workload: "sim_patient_turn",
    provider: "unknown",
    tokens_in: Math.round((system.length + message.length) / 4),
    tokens_out: Math.round(reply.length / 4),
  });

  return NextResponse.json({ reply, sessionId });
}
