import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Version history for a medication document.
 *
 *   GET /api/psychopharm/document/history?drug=<generic>
 *
 * Returns the document's versions (editor, timestamp, reason, changed_fields)
 * plus a rollback endpoint:
 *
 *   POST /api/psychopharm/document/history/rollback { drug_id, version }
 *
 * Rollback restores a version's content by appending a NEW version (history is
 * never mutated), then pulls the document back to in_review.
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const drug = searchParams.get("drug") ?? "";
  const { data: drugRow } = await supabase.from("psych_drugs").select("id").eq("generic_name", drug).maybeSingle();
  if (!drugRow) return NextResponse.json({ error: "unknown drug" }, { status: 404 });

  const { data: doc } = await supabase.from("medication_documents").select("id").eq("drug_id", drugRow.id).maybeSingle();
  if (!doc) return NextResponse.json([]);

  const { data: versions } = await supabase
    .from("medication_document_versions")
    .select("*")
    .eq("document_id", doc.id)
    .order("version", { ascending: false });

  return NextResponse.json(versions ?? []);
}