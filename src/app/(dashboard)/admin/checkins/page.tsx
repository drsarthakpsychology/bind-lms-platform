import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { MobileCard } from "@/components/mobile/mobile-card";
import { CohortTrendChart } from "./trend-chart";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export interface AggregateRow {
  week_label: string;
  n_responses: number;
  avg_workload: number;
  avg_energy: number;
  avg_preparedness: number;
}

/** "2026-08-24" → "Week of 24 Aug". */
function weekLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return `Week of ${d.toLocaleDateString("en-IN", { timeZone: "UTC", day: "numeric", month: "short" })}`;
}

/** A week worth flagging: heavy workload + drained energy/preparedness. */
function isConcerningWeek(r: AggregateRow): boolean {
  return r.avg_workload >= 4 && (r.avg_energy <= 2 || r.avg_preparedness <= 2);
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
  const prev = aggregate[1] ?? null;
  const concerning = aggregate.filter(isConcerningWeek);

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
            Students check in once a week. Trends appear here after the first check-in.
          </p>
        </div>
      ) : (
        <>
          {latest ? (
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <MiniStat
                label="Responses (latest week)"
                value={String(latest.n_responses)}
                delta={prev ? { direction: latest.n_responses === prev.n_responses ? "flat" : latest.n_responses > prev.n_responses ? "up" : "down", text: `vs ${prev.n_responses} last week` } : undefined}
              />
              <MiniStat
                label="Avg workload"
                value={latest.avg_workload.toFixed(2)}
                note="1-5, higher = heavier"
                delta={prev ? { direction: latest.avg_workload > prev.avg_workload ? "up" : latest.avg_workload < prev.avg_workload ? "down" : "flat", text: prev.avg_workload.toFixed(2) + " last week" } : undefined}
              />
              <MiniStat
                label="Avg energy"
                value={latest.avg_energy.toFixed(2)}
                note="1-5, higher = more"
                delta={prev ? { direction: latest.avg_energy > prev.avg_energy ? "up" : latest.avg_energy < prev.avg_energy ? "down" : "flat", text: prev.avg_energy.toFixed(2) + " last week" } : undefined}
              />
              <MiniStat
                label="Avg preparedness"
                value={latest.avg_preparedness.toFixed(2)}
                note="1-5, higher = readier"
                delta={prev ? { direction: latest.avg_preparedness > prev.avg_preparedness ? "up" : latest.avg_preparedness < prev.avg_preparedness ? "down" : "flat", text: prev.avg_preparedness.toFixed(2) + " last week" } : undefined}
              />
            </div>
          ) : null}

          {/* The trend — this page's whole point. */}
          <div className="mt-6">
            <CohortTrendChart rows={aggregate} />
          </div>

          {/* Concerning weeks — heavy workload + drained energy/preparedness. */}
          {concerning.length > 0 ? (
            <div className="mt-4 rounded-md border-2 border-border bg-card p-4 hard-shadow-sm">
              <p className="text-body-strong text-foreground">Watch these weeks</p>
              <ul className="mt-2 space-y-1 text-small text-foreground">
                {concerning.map((r) => (
                  <li key={r.week_label} className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    <span className="font-semibold text-link">{weekLabel(r.week_label)}</span>
                    <span className="text-muted-foreground">
                      workload {r.avg_workload.toFixed(1)} · energy {r.avg_energy.toFixed(1)} · preparedness {r.avg_preparedness.toFixed(1)}
                      {isConcerningWeek(r) ? " — heavy load, low reserves" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Mobile weekly records — stacked below lg; the 560px table is lg+. */}
          <div className="mt-6 lg:hidden">
            <div className="space-y-2">
              {aggregate.map((r) => (
                <MobileCard key={r.week_label} title={weekLabel(r.week_label)} description={`${r.n_responses} response${r.n_responses === 1 ? "" : "s"}`}>
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
                    <td className="px-4 py-2">
                      {weekLabel(r.week_label)}
                      {isConcerningWeek(r) ? <span className="ml-2 text-caption font-medium text-status-alert-fg">watch</span> : null}
                    </td>
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
            Trends only — no individual student data is shown here.
          </p>
        </>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  note,
  delta,
}: {
  label: string;
  value: string;
  note?: string;
  delta?: { direction: "up" | "down" | "flat"; text: string };
}) {
  return (
    <div className="rounded-md border-2 border-border bg-card p-4">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="flex items-baseline gap-1.5 text-numeric text-base font-semibold">
        {value}
        {delta ? (
          <span
            className={cn(
              "text-caption font-medium",
              delta.direction === "up" ? "text-status-alert-fg" : delta.direction === "down" ? "text-link" : "text-muted-foreground",
            )}
            title={delta.text}
          >
            {delta.direction === "up" ? "▲" : delta.direction === "down" ? "▼" : "—"}
          </span>
        ) : null}
      </p>
      {note ? <p className="text-caption text-muted-foreground">{note}</p> : null}
      {delta ? <p className="text-caption text-muted-foreground">{delta.text}</p> : null}
    </div>
  );
}
