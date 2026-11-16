import { addDays, weekdayOf } from "@/components/clinic/format";
import { addSession, applyTimetable, deleteSlot, loadOverview, loadSessions, loadTimetable, patchSession, saveDayNote, saveSlot } from "../../../_clinic/bridge";
import { AdminPage, Block, LoadError } from "../../_v2/kit";
import { CohortSwitch } from "../_ui/overview";
import { clinicAdmin } from "../_ui/page-bits";
import { WeekSessions, WeeklyTimetable } from "../_ui/timetable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Timetable" };

/** The Monday on or before a date. */
function monday(date: string): string {
  const wd = weekdayOf(date);
  return addDays(date, wd === 0 ? -6 : 1 - wd);
}

/** The weekly timetable, making sessions from it, and one week of real sessions with one-offs and notes. */
export default async function TimetablePage({ searchParams }: { searchParams: Promise<{ cohort?: string; from?: string }> }) {
  const sp = await searchParams;
  const { canWrite, cohort } = await clinicAdmin(Promise.resolve(sp));
  const ov = await loadOverview(cohort);
  if (!ov.ok || !ov.data.cohortId) {
    return (
      <AdminPage title="Timetable">
        {ov.ok ? <p className="type-small text-muted-foreground">Make a cohort first.</p> : <LoadError what="the timetable" href="/admin/clinic/timetable" />}
      </AdminPage>
    );
  }
  const cohortId = ov.data.cohortId;
  const from = monday(sp.from && /^\d{4}-\d{2}-\d{2}$/.test(sp.from) ? sp.from : ov.data.today);
  const [slots, week] = await Promise.all([loadTimetable(cohortId), loadSessions(cohortId, from, addDays(from, 6))]);
  const actions = { saveSlot, deleteSlot, apply: applyTimetable, addSession, patchSession, saveNote: saveDayNote };
  return (
    <AdminPage title="Timetable" actions={<CohortSwitch cohorts={ov.data.cohorts} current={cohortId} hrefFor={(id) => `/admin/clinic/timetable?cohort=${id}`} />}>
      <Block title="Every week">{slots.ok ? <WeeklyTimetable cohortId={cohortId} slots={slots.data.slots} actions={actions} canWrite={canWrite} today={ov.data.today} /> : <LoadError what="the timetable" />}</Block>
      <Block title="Sessions">
        {week.ok ? <WeekSessions cohortId={cohortId} from={from} sessions={week.data.sessions} notes={week.data.notes} actions={actions} canWrite={canWrite} weekHref={`/admin/clinic/timetable?cohort=${cohortId}&from=`} /> : <LoadError what="the sessions" />}
      </Block>
    </AdminPage>
  );
}
