import { Plus } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { useAdminAction, useRefreshAdmin } from "@/admin/api";
import { DateField } from "@/admin/date-field";
import { ConfirmSheet, Quiet, SmallButton, TabSwap, ScrollTabs } from "@/admin/kit";
import { useAdminRole } from "@/admin/role";
import { Button, Field, RowsSkeleton, Section, Sheet, SwitchRow, T } from "@/ds";
import { Screen } from "@/admin/ui";
import { space, useTheme } from "@/theme";
import { adminClinicCalls, useAdminClinicToday, useCohortId, useTimetable } from "../api";
import { ClinicLoaded } from "./kit";
import type { AdminSession, Ref, SessionKind, Slot, Timetable, Weekday } from "../contract";
import { WEEKDAYS } from "../contract";
import { dateLabel, dayLong, dayShort, isOpd, KIND_NAME, KINDS, minutesOf, parseClock, relDay, sessionMeta, todayIST } from "../logic";
import { SessionLine } from "../parts";
import { MultiPills, Pills } from "./kit";
import { countsLine } from "./today";

/** A start and an end typed as "10 am", "17:30": both read, the end after the start. */
export function checkTimes(start: string, end: string): { start: string; end: string } | string {
  const a = parseClock(start);
  const b = parseClock(end);
  if (!a || !b) return "Write the times like 10 am or 17:30.";
  if (minutesOf(b) <= minutesOf(a)) return "The end must be after the start.";
  return { start: a, end: b };
}

type Draft = { weekday: Weekday; date: string; kind: SessionKind; title: string; start: string; end: string; place: string; link: string; cohortIds: string[]; compulsory: boolean; note: string };

/** A weekly slot (`slot` set or a new one) or a one-off session (`oneOff`). */
function SessionSheet({ open, onClose, cohorts, cohortId, slot, oneOff }: { open: boolean; onClose: () => void; cohorts: Ref[]; cohortId: string; slot?: Slot | null; oneOff?: boolean }) {
  const [d, setD] = React.useState<Draft>(() => ({
    weekday: slot?.weekday ?? "mon",
    date: todayIST(),
    kind: slot?.kind ?? "class",
    title: slot?.title ?? "",
    start: slot?.start ?? "10:00",
    end: slot?.end ?? "13:00",
    place: slot?.place ?? "",
    link: slot?.link ?? "",
    cohortIds: slot?.cohortIds ?? [cohortId],
    compulsory: slot?.compulsory ?? true,
    note: "",
  }));
  const [error, setError] = React.useState<string | null>(null);
  const { run, busy } = useAdminAction();
  const set = (p: Partial<Draft>) => setD((x) => ({ ...x, ...p }));
  const go = async () => {
    const t = checkTimes(d.start, d.end);
    if (typeof t === "string") return setError(t);
    if (!d.cohortIds.length) return setError("Pick at least one cohort.");
    if (d.kind === "other" && !d.title.trim()) return setError("Name this session.");
    setError(null);
    const base = { kind: d.kind, title: d.title.trim(), start: t.start, end: t.end, place: d.place.trim() || null, link: d.link.trim() || null, cohortIds: d.cohortIds, compulsory: d.compulsory };
    const r = await run(
      "clinic",
      async () => {
        if (oneOff) {
          await adminClinicCalls.addSession({ ...base, date: d.date, note: d.note.trim() || null });
          return "Session added. Students get a notification.";
        }
        await (slot ? adminClinicCalls.editSlot(slot.id, { ...base, weekday: d.weekday }) : adminClinicCalls.addSlot({ ...base, weekday: d.weekday }));
        // Make the sessions for the next 8 weeks from the timetable (only the missing ones).
        const made = await adminClinicCalls.apply(cohortId).catch(() => null);
        return made && made.created ? `Timetable saved. ${made.created} new ${made.created === 1 ? "session" : "sessions"} in the next 8 weeks.` : "Timetable saved";
      },
      { done: (line) => line },
    );
    if (r !== undefined) onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} title={oneOff ? "Add a one-off session" : slot ? "Change this slot" : "Add a weekly slot"} testID="slot-sheet">
      <View style={{ gap: space[4] }}>
        {oneOff ? <DateField label="Date" value={d.date} onChange={(v) => set({ date: v })} min={todayIST()} testID="slot-date" /> : <Pills label="Day" value={d.weekday} onChange={(v) => set({ weekday: v })} options={WEEKDAYS.map((w) => ({ id: w, name: dayShort(w) }))} testID="slot-day" />}
        <Pills label="Kind" value={d.kind} onChange={(v) => set({ kind: v, compulsory: !isOpd(v) })} options={KINDS.map((k) => ({ id: k, name: KIND_NAME[k] }))} testID="slot-kind" />
        <Field label={d.kind === "other" ? "Name" : "Title (optional)"} value={d.title} onChangeText={(v) => set({ title: v })} maxLength={80} testID="slot-title" />
        <View style={{ flexDirection: "row", gap: space[3] }}>
          <View style={{ flex: 1 }}>
            <Field label="Start" value={d.start} onChangeText={(v) => set({ start: v })} maxLength={8} testID="slot-start" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="End" value={d.end} onChangeText={(v) => set({ end: v })} maxLength={8} testID="slot-end" />
          </View>
        </View>
        {d.kind === "online_class" ? <Field label="Link" value={d.link} onChangeText={(v) => set({ link: v })} autoCapitalize="none" keyboardType="url" testID="slot-link" /> : <Field label="Place" value={d.place} onChangeText={(v) => set({ place: v })} maxLength={80} testID="slot-place" />}
        <MultiPills label="Cohorts" options={cohorts} value={d.cohortIds} onChange={(v) => set({ cohortIds: v })} testID="slot-cohorts" />
        <SwitchRow title="Compulsory" meta={isOpd(d.kind) ? "OPD is only for the students assigned that day" : "Counts for attendance"} value={d.compulsory} onChange={(v) => set({ compulsory: v })} testID="slot-compulsory" />
        {oneOff ? <Field label="Note to students (optional)" value={d.note} onChangeText={(v) => set({ note: v })} maxLength={200} testID="slot-note" /> : null}
        {error ? (
          <T v="small" tone="alert" accessibilityRole="alert" testID="slot-error">
            {error}
          </T>
        ) : null}
        <Button label="Save" busy={!!busy} onPress={() => void go()} testID="slot-save" />
      </View>
    </Sheet>
  );
}

