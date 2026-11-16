import Link from "next/link";
import { QrCode } from "lucide-react";

import { KIND_LABEL, dayLong, timeRange } from "@/components/clinic/format";
import { loadLiveAttendance, markAttendance } from "../../../../_clinic/bridge";
import { AdminPage, btn } from "../../../_v2/kit";
import { LiveAttendance } from "../../_ui/live-attendance";
import { clinicAdmin } from "../../_ui/page-bits";

import { ClinicLoadError } from "../../_ui/load-error";

export const dynamic = "force-dynamic";
export const metadata = { title: "Attendance" };

/** One session: who is in, who left, who is late or missing; mark by hand. */
export default async function SessionAttendancePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ cohort?: string }> }) {
  const { canWrite, q } = await clinicAdmin(searchParams);
  const { id } = await params;
  const res = await loadLiveAttendance(id);
  const s = res.ok ? res.data.session : null;
  return (
    <AdminPage
      back={{ href: `/admin/clinic${q}`, label: "Clinic" }}
      title={s ? s.title || KIND_LABEL[s.kind] : "Attendance"}
      lead={s ? `${dayLong(s.date)}, ${timeRange(s.start, s.end)}${s.place ? `, ${s.place}` : ""}` : undefined}
      actions={
        s && s.status !== "cancelled" && res.ok && res.data.open ? (
          <Link href={`/admin/clinic/session/${id}/code${q}`} className={btn.primary}>
            <QrCode aria-hidden /> Show code
          </Link>
        ) : null
      }
    >
      {res.ok ? <LiveAttendance first={res} sessionId={id} load={loadLiveAttendance} mark={markAttendance} canWrite={canWrite} /> : <ClinicLoadError res={res} what="this session" href={`/admin/clinic/session/${id}${q}`} />}
    </AdminPage>
  );
}
