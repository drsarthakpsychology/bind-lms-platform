import type { ClinicAttendanceSummary, ClinicMySession } from "@/lib/clinic/types";
import { KIND_LABEL, dayShort, duration, instantClock, timeRange } from "./format";
import { StatusText, myLine } from "./sessions";

/** Attendance numbers in one quiet line: percent first, then the counts. No boxes. */
export function AttendanceFigures({ s }: { s: ClinicAttendanceSummary }) {
  // The same five words as everywhere else; every number comes from the one shared count on the server.
  const items: [string, string | number][] = [
    ["Present", s.present],
    ["Late", s.late],
    ["On leave", s.onLeave],
    ["Absent", s.absent],
  ];
  if (s.leftEarly) items.splice(2, 0, ["Left early (approved)", s.leftEarly]);
  if (s.noScanOut) items.push(["No scan out", s.noScanOut]);
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <p className="flex flex-wrap items-baseline gap-x-3">
        <span className="type-display type-num">{s.percent === null ? "None yet" : `${s.percent}%`}</span>
        {s.percent !== null ? (
          <span className="type-small text-muted-foreground type-num">
            came to {s.countedPresent} of {s.counted} sessions that count, {duration(s.minutes) || "0 min"} present
          </span>
        ) : null}
      </p>
      <p className="type-caption text-muted-foreground">Sessions on approved leave are left out of the percent. Leaving early with approval never lowers it.</p>
      <ul className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-10">
        {items.map(([label, v]) => (
          <li key={label} className="flex min-w-0 flex-col">
            <span className="type-h3 type-num">{v}</span>
            <span className="type-caption text-muted-foreground">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Past sessions, newest first, with in and out times. */
export function AttendanceList({ sessions }: { sessions: ClinicMySession[] }) {
  if (!sessions.length) return <p className="border-y border-[var(--ds-hairline)] py-6 type-small text-muted-foreground">No sessions yet.</p>;
  return (
    <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
      {sessions.map((s) => {
        const line = myLine(s);
        return (
          <li key={s.id} className="flex min-h-14 min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
            <span className="flex min-w-0 flex-col">
              <span className="type-body font-semibold [overflow-wrap:anywhere]">{s.title || KIND_LABEL[s.kind]}</span>
              <span className="type-small text-muted-foreground type-num">
                {dayShort(s.date)}, {timeRange(s.start, s.end)}
                {s.my.inAt ? `. In ${instantClock(s.my.inAt)}` : ""}
                {s.my.outAt ? `, out ${instantClock(s.my.outAt)}` : ""}
              </span>
            </span>
            <StatusText tone={line.tone}>{line.text}</StatusText>
          </li>
        );
      })}
    </ul>
  );
}
