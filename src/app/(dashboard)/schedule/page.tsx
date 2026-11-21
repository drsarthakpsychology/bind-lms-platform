import type { Metadata } from "next";
import Link from "next/link";

import { PageFrame } from "@/components/ds";
import { quietButton } from "@/components/ds/parts";
import { addDays, dayShort } from "@/components/clinic/format";
import { CalendarLinkPanel } from "@/components/clinic/calendar-link";
import { DayBlock } from "@/components/clinic/sessions";
import { loadCalendarLink, loadToday, loadWeek, resetCalendarLink } from "../_clinic/bridge";
import { ClinicNotReady } from "../_clinic/not-ready";

export const metadata: Metadata = { title: "Schedule" };
export const dynamic = "force-dynamic";

/** The student's week: every session, the admin's notes, their OPD days. */
export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ start?: string }> }) {
  const { start } = await searchParams;
  const valid = start && /^\d{4}-\d{2}-\d{2}$/.test(start) ? start : undefined;
  const [week, today] = await Promise.all([loadWeek(valid), loadToday()]);
  if (!week.ok) {
    return (
      <PageFrame title="Schedule">
        <ClinicNotReady error={week.error} />
      </PageFrame>
    );
  }
  const w = week.data;
  const todayDate = today.ok ? today.data.date : "";
  return (
    <PageFrame title="Schedule" lead={`${dayShort(w.from)} to ${dayShort(w.to)}`}>
      <nav aria-label="Week" className="flex min-w-0 flex-wrap items-center gap-2">
        <Link href={`/schedule?start=${addDays(w.from, -7)}`} className={quietButton}>
          Last week
        </Link>
        {valid ? (
          <Link href="/schedule" className={quietButton}>
            This week
          </Link>
        ) : null}
        <Link href={`/schedule?start=${addDays(w.from, 7)}`} className={quietButton}>
          Next week
        </Link>
        <Link href="/opd" className="ml-auto inline-flex min-h-11 items-center type-small font-semibold text-link underline-offset-4 hover:underline">
          My OPD days
        </Link>
      </nav>
      {w.cohortId ? <CalendarLinkPanel actions={{ load: loadCalendarLink, reset: resetCalendarLink }} /> : null}
      {w.days.map((d) => (
        <DayBlock key={d.date} day={d} today={todayDate} />
      ))}
    </PageFrame>
  );
}
