import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { ReviewActions } from "@/components/psychopharm/review-actions";

/**
 * DB-backed review queue for one table (drug_fields | dose_bands | dose_ranges).
 * Accepts both the full table name ("psych_dose_bands") and the shorthand
 * used in some URLs ("dose_bands") — both resolve. Unknown tables redirect to
 * the review overview rather than crashing.
 */
const TABLE_ALIASES: Record<string, string> = {
  "psych_drug_fields": "psych_drug_fields",
  "psych_dose_bands": "psych_dose_bands",
  "psych_dose_ranges": "psych_dose_ranges",
  drug_fields: "psych_drug_fields",
  dose_bands: "psych_dose_bands",
  dose_ranges: "psych_dose_ranges",
};

export default async function ReviewTablePage({
  params,
  searchParams,
}: {
  params: Promise<{ table: string }>;
  searchParams: Promise<{ drug?: string }>;
}) {
  const { table: tableParam } = await params;
  const { drug: drugFilter } = await searchParams;
  const table = TABLE_ALIASES[tableParam];
  if (!table) notFound();

  const supabase = await createClient();
  let query = supabase.from(table).select("*").order("created_at", { ascending: true });
  if (drugFilter) {
    // filter by drug name via the drug join
    const { data: drug } = await supabase.from("psych_drugs").select("id").eq("generic_name", drugFilter).maybeSingle();
    if (drug) query = supabase.from(table).select("*").eq("drug_id", drug.id).order("created_at", { ascending: true });
  }
  const { data: rows } = await query;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Editor-in-Chief · review"
        title={`Review · ${table.replace("psych_", "")}`}
        description={`${rows?.length ?? 0} rows in the queue. Live from the database — actions write the audit log.`}
      />
      <Link href="/admin/psychopharm-review" className="text-caption text-muted-foreground hover:underline">
        ← Back to review overview
      </Link>

      {!rows || rows.length === 0 ? (
        <p className="text-small text-muted-foreground">Queue empty — nothing seeded yet.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => {
            const isDose = table === "psych_dose_bands" || table === "psych_dose_ranges";
            const valueText =
              row.value != null
                ? typeof row.value === "string"
                  ? row.value
                  : JSON.stringify(row.value)
                : row.band_label ?? row.page_ref ?? row.id;
            return (
              <section key={row.id} className="rounded-md border-2 border-border bg-card p-4">
                <p className="text-small font-medium">{valueText}</p>
                <p className="text-caption text-muted-foreground">
                  page {row.page_ref ?? "—"} · status {row.status}
                </p>
                <ReviewActions table={table} id={row.id} status={row.status} isDose={isDose} />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}