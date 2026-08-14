import { drugFromSlug, compareDrugs, type CompareRow } from "@/lib/psychopharm/store";
import { STANDING_NOTICE } from "@/lib/psychopharm/forbidden-phrases";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PsychSearch } from "@/components/psychopharm/psych-search";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { MobileSection } from "@/components/mobile/mobile-section";
import { MobileListItem } from "@/components/mobile/mobile-list-item";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** One field at a time — the mobile comparison unit (T32). */
const FIELDS: Array<{ label: string; key: keyof CompareRow }> = [
  { label: "Class", key: "class" },
  { label: "Band", key: "band_label" },
  { label: "Purpose at this dose", key: "purpose" },
  { label: "Mechanism", key: "mechanism" },
  { label: "Dose range", key: "dose_range" },
  { label: "How quickly it starts working", key: "onset" },
  { label: "Half-life (how long it stays)", key: "half_life" },
  { label: "Main side effects / watch", key: "side_effects" },
  { label: "Published equivalence", key: "published_equivalence" },
];

function compareHref(slugs: string[], field?: string): string {
  const base = slugs
    .slice(0, 5)
    .map((s, i) => `${String.fromCharCode(97 + i)}=${encodeURIComponent(s)}`)
    .join("&");
  return `/tools/psychopharm/compare?${base}${field ? `&field=${field}` : ""}`;
}

/**
 * Comparison view (D5). Compare 2–5 drugs at their chosen band, not as a
 * single drug. Reads `?a=..&b=..[&c=..]` drug slugs.
 *
 * Mobile (T32): no overflow-x table, no URL hand-editing. A search picker adds
 * drugs (show → act → reveal next); the comparison is one field at a time with
 * prev/next, or all fields stacked on request.
 */
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; c?: string; d?: string; e?: string; field?: string }>;
}) {
  const sp = await searchParams;
  const slugs = [sp.a, sp.b, sp.c, sp.d, sp.e].filter(Boolean) as string[];
  const generic = slugs.map((s) => drugFromSlug(s)).filter((g): g is string => Boolean(g));
  const rows = compareDrugs(generic);

  const showAll = sp.field === "all";
  const fieldIndex = Math.min(Math.max(Number(sp.field) || 0, 0), FIELDS.length - 1);

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <MobileHeader
        className="lg:hidden"
        inset={false}
        backHref="/tools/psychopharm"
        title="Compare medications"
      />

      <div className="hidden lg:block">
        <Link href="/tools/psychopharm" className="text-caption text-muted-foreground hover:underline">
          ← Search
        </Link>
        <h1 className="mt-2 text-h1">Compare at a dose</h1>
      </div>

      <p className="text-caption text-muted-foreground">
        Comparing whole drugs is nearly meaningless. Each drug below is at its
        band. Differences are what matter.
      </p>

      {/* Drug picker — add up to five, no URL editing. */}
      <MobileSection
        title={generic.length >= 2 ? "Add another drug" : "Pick drugs to compare"}
        description={
          generic.length
            ? `Comparing ${generic.length} of 5.`
            : "Search for a drug to add it; pick at least two."
        }
      >
        <PsychSearch compareTo={slugs} className="w-full" />
      </MobileSection>

      {rows.length >= 2 ? (
        <CompareFlow rows={rows} slugs={slugs} fieldIndex={fieldIndex} showAll={showAll} />
      ) : (
        <div className="space-y-3 rounded-md border-2 border-dashed border-border p-4">
          <p className="text-small text-muted-foreground">
            Pick at least two drugs above. Or start from a common pair:
          </p>
          <MobileListItem
            href="/tools/psychopharm/compare?a=risperidone&b=olanzapine"
            title="risperidone vs olanzapine"
            subtitle="Antipsychotics"
          />
        </div>
      )}

      <p className="text-caption text-muted-foreground">{STANDING_NOTICE}</p>
    </div>
  );
}

function CompareFlow({
  rows,
  slugs,
  fieldIndex,
  showAll,
}: {
  rows: CompareRow[];
  slugs: string[];
  fieldIndex: number;
  showAll: boolean;
}) {
  return (
    <MobileSection
      title={showAll ? "All fields" : "Comparison"}
      description={
        showAll ? `${rows.length} drugs, every field.` : `Field ${fieldIndex + 1} of ${FIELDS.length} · ${rows.length} drugs`
      }
      action={
        showAll ? (
          <Link href={compareHref(slugs)} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            One at a time
          </Link>
        ) : (
          <Link href={compareHref(slugs, "all")} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Show all fields
          </Link>
        )
      }
    >
      {/* Drug strip — which drugs are in the comparison. */}
      <div className="flex flex-wrap gap-2">
        {rows.map((r) => (
          <span key={r.drug} className="rounded-full border-2 border-border px-3 py-1 text-caption">
            {r.drug}
          </span>
        ))}
      </div>

      {showAll ? (
        <div className="space-y-6">
          {FIELDS.map((f) => (
            <FieldCard key={f.key} label={f.label} rows={rows} fieldKey={f.key} />
          ))}
        </div>
      ) : (
        <FieldCard label={FIELDS[fieldIndex].label} rows={rows} fieldKey={FIELDS[fieldIndex].key} />
      )}

      {!showAll ? (
        <div className="flex items-center justify-between gap-2 pt-1">
          <Link
            href={compareHref(slugs, String(fieldIndex - 1))}
            aria-disabled={fieldIndex === 0}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              fieldIndex === 0 && "pointer-events-none opacity-40",
            )}
          >
            <ChevronLeft className="size-4" aria-hidden />
            Previous
          </Link>
          <Link
            href={compareHref(slugs, String(fieldIndex + 1))}
            aria-disabled={fieldIndex === FIELDS.length - 1}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              fieldIndex === FIELDS.length - 1 && "pointer-events-none opacity-40",
            )}
          >
            Next
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </div>
      ) : null}
    </MobileSection>
  );
}

function FieldCard({
  label,
  rows,
  fieldKey,
}: {
  label: string;
  rows: CompareRow[];
  fieldKey: keyof CompareRow;
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-caption font-semibold uppercase text-muted-foreground">{label}</h3>
      {rows.map((r) => (
        <div key={r.drug} className="rounded-md border-2 border-border bg-card p-3">
          <p className="text-eyebrow text-link">{r.drug}</p>
          <p className="mt-1 text-small">
            {r[fieldKey] ?? <span className="text-muted-foreground">Not covered</span>}
          </p>
        </div>
      ))}
    </section>
  );
}
