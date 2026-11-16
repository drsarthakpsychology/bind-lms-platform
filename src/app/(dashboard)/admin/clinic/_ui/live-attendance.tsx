"use client";

import * as React from "react";

import { STATUS_LABEL, STATUS_TONE, duration, instantClock } from "@/components/clinic/format";
import type { Res } from "@/components/clinic/result";
import type { ClinicAttendanceRow, ClinicLiveAttendance, ClinicManualMarkBody } from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import { Block, Empty, Figures, Notice, Status, btn, control, table } from "../../_v2/kit";

/**
 * One session's attendance as it happens: who is in, who left, who is late,
 * who is missing, and marking someone by hand with a note. Refreshes every
 * 5 seconds while the session is open.
 */

type Filter = "all" | "missing" | "in" | "late" | "out";

export function filterRows(rows: ClinicAttendanceRow[], f: Filter): ClinicAttendanceRow[] {
  if (f === "all") return rows;
  if (f === "missing") return rows.filter((r) => !r.inAt && r.status !== "on_leave" && r.status !== "not_required" && r.status !== "cancelled");
  if (f === "in") return rows.filter((r) => r.inAt && !r.outAt);
  if (f === "out") return rows.filter((r) => r.outAt);
  return rows.filter((r) => r.late);
}

/** Missing first, then in, then out, each by name. The one who needs a look is at the top. */
export function sortRows(rows: ClinicAttendanceRow[]): ClinicAttendanceRow[] {
  const rank = (r: ClinicAttendanceRow) => (r.status === "absent" || (!r.inAt && r.status === "upcoming") ? 0 : r.inAt && !r.outAt ? 1 : r.outAt ? 2 : 3);
  return [...rows].sort((a, b) => rank(a) - rank(b) || (a.name ?? "").localeCompare(b.name ?? ""));
}

