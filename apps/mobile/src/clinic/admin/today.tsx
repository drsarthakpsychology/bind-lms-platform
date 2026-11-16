import { CalendarClock, CalendarOff, ChartColumn, Hospital, QrCode, SlidersHorizontal } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { go } from "@/api/prefetch";
import { useAdminAction, useRefreshAdmin } from "@/admin/api";
import { Quiet, SmallButton } from "@/admin/kit";
import { useAdminRole } from "@/admin/role";
import { Button, Field, IconDot, Row, RowList, RowsSkeleton, Screen, Section, Sheet, T } from "@/ds";
import { space, useTheme } from "@/theme";
import { adminClinicCalls, cohortStore, useAdminClinicToday } from "../api";
import { ClinicLoaded } from "../loaded";
import { dateLabel } from "../logic";
import { Pills } from "./kit";
import type { AdminSession } from "../contract";
import { Band, SessionLine, SessionList } from "../parts";
import { HeadLink } from "../today";

/** "8 in · 2 left · 3 not here · 1 late". */
export function countsLine(s: AdminSession): string {
  const n = s.counts;
  if (s.status === "cancelled") return "Cancelled";
  if (!n.expected) return "No students expected";
  const parts = [`${n.in} in`, n.out ? `${n.out} left` : "", `${n.missing} not here`, n.late ? `${n.late} late` : "", n.leave ? `${n.leave} on leave` : ""].filter(Boolean);
  return parts.join(" · ");
}

export const openSession = (id: string) => go(`/admin/clinic/session/${encodeURIComponent(id)}`);
export const openCode = (id: string) => go(`/admin/clinic/code/${encodeURIComponent(id)}`);

/** The note students see on today's schedule. */
function NoteSheet({ open, onClose, date, note, cohortId }: { open: boolean; onClose: () => void; date: string; note: string | null; cohortId: string }) {
  const [text, setText] = React.useState(note ?? "");
  const { run, busy } = useAdminAction();
  return (
    <Sheet open={open} onClose={onClose} title="Note on today's schedule" testID="note-sheet">
      <View style={{ gap: space[4] }}>
        <Field label="Note to students" value={text} onChangeText={setText} maxLength={200} placeholder="For example: bring your case sheets" testID="note-text" />
        <Button label={text.trim() ? "Save note" : "Remove note"} busy={!!busy} onPress={() => void run("clinic", () => adminClinicCalls.dayNote(cohortId, date, text.trim()), { done: text.trim() ? "Note saved" : "Note removed" }).then((r) => r && onClose())} testID="note-save" />
      </View>
    </Sheet>
  );
}

/**
 * Clinic for the admin: today's sessions with Show code and who is in, then
 * everything else (leave queue, allowances, timetable, OPD, trackers).
 */
