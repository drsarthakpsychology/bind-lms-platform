import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const sendSchema = z.object({
  sessionId: z.string().uuid(),
  content: z.string().min(1).max(2000),
});

/**
 * POST /api/practice/roleplay/message — send a message in a peer session.
 * RLS enforces that the sender is a participant of that session.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`roleplay:msg:${user.id}`, 30);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  // The session must still be active.
  const { data: session } = await supabase
    .from("pair_sessions")
    .select("id, status")
    .eq("id", parsed.data.sessionId)
    .maybeSingle();
  if (!session) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (session.status !== "active") {
    return NextResponse.json({ error: "session complete" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("pair_messages")
    .insert({ session_id: parsed.data.sessionId, sender_id: user.id, content: parsed.data.content })
    .select("id, created_at")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id, createdAt: data.created_at });
}
