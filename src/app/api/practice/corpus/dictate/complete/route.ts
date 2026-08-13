import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { buildCaseFromState } from "@/lib/corpus/interviewer";

export const runtime = "nodejs";

const completeSchema = z.object({
  sessionId: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  caseDataOverride: z.record(z.string(), z.unknown()).optional(),
});

/**
 * POST /api/practice/corpus/dictate/complete
 * Build the SimCase-shaped case_data from the completed dictation and save it
 * as a draft sim_case (source='faculty_dictated', approved=false). Admin-only.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const sessionProfile = await requireSession();
  if (!sessionProfile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = sessionProfile;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = completeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { data: dictation } = await supabase
    .from("corpus_dictations")
    .select("state, transcript, completed")
    .eq("id", parsed.data.sessionId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!dictation) return NextResponse.json({ error: "session not found" }, { status: 404 });

  if (dictation.completed) {
    return NextResponse.json({ error: "already completed" }, { status: 409 });
  }

  const { case_data, missing } = buildCaseFromState(
    (dictation.state as Record<string, unknown>) ?? {},
  );

  // Allow an explicit override from the UI (editable form before save).
  const finalData = parsed.data.caseDataOverride ?? case_data;

  const title =
    parsed.data.title ??
    (typeof (dictation.state as Record<string, unknown>).name === "string"
      ? `${String((dictation.state as Record<string, unknown>).name)} — dictated case`
      : "Dictated composite case");

  const { data: created, error } = await supabase
    .from("sim_cases")
    .insert({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      difficulty: "cooperative",
      case_data: finalData,
      status: "draft",
      approved: false,
      source: "faculty_dictated",
    })
    .select("id, title")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase
    .from("corpus_dictations")
    .update({ completed: true, final_title: title, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.sessionId);

  return NextResponse.json({
    caseId: created?.id,
    title: created?.title,
    missingFields: missing, // still worth flagging even though the case saved
  });
}