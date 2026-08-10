import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const schema = z.object({
  entryId: z.string().uuid(),
  action: z.enum(["signed", "rejected"]),
});

/**
 * POST /api/admin/supervision-signoff — admin signs off (or rejects) a
 * student's requested supervision entry. Admin-only; uses the service-role
 * client to write the status.
 */
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const adminClient = createAdminClient();
  const { data: entry } = await adminClient
    .from("supervision_entries")
    .select("id, signoff_status, user_id")
    .eq("id", parsed.data.entryId)
    .maybeSingle();
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (entry.signoff_status !== "requested") {
    return NextResponse.json({ error: "entry not awaiting sign-off" }, { status: 409 });
  }

  const { error } = await adminClient
    .from("supervision_entries")
    .update({ signoff_status: parsed.data.action })
    .eq("id", parsed.data.entryId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, status: parsed.data.action });
}
