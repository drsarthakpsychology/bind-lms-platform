import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { drugFromSlug, drugDetail } from "@/lib/psychopharm/store";
import { EditorPane } from "@/components/psychopharm/editor-pane";
import type { MedicationDocument, MedicationDocumentRow } from "@/lib/psychopharm/document";

/**
 * The two-pane medication editor (KMS). Left: live student preview. Right:
 * the editable section tree + source panel. One document, two feeds — the
 * preview is literally the student render.
 */
export default async function DrugEditorPage({ params }: { params: Promise<{ drug: string }> }) {
  const { drug } = await params;
  const generic = drugFromSlug(drug);
  if (!generic) notFound();

  const supabase = await createClient();
  const { data: drugRow } = await supabase.from("psych_drugs").select("id").eq("generic_name", generic).maybeSingle();
  let doc: MedicationDocumentRow | null = null;
  if (drugRow) {
    const { data } = await supabase
      .from("medication_documents")
      .select("*")
      .eq("drug_id", drugRow.id)
      .maybeSingle();
    doc = (data as MedicationDocumentRow | null) ?? null;
  }

  const detail = drugDetail(generic);
  const initialDocument: MedicationDocument =
    doc?.document ??
    (detail
      ? { generic_name: generic, sections: [] }
      : { generic_name: generic, sections: [] });

  return (
    <div className="flex h-[calc(100dvh-3rem)] flex-col">
      <div className="flex items-center justify-between border-b-2 border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <Link href="/admin/psychopharm-review" className="text-caption text-muted-foreground hover:underline">
            ← Library
          </Link>
          <h1 className="text-h1 text-lg">{generic}</h1>
          <span className="text-caption text-muted-foreground">
            {doc ? `v${doc.version} · ${doc.status}` : "no document yet"}
          </span>
        </div>
      </div>
      <EditorPane
        drug={generic}
        drugId={drugRow?.id ?? ""}
        initialDocument={initialDocument}
        initialStatus={doc?.status ?? "draft"}
      />
    </div>
  );
}