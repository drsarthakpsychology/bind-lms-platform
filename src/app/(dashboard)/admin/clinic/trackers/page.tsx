import { loadOverview, loadTrackers, remindLogs } from "../../../_clinic/bridge";
import { AdminPage, LoadError } from "../../_v2/kit";
import { CohortSwitch } from "../_ui/overview";
import { clinicAdmin } from "../_ui/page-bits";
import { RemindButton } from "../_ui/remind";
import { Trackers, cohortTotals } from "../_ui/trackers";

export const dynamic = "force-dynamic";
export const metadata = { title: "Trackers" };

/** Per student: attendance, leaves left, cases done of the total, OPD visits. */
export default async function TrackersPage({ searchParams }: { searchParams: Promise<{ cohort?: string }> }) {
  const { canWrite, cohort, q } = await clinicAdmin(searchParams);
  const [res, ov] = await Promise.all([loadTrackers(cohort), loadOverview(cohort)]);
  const cohortId = res.ok ? res.data.cohortId : null;
  return (
    <AdminPage title="Trackers" actions={ov.ok ? <CohortSwitch cohorts={ov.data.cohorts} current={cohortId ?? ov.data.cohortId} hrefFor={(id) => `/admin/clinic/trackers?cohort=${id}`} /> : null}>
      {res.ok ? (
        <Trackers
          data={res.data}
          hrefFor={(id) => `/admin/clinic/trackers/${id}?cohort=${res.data.cohortId}`}
          remind={canWrite ? <RemindButton cohortId={res.data.cohortId} remind={remindLogs} due={cohortTotals(res.data.rows).logsDue} /> : null}
        />
      ) : (
        <LoadError what="the trackers" href={`/admin/clinic/trackers${q}`} />
      )}
    </AdminPage>
  );
}
