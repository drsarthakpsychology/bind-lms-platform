import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { SEED_CASES } from "@/lib/psychopharm/sim/cases";
import { runPatientTurn } from "@/lib/sim/engine";
import { initialState, type PatientState } from "@/lib/sim/types";
import { drawVariant } from "@/lib/sim/variation";
import type { DepthCase } from "@/lib/sim/types";
import type { Gate } from "@/lib/sim/gates";
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
 * The v5 patient engine: one turn = Director (decides) → Actor (writes).
 * PatientState mutates every turn and is persisted on the patient turn's
 * `state` column so the next turn resumes exactly where this one ended (and
 * the debrief/retry can rewind to it).
 *
 * STUDENT INPUT IS UNTRUSTED — it goes to the Director as data, never into a
 * system prompt.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`sim:${user.id}`, 15);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = turnSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });
  const { sessionId, message } = parsed.data;

  const admin = createAdminClient();
  const { data: session } = await admin
    .from("sim_sessions")
    .select("id, case_id, user_id, status, difficulty, seed")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session || session.user_id !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (session.status !== "active") return NextResponse.json({ error: "session not active" }, { status: 409 });

  // Load the case (seed or DB).
  const { data: caseRow } = await admin
    .from("sim_cases")
    .select("case_data, title")
    .eq("id", session.case_id)
    .maybeSingle();
  const seedCase = SEED_CASES.find((c) => c.title === (caseRow?.title ?? ""));
  const caseData = (caseRow?.case_data as Record<string, unknown> | undefined) ?? {};
  // Build a DepthCase (the v5 model) from the seed or DB data.
  const base = (seedCase ?? caseData) as unknown as DepthCase;
  const simCase: DepthCase = {
    ...base,
    case_id: session.case_id,
    variation: (caseData.variation as DepthCase["variation"]) ?? base.variation,
    traps: (caseData.traps as DepthCase["traps"]) ?? base.traps ?? [],
    moves: {},
  };

  // Token ceiling.
  const { count } = await admin.from("sim_turns").select("id", { count: "exact", head: true }).eq("session_id", sessionId);
  if ((count ?? 0) > 120) return NextResponse.json({ error: "session turn limit reached" }, { status: 429 });

  try {
    guardStudentCall("sim_patient_turn", { enabled: process.env.AI_ENABLED !== "false" });
  } catch (e) {
    return NextResponse.json({ error: "AI unavailable", detail: (e as Error).message }, { status: 503 });
  }

  // Resume state: the last patient turn's `state` column, or a fresh state
  // from the session seed.
  const { data: lastPatientTurn } = await admin
    .from("sim_turns")
    .select("state")
    .eq("session_id", sessionId)
    .eq("role", "patient")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const variant = session.seed
    ? (JSON.parse(String(session.seed)) as ReturnType<typeof drawVariant>)
    : drawVariant(simCase.variation ?? { mood_today: ["flat"], recent_event: ["a long day"], most_defended_topic: ["the family"], opening_posture: ["came willingly"], somatic_focus: ["head"], trust_start: [3], language_mix: ["Hinglish"] }, session.case_id, 1);

  const state: PatientState = (lastPatientTurn?.state as PatientState | null) ?? initialState(session.case_id, variant);
  // Persist the seed on the session so a rewind/debrief is reproducible.
  if (!session.seed) {
    await admin.from("sim_sessions").update({ seed: JSON.stringify(variant) }).eq("id", sessionId);
  }

  // Persist the student turn (drop-safe).
  await admin.from("sim_turns").insert({
    session_id: sessionId,
    user_id: user.id,
    role: "student",
    content: message,
    content_type: "text",
  });

  // Build the fact rules from the case's disclosure data.
  const facts = (simCase.disclosure_rules ?? []).map((r) => ({
    fact_id: r.fact,
    gate: { kind: "explicit_phrase", patterns: [/./] } as Gate,
    sensitive: true,
  }));

  // Run the patient engine (Director → hard rules → Actor → fallback).
  const result = await runPatientTurn(simCase, state, message, [], facts);

  // Persist the patient turn WITH the new state (the rewind point).
  await admin.from("sim_turns").insert({
    session_id: sessionId,
    user_id: user.id,
    role: "patient",
    content: result.reply,
    content_type: "text",
    state: result.state,
  });

  // Log usage.
  await admin.from("ai_usage_log").insert({
    user_id: user.id,
    workload: "sim_patient_turn",
    provider: "unknown",
    tokens_in: Math.round((message.length + result.reply.length) / 4),
    tokens_out: Math.round(result.reply.length / 4),
  });

  return NextResponse.json({ reply: result.reply, sessionId, move: result.move });
}
