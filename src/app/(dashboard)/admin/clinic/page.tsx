import { loadOverview } from "../../_clinic/bridge";
import { AdminPage } from "../_v2/kit";
import { ClinicToday, CohortSwitch } from "./_ui/overview";
import { clinicAdmin } from "./_ui/page-bits";

import { ClinicLoadError } from "./_ui/load-error";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clinic" };

/** Clinic today: the day's sessions with Show code and live counts, leave to decide, case counts due. */
export default async function ClinicTodayPage({ searchParams }: { searchParams: Promise<{ cohort?: string }> }) {
  const { cohort, q } = await clinicAdmin(searchParams);
  const res = await loadOverview(cohort);
  return (
    <AdminPage title="Clinic" actions={res.ok ? <CohortSwitch cohorts={res.data.cohorts} current={res.data.cohortId} hrefFor={(id) => `/admin/clinic?cohort=${id}`} /> : null}>
      {res.ok ? <ClinicToday data={res.data} q={res.data.cohortId ? `?cohort=${res.data.cohortId}` : q} /> : <ClinicLoadError res={res} what="the clinic" href={`/admin/clinic${q}`} />}
    </AdminPage>
  );
}
