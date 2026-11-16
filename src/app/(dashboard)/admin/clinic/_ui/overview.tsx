import Link from "next/link";
import { QrCode } from "lucide-react";

import { KIND_LABEL, timeRange } from "@/components/clinic/format";
import type { ClinicAdminOverview, ClinicCohortRef } from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import { Block, Empty, Figures, Rows, RowItem, Status, btn, nameLink } from "../../_v2/kit";

/** Picks the cohort (links, so each cohort has an address). Hidden with one cohort. */
export function CohortSwitch({ cohorts, current, hrefFor }: { cohorts: ClinicCohortRef[]; current: string | null; hrefFor: (id: string) => string }) {
  if (cohorts.length < 2) return null;
  return (
    <nav aria-label="Cohort" className="flex min-w-0 flex-wrap gap-1">
      {cohorts.map((c) => (
        <Link key={c.id} href={hrefFor(c.id)} aria-current={c.id === current ? "page" : undefined} className={cn(btn.ghost, c.id === current && "bg-[var(--ds-tint)] text-foreground")}>
          {c.name}
        </Link>
      ))}
    </nav>
  );
}

/** Admin Clinic, today: each session with its live counts, Show code and attendance. */
export function ClinicToday({ data, q }: { data: ClinicAdminOverview; q: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-section)]">
      <Figures
        items={[
          { value: data.sessions.filter((s) => s.status !== "cancelled").length, label: "Sessions today" },
          { value: data.pendingLeave, label: "Leave to decide", href: `/admin/clinic/leave${q}` },
          { value: data.logsDue, label: "Case counts due", href: `/admin/clinic/trackers${q}` },
        ]}
      />
      <Block title="Today">
        {data.sessions.length ? (
          <Rows label="Sessions today">
            {data.sessions.map((s) => {
              const off = s.status === "cancelled";
              const c = s.counts;
              return (
                <RowItem key={s.id}>
                  <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <Link href={`/admin/clinic/session/${s.id}${q}`} className={cn(nameLink, "inline-flex min-h-11 items-center type-body lg:min-h-0", off && "text-muted-foreground line-through")}>
                        <span className="type-num">{timeRange(s.start, s.end)}</span>, {s.title || KIND_LABEL[s.kind]}
                      </Link>
                      <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{[KIND_LABEL[s.kind], s.place, s.onlineLink ? "Online" : null].filter(Boolean).join(", ")}</span>
                      {off ? (
                        <Status tone="quiet">Cancelled</Status>
                      ) : (
                        <span className="type-small type-num">
                          {c.in} of {c.expected} in
                          {c.late ? `, ${c.late} late` : ""}
                          {c.out ? `, ${c.out} left` : ""}
                          {c.onLeave ? `, ${c.onLeave} on leave` : ""}
                        </span>
                      )}
                    </span>
                    {!off ? (
                      <span className="flex shrink-0 flex-wrap gap-2">
                        <Link href={`/admin/clinic/session/${s.id}/code${q}`} className={btn.ink}>
                          <QrCode aria-hidden /> Show code
                        </Link>
                        <Link href={`/admin/clinic/session/${s.id}${q}`} className={btn.quiet}>
                          Attendance
                        </Link>
                      </span>
                    ) : null}
                  </div>
                </RowItem>
              );
            })}
          </Rows>
        ) : (
          <Empty>
            No sessions today.{" "}
            <Link href={`/admin/clinic/timetable${q}`} className="font-semibold text-link underline-offset-4 hover:underline">
              Timetable
            </Link>
          </Empty>
        )}
      </Block>
    </div>
  );
}
