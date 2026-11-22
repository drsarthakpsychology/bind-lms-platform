import { CalendarClock, CalendarOff, ChartColumn, Hospital, QrCode, SlidersHorizontal, StickyNote } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { go } from "@/api/prefetch";
import { useAdminAction, useRefreshAdmin } from "@/admin/api";
import { BarAction, EmptyState, Group, Locked, Panel, Screen, Tiles } from "@/admin/ui";
import { Button, Field, IconDot, Row, RowsSkeleton, Sheet, T } from "@/ds";
import { Enter } from "@/motion";
import { space, useTheme } from "@/theme";
import { adminClinicCalls, cohortStore, useAdminClinicToday } from "../api";
import { ClinicLoaded, Pills } from "./kit";
import { SmallButton } from "@/admin/kit";
import { dateLabel, minutesOf, rangeLabel, sessionTitle, timeLabel } from "../logic";
import type { AdminSession } from "../contract";
import { KIND_ICON } from "../parts";

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

/** Minutes since midnight in India, where the clinic is. */
const nowIst = () => {
  const d = new Date(Date.now() + 5.5 * 3600_000);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
};
/** The session running now, else the next one today: the one that gets the lime Show code. */
export function currentSession(list: AdminSession[], now = nowIst()): string | null {
  const live = list.filter((s) => s.status !== "cancelled");
  const on = live.find((s) => minutesOf(s.start) - 20 <= now && now < minutesOf(s.end));
  return (on ?? live.find((s) => minutesOf(s.start) > now) ?? live[0])?.id ?? null;
}

/**
 * One session as the admin sees it: when, what, who is in, and the two things
 * done from here all day: Show code and Who is in. `prefix` keeps the Home and
 * Clinic test ids apart.
 */
export function SessionCard({ s, current, prefix }: { s: AdminSession; current: boolean; prefix: string }) {
  const c = useTheme();
  const Icon = KIND_ICON[s.kind] ?? CalendarClock;
  const cancelled = s.status === "cancelled";
  const n = s.counts;
  return (
    <Panel testID={`${prefix}-${s.id}-card`} style={{ gap: space[3] }}>
      <View style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start" }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: current && !cancelled ? c.ink : c.bg, alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} color={current && !cancelled ? c.bg : c.muted} />
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <T v="bodyStrong" style={cancelled ? { textDecorationLine: "line-through", color: c.muted } : undefined}>
            {sessionTitle(s)}
          </T>
          <T v="small" tone="muted" num>
            {rangeLabel(s.start, s.end)}
            {s.place ? ` · ${s.place}` : s.link ? " · Online" : ""}
          </T>
        </View>
        {n.expected && !cancelled ? (
          <View accessible accessibilityLabel={`${n.in + n.out} of ${n.expected} came`} style={{ alignItems: "flex-end" }}>
            <T v="h3" num>
              {n.in + n.out}/{n.expected}
            </T>
            <T v="caption" tone="muted">
              came
            </T>
          </View>
        ) : null}
      </View>
      <T v="small" tone={cancelled ? "muted" : "ink"} num>
        {countsLine(s)}
      </T>
      {!cancelled ? (
        <View style={{ flexDirection: "row", gap: space[2], alignItems: "center" }}>
          {current ? (
            <View style={{ flex: 1 }}>
              <Button small label="Show code" icon={<QrCode size={18} color={c.onPrimary} />} onPress={() => openCode(s.id)} testID={`${prefix}-${s.id}-code`} />
            </View>
          ) : (
            <SmallButton label="Show code" icon={<QrCode size={18} color={c.ink} />} onPress={() => openCode(s.id)} testID={`${prefix}-${s.id}-code`} />
          )}
          <SmallButton label="Who is in" onPress={() => openSession(s.id)} testID={`${prefix}-${s.id}-list`} />
        </View>
      ) : null}
    </Panel>
  );
}

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
 * Clinic for the admin: today's sessions with Show code and who is in, the
 * numbers for the day, then everything else (leave queue, allowances,
 * timetable, OPD, trackers).
 */
