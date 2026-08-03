import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Rollback a medication document to a previous version.
 *
 *   POST /api/psychopharm/document/history/rollback { drug_id, version }
 *
 * Restores the version's content by appending a NEW version (never mutating
 * history), then flips the document back to in_review. RLS: reviewer/admin only.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { drug_id?: string; version?: number };
  if (!body.drug_id || !body.version) {
    return NextResponse.json({ error: "drug_id + version required" }, { status: 400 });
  }

  const { data: doc } = await supabase.from("medication_documents").select("*").eq("id", body.drug_id).maybeSingle();
  if (!doc) return NextResponse.json({ error: "document not found" }, { status: 404 });

  const { data: target } = await supabase
    .from("medication_document_versions")
    .select("*")
    .eq("document_id", doc.id)
    .eq("version", body.version)
    .maybeSingle();
  if (!target) return NextResponse.json({ error: "version not found" }, { status: 404 });

  const nextVersion = doc.version + 1;
  const { data: updated, error } = await supabase
    .from("medication_documents")
    .update({ document: target.content, version: nextVersion, status: "in_review" })
    .eq("id", doc.id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("medication_document_versions").insert({
    document_id: doc.id,
    version: nextVersion,
    content: target.content,
    delta: {},
    editor: user.id,
    reason: `rolled back to v${body.version}`,
    changed_fields: ["*"],
  });

  return NextResponse.json({ ok: true, document: updated });
}