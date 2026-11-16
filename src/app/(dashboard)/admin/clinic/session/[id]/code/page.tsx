import { KIND_LABEL, dayLong, timeRange } from "@/components/clinic/format";
import { loadCode, loadLiveAttendance } from "../../../../../_clinic/bridge";
import { ShowCode } from "../../../_ui/show-code";
import { clinicAdmin } from "../../../_ui/page-bits";

export const dynamic = "force-dynamic";
export const metadata = { title: "Show code" };

/** Full-screen QR for a session (projected in class, or shared in an online class). */
export default async function ShowCodePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ cohort?: string }> }) {
  const { q } = await clinicAdmin(searchParams);
  const { id } = await params;
  const [first, live] = await Promise.all([loadCode(id), loadLiveAttendance(id)]);
  const s = live.ok ? live.data.session : null;
  return (
    <ShowCode
      sessionId={id}
      title={s ? s.title || KIND_LABEL[s.kind] : "Attendance"}
      when={s ? `${dayLong(s.date)}, ${timeRange(s.start, s.end)}` : ""}
      back={`/admin/clinic/session/${id}${q}`}
      load={loadCode}
      first={first}
    />
  );
}