export function AdminClinicScreen() {
  const q = useAdminClinicToday();
  const { refresh, refreshing } = useRefreshAdmin();
  const [note, setNote] = React.useState(false);
  const c = useTheme();
  const d = q.data;
  return (
    <Screen tab title="Clinic" lead={d ? dateLabel(d.date, true) : undefined} testID="admin-clinic" onRefresh={refresh} refreshing={refreshing} right={<BarAction label="Timetable" icon={CalendarClock} onPress={() => go("/admin/clinic/timetable")} testID="clinic-bar-timetable" />}>
      <ClinicLoaded admin q={q} what="today's sessions" skeleton={<RowsSkeleton rows={4} />}>
        {(d) => {
          const live = d.sessions.filter((s) => s.status !== "cancelled");
          const cur = currentSession(d.sessions);
          const sum = (k: "expected" | "in" | "out" | "missing" | "late" | "leave") => live.reduce((n, s) => n + s.counts[k], 0);
          return (
            <View style={{ gap: space[5] }}>
              {d.cohorts.length > 1 ? <Pills label="Cohort" value={d.cohortId} onChange={(id) => cohortStore.set({ id })} options={d.cohorts} testID="clinic-cohort" /> : null}
              <Tiles
                items={[
                  { value: sum("in") + sum("out"), label: `of ${sum("expected")} came today` },
                  { value: sum("late"), label: "late", tone: "warn" },
                  { value: d.pendingLeaves, label: "leave waiting", tone: "warn", onPress: () => go("/admin/clinic/leaves"), testID: "clinic-tile-leaves" },
                ]}
              />
              <Group title="Sessions today" count={d.sessions.length || undefined}>
                {d.sessions.length ? (
                  d.sessions.map((s, i) => (
                    <Enter key={s.id} i={i}>
                      <SessionCard s={s} current={s.id === cur} prefix="a-s" />
                    </Enter>
                  ))
                ) : (
                  <EmptyState title="No sessions today" body="Weekly slots and one-off sessions are set in the timetable." action={{ label: "Open the timetable", onPress: () => go("/admin/clinic/timetable") }} testID="home-timetable" />
                )}
              </Group>
              <Group title="Note to students">
                <Panel testID="admin-note" style={{ gap: space[3] }}>
                  <View style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start" }}>
                    <StickyNote size={18} color={c.muted} />
                    <T v="small" tone={d.note ? "ink" : "muted"} style={{ flex: 1 }}>
                      {d.note || "No note on today's schedule. Students see it at the top of their day."}
                    </T>
                  </View>
                  <Locked>
                    <Button small kind="quiet" full={false} label={d.note ? "Change the note" : "Add a note for today"} onPress={() => setNote(true)} testID="admin-note-edit" />
                  </Locked>
                </Panel>
              </Group>
              <Group title="Run the clinic">
                <Panel rows>
                  <Row title="Leave requests" meta="Approve or turn down, with a reason" icon={<IconDot icon={CalendarOff} />} trailing={d.pendingLeaves ? `${d.pendingLeaves} waiting` : undefined} onPress={() => go("/admin/clinic/leaves")} testID="clinic-leaves" />
                  <Row title="Allowances" meta="Leaves and OPD cases for each student" icon={<IconDot icon={SlidersHorizontal} />} onPress={() => go("/admin/clinic/allowances")} testID="clinic-allowances" />
                  <Row title="Timetable" meta="Weekly slots and one-off sessions" icon={<IconDot icon={CalendarClock} />} onPress={() => go("/admin/clinic/timetable")} testID="clinic-timetable" />
                  <Row title="OPD timetable" meta="Seats, generate, move, publish" icon={<IconDot icon={Hospital} />} onPress={() => go("/admin/clinic/opd")} testID="clinic-opd" />
                  <Row title="Trackers" meta="Attendance and cases for everyone" icon={<IconDot icon={ChartColumn} />} trailing={d.logsDue ? `${d.logsDue} logs due` : undefined} onPress={() => go("/admin/clinic/trackers")} testID="clinic-trackers" />
                </Panel>
              </Group>
              {note && d.cohortId ? <NoteSheet open={note} onClose={() => setNote(false)} date={d.date} note={d.note} cohortId={d.cohortId} /> : null}
            </View>
          );
        }}
      </ClinicLoaded>
    </Screen>
  );
}

/** Admin Home's block: today's sessions with Show code. Quiet when the server has no schedule yet. */
export function AdminTodayBlock() {
  const q = useAdminClinicToday();
  const d = q.data;
  if (!d) return null;
  const cur = currentSession(d.sessions);
  const next = d.sessions.find((s) => s.id === cur);
  return (
    <Group title="Sessions today" count={d.sessions.length || undefined} action={{ label: "Clinic", onPress: () => go("/admin/clinic"), testID: "home-clinic" }}>
      {d.sessions.length ? (
        d.sessions.map((s) => <SessionCard key={s.id} s={s} current={s.id === cur} prefix="home-s" />)
      ) : (
        <Panel>
          <T v="small" tone="muted">
            No sessions today.
          </T>
        </Panel>
      )}
      {next ? (
        <T v="caption" tone="muted" style={{ paddingHorizontal: space[1] }}>
          The code changes every few seconds. Show it on this phone at {timeLabel(next.start)}.
        </T>
      ) : null}
    </Group>
  );
}
