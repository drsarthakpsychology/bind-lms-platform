import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type { MedicationDocument } from "@/lib/psychopharm/document";

/**
 * Medication document API (KMS).
 *
 *   GET  /api/psychopharm/document?drug=<generic>   → the medication document
 *        (editors/reviewers/admins get their draft; students get published only)
 *   PUT  /api/psychopharm/document                  → save a draft (editor/reviewer/admin)
 *        { drug, document, reason, changedFields }
 *
 * The student page and the editor preview render the same document, so an edit
 * saved here is exactly what a student sees once published.
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const drug = searchParams.get("drug") ?? "";
  if (!drug) return NextResponse.json({ error: "drug required" }, { status: 400 });

  const { data: drugRow } = await supabase.from("psych_drugs").select("id").eq("generic_name", drug).maybeSingle();
  if (!drugRow) return NextResponse.json({ error: "unknown drug" }, { status: 404 });

  // RLS decides what this user can see: students get published only.
  const { data } = await supabase
    .from("medication_documents")
    .select("*")
    .eq("drug_id", drugRow.id)
    .maybeSingle();

  if (!data) {
    // No document yet → empty scaffold so the editor can create one.
    return NextResponse.json({
      id: null,
      drug_id: drugRow.id,
      generic_name: drug,
      document: { generic_name: drug, sections: [] },
      status: "draft",
      version: 1,
    });
  }
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const body = (await req.json().catch(() => ({}))) as {
    drug?: string;
    document?: MedicationDocument;
    reason?: string;
    changedFields?: string[];
  };
  if (!body.drug || !body.document) {
    return NextResponse.json({ error: "drug + document required" }, { status: 400 });
  }

  const { data: drugRow } = await supabase.from("psych_drugs").select("id").eq("generic_name", body.drug).maybeSingle();
  if (!drugRow) return NextResponse.json({ error: "unknown drug" }, { status: 404 });

  // Load the current document (RLS: only editor/reviewer/admin can write).
  const { data: existing } = await supabase
    .from("medication_documents")
    .select("*")
    .eq("drug_id", drugRow.id)
    .maybeSingle();

  const nextVersion = (existing?.version ?? 0) + 1;

  if (!existing) {
    const { data: created, error } = await supabase
      .from("medication_documents")
      .insert({
        drug_id: drugRow.id,
        document: body.document,
        status: "draft",
        version: 1,
      })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await supabase.from("medication_document_versions").insert({
      document_id: created.id,
      version: 1,
      content: body.document,
      editor: user.id,
      reason: body.reason ?? null,
      changed_fields: body.changedFields ?? [],
    });
    return NextResponse.json(created);
  }

  const { data: updated, error } = await supabase
    .from("medication_documents")
    .update({ document: body.document, version: nextVersion, status: existing.status })
    .eq("id", existing.id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("medication_document_versions").insert({
    document_id: existing.id,
    version: nextVersion,
    content: body.document,
    delta: {},
    editor: user.id,
    reason: body.reason ?? null,
    changed_fields: body.changedFields ?? [],
  });

  return NextResponse.json(updated);
}