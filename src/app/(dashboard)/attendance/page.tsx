import type { Metadata } from "next";
import { ScanLine } from "lucide-react";
import Link from "next/link";

import { PageFrame, Section } from "@/components/ds";
import { quietButton } from "@/components/ds/parts";
import { AttendanceFigures, AttendanceList } from "@/components/clinic/attendance-view";
import { loadMyAttendance } from "../_clinic/bridge";
import { ClinicNotReady } from "../_clinic/not-ready";

export const metadata: Metadata = { title: "My attendance" };
export const dynamic = "force-dynamic";

/** The student's own attendance: percent, counts, and every past session. */
export default async function MyAttendancePage() {
  const res = await loadMyAttendance();
  return (
    <PageFrame
      title="My attendance"
      actions={
        <Link href="/attendance/scan" className={quietButton}>
          <ScanLine aria-hidden /> Scan
        </Link>
      }
    >
      {res.ok ? (
        <>
          <AttendanceFigures s={res.data.summary} />
          <Section title="Sessions">
            <AttendanceList sessions={[...res.data.sessions].sort((a, b) => (b.date + b.start).localeCompare(a.date + a.start))} />
          </Section>
        </>
      ) : (
        <ClinicNotReady error={res.error} />
      )}
    </PageFrame>
  );
}
