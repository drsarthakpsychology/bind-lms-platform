import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const patchSchema = z.object({
  id: z.string().uuid(),
  front: z.string().min(1).optional(),
  back: z.string().min(1).optional(),
  status: z.enum(["draft", "in_review", "published", "archived"]).optional(),
  approved: z.boolean().optional(),
});

const createSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
});

/**
 * GET /api/admin/cards — all cards for the review queue (drafts first).
 * POST /api/admin/cards — add a card by hand (source 'manual', status 'draft').
 * PATCH /api/admin/cards — approve/reject/edit a drafted card.
 * DELETE /api/admin/cards?id=… — remove a card. All admin-only.
 *
 * Approve = status published + approved true (then students can see it and
 * Rounds can schedule it). Reject = status archived.
 */

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cards")
    .insert({
      front: parsed.data.front,
      back: parsed.data.back,
      source: "manual",
      status: "draft",
      approved: false,
    })
    .select("id, front, back, source, status, approved, created_at")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ card: data ?? null });
}
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cards")
    .select("id, front, back, source, status, approved, lesson_id, created_at")
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cards: data ?? [] });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const admin = createAdminClient();
  const { data: profile } = await admin.auth.getUser();
  const approvedBy = profile.user?.id ?? null;

  const update: Record<string, unknown> = { ...parsed.data };
  delete update.id;
  if (parsed.data.approved === true) {
    update.status = "published";
    update.approved_by = approvedBy;
  }
  if (parsed.data.status === "archived") {
    update.approved = false;
  }

  const { error } = await admin.from("cards").update(update).eq("id", parsed.data.id);
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
  const { error } = await admin.from("cards").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
