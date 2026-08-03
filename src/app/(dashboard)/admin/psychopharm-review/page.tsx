import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { ReviewFilter } from "./review-filter";

/**
 * Medication list (KMS). One action per drug: Open — which takes you to the
 * page editor, the single surface for editing, reviewing, and publishing.
 * Status is simply whether the page is student-visible (published) or not.
 */
export default async function PsychReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();

  const { data: drugs } = await supabase.from("psych_drugs").select("id, generic_name, drug_class").order("generic_name");
  const { data: docs } = await supabase.from("medication_documents").select("drug_id, status");

  const docStatus = new Map<string, string>();
  for (const d of docs ?? []) docStatus.set(d.drug_id, d.status);

  const q = (sp.q ?? "").trim().toLowerCase();
  const filtered = (drugs ?? []).filter(
    (d) => !q || d.generic_name.toLowerCase().includes(q) || (d.drug_class ?? "").toLowerCase().includes(q),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Medication library"
        title="All medications"
        description="Open a medication to edit, review, and publish its page. Changes stay drafts until you publish them."
        badge={<span className="text-caption text-muted-foreground">{(drugs ?? []).length} medications</span>}
      />

      <ReviewFilter />

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-small text-muted-foreground">No medications match “{sp.q}”.</p>
        ) : (
          filtered.map((drug) => {
            const s = docStatus.get(drug.id) ?? "draft";
            const published = s === "published";
            return (
              <Link
                key={drug.id}
                href={`/admin/psychopharm/editor/${encodeURIComponent(drug.generic_name.toLowerCase().replace(/\s+/g, "-"))}`}
                className="flex items-center justify-between gap-3 rounded-md border-2 border-border bg-card p-3 transition hover:border-foreground hover:hard-shadow-sm"
              >
                <div className="min-w-0">
                  <p className="text-small font-semibold">{drug.generic_name}</p>
                  <p className="text-caption text-muted-foreground">{drug.drug_class ?? "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${published ? "bg-emerald-600" : "bg-amber-500"}`} aria-hidden />
                  <span className="text-caption text-muted-foreground">
                    {published ? "Published" : "Draft"}
                  </span>
                  <span className="text-caption font-medium text-primary">Open →</span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}