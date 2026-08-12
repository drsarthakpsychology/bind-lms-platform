import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export const RIGHTS_STATUSES = [
  "public_domain",
  "open_access",
  "licensed",
  "pending_licence",
  "not_started",
  "unlicensed",
  "acquisition_failed",
] as const;

const schema = z.object({
  id: z.string().uuid(),
  /** Any registry column may be patched; the status flip is the common case. */
  updates: z
    .object({
      title: z.string().min(1).max(300).optional(),
      authors: z.array(z.string()).optional(),
      publisher: z.string().max(200).nullable().optional(),
      isbn: z.string().max(64).nullable().optional(),
      category: z.string().max(64).nullable().optional(),
      layer: z.enum(["clinical", "phenomenological", "style", "cultural", "reasoning"]).optional(),
      priority: z.number().int().min(1).max(9).optional(),
      rights_status: z.enum(RIGHTS_STATUSES).optional(),
      rights_contact: z.string().max(200).nullable().optional(),
      contact_email: z.string().max(200).nullable().optional(),
      contact_url: z.string().max(500).nullable().optional(),
      ask: z.string().max(500).nullable().optional(),
      cost_quoted: z.number().nullable().optional(),
      cost_paid: z.number().nullable().optional(),
      currency: z.string().max(8).nullable().optional(),
      licence_start: z.string().nullable().optional(),
      licence_end: z.string().nullable().optional(),
      licence_terms: z.string().max(1000).nullable().optional(),
      author_consent: z.boolean().optional(),
      unlocks: z.string().max(500).nullable().optional(),
      notes: z.string().max(2000).nullable().optional(),
      acquired_file: z.string().max(500).nullable().optional(),
      sha256: z.string().max(128).nullable().optional(),
    })
    .refine((u) => Object.keys(u).length > 0, { message: "no updates" }),
});

/**
 * POST /api/admin/rights — patch one row of the Casebook acquisition
 * tracker. Admin-only (requireAdmin: full session check, so expired or
 * session-replaced admins are rejected too). Anything in `updates` is
 * written verbatim plus a bumped updated_at; the client sends the whole
 * row for the flip, but a partial patch is valid too.
 */
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body", issues: parsed.error.issues }, { status: 400 });
  }

  const { id, updates } = parsed.data;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("rights_registry")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
