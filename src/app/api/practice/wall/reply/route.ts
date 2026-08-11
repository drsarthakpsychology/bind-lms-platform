import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const replySchema = z.object({
  postId: z.string().uuid(),
  content: z.string().min(1).max(2000),
  isAnonymous: z.boolean().default(false),
});

/**
 * POST /api/practice/wall/reply — reply to a wall post. The author_id is
 * stored but hidden for anonymous replies (same policy as posts).
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`wall:reply:${user.id}`, 20);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = replySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { data, error } = await supabase
    .from("wall_replies")
    .insert({
      post_id: parsed.data.postId,
      author_id: user.id,
      content: parsed.data.content,
      is_anonymous: parsed.data.isAnonymous,
      is_faculty: false,
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id });
}
