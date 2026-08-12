import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const rewindSchema = z.object({
  sessionId: z.string().uuid(),
  /** The student's turn to re-attempt FROM (the flagged moment). */
  turnNumber: z.number().int().min(1),
});

/**
 * POST /api/practice/sim/rewind — A1 Retry from turn N.
 *
 * Clones a completed session up to turn N-1 (same case, same seed/variant,
 * same PatientState snapshot at that point) into a NEW active session, and
 * records a sim_branches row. The student re-attempts from exactly there.
 *
 * Cap: at most 3 branches per parent session.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`sim:rewind:${user.id}`, 10);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = rewindSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const admin = createAdminClient();

  // The parent session must belong to this user.
  const { data: parent } = await admin
    .from("sim_sessions")
    .select("id, case_id, user_id, status, difficulty, seed, state")
    .eq("id", parsed.data.sessionId)
    .maybeSingle();
  if (!parent || parent.user_id !== user.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Branch cap.
  const { count } = await admin
    .from("sim_branches")
    .select("id", { count: "exact", head: true })
    .eq("parent_session_id", parent.id);
  if ((count ?? 0) >= 3) {
    return NextResponse.json({ error: "branch limit reached (3 per moment)" }, { status: 429 });
  }

  // Load the parent's turns up to turn N-1 (student + patient), preserving
  // the PatientState snapshot persisted on the turn before the flagged one.
  const { data: turns } = await admin
    .from("sim_turns")
    .select("role, content, content_type, state")
    .eq("session_id", parent.id)
    .order("created_at", { ascending: true })
    .limit(parsed.data.turnNumber * 2);

  if (!turns || turns.length === 0) {
    return NextResponse.json({ error: "no turns to branch from" }, { status: 400 });
  }

  // The state to resume from is the LAST state snapshot before the flagged turn.
  const resumeState = [...turns].reverse().find((t) => t.state)?.state ?? null;
  const cutTurns = turns.slice(0, parsed.data.turnNumber * 2 - 1); // drop the flagged student turn

  // Clone the session.
  const { data: clone, error: cloneErr } = await admin
    .from("sim_sessions")
    .insert({
      case_id: parent.case_id,
      user_id: user.id,
      status: "active",
      difficulty: parent.difficulty,
      seed: parent.seed,
      state: resumeState ?? parent.state,
      parent_session_id: parent.id,
      is_branch: true,
    })
    .select("id")
    .single();
  if (cloneErr || !clone) {
    return NextResponse.json({ error: "could not branch session" }, { status: 500 });
  }

  // Copy the turns into the new session.
  if (cutTurns.length > 0) {
    await admin.from("sim_turns").insert(
      cutTurns.map((t) => ({
        session_id: clone.id,
        user_id: user.id,
        role: t.role,
        content: t.content,
        content_type: t.content_type ?? "text",
        state: t.state ?? null,
      })),
    );
  }

  // Record the branch.
  await admin.from("sim_branches").insert({
    parent_session_id: parent.id,
    branched_from_turn: parsed.data.turnNumber,
    new_session_id: clone.id,
  });

  return NextResponse.json({ sessionId: clone.id });
}