export function AdminClinicScreen() {
  const q = useAdminClinicToday();
  const { refresh, refreshing } = useRefreshAdmin();
  const { canWrite } = useAdminRole();
  const c = useTheme();
  const [note, setNote] = React.useState(false);
  return (
    <Screen testID="admin-clinic" onRefresh={refresh} refreshing={refreshing}>
      <ClinicLoaded admin q={q} what="today's sessions" skeleton={<RowsSkeleton rows={4} />}>
        {(d) => (
          <View style={{ gap: space[6] }}>
            <View style={{ gap: space[1] }}>
              <T v="h1">Today</T>
              <T tone="muted" num>
                {dateLabel(d.date, true)}
              </T>
            </View>
            {d.cohorts.length > 1 ? <Pills label="Cohort" value={d.cohortId} onChange={(id) => cohortStore.set({ id })} options={d.cohorts} testID="clinic-cohort" /> : null}
            <View style={{ gap: space[3] }}>
              {d.note ? (
                <Band tone="plain" testID="admin-note">
                  <T v="caption" tone="muted">
                    Note to students
                  </T>
                  <T>{d.note}</T>
                </Band>
              ) : null}
              {canWrite ? (
                <View style={{ alignItems: "flex-start" }}>
                  <SmallButton label={d.note ? "Change the note" : "Add a note for today"} onPress={() => setNote(true)} testID="admin-note-edit" />
                </View>
              ) : null}
            </View>
            <Section title="Sessions">
              {d.sessions.length ? (
                <SessionList>
                  {d.sessions.map((s) => (
                    <View key={s.id} style={{ paddingBottom: space[3] }}>
                      <SessionLine s={s} onPress={() => openSession(s.id)} testID={`a-s-${s.id}`} trailing={null} />
                      <T v="small" tone="muted" num style={{ marginLeft: 48, marginTop: -space[2] }}>
                        {countsLine(s)}
                      </T>
                      {s.status !== "cancelled" ? (
                        <View style={{ flexDirection: "row", gap: space[2], marginLeft: 48, marginTop: space[2] }}>
                          <SmallButton label="Show code" icon={<QrCode size={18} color={c.ink} />} onPress={() => openCode(s.id)} testID={`a-s-${s.id}-code`} />
                          <SmallButton label="Who is in" onPress={() => openSession(s.id)} testID={`a-s-${s.id}-list`} />
                        </View>
                      ) : null}
                    </View>
                  ))}
                </SessionList>
              ) : (
                <Quiet>No sessions today.</Quiet>
              )}
            </Section>
            <Section title="Clinic">
              <RowList>
                <Row title="Leave requests" icon={<IconDot icon={CalendarOff} />} trailing={d.pendingLeaves ? `${d.pendingLeaves} waiting` : undefined} onPress={() => go("/admin/clinic/leaves")} testID="clinic-leaves" />
                <Row title="Allowances" meta="Leaves and OPD cases for each student" icon={<IconDot icon={SlidersHorizontal} />} onPress={() => go("/admin/clinic/allowances")} testID="clinic-allowances" />
                <Row title="Timetable" meta="Weekly slots and one-off sessions" icon={<IconDot icon={CalendarClock} />} onPress={() => go("/admin/clinic/timetable")} testID="clinic-timetable" />
                <Row title="OPD timetable" meta="Seats, generate, move, publish" icon={<IconDot icon={Hospital} />} onPress={() => go("/admin/clinic/opd")} testID="clinic-opd" />
                <Row title="Trackers" meta="Attendance and cases for everyone" icon={<IconDot icon={ChartColumn} />} trailing={d.logsDue ? `${d.logsDue} logs due` : undefined} onPress={() => go("/admin/clinic/trackers")} testID="clinic-trackers" />
              </RowList>
            </Section>
            {note && d.cohortId ? <NoteSheet open={note} onClose={() => setNote(false)} date={d.date} note={d.note} cohortId={d.cohortId} /> : null}
          </View>
        )}
      </ClinicLoaded>
    </Screen>
  );
}


/** Admin Home's block: today's sessions with Show code. Quiet when the server has no schedule yet. */
export function AdminTodayBlock() {
  const q = useAdminClinicToday();
  const c = useTheme();
  const d = q.data;
  if (!d) return null;
  const live = d.sessions.filter((s) => s.status !== "cancelled");
  return (
    <Section title="Sessions today" action={<HeadLink label="Clinic" onPress={() => go("/admin/clinic")} testID="home-clinic" />}>
      {live.length ? (
        <SessionList>
          {live.map((s) => (
            <View key={s.id} style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <SessionLine s={s} onPress={() => openSession(s.id)} testID={`home-s-${s.id}`} trailing={null} />
              </View>
              <SmallButton label="Show code" icon={<QrCode size={18} color={c.ink} />} onPress={() => openCode(s.id)} testID={`home-s-${s.id}-code`} />
            </View>
          ))}
        </SessionList>
      ) : (
        <Quiet>No sessions today.</Quiet>
      )}
      {d.pendingLeaves ? (
        <HeadLink label={`${d.pendingLeaves} leave ${d.pendingLeaves === 1 ? "request" : "requests"} waiting`} onPress={() => go("/admin/clinic/leaves")} testID="home-leaves" />
      ) : null}
    </Section>
  );
}
