import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const schema = z.object({
  key: z.string().min(1).max(64),
  status: z.enum(["off", "live", "unlocked"]),
});

/**
 * POST /api/admin/flags — set a feature flag's three-state status
 * (off | live | unlocked). `enabled` is kept in sync (status !== "off") so
 * anything still reading the boolean keeps working. Admin-only.
 */
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("feature_flags")
    .update({
      status: parsed.data.status,
      enabled: parsed.data.status !== "off",
      updated_at: new Date().toISOString(),
    })
    .eq("key", parsed.data.key);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
