import * as React from "react";

import { cn } from "@/lib/utils";
import { AdminPage, Block, Empty, Meter, Notice, Rows, Status, table, type Tone } from "./kit";

const LIMIT = 500 * 1024 * 1024; // the free database limit
function bytes(n: number): string {
  if (n >= 1024 ** 3) return `${(n / 1024 ** 3).toFixed(2)} GB`;
  if (n >= 1024 ** 2) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
}

export type ProviderV2 = {
  id: string;
  tone: Tone;
  state: string;
  note: string;
  calls: number;
  failed: number;
  fallback: number;
  speed: string;
  lastOk: string;
  lastFail: string;
  failing: boolean;
};

/**
 * Usage and AI providers (v2). One purpose: is anything about to run out or
 * fail. Storage first as one line with its bar, then the providers as a table,
 * then where the space goes.
 */
export function InfraV2({
  dbBytes,
  tables,
  aiOn,
  providers,
}: {
  dbBytes: number;
  tables: { name: string; size: number }[];
  aiOn: boolean;
  providers: ProviderV2[];
}) {
  const pct = Math.round((dbBytes / LIMIT) * 100);
  return (
    <AdminPage title="Usage and AI providers" lead="Storage and AI use. Anything past 70% is flagged before it becomes a problem.">
      {pct >= 70 ? (
        <Notice tone="alert">
          <span>Storage is at {pct}% of the free limit. Free up space or plan an upgrade before the cohort starts.</span>
        </Notice>
      ) : null}

      <Block title="Database storage">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="type-h2 type-num">{bytes(dbBytes)}</span>
          <span className="type-small text-muted-foreground">of 500 MB</span>
        </p>
        <Meter pct={pct} label={`${pct}%`} tone={pct >= 50 ? "warn" : "info"} className="max-w-xl" />
      </Block>

      <Block title="AI providers">
        <p className="type-small text-muted-foreground">
          AI is {aiOn ? "switched on" : "switched off (AI_ENABLED=false)"}. Providers are tried in order. The ones that do not train on data are used first for student work.
        </p>
        <table className={cn(table.root, "hidden lg:table")}>
          <thead>
            <tr>
              <th scope="col" className={cn(table.th, "w-[30%]")}>Provider</th>
              <th scope="col" className={table.th}>State</th>
              <th scope="col" className={cn(table.th, "text-right")}>Calls, 7 days</th>
              <th scope="col" className={cn(table.th, "text-right")}>Failed</th>
              <th scope="col" className={cn(table.th, "text-right")}>Average speed</th>
              <th scope="col" className={table.th}>Last success</th>
              <th scope="col" className={table.th}>Last failure</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id} className={table.tr}>
                <td className={table.td}>
                  <span className="block font-semibold">{p.id}</span>
                  <span className="block text-muted-foreground [overflow-wrap:anywhere]">{p.note}</span>
                </td>
                <td className={cn(table.td, "whitespace-nowrap")}><Status tone={p.tone}>{p.state}</Status></td>
                <td className={cn(table.td, table.num)}>{p.calls}</td>
                <td className={cn(table.td, table.num)}>{p.failed}</td>
                <td className={cn(table.td, table.num)}>{p.speed}</td>
                <td className={cn(table.td, "whitespace-nowrap text-muted-foreground")}>{p.lastOk}</td>
                <td className={cn(table.td, "whitespace-nowrap", p.failing ? "font-semibold text-status-alert-fg" : "text-muted-foreground")}>{p.lastFail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Rows className="lg:hidden">
          {providers.map((p) => (
            <li key={p.id} className="flex min-w-0 flex-col gap-1 py-3">
              <span className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3">
                <span className="type-body font-semibold">{p.id}</span>
                <Status tone={p.tone}>{p.state}</Status>
              </span>
              <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{p.note}</span>
              <span className="type-small type-num">
                {p.calls} calls · {p.failed} failed · {p.fallback} fell back · {p.speed}
              </span>
              <span className={cn("type-small", p.failing ? "font-semibold text-status-alert-fg" : "text-muted-foreground")}>
                Last success {p.lastOk} · last failure {p.lastFail}
              </span>
            </li>
          ))}
        </Rows>
        <p className="type-small text-muted-foreground">Limits per provider are set in the code. Keys live in Vercel, Settings, Environment Variables. They are never shown here.</p>
      </Block>

      <Block title="Where the space goes">
        {tables.length ? (
          <table className={cn(table.root, "max-w-xl")}>
            <thead>
              <tr>
                <th scope="col" className={cn(table.th, "static")}>Table</th>
                <th scope="col" className={cn(table.th, "static text-right")}>Size</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((t) => (
                <tr key={t.name} className={table.tr}>
                  <td className={cn(table.td, "[overflow-wrap:anywhere]")}>{t.name}</td>
                  <td className={cn(table.td, table.num)}>{bytes(t.size)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty>No data yet.</Empty>
        )}
      </Block>
    </AdminPage>
  );
}

/* ---------------------------------------------------------------- */
/* Wellbeing check-ins                                               */
/* ---------------------------------------------------------------- */

export type CheckinWeekV2 = { key: string; label: string; n: number; workload: string; energy: string; preparedness: string; watch: boolean };

/** Wellbeing check-ins (v2). One purpose: the cohort's trend. Latest numbers in a line, the chart, then weeks as a table. */
export function CheckinsV2({
  figures,
  chart,
  weeks,
}: {
  figures: { label: string; value: string; note: string }[];
  chart: React.ReactNode;
  weeks: CheckinWeekV2[];
}) {
  return (
    <AdminPage title="Wellbeing check-ins" lead="Once a week students answer three quick questions. You only see the cohort's averages, never who said what.">
      {weeks.length === 0 ? (
        <Empty>No check-ins yet. Trends appear here after the first one.</Empty>
      ) : (
        <>
          <ul className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
            {figures.map((f) => (
              <li key={f.label} className="flex min-w-0 flex-col">
                <span className="type-h2 type-num">{f.value}</span>
                <span className="type-caption text-muted-foreground [overflow-wrap:anywhere]">{f.label}</span>
                <span className="type-caption text-muted-foreground [overflow-wrap:anywhere]">{f.note}</span>
              </li>
            ))}
          </ul>
          <div className="min-w-0">{chart}</div>
          {weeks.some((w) => w.watch) ? (
            <Notice>
              <span>Heavy workload with low energy or preparedness: {weeks.filter((w) => w.watch).map((w) => w.label).join(", ")}.</span>
            </Notice>
          ) : null}
          <Block title="Week by week">
            <table className={cn(table.root, "hidden md:table")}>
              <thead>
                <tr>
                  <th scope="col" className={table.th}>Week</th>
                  <th scope="col" className={cn(table.th, "text-right")}>Responses</th>
                  <th scope="col" className={cn(table.th, "text-right")}>Workload</th>
                  <th scope="col" className={cn(table.th, "text-right")}>Energy</th>
                  <th scope="col" className={cn(table.th, "text-right")}>Preparedness</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map((w) => (
                  <tr key={w.key} className={table.tr}>
                    <td className={table.td}>
                      {w.label}
                      {w.watch ? <span className="ml-2 font-semibold text-status-alert-fg">Watch</span> : null}
                    </td>
                    <td className={cn(table.td, table.num)}>{w.n}</td>
                    <td className={cn(table.td, table.num)}>{w.workload}</td>
                    <td className={cn(table.td, table.num)}>{w.energy}</td>
                    <td className={cn(table.td, table.num)}>{w.preparedness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Rows className="md:hidden">
              {weeks.map((w) => (
                <li key={w.key} className="flex min-w-0 flex-col gap-0.5 py-3">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="type-body font-semibold">{w.label}</span>
                    <span className="type-small text-muted-foreground type-num">{w.n} response{w.n === 1 ? "" : "s"}</span>
                  </span>
                  <span className="type-small type-num">
                    Workload {w.workload} · Energy {w.energy} · Preparedness {w.preparedness}
                  </span>
                  {w.watch ? <span className="type-small font-semibold text-status-alert-fg">Watch</span> : null}
                </li>
              ))}
            </Rows>
          </Block>
        </>
      )}
    </AdminPage>
  );
}
