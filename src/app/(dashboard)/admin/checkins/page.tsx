import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { MobileCard } from "@/components/mobile/mobile-card";

export const dynamic = "force-dynamic";

interface AggregateRow {
  week_label: string;
  n_responses: number;
  avg_workload: number;
  avg_energy: number;
  avg_preparedness: number;
}

/**
 * /admin/checkins — cohort check-in trends.
 * Reads the checkins_aggregate view ONLY — no user identifiers (enforced by
 * the privacy test). Faculty see trends, never who said what.
 */
export default async function AdminCheckinsPage() {
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("checkins_aggregate")
    .select("*")
    .order("week_label", { ascending: false })
    .limit(16);

  const aggregate = (rows ?? []) as unknown as AggregateRow[];
  const latest = aggregate[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Cohort check-ins"
        description="Weekly workload / energy / preparedness, aggregated. No student identifiers — trends only."
      />

      {aggregate.length === 0 ? (
        <div className="mt-6 rounded-md border-2 border-border bg-card p-6 text-center">
          <p className="text-base font-medium">No check-ins yet</p>
          <p className="mt-1 text-small text-muted-foreground">
            Students check in weekly at /record. Aggregates land here.
          </p>
        </div>
      ) : (
        <>
          {latest ? (
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <MiniStat label="Responses (latest week)" value={String(latest.n_responses)} />
              <MiniStat label="Avg workload" value={latest.avg_workload.toFixed(2)} note="1-5, higher = heavier" />
              <MiniStat label="Avg energy" value={latest.avg_energy.toFixed(2)} note="1-5, higher = more" />
              <MiniStat label="Avg preparedness" value={latest.avg_preparedness.toFixed(2)} note="1-5, higher = readier" />
            </div>
          ) : null}

          {/* Mobile weekly records — stacked below lg; the 560px table is lg+. */}
          <div className="mt-6 lg:hidden">
            <div className="space-y-2">
              {aggregate.map((r) => (
                <MobileCard key={r.week_label} title={r.week_label} description={`${r.n_responses} response${r.n_responses === 1 ? "" : "s"}`}>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted-foreground">
                    <span>Workload <span className="font-semibold text-foreground text-numeric">{r.avg_workload.toFixed(2)}</span></span>
                    <span>Energy <span className="font-semibold text-foreground text-numeric">{r.avg_energy.toFixed(2)}</span></span>
                    <span>Preparedness <span className="font-semibold text-foreground text-numeric">{r.avg_preparedness.toFixed(2)}</span></span>
                  </div>
                </MobileCard>
              ))}
            </div>
          </div>

          <div className="mt-6 hidden overflow-x-auto rounded-md border-2 border-border bg-card lg:block">
            <table className="w-full min-w-[560px] text-left text-small">
              <thead>
                <tr className="border-b border-border text-caption text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Week</th>
                  <th className="px-4 py-2 font-medium">Responses</th>
                  <th className="px-4 py-2 font-medium">Workload</th>
                  <th className="px-4 py-2 font-medium">Energy</th>
                  <th className="px-4 py-2 font-medium">Preparedness</th>
                </tr>
              </thead>
              <tbody>
                {aggregate.map((r) => (
                  <tr key={r.week_label} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-2">{r.week_label}</td>
                    <td className="px-4 py-2 text-numeric">{r.n_responses}</td>
                    <td className="px-4 py-2 text-numeric">{r.avg_workload.toFixed(2)}</td>
                    <td className="px-4 py-2 text-numeric">{r.avg_energy.toFixed(2)}</td>
                    <td className="px-4 py-2 text-numeric">{r.avg_preparedness.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-caption text-muted-foreground">
            The aggregate view is the only read path — a privacy test enforces no identifier leaks.
          </p>
        </>
      )}
    </div>
  );
}

function MiniStat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-md border-2 border-border bg-card p-4">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="text-numeric text-base font-semibold">{value}</p>
      {note ? <p className="text-caption text-muted-foreground">{note}</p> : null}
    </div>
  );
}
