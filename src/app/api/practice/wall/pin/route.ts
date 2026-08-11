import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const schema = z.object({
  postId: z.string().uuid(),
  pinned: z.boolean(),
});

/**
 * POST /api/practice/wall/pin — pin/unpin a post (the Case of the Week).
 * Faculty/admin only (requireAdmin + RLS). Pinned posts render first with a
 * 📌 badge on the wall.
 */
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("wall_posts")
    .update({ is_pinned: parsed.data.pinned })
    .eq("id", parsed.data.postId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
