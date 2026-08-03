import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { Badge } from "@/components/ui/badge";
import { ReviewFilter } from "./review-filter";

/**
 * Admin Dose Review Dashboard — lists ALL medications from the DB with their
 * review status, so Dr. Sarthak sees the whole queue before posting. Each
 * med links to its DB-backed review queue (bands + fields). The filter narrows
 * by name; results are one med at a time.
 */
export default async function PsychReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();

  // All drugs with a per-drug status summary (any field/band still draft).
  const { data: drugs } = await supabase.from("psych_drugs").select("id, generic_name, drug_class, status").order("generic_name");
  const { data: bands } = await supabase.from("psych_dose_bands").select("drug_id, status").order("status");
  const { data: fields } = await supabase.from("psych_drug_fields").select("drug_id, status");

  const bandStatus = new Map<string, string[]>();
  for (const b of bands ?? []) {
    const arr = bandStatus.get(b.drug_id) ?? [];
    arr.push(b.status);
    bandStatus.set(b.drug_id, arr);
  }
  const fieldStatus = new Map<string, string[]>();
  for (const f of fields ?? []) {
    const arr = fieldStatus.get(f.drug_id) ?? [];
    arr.push(f.status);
    fieldStatus.set(f.drug_id, arr);
  }

  const q = (sp.q ?? "").trim().toLowerCase();
  const filtered = (drugs ?? []).filter(
    (d) => !q || d.generic_name.toLowerCase().includes(q) || (d.drug_class ?? "").toLowerCase().includes(q),
  );

  const totalBands = bands?.length ?? 0;
  const totalFields = fields?.length ?? 0;
  const publishedBands = bands?.filter((b) => b.status === "published").length ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Editor-in-Chief · Dose review"
        title="Dose Review Dashboard"
        description={`${drugs?.length ?? 0} medications total · ${totalBands} dose bands · ${totalFields} fields · ${publishedBands} published. Nothing publishes without a source, a page, and your signature.`}
        badge={<Badge variant="outline">{(drugs ?? []).length} meds for review</Badge>}
      />

      <ReviewFilter />

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-small text-muted-foreground">No medications match “{sp.q}”.</p>
        ) : (
          filtered.map((drug) => {
            const b = bandStatus.get(drug.id) ?? [];
            const f = fieldStatus.get(drug.id) ?? [];
            const allPublished = b.every((s) => s === "published") && f.every((s) => s === "published") && b.length + f.length > 0;
            const status = allPublished ? "published" : "in review";
            return (
              <section key={drug.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border-2 border-border bg-card p-4">
                <div>
                  <p className="text-small font-semibold">{drug.generic_name}</p>
                  <p className="text-caption text-muted-foreground">
                    {drug.drug_class ?? "—"} · {b.length} bands · {f.length} fields
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={allPublished ? "secondary" : "outline"}>{status}</Badge>
                  <Link
                    href={`/admin/psychopharm/editor/${encodeURIComponent(drug.generic_name.toLowerCase().replace(/\s+/g, "-"))}`}
                    className="rounded-md border-2 border-foreground px-3 py-1.5 text-sm hover:bg-accent"
                  >
                    Edit page
                  </Link>
                  <Link
                    href={`/admin/psychopharm-review/psych_dose_bands?drug=${encodeURIComponent(drug.generic_name)}`}
                    className="rounded-md border-2 border-foreground bg-primary px-3 py-1.5 text-sm text-primary-foreground"
                  >
                    Review
                  </Link>
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}