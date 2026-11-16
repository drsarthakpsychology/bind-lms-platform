import { addExtra, discardPlan, generatePlan, loadOpdSettings, loadOverview, loadPlan, loadQuotas, movePlan, publishPlan, saveOpdSettings, setQuota, setStudentBatch } from "../../../_clinic/bridge";
import { AdminPage, Block, LoadError, More } from "../../_v2/kit";
import { CohortSwitch } from "../_ui/overview";
import { OpdPlan, OpdSettingsForm, QuotaTable } from "../_ui/opd";
import { planSummary } from "../_ui/opd-logic";
import { clinicAdmin } from "../_ui/page-bits";

export const dynamic = "force-dynamic";
export const metadata = { title: "OPD" };

/** OPD: the timetable of visits (generate, move, publish), each student's cases and batch, and the settings. */
export default async function OpdAdminPage({ searchParams }: { searchParams: Promise<{ cohort?: string }> }) {
  const { canWrite, cohort, q } = await clinicAdmin(searchParams);
  const ov = await loadOverview(cohort);
  if (!ov.ok || !ov.data.cohortId) {
    return <AdminPage title="OPD">{ov.ok ? <p className="type-small text-muted-foreground">Make a cohort first.</p> : <LoadError what="OPD" href={`/admin/clinic/opd${q}`} />}</AdminPage>;
  }
  const cohortId = ov.data.cohortId;
  const [settings, quotas, plan] = await Promise.all([loadOpdSettings(cohortId), loadQuotas(cohortId), loadPlan(cohortId)]);
  return (
    <AdminPage title="OPD" lead={plan.ok ? planSummary(plan.data) || undefined : undefined} actions={<CohortSwitch cohorts={ov.data.cohorts} current={cohortId} hrefFor={(id) => `/admin/clinic/opd?cohort=${id}`} />}>
      <Block title="OPD days">{plan.ok ? <OpdPlan key={`${plan.data.state}-${plan.data.days.length}`} plan={plan.data} actions={{ generate: generatePlan, move: movePlan, publish: publishPlan, discard: discardPlan }} canWrite={canWrite} /> : <LoadError what="the OPD days" />}</Block>
      <Block title="Cases and batch">{quotas.ok ? <QuotaTable data={quotas.data} actions={{ setQuota, addExtra, setBatch: setStudentBatch }} canWrite={canWrite} /> : <LoadError what="the cases" />}</Block>
      {settings.ok ? (
        <More summary="Seats, dates and settings">
          <OpdSettingsForm s={settings.data} save={saveOpdSettings} canWrite={canWrite} />
        </More>
      ) : (
        <LoadError what="the settings" />
      )}
    </AdminPage>
  );
}
