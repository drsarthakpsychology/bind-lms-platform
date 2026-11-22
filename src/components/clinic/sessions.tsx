import Link from "next/link";
import { ScanLine } from "lucide-react";

import type { ClinicDay, ClinicMySession, ClinicToday } from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import { BATCH_LABEL, KIND_LABEL, STATUS_LABEL, STATUS_TONE, dayLong, dayShort, duration, instantClock, timeRange, type StatusTone } from "./format";

/**
 * The student's sessions: Home's Today block, and the days of the week view.
 * Server components (no hooks). Rows with hairlines, no boxes; the status is
 * always written, the dot only repeats it.
 */

const DOT: Record<StatusTone, string> = {
  ok: "bg-[#2f9e44] dark:bg-status-success-fg",
  warn: "bg-[#e8910c]",
  alert: "bg-status-alert-fg",
  info: "bg-link",
  quiet: "bg-foreground/25",
};

export function StatusText({ tone, children, className }: { tone: StatusTone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-1.5 type-small", tone === "alert" && "font-semibold text-status-alert-fg", className)}>
      <span aria-hidden className={cn("size-2 shrink-0 rounded-full", DOT[tone])} />
      <span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
    </span>
  );
}

/** What a session row says on its right: the student's state in it. */
export function myLine(s: ClinicMySession): { text: string; tone: StatusTone } {
  if (s.status === "cancelled") return { text: "Cancelled", tone: "quiet" };
  const m = s.my;
  if (m.status === "on_leave") return { text: m.missedOpd ? "On leave (missed OPD day)" : "On leave", tone: "info" };
  if (m.mark === "left_early" && m.status !== "in") {
    const d = m.minutes !== null ? `, ${duration(m.minutes)}` : "";
    return { text: `Left early (approved)${d}`, tone: "ok" };
  }
  if (m.status === "in") return { text: `In at ${instantClock(m.inAt)}${m.late ? ", late" : ""}`, tone: m.late ? "warn" : "info" };
  if (m.status === "present" || m.status === "late") {
    const d = m.minutes !== null ? `, ${duration(m.minutes)}` : "";
    return { text: `${m.status === "late" ? "Late" : "Present"}${d}`, tone: STATUS_TONE[m.status] };
  }
  if (m.status === "upcoming" && !s.required) return { text: s.kind.startsWith("opd") ? "Not your day" : "Optional", tone: "quiet" };
  return { text: STATUS_LABEL[m.status], tone: STATUS_TONE[m.status] };
}

function Where({ s }: { s: ClinicMySession }) {
  if (s.onlineLink && s.status !== "cancelled") {
    return (
      <a href={s.onlineLink} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center font-semibold text-link underline-offset-4 hover:underline focus-visible:underline lg:min-h-0">
        Join online
      </a>
    );
  }
  return s.place ? <span className="[overflow-wrap:anywhere]">{s.place}</span> : null;
}

/** One session as a row: time on the left, title and place, the student's state on the right. */
export function SessionRow({ s, showScan = false }: { s: ClinicMySession; showScan?: boolean }) {
  const off = s.status === "cancelled";
  const line = myLine(s);
  const scan = showScan && s.open && s.required && !off && (s.my.status === "upcoming" || s.my.status === "in");
  return (
    <li className="grid min-h-14 min-w-0 grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 py-3 @lg:grid-cols-[7rem_minmax(0,1fr)_auto] @lg:items-center">
      <span className={cn("type-small font-semibold type-num", off && "text-muted-foreground line-through decoration-foreground/40")}>{timeRange(s.start, s.end)}</span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
          <span className={cn("min-w-0 type-body font-semibold [overflow-wrap:anywhere]", off && "text-muted-foreground line-through decoration-foreground/40")}>{s.title || KIND_LABEL[s.kind]}</span>
          {s.assigned ? <span className="type-caption font-semibold text-link">Your OPD day</span> : null}
        </span>
        <span className="flex min-w-0 flex-wrap items-center gap-x-1.5 type-small text-muted-foreground">
          {s.title && s.title !== KIND_LABEL[s.kind] ? <span>{KIND_LABEL[s.kind]}{s.place || s.onlineLink ? "," : ""}</span> : null}
          <Where s={s} />
          {s.movedFrom ? <span>Moved from {movedText(s.movedFrom)}</span> : null}
          {s.my.earlyLeaveAt ? <span>Leaving at {instantClock(s.my.earlyLeaveAt) || s.my.earlyLeaveAt}</span> : null}
        </span>
        {s.note ? <span className="type-small [overflow-wrap:anywhere]">{s.note}</span> : null}
      </span>
      <span className="col-start-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 @lg:col-start-3 @lg:justify-end">
        <StatusText tone={line.tone}>{line.text}</StatusText>
        {scan ? (
          <Link href="/attendance/scan" className="inline-flex min-h-11 items-center gap-1.5 type-small font-semibold text-link underline-offset-4 hover:underline focus-visible:underline [&_svg]:size-4">
            <ScanLine aria-hidden /> {s.my.status === "in" ? "Scan out" : "Scan in"}
          </Link>
        ) : null}
      </span>
    </li>
  );
}

