import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { applyTranscript, nextMissingField } from "@/lib/corpus/interviewer";
import { fixtureFollowUp, progressLabel } from "@/lib/ai/fixtures/corpus-interviewer";

export const runtime = "nodejs";

const turnSchema = z.object({
  sessionId: z.string().uuid().optional(),
  rawTranscript: z.string().min(1).max(8000),
});

/**
 * POST /api/practice/corpus/dictate/turn
 * Advance the dictation conversation: appends the raw transcript, applies it
 * to the interviewer state machine, and returns the next follow-up question.
 * Admin-only. When no sessionId is supplied, a new dictation is started.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = turnSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  let state: Record<string, unknown> = {};
  let transcript: unknown[] = [];
  let sessionId = parsed.data.sessionId;

  if (sessionId) {
    const { data: existing } = await supabase
      .from("corpus_dictations")
      .select("state, transcript")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!existing) return NextResponse.json({ error: "session not found" }, { status: 404 });
    state = (existing.state as Record<string, unknown>) ?? {};
    transcript = (existing.transcript as unknown[]) ?? [];
  }

  // Apply the transcript to the state machine (deterministic).
  const next = applyTranscript(state, parsed.data.rawTranscript);
  const nextField = nextMissingField(next);

  // The follow-up question (fixture-first; a provider can rephrase via
  // corpusInterviewerPrompt when AI is enabled).
  const followUp = nextField ? fixtureFollowUp(next) : "That's all I need. Finish to build the draft.";

  const newTurn = { by: "sarthak", text: parsed.data.rawTranscript, at: new Date().toISOString() };
  const newReply = { by: "interviewer", text: followUp, at: new Date().toISOString() };
  transcript = [...transcript, newTurn, newReply];

  if (sessionId) {
    await supabase
      .from("corpus_dictations")
      .update({ state: next, transcript, updated_at: new Date().toISOString() })
      .eq("id", sessionId);
  } else {
    const { data: created } = await supabase
      .from("corpus_dictations")
      .insert({ user_id: user.id, state: next, transcript })
      .select("id")
      .single();
    sessionId = created?.id;
  }

  return NextResponse.json({
    sessionId,
    followUp: nextField ? followUp : null,
    state: next,
    progress: progressLabel(next),
    complete: nextField === null,
    transcript,
  });
}