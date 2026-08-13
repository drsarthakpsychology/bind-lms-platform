import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  documentId: z.string().uuid(),
  note: z.string().max(2000),
});

/**
 * POST /api/practice/library/note — save/update the caller's annotation on a
 * corpus document (peers-unlock-after-yours).
 * GET  ?documentId= — the caller's note + peers' notes (peers' readable ONLY
 * when the caller has their own note on the document).
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`lib:note:${user.id}`, 40);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { error } = await supabase
    .from("library_notes")
    .upsert(
      { user_id: user.id, document_id: parsed.data.documentId, note: parsed.data.note },
      { onConflict: "user_id,document_id" },
    );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const documentId = new URL(req.url).searchParams.get("documentId");
  if (!documentId) return NextResponse.json({ error: "documentId required" }, { status: 400 });

  const admin = createAdminClient();

  // The caller's own note.
  const { data: own } = await supabase
    .from("library_notes")
    .select("id, note, created_at")
    .eq("user_id", user.id)
    .eq("document_id", documentId)
    .maybeSingle();

  // Peers' notes: readable ONLY when the caller has written their own note.
  let peers: Array<{ id: string; note: string; created_at: string }> = [];
  if (own) {
    const { data: peerNotes } = await admin
      .from("library_notes")
      .select("id, note, created_at")
      .eq("document_id", documentId)
      .neq("user_id", user.id)
      .limit(20);
    peers = (peerNotes ?? []).map((n) => ({ id: String(n.id), note: String(n.note), created_at: String(n.created_at) }));
  }

  return NextResponse.json({
    own: own ? { id: own.id, note: String(own.note), createdAt: own.created_at } : null,
    peers,
    unlocked: !!own,
  });
}
