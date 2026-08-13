import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  session_id: z.string().uuid(),
});

/** The chain steps offered after a completed Consulting Room session. */
const INITIAL_STEPS = [
  { surface: "consulting_room", status: "complete" },
  { surface: "formulation", status: "pending" },
  { surface: "mse", status: "pending" },
  { surface: "rounds", status: "pending" },
];

/**
 * POST /api/practice/chain — create-or-get the multi-surface chain for one
 * patient after a completed session (casebook "the chain"). Owner-scoped;
 * RLS on practice_chains enforces it. A check, not a test — silent callers.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`chain:${user.id}`, 30);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  // Resolve the session → case (owner-scoped: the session must be this user's).
  const { data: session } = await supabase
    .from("sim_sessions")
    .select("case_id")
    .eq("id", parsed.data.session_id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!session) return NextResponse.json({ error: "session not found" }, { status: 404 });
  const caseId = session.case_id as string;

  // The patient's name for the "Continue with Ravi" offer. follow_up is the
  // authored recurring-visit spec (content is a Kavya decision); when a case
  // has one, the chain extends with a "Follow-up visit" step so the arc is
  // actionable the moment content lands.
  const { data: simCase } = await supabase.from("sim_cases").select("title, follow_up").eq("id", caseId).maybeSingle();
  const caseTitle = (simCase?.title as string | undefined) ?? "your patient";
  const patientName = caseTitle.split("—")[0].trim().replace(/^(.+?),.*$/, "$1") || caseTitle;
  const followUp = simCase?.follow_up as Record<string, unknown> | null | undefined;
  const hasFollowUp = !!followUp && typeof followUp === "object" && !Array.isArray(followUp) && Object.keys(followUp).length > 0;

  // Existing chain for this patient?
  const { data: existing } = await supabase
    .from("practice_chains")
    .select("id, steps")
    .eq("user_id", user.id)
    .eq("case_id", caseId)
    .maybeSingle();

  if (existing) {
    const steps = (existing.steps as Array<{ surface: string; status: string; artefact_id?: string }> ?? []).map((s) =>
      s.surface === "consulting_room" ? { ...s, status: "complete", artefact_id: parsed.data.session_id, completed_at: new Date().toISOString() } : s,
    );
    // Extend with the follow-up visit if content landed after the chain was
    // created (idempotent — never duplicate the step).
    if (hasFollowUp && !steps.some((s) => s.surface === "follow_up")) {
      steps.push({ surface: "follow_up", status: "pending" });
    }
    const { error } = await supabase
      .from("practice_chains")
      .update({ steps, session_id: parsed.data.session_id, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, chain_id: existing.id, created: false, next: nextStep(steps, patientName) });
  }

  const steps = INITIAL_STEPS.map((s, i) =>
    i === 0 ? { ...s, artefact_id: parsed.data.session_id, completed_at: new Date().toISOString() } : s,
  );
  if (hasFollowUp) steps.push({ surface: "follow_up", status: "pending" });
  const { data: created, error } = await supabase
    .from("practice_chains")
    .insert({
      user_id: user.id,
      case_id: caseId,
      session_id: parsed.data.session_id,
      steps,
      current_step: 0,
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, chain_id: created?.id, created: true, next: nextStep(steps, patientName) });
}

const STEP_HREF: Record<string, string> = {
  consulting_room: "/practice/consulting-room",
  formulation: "/practice/formulation",
  mse: "/practice/mse",
  rounds: "/practice/rounds",
  follow_up: "/practice/consulting-room",
};
const STEP_LABEL: Record<string, string> = {
  consulting_room: "Consulting Room",
  formulation: "Formulation Forge",
  mse: "MSE Trainer",
  rounds: "Rounds",
  follow_up: "Follow-up visit",
};

/** The first step the student hasn't done yet, with a one-tap target. */
function nextStep(steps: Array<{ surface: string; status: string }>, patient: string) {
  const next = steps.find((s) => s.status !== "complete");
  if (!next) return null;
  return {
    surface: next.surface,
    label: STEP_LABEL[next.surface] ?? next.surface,
    href: STEP_HREF[next.surface] ?? `/practice/consulting-room`,
    patient,
  };
}
