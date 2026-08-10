import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  entryId: z.string().uuid(),
});

/**
 * POST /api/practice/supervision/signoff — student requests sign-off on a
 * supervision entry. Only the owner may request (RLS enforces). Admin signs
 * or rejects via a separate admin route.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`supervision:signoff:${user.id}`, 10);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  // RLS guarantees this entry is the caller's own; status must be pending.
  const { data: entry } = await supabase
    .from("supervision_entries")
    .select("id, signoff_status")
    .eq("id", parsed.data.entryId)
    .maybeSingle();
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (entry.signoff_status !== "pending") {
    return NextResponse.json({ error: "already requested" }, { status: 409 });
  }

  const { error } = await supabase
    .from("supervision_entries")
    .update({ signoff_status: "requested" })
    .eq("id", parsed.data.entryId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
