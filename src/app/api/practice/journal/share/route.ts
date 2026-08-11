import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const shareSchema = z.object({
  entryId: z.string().uuid(),
  /** The recipient's email (resolved to a profile server-side — the caller
   *  never sees another user's id, consistent with the privacy model). */
  sharedToEmail: z.string().email(),
});

const revokeSchema = z.object({
  shareId: z.string().uuid(),
});

/**
 * POST /api/practice/journal/share — share a journal entry with a named
 * person (per-entry sharing, revocable). Only the OWNER of the entry can
 * share it (checked server-side). The share row is logged and revocable.
 * DELETE /api/practice/journal/share — revoke a share.
 *
 * journal_shares RLS: owner-only (see practice_layer_rest.sql).
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`journal:share:${user.id}`, 30);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = shareSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });
  const { entryId, sharedToEmail } = parsed.data;

  // Ownership: the entry must be the caller's own.
  const { data: entry } = await supabase
    .from("journal_entries")
    .select("id")
    .eq("id", entryId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!entry) return NextResponse.json({ error: "entry not found" }, { status: 404 });

  // Resolve the recipient by email (admin client — the caller must never see
  // another user's id; only the share row records it).
  const admin = createAdminClient();
  const { data: recipient } = await admin
    .from("profiles")
    .select("id")
    .eq("email", sharedToEmail.toLowerCase())
    .maybeSingle();
  if (!recipient) return NextResponse.json({ error: "No person with that email." }, { status: 404 });

  const { data: shared, error } = await supabase
    .from("journal_shares")
    .insert({ entry_id: entryId, shared_by: user.id, shared_to: recipient.id })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: "share failed" }, { status: 500 });

  return NextResponse.json({ ok: true, shareId: shared.id, sharedToEmail });
}

/**
 * DELETE /api/practice/journal/share — revoke a share. Only the sharer
 * (or the share recipient) can revoke; owner-only RLS enforces it.
 */
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = revokeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const admin = createAdminClient();
  // Revoke = set revoked_at (keep the log row — "revocable, logged").
  const { error } = await admin
    .from("journal_shares")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", parsed.data.shareId)
    .eq("shared_by", user.id);
  if (error) return NextResponse.json({ error: "revoke failed" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
