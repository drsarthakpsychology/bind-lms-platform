import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { createLiveKitToken, liveKitWsUrl } from "@/lib/livekit/token";

export const runtime = "nodejs";

const tokenSchema = z.object({
  sessionId: z.string().uuid(),
});

/**
 * POST /api/livekit/token
 *
 * Issues a short-lived LiveKit participant token for a realtime voice session.
 * The student must own an ACTIVE sim session (validated server-side), and the
 * token is scoped to that one room with a 10-minute expiry. The LiveKit API
 * secret never reaches the browser.
 */
export async function POST(req: Request) {
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const body = await req.json().catch(() => null);
  const parsed = tokenSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid sessionId" }, { status: 400 });
  const { sessionId } = parsed.data;

  const supabase = await createClient();
  const { data: session } = await supabase
    .from("sim_sessions")
    .select("id, case_id, status")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!session || session.status !== "active") {
    return NextResponse.json({ error: "no active session for this student" }, { status: 404 });
  }

  // The patient's display name, from the case.
  let patientName = "the patient";
  if (session.case_id) {
    const admin = createAdminClient();
    const { data: caseRow } = await admin
      .from("sim_cases")
      .select("case_data")
      .eq("id", session.case_id)
      .maybeSingle();
    const identity = (caseRow?.case_data as { identity?: { name?: string } } | null)?.identity;
    if (identity?.name) patientName = identity.name;
  }

  try {
    const token = await createLiveKitToken({
      room: sessionId,
      identity: user.id,
      name: patientName,
      metadata: JSON.stringify({ sessionId, userId: user.id }),
    });
    return NextResponse.json({ token, wsUrl: liveKitWsUrl(), room: sessionId, patientName });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
