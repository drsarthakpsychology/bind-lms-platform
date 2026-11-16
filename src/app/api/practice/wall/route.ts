import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStudentApi } from "@/lib/auth/api-guard";
import { addWallPost } from "@/lib/wall/data";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const postSchema = z.object({
  content: z.string().min(1).max(2000),
  isAnonymous: z.boolean().default(false),
});

/**
 * POST /api/practice/wall: create a wall post. The author_id is stored, but
 * the SELECT policy hides it for anonymous posts on student queries.
 */
export async function POST(req: Request) {
  const access = await requireStudentApi({ path: "/wall" });
  if (!access.ok) return access.response;
  const profile = access.profile;
  const user = profile;

  const allowed = await rateLimit(`wall:${user.id}`, 15);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const r = await addWallPost(user.id, parsed.data);
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: 500 });

  return NextResponse.json({ id: r.value.id });
}
