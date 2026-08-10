import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const getSchema = z.object({
  sessionId: z.string().uuid(),
});

/**
 * GET /api/practice/roleplay/messages?sessionId=… — poll the thread.
 * RLS restricts reads to participants. Returns messages oldest-first.
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const parsed = getSchema.safeParse({ sessionId: url.searchParams.get("sessionId") });
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const allowed = await rateLimit(`roleplay:list:${user.id}`, 60);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const { data: messages, error } = await supabase
    .from("pair_messages")
    .select("id, sender_id, content, created_at")
    .eq("session_id", parsed.data.sessionId)
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ messages: messages ?? [] });
}
