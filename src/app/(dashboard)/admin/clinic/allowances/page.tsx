import { loadAllowances, loadOverview, saveAllowances } from "../../../_clinic/bridge";
import { AdminPage, LoadError } from "../../_v2/kit";
import { Allowances } from "../_ui/allowances";
import { CohortSwitch } from "../_ui/overview";
import { clinicAdmin } from "../_ui/page-bits";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leaves allowed" };

/** How many leaves each student has: set for everyone, for the ticked, or one by hand. */
export default async function AllowancesPage({ searchParams }: { searchParams: Promise<{ cohort?: string }> }) {
  const { canWrite, cohort, q } = await clinicAdmin(searchParams);
  const [res, ov] = await Promise.all([loadAllowances(cohort), loadOverview(cohort)]);
  return (
    <AdminPage title="Leaves allowed" actions={ov.ok ? <CohortSwitch cohorts={ov.data.cohorts} current={res.ok ? res.data.cohortId : ov.data.cohortId} hrefFor={(id) => `/admin/clinic/allowances?cohort=${id}`} /> : null}>
      {res.ok ? <Allowances data={res.data} save={saveAllowances} canWrite={canWrite} /> : <LoadError what="leaves" href={`/admin/clinic/allowances${q}`} />}
    </AdminPage>
  );
}
