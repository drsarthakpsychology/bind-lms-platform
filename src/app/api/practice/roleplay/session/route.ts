import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const createSchema = z.object({
  peerEmail: z.string().email(),
  /** Which role the creator plays. The peer gets the other. */
  myRole: z.enum(["patient", "clinician"]),
});

/**
 * POST /api/practice/roleplay/session — create a peer role-play session.
 * Both participants are students of the cohort; the peer is found by email.
 * The creator takes `myRole`, the peer takes the opposite.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`roleplay:${user.id}`, 20);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  // Find the peer by email. The USER client can't read another student's
  // profile (RLS: profiles_select_own_or_admin), so use the admin client
  // (service role) for the lookup only. Inserting the session still goes
  // through the user's client so RLS enforces participant membership.
  const admin = createAdminClient();
  const { data: peer } = await admin
    .from("profiles")
    .select("id, email, role")
    .eq("email", parsed.data.peerEmail.toLowerCase())
    .maybeSingle();
  if (!peer || peer.role !== "student") {
    return NextResponse.json({ error: "No student with that email." }, { status: 404 });
  }
  if (peer.id === user.id) {
    return NextResponse.json({ error: "Pick a peer — not yourself." }, { status: 400 });
  }

  // Assign roles: creator takes their choice, peer takes the opposite.
  const [studentA, roleA] =
    parsed.data.myRole === "patient"
      ? [user.id, "patient"]
      : [peer.id, "patient"];
  const studentB = studentA === user.id ? peer.id : user.id;
  const roleB = roleA === "patient" ? "clinician" : "patient";

  const { data, error } = await supabase
    .from("pair_sessions")
    .insert({ student_a: studentA, student_b: studentB, role_a: roleA })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    sessionId: data.id,
    peerId: peer.id,
    peerEmail: peer.email,
    roleA,
    roleB,
  });
}
