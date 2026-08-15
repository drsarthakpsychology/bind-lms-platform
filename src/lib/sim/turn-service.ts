import type { SupabaseClient } from "@supabase/supabase-js";
import { runPatientTurn } from "./engine";
import { parseGate } from "./gates";
import { initialState, type DepthCase, type PatientState } from "./types";
import { drawVariant, hashString } from "./variation";
import { parseDelivery } from "./delivery";
import { makeDirectorActor } from "./llm-gateway";

/**
 * The shared "run one patient turn" service. The LIVEKIT WORKER and any
 * non-Next consumer call this — it is the EXISTING patient engine (state,
 * gates, disclosure, memory, case truth) plus the persistence glue, with the
 * real Groq LLM wired through the gateway. There is exactly ONE brain; text
 * mode and realtime voice both route through it, so voice ↔ text always share
 * the same session and memory.
 */

export interface SessionTurnInput {
  /** A service/admin Supabase client (the worker uses the service role). */
  supabase: SupabaseClient;
  sessionId: string;
  userId: string;
  message: string;
}

export interface SessionTurnResult {
  reply: string;
  move: string;
  disclosed: string[];
  trust: number;
  state: PatientState;
}

export async function runSessionTurn(input: SessionTurnInput): Promise<SessionTurnResult> {
  const { supabase, sessionId, userId, message } = input;

  // 1. Load the active session.
  const { data: session } = await supabase
    .from("sim_sessions")
    .select("id, case_id, status, seed")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session || session.status !== "active") throw new Error("session not active");

  // 2. Load the case (its own case_data is the source of truth).
  const { data: caseRow } = await supabase
    .from("sim_cases")
    .select("case_data")
    .eq("id", session.case_id)
    .maybeSingle();
  const simCase = (caseRow?.case_data ?? {}) as DepthCase;
  if (!simCase.identity) throw new Error("case data missing");

  // 3. Resume state: the last patient turn's persisted state.
  const { data: lastPatient } = await supabase
    .from("sim_turns")
    .select("state")
    .eq("session_id", sessionId)
    .eq("role", "patient")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // 4. Recent turns for context (the patient "remembers" the thread).
  const { data: history } = await supabase
    .from("sim_turns")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(10);
  const recentTurns: Array<{ role: "student" | "patient"; content: string }> =
    (history ?? []).reverse().map((t) => ({
      role: t.role as "student" | "patient",
      content: String(t.content),
    }));

  // 5. Session variant (seed) + initial/fresh state.
  const variant = session.seed
    ? (JSON.parse(String(session.seed)) as ReturnType<typeof drawVariant>)
    : drawVariant(simCase.variation ?? {}, sessionId, hashString(sessionId) ^ 7);
  const state: PatientState =
    (lastPatient?.state as PatientState | null) ?? initialState(sessionId, variant);

  // 6. Disclosure gates from the case's authored rules.
  const facts = (simCase.disclosure_rules ?? []).map((r) => ({
    fact_id: r.fact,
    gate: parseGate(r.gate),
    sensitive: true,
  }));

  // 7. Persist the student turn (drop-safe).
  await supabase.from("sim_turns").insert({
    session_id: sessionId,
    user_id: userId,
    role: "student",
    content: message,
    content_type: "text",
  });

  // 8. Run the EXISTING engine with the real Groq Director/Actor.
  const result = await runPatientTurn(simCase, state, message, recentTurns, facts, makeDirectorActor());

  // 9. Persist the patient turn WITH the new state (the shared memory).
  const spoken = parseDelivery(result.reply);
  await supabase.from("sim_turns").insert({
    session_id: sessionId,
    user_id: userId,
    role: "patient",
    content: spoken.content,
    content_type: "text",
    state: result.state,
    delivery: spoken.delivery,
  });

  return {
    reply: spoken.content,
    move: result.move,
    disclosed: result.state.disclosed,
    trust: result.state.trust,
    state: result.state,
  };
}