function movedText(v: string): string {
  const [d, t] = v.split(" ");
  return t ? `${dayShort(d)}, ${timeRange(t, null)}` : dayShort(d);
}

export const sessionList = "@container flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]";

/** Home's Today block: the admin's note, the OPD day line, today's sessions. Null when there is nothing today. */
export function TodayBlock({ today }: { today: ClinicToday }) {
  const live = today.sessions.filter((s) => s.status !== "cancelled" || s.required);
  if (!live.length && !today.note && !today.opd && !today.logsDue) return null;
  return (
    <section aria-labelledby="clinic-today" className="flex min-w-0 flex-col gap-2">
      <div className="flex min-h-11 min-w-0 items-center justify-between gap-4">
        <h2 id="clinic-today" className="type-h3">
          Schedule today
        </h2>
        <Link href="/schedule" className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-end type-small font-semibold text-link underline-offset-4 hover:underline focus-visible:underline">
          Week
        </Link>
      </div>
      {today.opd ? (
        <p className="type-body font-semibold [overflow-wrap:anywhere]">
          Today is your OPD day, {BATCH_LABEL[today.opd.batch].toLowerCase()}
          {today.opd.start ? ` ${timeRange(today.opd.start, today.opd.end)}` : ""}.
        </p>
      ) : null}
      {today.note ? <p className="border-l-2 border-link pl-3 type-small [overflow-wrap:anywhere]">{today.note}</p> : null}
      {live.length ? (
        <ul className={sessionList}>
          {live.map((s) => (
            <SessionRow key={s.id} s={s} showScan />
          ))}
        </ul>
      ) : (
        <p className="type-small text-muted-foreground">No sessions today.</p>
      )}
      {today.logsDue ? (
        <Link href="/opd" className="inline-flex min-h-11 w-fit items-center type-small font-semibold text-link underline-offset-4 hover:underline focus-visible:underline">
          {today.logsDue === 1 ? "One OPD day needs your case count" : `${today.logsDue} OPD days need your case count`}
        </Link>
      ) : null}
    </section>
  );
}

/** One day of the week view. */
export function DayBlock({ day, today }: { day: ClinicDay; today: string }) {
  const isToday = day.date === today;
  return (
    <section aria-labelledby={`d-${day.date}`} className="flex min-w-0 flex-col gap-1">
      <h2 id={`d-${day.date}`} className="flex min-w-0 items-baseline gap-2 type-h3">
        {dayLong(day.date)}
        {isToday ? <span className="type-caption font-semibold text-link">Today</span> : null}
      </h2>
      {day.note ? <p className="border-l-2 border-link pl-3 type-small [overflow-wrap:anywhere]">{day.note}</p> : null}
      {day.sessions.length ? (
        <ul className={sessionList}>
          {day.sessions.map((s) => (
            <SessionRow key={s.id} s={s} showScan={isToday} />
          ))}
        </ul>
      ) : (
        <p className="border-y border-[var(--ds-hairline)] py-3 type-small text-muted-foreground">Nothing on this day.</p>
      )}
    </section>
  );
}