/** Move one session (date and time) with a note students see. */
function MoveSheet({ s, onClose }: { s: AdminSession; onClose: () => void }) {
  const [date, setDate] = React.useState(s.date);
  const [start, setStart] = React.useState(s.start);
  const [end, setEnd] = React.useState(s.end);
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const { run, busy } = useAdminAction();
  const go = async () => {
    const t = checkTimes(start, end);
    if (typeof t === "string") return setError(t);
    setError(null);
    const r = await run("clinic", () => adminClinicCalls.moveSession(s.id, { date, start: t.start, end: t.end, note: note.trim() || null }), { done: "Moved. Students get a notification." });
    if (r !== undefined) onClose();
  };
  return (
    <Sheet open onClose={onClose} title={`Move: ${s.title || KIND_NAME[s.kind]}`} testID="move-sheet">
      <View style={{ gap: space[4] }}>
        <DateField label="Date" value={date} onChange={setDate} min={todayIST()} testID="move-date" />
        <View style={{ flexDirection: "row", gap: space[3] }}>
          <View style={{ flex: 1 }}>
            <Field label="Start" value={start} onChangeText={setStart} maxLength={8} testID="move-start" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="End" value={end} onChangeText={setEnd} maxLength={8} testID="move-end" />
          </View>
        </View>
        <Field label="Note to students" value={note} onChangeText={setNote} error={error} maxLength={200} placeholder="For example: moved because of the holiday" testID="move-note" />
        <Button label="Move" busy={!!busy} onPress={() => void go()} testID="move-save" />
      </View>
    </Sheet>
  );
}

