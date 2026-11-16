import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStudentApi } from "@/lib/auth/api-guard";
import { toggleWallReaction, WALL_REACTIONS } from "@/lib/wall/data";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const REACTIONS = WALL_REACTIONS;

const reactSchema = z.object({
  postId: z.string().uuid().optional(),
  replyId: z.string().uuid().optional(),
  reaction: z.enum(REACTIONS),
}).refine((v) => (v.postId && !v.replyId) || (!v.postId && v.replyId), {
  message: "exactly one of postId or replyId",
});

/**
 * POST /api/practice/wall/reaction: add a reaction (toggle: same reaction
 * again removes it). Reactions, not upvotes: they signal without ranking.
 * DELETE /api/practice/wall/reaction: remove a reaction.
 */
export async function POST(req: Request) {
  const access = await requireStudentApi({ path: "/wall" });
  if (!access.ok) return access.response;
  const profile = access.profile;
  const user = profile;

  const allowed = await rateLimit(`wall:react:${user.id}`, 30);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = reactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });
  const { postId, replyId, reaction } = parsed.data;

  // Toggle: if this exact reaction already exists, remove it.
  const r = await toggleWallReaction(user.id, { postId, replyId, reaction });
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: 500 });
  return NextResponse.json(r.value.added ? { ok: true, added: true } : { ok: true, removed: true });
}
