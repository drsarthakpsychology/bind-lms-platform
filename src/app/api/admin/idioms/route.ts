import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const patchSchema = z.object({
  id: z.string().uuid(),
  phrase: z.string().min(1).max(200).optional(),
  trap: z.string().min(1).max(500).optional(),
  approved: z.boolean().optional(),
});

/**
 * GET /api/admin/idioms — the idiom bank for review (unapproved first).
 * PATCH /api/admin/idioms — approve/reject/edit an idiom.
 * DELETE /api/admin/idioms?id=… — remove an idiom. All admin-only.
 *
 * The decode drill reads approved idioms only, so approving here is what
 * surfaces a phrase to students.
 */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("idioms")
    .select("id, phrase, transliteration, register, possible_meanings, disambiguators, trap, sources, approved, created_at")
    .order("approved", { ascending: true })
    .order("phrase", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ idioms: data ?? [] });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const admin = createAdminClient();
  const update: Record<string, unknown> = { ...parsed.data };
  delete update.id;
  const { error } = await admin.from("idioms").update(update).eq("id", parsed.data.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  const admin = createAdminClient();
  const { error } = await admin.from("idioms").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
