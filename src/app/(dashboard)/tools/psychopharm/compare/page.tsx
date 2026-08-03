import { drugFromSlug, compareDrugs, type CompareRow } from "@/lib/psychopharm/store";
import { STANDING_NOTICE } from "@/lib/psychopharm/forbidden-phrases";
import Link from "next/link";

/**
 * Comparison view (D5). Compare 2–3 drugs at chosen bands, not as a single
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
  if (slugs.length < 2) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-8">
        <h1 className="text-h1">Compare medications</h1>
        <p className="text-small text-muted-foreground">
          Compare 2–5 drugs at their dose, e.g.{" "}
          <Link href="/tools/psychopharm/compare?a=risperidone&b=olanzapine" className="underline">
            risperidone vs olanzapine
          </Link>
          . Add up to five names to the URL (<code>&amp;a=…&amp;b=…&amp;c=…</code>).
        </p>
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
  const headers = ["", ...rows.map((r) => r.drug)];
  const fields: Array<{ label: string; key: keyof CompareRow }> = [
    { label: "Class", key: "class" },
    { label: "Band", key: "band_label" },
    { label: "Purpose at this dose", key: "purpose" },
    { label: "Mechanism", key: "mechanism" },
    { label: "Dose range", key: "dose_range" },
    { label: "Main side effects / watch", key: "side_effects" },
    { label: "Published equivalence", key: "published_equivalence" },
  ];
  return (
    <div className="overflow-x-auto rounded-md border-2 border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-border">
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-semibold">
                {i === 0 ? "" : h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.key} className="border-b border-border/50">
              <td className="px-3 py-2 align-top font-medium">{f.label}</td>
              {rows.map((r, i) => (
                <td key={i} className="px-3 py-2 align-top">
                  {r[f.key] ?? <span className="text-muted-foreground">Not covered</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}