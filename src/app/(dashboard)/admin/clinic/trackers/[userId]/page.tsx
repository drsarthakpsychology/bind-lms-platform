import { AttendanceFigures, AttendanceList } from "@/components/clinic/attendance-view";
import { BATCH_LABEL, LEAVE_STATUS_LABEL, askLine, cases, dayShort, leaves } from "@/components/clinic/format";
import { loadStudentDetail } from "../../../../_clinic/bridge";
import { AdminPage, Block, Empty, Facts, LoadError, Rows, RowItem } from "../../../_v2/kit";
import { clinicAdmin } from "../../_ui/page-bits";

export const dynamic = "force-dynamic";
export const metadata = { title: "Student" };

/** One student's clinic record: attendance, leave, cases and OPD days. */
export default async function ClinicStudentPage({ params, searchParams }: { params: Promise<{ userId: string }>; searchParams: Promise<{ cohort?: string }> }) {
  const { cohort, q } = await clinicAdmin(searchParams);
  const { userId } = await params;
  const res = await loadStudentDetail(userId, cohort);
  if (!res.ok) {
    return (
      <AdminPage title="Student" back={{ href: `/admin/clinic/trackers${q}`, label: "Trackers" }}>
        <LoadError what="this student" />
      </AdminPage>
    );
  }
  const d = res.data;
  const r = d.row;
  return (
    <AdminPage title={r.name ?? "Student"} lead={r.roll ?? undefined} back={{ href: `/admin/clinic/trackers?cohort=${d.cohortId}`, label: "Trackers" }}>
      <AttendanceFigures s={r.attendance} />
      <Facts
        items={[
          { label: "Batch", value: r.batch ? BATCH_LABEL[r.batch] : "None" },
          { label: "Leaves", value: `${leaves(r.leave.left)} left of ${r.leave.allowance}${r.leave.pending ? `, ${r.leave.pending} waiting` : ""}` },
          { label: "Cases", value: `${r.cases.done} of ${r.cases.total}${r.cases.extras.length ? `, ${cases(r.cases.extras.reduce((n, e) => n + e.count, 0))} added` : ""}` },
          { label: "OPD visits", value: `${r.visits.done} of ${r.visits.planned}${r.visits.due ? `, ${r.visits.due} count due` : ""}${r.visits.missed ? `, ${r.visits.missed} missed` : ""}` },
        ]}
      />
      <Block title="OPD days" count={d.visits.length}>
        {d.visits.length ? (
          <Rows>
            {d.visits.map((v) => (
              <RowItem key={v.assignmentId} className="flex-row flex-wrap items-baseline justify-between gap-x-4">
                <span className="type-body font-semibold">
                  {dayShort(v.date)}, {BATCH_LABEL[v.batch].toLowerCase()}
                </span>
                <span className="type-small text-muted-foreground">{v.log ? (v.log.absent ? "Absent" : cases(v.log.cases)) : v.state === "upcoming" ? "Coming up" : v.state === "missed" ? "Missed" : v.state === "due" ? "Count due" : v.state === "on_leave" ? "On leave" : "Today"}</span>
              </RowItem>
            ))}
          </Rows>
        ) : (
          <Empty>No OPD days yet.</Empty>
        )}
      </Block>
      <Block title="Leave" count={d.leave.length}>
        {d.leave.length ? (
          <Rows>
            {d.leave.map((l) => (
              <RowItem key={l.id}>
                <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="type-body font-semibold">{askLine(l)}</span>
                  <span className="type-small text-muted-foreground">{LEAVE_STATUS_LABEL[l.status]}</span>
                </span>
                <span className="type-small text-muted-foreground">{l.sessions.map((s) => `${dayShort(s.date)}, ${s.title}`).join("; ")}</span>
                {l.reason ? <span className="type-small">{l.reason}</span> : null}
              </RowItem>
            ))}
          </Rows>
        ) : (
          <Empty>No leave asked.</Empty>
        )}
      </Block>
      <Block title="Sessions" count={d.sessions.length}>
        <AttendanceList sessions={[...d.sessions].sort((a, b) => (b.date + b.start).localeCompare(a.date + a.start))} />
      </Block>
    </AdminPage>
  );
}
