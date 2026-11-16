import type { Metadata } from "next";
import { CalendarDays, CalendarX2, ClipboardCheck, ScanLine, Stethoscope } from "lucide-react";

import { PageFrame, Row, RowList } from "@/components/ds";
import { TodayBlock } from "@/components/clinic/sessions";
import { leaves } from "@/components/clinic/format";
import { loadToday } from "../_clinic/bridge";
import { ClinicNotReady } from "../_clinic/not-ready";

export const metadata: Metadata = { title: "Clinic" };
export const dynamic = "force-dynamic";

/** The student's clinic: today (sessions, OPD day, the admin's note), then the clinic screens. Notices link here. */
export default async function ClinicPage() {
  const res = await loadToday();
  const t = res.ok ? res.data : null;
  return (
    <PageFrame title="Clinic">
      {t ? <TodayBlock today={t} /> : <ClinicNotReady error={res.ok ? "" : res.error} />}
      {t && !t.sessions.length && !t.note && !t.opd && !t.logsDue ? <p className="type-small text-muted-foreground">Nothing on today.</p> : null}
      <RowList>
        <Row href="/attendance/scan" icon={<ScanLine />} title="Scan attendance" />
        <Row href="/schedule" icon={<CalendarDays />} title="Schedule"/>
        <Row href="/leave" icon={<CalendarX2 />} title="Leave" meta={t?.leavesLeft !== null && t?.leavesLeft !== undefined ? `${leaves(t.leavesLeft)} left` : undefined} />
        <Row href="/opd" icon={<Stethoscope />} title="OPD cases" meta={t?.logsDue ? `${t.logsDue} case ${t.logsDue === 1 ? "count" : "counts"} due` : undefined} />
        <Row href="/attendance" icon={<ClipboardCheck />} title="My attendance" />
      </RowList>
    </PageFrame>
  );
}
