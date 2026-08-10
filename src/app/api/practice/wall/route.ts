import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const postSchema = z.object({
  content: z.string().min(1).max(2000),
  isAnonymous: z.boolean().default(false),
});

/**
 * POST /api/practice/wall — create a wall post. The author_id is stored, but
 * the SELECT policy hides it for anonymous posts on student queries.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`wall:${user.id}`, 15);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { data, error } = await supabase
    .from("wall_posts")
    .insert({
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
