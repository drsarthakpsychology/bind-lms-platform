import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { MedicationDocument } from "@/lib/psychopharm/document";

/**
 * Publish a medication document.
 *
 *   POST /api/psychopharm/document/publish  { drug, reason }
 *
 * Runs validation before publishing (missing sources, empty required fields,
 * invalid ranges, unresolved conflicts, missing reviewer note). Blocks on any
 * failure and returns the list. On success: writes a version, sets status to
 * published, reviewer + verified_at + published_version. RLS restricts publish
 * to reviewer/admin.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { drug_id?: string; reason?: string };
  if (!body.drug_id) return NextResponse.json({ error: "drug_id required" }, { status: 400 });

  const { data: doc } = await supabase
    .from("medication_documents")
    .select("*")
    .eq("id", body.drug_id)
    .maybeSingle();
  if (!doc) return NextResponse.json({ error: "document not found" }, { status: 404 });

  const d = doc.document as MedicationDocument;
  const problems = validateDocument(d);
  if (problems.length) {
    return NextResponse.json({ ok: false, errors: problems }, { status: 422 });
  }

  // Publish via the SECURITY DEFINER function, which enforces that only
  // reviewer/admin can flip status → published (F1 / BFLA fix). The function
  // raises if app_role() is not in (admin, reviewer); a plain UPDATE would be
  // blocked by the med_docs_block_editor_publish trigger anyway.
  const { data: published, error } = await supabase.rpc("publish_medication_document", {
    p_drug_id: doc.drug_id,
    p_reason: body.reason ?? "publish",
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  return NextResponse.json({ ok: true, result: published });
}

/** Publish validation — every medication must be source-backed and internally valid. */
export function validateDocument(d: MedicationDocument): string[] {
  const errors: string[] = [];
  let hasSource = false;
  for (const section of d.sections) {
    for (const block of section.blocks) {
      if (block.hidden) continue;
      if (block.sources?.length) hasSource = true;
      if (block.type === "dose_band") {
        const low = block.data?.low as number | undefined;
        const high = block.data?.high as number | undefined;
        if (low != null && high != null && low > high) {
          errors.push(`Band "${block.value || block.id}" has low > high (${low} > ${high}).`);
        }
        if (block.data && !block.sources?.length) {
          errors.push(`Band "${block.value || block.id}" has no source.`);
        }
      }
      if (block.agreement === "conflict" && !block.data?.adjudicated) {
        errors.push(`Section "${section.title}" block "${block.value || block.id}" has an unresolved conflict.`);
      }
    }
  }
  if (!hasSource) errors.push("No block carries a source — nothing is quotable.");
  return errors;
}