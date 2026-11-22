import * as React from "react";
import { View } from "react-native";

import { useAdminAction, useRefreshAdmin } from "@/admin/api";
import { Figures, FilterChips, Meter, Quiet, SmallButton, Tag } from "@/admin/kit";
import { openStudent } from "@/admin/nav";
import { useAdminRole } from "@/admin/role";
import { Row, RowsSkeleton } from "@/ds";
import { Screen, Locked } from "@/admin/ui";
import { space } from "@/theme";
import { adminClinicCalls, useClinicStudents } from "../api";
import { ClinicLoaded } from "./kit";
import type { ClinicStudent } from "../contract";
import { pct } from "../logic";

type Sort = "attendance" | "cases" | "logs";

export function sortTrackers(rows: ClinicStudent[], by: Sort): ClinicStudent[] {
  const r = [...rows];
  if (by === "attendance") return r.sort((a, b) => (a.attendancePct ?? 101) - (b.attendancePct ?? 101) || a.name.localeCompare(b.name));
  if (by === "cases") return r.sort((a, b) => (pct(a.casesDone, a.opdTotal) ?? 0) - (pct(b.casesDone, b.opdTotal) ?? 0) || a.name.localeCompare(b.name));
  return r.filter((x) => x.unsubmitted > 0).sort((a, b) => b.unsubmitted - a.unsubmitted || a.name.localeCompare(b.name));
}

/** Trackers: attendance and cases for the cohort, lowest first, and who has not logged their cases. */
export function AdminTrackersScreen() {
  const q = useClinicStudents();
  const { canWrite } = useAdminRole();
  const { refresh, refreshing } = useRefreshAdmin();
  const { run, busy } = useAdminAction();
  const [by, setBy] = React.useState<Sort>("attendance");
  return (
    <Screen testID="admin-trackers" title="Trackers" onRefresh={refresh} refreshing={refreshing}>
      <ClinicLoaded admin q={q} what="the trackers" skeleton={<RowsSkeleton rows={6} />}>
        {(d) => {
          const rows = sortTrackers(d.items, by);
          const withPct = d.items.filter((x) => x.attendancePct !== null);
          const avg = withPct.length ? Math.round(withPct.reduce((n, x) => n + (x.attendancePct ?? 0), 0) / withPct.length) : null;
          const done = d.items.reduce((n, x) => n + x.casesDone, 0);
          const total = d.items.reduce((n, x) => n + x.opdTotal, 0);
          const due = d.items.filter((x) => x.unsubmitted > 0);
          return (
            <View style={{ gap: space[5] }}>
              <Figures
                items={[
                  { value: avg === null ? "None yet" : `${avg}%`, label: "Attendance" },
                  { value: `${done}/${total}`, label: "Cases done" },
                  { value: String(due.reduce((n, x) => n + x.unsubmitted, 0)), label: "Logs not in", onPress: () => setBy("logs"), testID: "trk-logs" },
                  { value: String(d.items.reduce((n, x) => n + x.absences, 0)), label: "OPD absences" },
                ]}
              />
              <FilterChips
                label="Sort"
                value={by}
                onChange={setBy}
                testID="trk-sort"
                options={[
                  { id: "attendance", name: "Attendance" },
                  { id: "cases", name: "Cases" },
                  { id: "logs", name: "Logs not in", count: due.length },
                ]}
              />
              {by === "logs" && due.length ? <Locked><View style={{ alignItems: "flex-start" }}>
                  <SmallButton label={`Remind ${due.length} ${due.length === 1 ? "student" : "students"}`} busy={!!busy} onPress={() => d.cohortId && void run("clinic", () => adminClinicCalls.remind(d.cohortId!), { done: (r) => `Reminder sent to ${r.notified}` })} testID="trk-remind" />
                </View></Locked> : null}
              {rows.length ? (
                <View>
                  {rows.map((s) => {
                    const cp = pct(s.casesDone, s.opdTotal) ?? 0;
                    return (
                      <Row
                        key={s.studentId}
                        testID={`trk-${s.studentId}`}
                        title={s.name}
                        meta={`${s.attendancePct === null ? "No sessions yet" : `${s.attendancePct}% attendance`} · ${s.casesDone} of ${s.opdTotal} cases · ${s.visits} visits${s.absences ? ` · ${s.absences} absent` : ""}`}
                        trailing={s.unsubmitted ? <Tag tone="warn">{`${s.unsubmitted} to log`}</Tag> : undefined}
                        below={<Meter pct={cp} label={`${cp}%`} />}
                        onPress={() => openStudent(s.studentId)}
                      />
                    );
                  })}
                </View>
              ) : (
                <Quiet>{by === "logs" ? "Every case log is in." : "No students yet."}</Quiet>
              )}
            </View>
          );
        }}
      </ClinicLoaded>
    </Screen>
  );
}
