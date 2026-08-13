import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { Badge } from "@/components/ui/badge";
import { drugDetail } from "@/lib/psychopharm/store";
import { ReviewFilter } from "./review-filter";

/** Map a document status to an unmistakable badge (label + fill, never colour alone). */
function statusBadge(status: string) {
  switch (status) {
    case "published":
      return { variant: "published", label: "Published" } as const;
    case "in_review":
      return { variant: "pending", label: "In review" } as const;
    case "verified":
      return { variant: "outline", label: "Verified" } as const;
    default:
      return { variant: "draft", label: "Draft" } as const;
  }
}

/**
 * Medication list (KMS). One action per drug: Open — which takes you to the
 * page editor, the single surface for editing, reviewing, and publishing.
 *
 * This is a LIST — it must be light. The student-facing summary line comes from
 * the static `drugDetail` (curated TS data), NOT the full `document` jsonb, so
 * the query stays cheap and the ~100 editor links don't trigger a prefetch
 * storm of heavy editor renders.
 */
export default async function PsychReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();

  const { data: drugs } = await supabase
    .from("psych_drugs")
    .select("id, generic_name, drug_class")
    .order("generic_name");
  const { data: docs } = await supabase.from("medication_documents").select("drug_id, status");

  const statusByDrug = new Map<string, string>();
  for (const d of docs ?? []) statusByDrug.set(d.drug_id, d.status);

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
            const { variant, label } = statusBadge(statusByDrug.get(drug.id) ?? "draft");
            const plain = drugDetail(drug.generic_name)?.plain;
            return (
              <Link
                key={drug.id}
                href={`/admin/psychopharm/editor/${encodeURIComponent(drug.generic_name.toLowerCase().replace(/\s+/g, "-"))}`}
                prefetch={false}
                className="flex items-center justify-between gap-3 rounded-md border-2 border-border bg-card p-3 transition hover:border-foreground hover:hard-shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-body-strong">{drug.generic_name}</p>
                    {drug.drug_class ? <Badge variant="secondary">{drug.drug_class}</Badge> : null}
                  </div>
                  {plain ? (
                    <p className="mt-1 line-clamp-2 text-small text-muted-foreground">{plain}</p>
                  ) : (
                    <p className="mt-1 text-caption text-muted-foreground">No student summary yet.</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={variant}>{label}</Badge>
                  <span className="inline-flex items-center gap-1 text-caption font-medium text-link">
                    Open
                    <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