export function LiveAttendance({
  first,
  sessionId,
  load,
  mark,
  canWrite,
}: {
  first: Res<ClinicLiveAttendance>;
  sessionId: string;
  load: (sessionId: string) => Promise<Res<ClinicLiveAttendance>>;
  mark: (sessionId: string, body: ClinicManualMarkBody) => Promise<Res<ClinicLiveAttendance>>;
  canWrite: boolean;
}) {
  const [res, setRes] = React.useState(first);
  const [filter, setFilter] = React.useState<Filter>("all");
  const [q, setQ] = React.useState("");
  const [marking, setMarking] = React.useState<string | null>(null);
  const open = res.ok && res.data.open;

  React.useEffect(() => {
    if (!open) return;
    let alive = true;
    const t = window.setInterval(async () => {
      const next = await load(sessionId).catch(() => null);
      if (alive && next?.ok) setRes(next);
    }, 5000);
    return () => {
      alive = false;
      window.clearInterval(t);
    };
  }, [open, sessionId, load]);

  if (!res.ok) return <Notice tone="alert">{res.error}</Notice>;
  const d = res.data;
  const needle = q.trim().toLowerCase();
  const rows = sortRows(filterRows(d.rows, filter)).filter((r) => !needle || (r.name ?? "").toLowerCase().includes(needle) || (r.roll ?? "").toLowerCase().includes(needle));
  const FILTERS: { id: Filter; label: string; n: number }[] = [
    { id: "all", label: "Everyone", n: d.rows.length },
    { id: "missing", label: "Missing", n: d.counts.missing },
    { id: "in", label: "In now", n: d.rows.filter((r) => r.inAt && !r.outAt).length },
    { id: "late", label: "Late", n: d.counts.late },
    { id: "out", label: "Left", n: d.counts.out },
  ];

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <Figures
        items={[
          { value: `${d.counts.in} of ${d.counts.expected}`, label: "In" },
          { value: d.counts.missing, label: "Missing" },
          { value: d.counts.late, label: `Late (after ${d.lateMinutes} min)` },
          { value: d.counts.out, label: "Left" },
          { value: d.counts.onLeave, label: "On leave" },
        ]}
      />

      <Block title="Students" count={rows.length}>
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Show" className="flex min-w-0 flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(btn.ghost, filter === f.id && "bg-[var(--ds-tint)] text-foreground")}
              >
                {f.label} <span className="type-caption type-num text-muted-foreground">{f.n}</span>
              </button>
            ))}
          </div>
          <input aria-label="Find a student" placeholder="Find a student" value={q} onChange={(e) => setQ(e.target.value)} className={cn(control, "md:w-64")} />
        </div>

        {rows.length ? (
          <>
            <table className={cn(table.root, "hidden md:table")}>
              <thead>
                <tr>
                  <th className={table.th}>Student</th>
                  <th className={table.th}>Status</th>
                  <th className={cn(table.th, "text-right")}>In</th>
                  <th className={cn(table.th, "text-right")}>Out</th>
                  <th className={cn(table.th, "text-right")}>Time</th>
                  {canWrite ? <th className={cn(table.th, "text-right")}><span className="sr-only">Mark</span></th> : null}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <React.Fragment key={r.userId}>
                    <tr className={table.tr}>
                      <td className={table.td}>
                        <span className="font-semibold [overflow-wrap:anywhere]">{r.name ?? "Student"}</span>
                        {r.roll ? <span className="ml-2 text-muted-foreground">{r.roll}</span> : null}
                        {r.note ? <span className="block text-muted-foreground [overflow-wrap:anywhere]">{r.note}</span> : null}
                      </td>
                      <td className={table.td}>
                        <RowStatus r={r} />
                      </td>
                      <td className={cn(table.td, table.num)}>{instantClock(r.inAt)}</td>
                      <td className={cn(table.td, table.num)}>{instantClock(r.outAt)}</td>
                      <td className={cn(table.td, table.num)}>{duration(r.minutes)}</td>
                      {canWrite ? (
                        <td className={cn(table.td, "text-right")}>
                          <button type="button" className={btn.ghost} aria-expanded={marking === r.userId} onClick={() => setMarking(marking === r.userId ? null : r.userId)}>
                            Mark
                          </button>
                        </td>
                      ) : null}
                    </tr>
                    {marking === r.userId ? (
                      <tr>
                        <td colSpan={6} className="border-b border-[var(--ds-hairline)] py-3">
                          <MarkForm r={r} onSave={async (body) => { const x = await mark(sessionId, body); if (x.ok) { setRes(x); setMarking(null); } return x; }} />
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)] md:hidden">
              {rows.map((r) => (
                <li key={r.userId} className="flex min-w-0 flex-col gap-2 py-3">
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <span className="flex min-w-0 flex-col">
                      <span className="type-body font-semibold [overflow-wrap:anywhere]">{r.name ?? "Student"}</span>
                      <span className="type-small text-muted-foreground type-num">
                        {[r.roll, r.inAt ? `in ${instantClock(r.inAt)}` : null, r.outAt ? `out ${instantClock(r.outAt)}` : null].filter(Boolean).join(", ")}
                      </span>
                    </span>
                    <RowStatus r={r} />
                  </div>
                  {r.note ? <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">{r.note}</p> : null}
                  {canWrite ? (
                    marking === r.userId ? (
                      <MarkForm r={r} onSave={async (body) => { const x = await mark(sessionId, body); if (x.ok) { setRes(x); setMarking(null); } return x; }} />
                    ) : (
                      <button type="button" className={cn(btn.quiet, "self-start")} onClick={() => setMarking(r.userId)}>
                        Mark by hand
                      </button>
                    )
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Empty>No one here.</Empty>
        )}
      </Block>
    </div>
  );
}

function RowStatus({ r }: { r: ClinicAttendanceRow }) {
  const text = r.inAt && !r.outAt && r.status !== "no_scan_out" ? (r.late ? "In, late" : "In") : r.status === "upcoming" ? "Not in" : STATUS_LABEL[r.status];
  const tone = r.inAt && !r.outAt && r.status !== "no_scan_out" ? (r.late ? "warn" : "info") : STATUS_TONE[r.status];
  return (
    <span className="flex flex-col items-end gap-0.5 md:items-start">
      <Status tone={tone}>{text}</Status>
      {r.manual ? <span className="type-caption text-muted-foreground">By hand</span> : null}
      {r.earlyLeaveAt ? <span className="type-caption text-muted-foreground">Leaving early</span> : null}
    </span>
  );
}

function MarkForm({ r, onSave }: { r: ClinicAttendanceRow; onSave: (body: ClinicManualMarkBody) => Promise<Res<unknown>> }) {
  const [note, setNote] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  async function go(direction: ClinicManualMarkBody["direction"]) {
    setBusy(true);
    setErr(null);
    const x = await onSave({ userId: r.userId, direction, note: note.trim() || undefined }).catch(() => ({ ok: false as const, error: "Could not reach the server." }));
    setBusy(false);
    if (!x.ok) setErr(x.error);
  }
  return (
    <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center">
      <input aria-label={`Note for ${r.name ?? "this student"}`} placeholder="Note (phone dead)" value={note} onChange={(e) => setNote(e.target.value)} maxLength={140} className={cn(control, "md:w-72")} />
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => go("in")} className={btn.ink}>
          Mark in
        </button>
        <button type="button" disabled={busy || !r.inAt} onClick={() => go("out")} className={btn.quiet}>
          Mark out
        </button>
        <button type="button" disabled={busy || !r.inAt} onClick={() => go("clear")} className={btn.danger}>
          Clear
        </button>
      </div>
      {err ? (
        <p role="alert" className="type-small text-status-alert-fg">
          {err}
        </p>
      ) : null}
    </div>
  );
}