function Weekly({ t, canWrite, cohorts, cohortId }: { t: Timetable; canWrite: boolean; cohorts: Ref[]; cohortId: string }) {
  const c = useTheme();
  const [edit, setEdit] = React.useState<Slot | null | "new">(null);
  const [remove, setRemove] = React.useState<Slot | null>(null);
  const { run, busy } = useAdminAction();
  return (
    <View style={{ gap: space[5] }}>
      {canWrite ? <Button kind="quiet" label="Add a weekly slot" icon={<Plus size={20} color={c.ink} />} onPress={() => setEdit("new")} testID="slot-add" /> : null}
      {WEEKDAYS.map((w) => {
        const rows = t.slots.filter((s) => s.weekday === w);
        if (!rows.length) return null;
        return (
          <Section key={w} title={dayLong(w)}>
            <View>
              {rows.map((s) => (
                <View key={s.id} style={{ borderTopWidth: 1, borderColor: c.hairline }}>
                  <SessionLine s={{ ...s, date: "", status: "scheduled", note: null, mine: null, batch: null }} testID={`slot-${s.id}`} trailing={s.cohortIds.length > 1 ? <T v="small" tone="muted">{cohorts.filter((x) => s.cohortIds.includes(x.id)).map((x) => x.name).join(", ")}</T> : undefined} />
                  {canWrite ? (
                    <View style={{ flexDirection: "row", gap: space[2], marginLeft: 48, paddingBottom: space[3] }}>
                      <SmallButton label="Change" onPress={() => setEdit(s)} testID={`slot-${s.id}-edit`} />
                      <SmallButton label="Remove" danger onPress={() => setRemove(s)} testID={`slot-${s.id}-remove`} />
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          </Section>
        );
      })}
      {!t.slots.length ? <Quiet>No weekly slots yet.</Quiet> : null}
      {edit ? <SessionSheet open cohorts={cohorts} cohortId={cohortId} slot={edit === "new" ? null : edit} onClose={() => setEdit(null)} /> : null}
      <ConfirmSheet open={!!remove} onClose={() => setRemove(null)} title="Remove this slot?" body="New weeks will not get it. Sessions already on the calendar stay; cancel them under Next two weeks." confirm="Remove" danger busy={!!busy} onConfirm={() => remove && void run("clinic", () => adminClinicCalls.removeSlot(remove.id), { done: "Slot removed" }).then(() => setRemove(null))} testID="slot-remove-confirm" />
    </View>
  );
}

function Coming({ t, canWrite, cohorts, cohortId }: { t: Timetable; canWrite: boolean; cohorts: Ref[]; cohortId: string }) {
  const c = useTheme();
  const today = todayIST();
  const [add, setAdd] = React.useState(false);
  const [move, setMove] = React.useState<AdminSession | null>(null);
  const [cancel, setCancel] = React.useState<AdminSession | null>(null);
  const { run, busy } = useAdminAction();
  const days = [...new Set(t.upcoming.map((s) => s.date))];
  return (
    <View style={{ gap: space[5] }}>
      {canWrite ? <Button kind="quiet" label="Add a one-off session" icon={<Plus size={20} color={c.ink} />} onPress={() => setAdd(true)} testID="oneoff-add" /> : null}
      {days.map((d) => (
        <Section key={d} title={relDay(d, today) === dateLabel(d) ? dateLabel(d, true) : `${relDay(d, today)}, ${dateLabel(d)}`}>
          <View>
            {t.upcoming
              .filter((s) => s.date === d)
              .map((s) => (
                <View key={s.id} style={{ borderTopWidth: 1, borderColor: c.hairline }}>
                  <SessionLine s={s} testID={`up-${s.id}`} trailing={s.status === "cancelled" ? undefined : <T v="small" tone="muted" num>{s.counts.expected ? `${s.counts.expected} students` : ""}</T>} />
                  {canWrite && s.status !== "cancelled" ? (
                    <View style={{ flexDirection: "row", gap: space[2], marginLeft: 48, paddingBottom: space[3] }}>
                      <SmallButton label="Move" onPress={() => setMove(s)} testID={`up-${s.id}-move`} />
                      <SmallButton label="Cancel" danger onPress={() => setCancel(s)} testID={`up-${s.id}-cancel`} />
                    </View>
                  ) : null}
                </View>
              ))}
          </View>
        </Section>
      ))}
      {!days.length ? <Quiet>Nothing in the next two weeks.</Quiet> : null}
      {add ? <SessionSheet open oneOff cohorts={cohorts} cohortId={cohortId} onClose={() => setAdd(false)} /> : null}
      {move ? <MoveSheet s={move} onClose={() => setMove(null)} /> : null}
      <ConfirmSheet
        open={!!cancel}
        onClose={() => setCancel(null)}
        title="Cancel this session?"
        body={cancel ? `${cancel.title || KIND_NAME[cancel.kind]}, ${dateLabel(cancel.date)}, ${sessionMeta(cancel)}. ${countsLine(cancel)}. Students get a notification.` : undefined}
        confirm="Cancel the session"
        danger
        busy={!!busy}
        reason={{ label: "Note to students" }}
        onConfirm={(note) => cancel && void run("clinic", () => adminClinicCalls.cancelSession(cancel.id, note || null), { done: "Cancelled. Students get a notification." }).then(() => setCancel(null))}
        testID="cancel-confirm"
      />
    </View>
  );
}

/** Timetable: the weekly slots per cohort, and the next two weeks with one-offs, moves and cancels. */
export function AdminTimetableScreen() {
  const q = useTimetable();
  const o = useAdminClinicToday();
  const cohortId = useCohortId() ?? "";
  const cohorts = o.data?.cohorts ?? [];
  const { canWrite } = useAdminRole();
  const { refresh, refreshing } = useRefreshAdmin();
  const [tab, setTab] = React.useState<"week" | "next">("week");
  const tabs = [
    { id: "week" as const, name: "Every week" },
    { id: "next" as const, name: "Next two weeks" },
  ];
  return (
    <Screen testID="admin-timetable" title="Timetable" onRefresh={refresh} refreshing={refreshing}>
      <ScrollTabs tabs={tabs} value={tab} onChange={setTab} />
      <ClinicLoaded admin q={q} what="the timetable" skeleton={<RowsSkeleton rows={6} />}>
        {(t) => (
          <TabSwap tabs={tabs} value={tab}>
            {tab === "week" ? <Weekly t={t} canWrite={canWrite} cohorts={cohorts} cohortId={cohortId} /> : <Coming t={t} canWrite={canWrite} cohorts={cohorts} cohortId={cohortId} />}
          </TabSwap>
        )}
      </ClinicLoaded>
    </Screen>
  );
}
