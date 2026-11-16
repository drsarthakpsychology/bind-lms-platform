import { loadLeaveQueue, decideLeave } from "../../../_clinic/bridge";
import { AdminPage, LoadError, ViewTabs } from "../../_v2/kit";
import { LeaveQueue } from "../_ui/leave-queue";
import { clinicAdmin } from "../_ui/page-bits";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leave" };

const VIEWS = [
  { id: "pending", label: "Waiting" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Not approved" },
  { id: "all", label: "All" },
] as const;
type View = (typeof VIEWS)[number]["id"];

/** Leave requests: approve or reject, with an optional note. Over-the-limit requests are marked. */
export default async function ClinicLeavePage({ searchParams }: { searchParams: Promise<{ cohort?: string; status?: string }> }) {
  const sp = await searchParams;
  const { canWrite, cohort } = await clinicAdmin(Promise.resolve(sp));
  const status: View = VIEWS.some((v) => v.id === sp.status) ? (sp.status as View) : "pending";
  const res = await loadLeaveQueue(cohort, status);
  const href = (s: string) => `/admin/clinic/leave?status=${s}${cohort ? `&cohort=${cohort}` : ""}`;
  return (
    <AdminPage title="Leave">
      <ViewTabs label="Requests" current={status} tabs={VIEWS.map((v) => ({ id: v.id, label: v.label, href: href(v.id), count: v.id === "pending" && res.ok ? res.data.requests.length : null }))} />
      {res.ok ? <LeaveQueue data={res.data} decide={decideLeave} canWrite={canWrite} /> : <LoadError what="leave requests" href={href(status)} />}
    </AdminPage>
  );
}
