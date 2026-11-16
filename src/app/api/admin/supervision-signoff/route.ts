import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { decideSignOff } from "@/lib/admin/signoffs";

export const runtime = "nodejs";

const schema = z.object({
  entryId: z.string().uuid(),
  action: z.enum(["signed", "rejected"]),
});

/**
 * POST /api/admin/supervision-signoff: admin signs off (or rejects) a
 * student's requested supervision entry. Admin-only; uses the service-role
 * client to write the status.
 */
export async function POST(req: Request) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const r = await decideSignOff(createAdminClient(), parsed.data.entryId, parsed.data.action);
  if (!r.ok) return NextResponse.json({ error: r.message }, { status: r.why === "not_found" ? 404 : r.why === "not_requested" ? 409 : 500 });
  return NextResponse.json({ ok: true, status: r.status });
}
