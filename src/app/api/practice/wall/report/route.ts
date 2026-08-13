import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  postId: z.string().uuid().optional(),
  replyId: z.string().uuid().optional(),
  reason: z.string().min(1).max(500),
}).refine((v) => (v.postId && !v.replyId) || (!v.postId && v.replyId), {
  message: "exactly one of postId or replyId",
});

/** POST /api/practice/wall/report — student flags a post/reply for faculty.
 *  wall_reports RLS: owner insert, owner+admin select (privacy test). */
export async function POST(req: Request) {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`wall:report:${user.id}`, 10);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { error } = await supabase.from("wall_reports").insert({
    post_id: parsed.data.postId ?? null,
    reply_id: parsed.data.replyId ?? null,
    reported_by: user.id,
    reason: parsed.data.reason,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
