import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { ReviewActions } from "@/components/psychopharm/review-actions";

/**
 * DB-backed review queue for one table (drug_fields | dose_bands | dose_ranges).
 * Reads live rows (draft/in_review/verified/published — RLS shows the admin
 * everything). Each row renders the wired ReviewActions, so approve/edit/
 * merge/reject/publish actually write the audit log.
 */
const TABLES = ["psych_drug_fields", "psych_dose_bands", "psych_dose_ranges"] as const;

export default async function ReviewTablePage({ params }: { params: { table: string } }) {
  const table = (params.table as (typeof TABLES)[number]);
  if (!TABLES.includes(table)) notFound();

  const supabase = await createClient();
  const { data: rows } = await supabase.from(table).select("*").order("created_at", { ascending: true });

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