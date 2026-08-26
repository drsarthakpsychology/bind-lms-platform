import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { SEED_CASES } from "@/lib/psychopharm/sim/cases";
import { runPatientTurn } from "@/lib/sim/engine";
import { runFixtureTurn } from "@/lib/sim/fixture-patient";
import { parseDelivery } from "@/lib/sim/delivery";
import { initialState, type PatientState } from "@/lib/sim/types";
import { drawVariant, hashString } from "@/lib/sim/variation";
import type { DepthCase } from "@/lib/sim/types";
import { parseGate } from "@/lib/sim/gates";
import { PATIENT_PROMPT_VERSION } from "@/lib/sim/prompt-version";
import { isEnabled as aiEnabled } from "@/lib/ai/router";
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
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

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

  // CONVERSATION HISTORY (Bug 2): load the last 10 turns so the engines see
  // the thread — never just the current message. This is what lets the
  // patient "remember" trailing off and the student picking the thread up.
  const { data: historyTurns } = await admin
    .from("sim_turns")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(10);
  const recentTurns: Array<{ role: "student" | "patient"; content: string }> =
    (historyTurns ?? []).reverse().map((t) => ({
      role: t.role as "student" | "patient",
      content: String(t.content),
    }));

  // Draw the session variant once (mixed into the persisted seed below) and
  // reuse it for every turn. The seed comes from the session id + a fresh
  // entropy term so sessions of the same case diverge; once persisted it is
  // the reproducible source for rewinds and debriefs.
  const variant = session.seed
    ? (JSON.parse(String(session.seed)) as ReturnType<typeof drawVariant>)
    : drawVariant(simCase.variation ?? { mood_today: ["flat"], recent_event: ["a long day"], most_defended_topic: ["the family"], opening_posture: ["came willingly"], somatic_focus: ["head"], trust_start: [3], language_mix: ["Hinglish"] }, session.case_id, hashString(session.id) ^ Date.now());

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

  // Build the fact rules from the case's disclosure data. The authored gate
  // strings ("asked_about_self_harm_clearly", "validation_given",
  // "two_or_more_reflective_statements") become real deterministic gates —
  // a self-harm fact only opens when the student clearly asks, empathy-gated
  // facts only after the student earns them. Trust ≥ 3 still applies on top.
  const facts = (simCase.disclosure_rules ?? []).map((r) => ({
    fact_id: r.fact,
    gate: parseGate(r.gate),
    sensitive: true,
  }));

  // Run the patient engine (Director → hard rules → Actor → fallback).
  // Fixture mode: the deterministic case-aware patient (no network, still a
  // different person per case). Live mode: Director + Actor model calls.
  // If the live provider fails entirely (outage, quota, timeout), degrade to
  // the fixture patient rather than surfacing a 500 — never a dead turn.
  const engineEnabled = aiEnabled();
  const runFixture = () => {
    const fx = runFixtureTurn(simCase, state, message, facts, recentTurns);
    return {
      reply: fx.reply,
      state: fx.state,
      decision: fx.decision,
      usedFallback: false,
      regenerated: false,
      move: fx.decision.patient_move,
    };
  };
  let result: Awaited<ReturnType<typeof runPatientTurn>>;
  let degraded = false;
  if (engineEnabled) {
    try {
      result = await runPatientTurn(simCase, state, message, recentTurns, facts);
    } catch (e) {
      console.error("live patient engine failed — degrading to fixture:", e);
      result = runFixture();
      degraded = true;
    }
  } else {
    result = runFixture();
  }

  // Persist the patient turn WITH the new state (the rewind point) and the
  // parsed delivery cues — stage directions are BEHAVIOUR, never text.
  const spoken = parseDelivery(result.reply);
  await admin.from("sim_turns").insert({
    session_id: sessionId,
    user_id: user.id,
    role: "patient",
    content: spoken.content,
    content_type: "text",
    state: result.state,
    delivery: spoken.delivery,
  });

  // Log usage (fixture turns cost nothing — still recorded for the audit
  // trail) WITH the reason, so "was this the real patient?" is answerable.
  await admin.from("ai_usage_log").insert({
    user_id: user.id,
    workload: "sim_patient_turn",
    provider: degraded ? "fixture" : engineEnabled ? "unknown" : "fixture",
    status: degraded ? "fixture_fallback" : engineEnabled ? "ok" : "fixture_fallback",
    used_fallback: Boolean(result.usedFallback),
    regenerated: Number(result.regenerated ?? 0),
    prompt_version: engineEnabled ? PATIENT_PROMPT_VERSION : null,
    tokens_in: Math.round((message.length + result.reply.length) / 4),
    tokens_out: Math.round(result.reply.length / 4),
  });


  // The Director's affect + fatigue ride along so the voice layer can map
  // them onto delivery (v5 §6: affect → rate/pitch/emotion tag).
  return NextResponse.json({
    reply: spoken.content,
    delivery: spoken.delivery,
    sessionId,
    move: result.move,
    affect: result.decision.affect,
    fatigue: result.state.fatigue,
    mood: result.state.mood_today,
    // Phase 1 observability: the client shows an amber "AI fallback" pill in
    // dev only (NODE_ENV !== 'production') when the scripted engine fired.
    aiFallback: degraded || Boolean(result.usedFallback),
  });
}
