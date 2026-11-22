import Link from "next/link";

import { BATCH_LABEL } from "@/components/clinic/format";
import { cohortAverage } from "@/lib/clinic/attendance";
import type { ClinicTrackerRow, ClinicTrackers } from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import { Empty, Figures, Meter, Status, nameLink, table } from "../../_v2/kit";

/**
 * Trackers: one row per student with attendance, leaves, cases and OPD
 * visits; the cohort's totals above. Server component.
 */

export function cohortTotals(rows: ClinicTrackerRow[]) {
  const sum = (f: (r: ClinicTrackerRow) => number) => rows.reduce((n, r) => n + f(r), 0);
  return {
    attendance: cohortAverage(rows.map((r) => r.attendance)),
    casesDone: sum((r) => r.cases.done),
    casesTotal: sum((r) => r.cases.total),
    logsDue: sum((r) => r.visits.due),
    noLeaves: rows.filter((r) => r.leave.left <= 0).length,
  };
}

export function Trackers({ data, hrefFor, remind }: { data: ClinicTrackers; hrefFor: (userId: string) => string; remind?: React.ReactNode }) {
  if (!data.rows.length) return <Empty>No students in this cohort yet.</Empty>;
  const t = cohortTotals(data.rows);
  const rows = [...data.rows].sort((a, b) => (a.attendance.percent ?? 101) - (b.attendance.percent ?? 101) || (a.name ?? "").localeCompare(b.name ?? ""));
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <Figures
        items={[
          { value: t.attendance === null ? "None yet" : `${t.attendance}%`, label: "Attendance, average" },
          { value: `${t.casesDone} of ${t.casesTotal}`, label: "Cases done" },
          { value: t.logsDue, label: "Case counts due" },
          { value: t.noLeaves, label: "No leaves left" },
        ]}
      />
      {remind}
      <table className={table.root}>
        <thead>
          <tr>
            <th className={table.th}>Student</th>
            <th className={cn(table.th, "hidden md:table-cell")}>Batch</th>
            <th className={table.th}>Attendance</th>
            <th className={cn(table.th, "hidden text-right sm:table-cell")}>Leaves left</th>
            <th className={cn(table.th, "hidden lg:table-cell")}>Cases</th>
            <th className={cn(table.th, "text-right")}>Visits</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const a = r.attendance;
            const flag = r.visits.due ? `${r.visits.due} due` : r.visits.missed ? `${r.visits.missed} missed, counted as leave` : null;
            return (
              <tr key={r.userId} className={table.tr}>
                <td className={table.td}>
                  <Link href={hrefFor(r.userId)} className={nameLink}>
                    {r.name ?? "Student"}
                  </Link>
                  {r.roll ? <span className="ml-2 text-muted-foreground">{r.roll}</span> : null}
                  <span className="block text-muted-foreground lg:hidden type-num">
                    {r.cases.done} of {r.cases.total} cases
                  </span>
                </td>
                <td className={cn(table.td, "hidden md:table-cell")}>{r.batch ? BATCH_LABEL[r.batch] : "None"}</td>
                <td className={table.td}>
                  {a.percent === null ? <span className="text-muted-foreground">None yet</span> : <Meter pct={a.percent} label={`${a.percent}%`} tone={a.percent < 75 ? "warn" : "info"} className="min-w-24" />}
                  {a.absent || a.noScanOut ? (
                    <span className="block type-caption text-muted-foreground">
                      {[a.absent ? `${a.absent} absent` : null, a.noScanOut ? `${a.noScanOut} no scan out` : null].filter(Boolean).join(", ")}
                    </span>
                  ) : null}
                </td>
                <td className={cn(table.td, table.num, "hidden sm:table-cell", r.leave.left <= 0 && "font-semibold text-status-alert-fg")}>
                  {r.leave.left} of {r.leave.allowance}
                </td>
                <td className={cn(table.td, "hidden lg:table-cell")}>
                  <Meter pct={r.cases.total ? (r.cases.done / r.cases.total) * 100 : 0} label={`${r.cases.done} of ${r.cases.total}`} className="min-w-28" />
                </td>
                <td className={cn(table.td, "text-right")}>
                  <span className="type-num whitespace-nowrap">
                    {r.visits.done} of {r.visits.planned}
                  </span>
                  {flag ? <Status tone={r.visits.missed ? "alert" : "warn"} className="justify-end">{flag}</Status> : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
