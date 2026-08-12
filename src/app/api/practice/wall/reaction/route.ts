import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const REACTIONS = ["heart", "insight", "question", "applause", "worry"] as const;

const reactSchema = z.object({
  postId: z.string().uuid().optional(),
  replyId: z.string().uuid().optional(),
  reaction: z.enum(REACTIONS),
}).refine((v) => (v.postId && !v.replyId) || (!v.postId && v.replyId), {
  message: "exactly one of postId or replyId",
});

/**
 * POST /api/practice/wall/reaction — add a reaction (toggle: same reaction
 * again removes it). Reactions, not upvotes: they signal without ranking.
 * DELETE /api/practice/wall/reaction — remove a reaction.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`wall:react:${user.id}`, 30);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = reactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });
  const { postId, replyId, reaction } = parsed.data;

  // Toggle: if this exact reaction already exists, remove it.
  const { data: existing } = await supabase
    .from("wall_reactions")
    .select("id")
    .eq("author_id", user.id)
    .eq("reaction", reaction)
    .eq("post_id", postId ?? null)
    .eq("reply_id", replyId ?? null)
    .maybeSingle();

  if (existing) {
    await supabase.from("wall_reactions").delete().eq("id", existing.id);
    return NextResponse.json({ ok: true, removed: true });
  }

  const { error } = await supabase.from("wall_reactions").insert({
    post_id: postId ?? null,
    reply_id: replyId ?? null,
    author_id: user.id,
    reaction,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, added: true });
}
