import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { StatusPill } from "@/components/mobile/status-pill";
import { drugDetail } from "@/lib/psychopharm/store";
import { FilterBar } from "@/components/admin/filter-bar";

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "in_review", label: "In review" },
  { value: "verified", label: "Verified" },
  { value: "published", label: "Published" },
];

/** Map a document status to an unmistakable pill (dot + label, never colour alone). */
function statusPill(status: string): { tone: "ai" | "scripted" | "neutral" | "warning"; label: string } {
  switch (status) {
    case "published":
      return { tone: "ai", label: "Published" };
    case "in_review":
      return { tone: "scripted", label: "In review" };
    case "verified":
      return { tone: "neutral", label: "Verified" };
    default:
      return { tone: "neutral", label: "Draft" };
  }
}

/**
 * Medication list (KMS). One action per drug: Open, which takes you to the
 * page editor, the single surface for editing, reviewing, and publishing.
 *
 * This is a LIST. It must be light. The student-facing summary line comes from
 * the static `drugDetail` (curated TS data), NOT the full `document` jsonb, so
 * the query stays cheap and the ~100 editor links don't trigger a prefetch
 * storm of heavy editor renders (kept `prefetch={false}`).
 *
 * Mobile (T32): rows are 48px single-tap targets with the status as a quiet
 * StatusPill trailing, not a competing badge + text cluster.
 */
export default async function PsychReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; class?: string }>;
}) {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  if (!(await requireAdmin())) redirect("/dashboard");
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
  const status = STATUSES.some((s) => s.value === sp.status) ? sp.status! : null;
  const drugClass = (sp.class ?? "").trim() || null;
  const classes = [...new Set((drugs ?? []).map((d) => (d.drug_class as string | null) ?? "").filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const filtered = (drugs ?? []).filter(
    (d) =>
      (!q || d.generic_name.toLowerCase().includes(q) || (d.drug_class ?? "").toLowerCase().includes(q)) &&
      (!status || (statusByDrug.get(d.id) ?? "draft") === status) &&
      (!drugClass || d.drug_class === drugClass),
  );
  const filteringBy = q || status || drugClass;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Medication library"
        title="All medications"
        description="Open a medication to edit, review, and publish its page. Changes stay drafts until you publish them."
        badge={<span className="text-caption text-muted-foreground">{(drugs ?? []).length} medications</span>}
      />

      <FilterBar
        search={{ label: "Filter medications", placeholder: "Filter by medication name…" }}
        selects={[
          { param: "status", label: "Status", allLabel: "Any status", options: STATUSES },
          { param: "class", label: "Drug class", allLabel: "All drug classes", options: classes.map((c) => ({ value: c, label: c })) },
        ]}
      />
      {filteringBy ? (
        <p className="text-caption text-muted-foreground" role="status">
          {filtered.length} of {(drugs ?? []).length} shown
        </p>
      ) : null}

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-small text-muted-foreground">No medications match these filters.</p>
        ) : (
          filtered.map((drug) => {
            const { tone, label } = statusPill(statusByDrug.get(drug.id) ?? "draft");
            const plain = drugDetail(drug.generic_name)?.plain;
            return (
              <Link
                key={drug.id}
                href={`/admin/psychopharm/editor/${encodeURIComponent(drug.generic_name.toLowerCase().replace(/\s+/g, "-"))}`}
                prefetch={false}
                className="flex min-h-[48px] w-full items-center gap-3 rounded-lg border-2 border-border bg-card px-3 py-2 transition-colors hover:bg-accent active:translate-y-px"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="text-small font-semibold leading-snug text-foreground [overflow-wrap:anywhere] line-clamp-1">
                      {drug.generic_name}
                    </span>
                    {drug.drug_class ? (
                      <span className="truncate text-caption text-muted-foreground">{drug.drug_class}</span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block line-clamp-2 text-caption text-muted-foreground">
                    {plain ?? "No student summary yet."}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  <StatusPill tone={tone} label={label} />
                  <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
                </span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
