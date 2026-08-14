import { drugFromSlug, compareDrugs, sameClassDrugs, type CompareRow } from "@/lib/psychopharm/store";
import { STANDING_NOTICE } from "@/lib/psychopharm/forbidden-phrases";
import { EmptyState } from "@/components/design-system/empty-state";
import { GitCompareArrows } from "lucide-react";
import Link from "next/link";

/** Build a URL slug from a generic name (forward of drugFromSlug). */
function slugOf(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

/**
 * Comparison view (D5). Compare 2–5 drugs at chosen bands, not as a single
 * drug. Reads `?a=..&b=..[&c=..]` drug slugs. Each column is a drug at its
 * first (or given) band.
 */
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; c?: string; d?: string; e?: string }>;
}) {
  const sp = await searchParams;
  const slugs = [sp.a, sp.b, sp.c, sp.d, sp.e].filter(Boolean) as string[];

  if (slugs.length === 0) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <EmptyState
          icon={<GitCompareArrows className="size-6" aria-hidden />}
          title="Compare medications"
          description="Compare two or more drugs at their dose — for example, risperidone vs olanzapine. Open a drug and tap Compare to get started."
          action={
            <Link
              href="/tools/psychopharm"
              className="rounded-md border-2 border-foreground bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hard-shadow-sm transition hover:-translate-y-0.5 active:translate-y-px active:hard-shadow-none"
            >
              Search medications
            </Link>
          }
        />
      </div>
    );
  }

  // One drug selected: ask for a second rather than showing a dangling slot.
  if (slugs.length === 1) {
    const generic = drugFromSlug(slugs[0]);
    if (!generic) {
      return (
        <div className="mx-auto max-w-3xl py-8">
          <EmptyState
            icon={<GitCompareArrows className="size-6" aria-hidden />}
            title="Drug not found"
            description="That slug doesn't match a drug in our sources."
            action={
              <Link href="/tools/psychopharm" className="text-link font-medium hover:underline">
                Back to search
              </Link>
            }
          />
        </div>
      );
    }
    const suggestions = sameClassDrugs(generic);
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-6">
        <Link href="/tools/psychopharm" className="text-caption text-muted-foreground hover:underline">
          ← Search
        </Link>
        <h1 className="text-h1">Compare medications</h1>
        <p className="text-small text-muted-foreground">
          Comparing <span className="font-semibold text-foreground">{generic}</span>. Pick a second drug:
        </p>
        {suggestions.length ? (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <Link
                key={s}
                href={`/tools/psychopharm/compare?a=${slugs[0]}&b=${slugOf(s)}`}
                className="inline-flex min-h-11 items-center rounded-full border-2 border-border bg-card px-4 py-2 text-sm hover:bg-accent"
              >
                {s}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-small text-muted-foreground">
            No other drug in this class yet. Search for a second drug and use its
            Compare link, or add a name to the URL (<code>&amp;a=…&amp;b=…</code>).
          </p>
        )}
      </div>
    );
  }

  const generic = slugs.map((s) => drugFromSlug(s)).filter((g): g is string => Boolean(g));
  const rows = compareDrugs(generic);

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-6">
      <Link href="/tools/psychopharm" className="text-caption text-muted-foreground hover:underline">
        ← Search
      </Link>
      <h1 className="text-h1">Compare at a dose</h1>
      <p className="text-caption text-muted-foreground">
        Comparing whole drugs is nearly meaningless. Each column below is that
        drug at its band. Differences are what matter.
      </p>

      <CompareGrid rows={rows} />
      <p className="text-caption text-muted-foreground">{STANDING_NOTICE}</p>
    </div>
  );
}

function CompareGrid({ rows }: { rows: CompareRow[] }) {
  const fields: Array<{ label: string; key: keyof CompareRow }> = [
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
  return (
    <div>
      {/* Mobile: stacked records — one drug per card, label above value. */}
      <div className="space-y-4 lg:hidden">
        {rows.map((r) => (
          <section key={r.drug} className="space-y-3 rounded-md border-2 border-border bg-card p-4 hard-shadow-sm">
            <h2 className="text-h3">{r.drug}</h2>
            <dl className="space-y-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <dt className="text-caption font-semibold uppercase text-muted-foreground">{f.label}</dt>
                  <dd className="mt-0.5 text-small">
                    {r[f.key] ?? <span className="text-muted-foreground">Not covered</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      {/* Desktop: side-by-side table. */}
      <div className="hidden overflow-x-auto rounded-md border-2 border-border lg:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="px-3 py-2 text-left font-semibold" />
              {rows.map((r) => (
                <th key={r.drug} className="px-3 py-2 text-left font-semibold">
                  {r.drug}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr key={f.key} className="border-b border-border/50">
                <td className="px-3 py-2 align-top font-medium">{f.label}</td>
                {rows.map((r) => (
                  <td key={r.drug} className="px-3 py-2 align-top">
                    {r[f.key] ?? <span className="text-muted-foreground">Not covered</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
