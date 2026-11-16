import { Sparkles } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { go } from "@/api/prefetch";
import { useAdminAction, useRefreshAdmin } from "@/admin/api";
import { DateField } from "@/admin/date-field";
import { ConfirmSheet, Notice, SmallButton } from "@/admin/kit";
import { useAdminRole } from "@/admin/role";
import { Button, RowsSkeleton, Screen, Section, Sheet, T } from "@/ds";
import { Swap } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { adminClinicCalls, useCohortId, useOpdAdmin } from "../api";
import { ClinicLoaded } from "../loaded";
import type { Batch, OpdAdmin, OpdPlan, OpdSettings, PlanDay, PlanSeat } from "../contract";
import { WEEKDAYS } from "../contract";
import { BATCH_NAME, dateLabel, dayShort, todayIST } from "../logic";
import { LineRow, Pills, Stepper } from "./kit";

/** Seats per weekday and batch, the cases per visit and the date range. */
function SettingsBlock({ s, canWrite, cohortId }: { s: OpdSettings; canWrite: boolean; cohortId: string }) {
  const [d, setD] = React.useState(s);
  const { run, busy } = useAdminAction();
  const c = useTheme();
  const dirty = JSON.stringify(d) !== JSON.stringify(s);
  const seat = (w: (typeof WEEKDAYS)[number], b: Batch, n: number) => setD((x) => ({ ...x, seats: { ...x.seats, [w]: { ...x.seats[w], [b]: n } } }));
  return (
    <Section title="Settings">
      <View style={{ gap: space[4] }}>
        <View style={{ flexDirection: "row", gap: space[3] }}>
          <View style={{ flex: 1 }}>
            <DateField label="From" value={d.from} onChange={(v) => setD((x) => ({ ...x, from: v }))} testID="opd-from" />
          </View>
          <View style={{ flex: 1 }}>
            <DateField label="To" value={d.to} onChange={(v) => setD((x) => ({ ...x, to: v }))} min={d.from} testID="opd-to" />
          </View>
        </View>
        <LineRow label="Cases per visit" meta="How many cases a student takes at one OPD">
          <Stepper value={d.casesPerVisit} onChange={(n) => setD((x) => ({ ...x, casesPerVisit: n }))} min={1} max={10} label="Cases per visit" testID="opd-per" />
        </LineRow>
        <View>
          <View style={{ flexDirection: "row", paddingVertical: space[2] }}>
            <T v="caption" tone="muted" style={{ flex: 1 }}>
              Seats
            </T>
            <T v="caption" tone="muted" center style={{ width: 132 }}>
              Morning
            </T>
            <T v="caption" tone="muted" center style={{ width: 132 }}>
              Evening
            </T>
          </View>
          {WEEKDAYS.map((w) => (
            <View key={w} testID={`seats-${w}`} style={{ flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderColor: c.hairline, minHeight: layout.target }}>
              <T v="bodyStrong" style={{ flex: 1 }}>
                {dayShort(w)}
              </T>
              <View style={{ width: 132, alignItems: "center" }}>
                <Stepper small value={d.seats[w].morning} onChange={(n) => seat(w, "morning", n)} max={20} label={`${dayShort(w)} morning seats`} testID={`seats-${w}-morning`} />
              </View>
              <View style={{ width: 132, alignItems: "center" }}>
                <Stepper small value={d.seats[w].evening} onChange={(n) => seat(w, "evening", n)} max={20} label={`${dayShort(w)} evening seats`} testID={`seats-${w}-evening`} />
              </View>
            </View>
          ))}
        </View>
        {canWrite && dirty ? <Button kind="quiet" label="Save settings" busy={!!busy} onPress={() => void run("clinic", () => adminClinicCalls.saveOpdSettings(cohortId, d), { done: "Settings saved. Generate again to use them." })} testID="opd-save" /> : null}
      </View>
    </Section>
  );
}

/** Move one student to another day (and batch) with a free seat. */
function MoveSeatSheet({ seat, from, plan, onClose }: { seat: PlanSeat; from: string; plan: OpdPlan; onClose: () => void }) {
  const today = todayIST();
  const [batch, setBatch] = React.useState<Batch>(plan.days.find((d) => d.date === from)?.evening.some((x) => x.studentId === seat.studentId) ? "evening" : "morning");
  const { run, busy } = useAdminAction();
  const free = plan.days.filter((d) => d.date >= today && d.date !== from && d[batch].length < d.seats[batch] && !d.morning.concat(d.evening).some((x) => x.studentId === seat.studentId));
  return (
    <Sheet open onClose={onClose} title={`Move ${seat.name}`} testID="seat-sheet">
      <View style={{ gap: space[4] }}>
        <T v="small" tone="muted">
          From {dateLabel(from)}. Pick a day with a free seat.
        </T>
        <Pills label="Batch" value={batch} onChange={setBatch} options={(["morning", "evening"] as const).map((b) => ({ id: b, name: BATCH_NAME[b] }))} testID="seat-batch" />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          {free.slice(0, 24).map((d) => (
            <SmallButton key={d.date} label={dateLabel(d.date)} busy={busy === d.date} onPress={() => void run("clinic", () => adminClinicCalls.moveSeat({ assignmentId: seat.assignmentId, date: d.date, batch }), { done: `${seat.name} moved to ${dateLabel(d.date)}`, tag: d.date }).then((r) => r && onClose())} testID={`seat-to-${d.date}`} />
          ))}
        </View>
        {!free.length ? (
          <T v="small" tone="muted">
            No free seats in this batch. Add seats in Settings.
          </T>
        ) : null}
      </View>
    </Sheet>
  );
}

function NameChip({ seat, onPress, canWrite }: { seat: PlanSeat; onPress: () => void; canWrite: boolean }) {
  const c = useTheme();
  return (
    <Pressable
      testID={`seat-${seat.studentId}`}
      accessibilityRole="button"
      accessibilityLabel={`${seat.name}${seat.fixed ? ", kept" : ". Move"}`}
      disabled={!canWrite || seat.fixed}
      onPress={() => {
        onPress();
      }}
      style={({ pressed }) => ({ minHeight: 36, paddingHorizontal: space[3], borderRadius: 18, justifyContent: "center", backgroundColor: pressed ? c.pill : c.tint, opacity: seat.fixed ? 0.7 : 1 })}
      hitSlop={4}
    >
      <T v="small">{seat.name.split(" ")[0]}</T>
    </Pressable>
  );
}

/** The calendar: one line per OPD day, morning and evening names under it. */
function Calendar({ plan, canWrite }: { plan: OpdPlan; canWrite: boolean }) {
  const c = useTheme();
  const today = todayIST();
  const [past, setPast] = React.useState(false);
  const [moving, setMoving] = React.useState<{ seat: PlanSeat; from: string } | null>(null);
  const days = plan.days.filter((d) => (past ? true : d.date >= today) && (d.seats.morning || d.seats.evening || d.morning.length || d.evening.length));
  const line = (d: PlanDay, b: Batch) =>
    d.seats[b] || d[b].length ? (
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: space[2] }}>
        <T v="caption" tone="muted" num style={{ width: 76, paddingTop: 10 }}>
          {BATCH_NAME[b]} {d[b].length}/{d.seats[b]}
        </T>
        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", gap: space[1] }}>
          {d[b].map((s) => (
            <NameChip key={s.studentId} seat={s} canWrite={canWrite} onPress={() => setMoving({ seat: s, from: d.date })} />
          ))}
          {!d[b].length ? (
            <T v="small" tone="muted" style={{ paddingTop: 8 }}>
              Empty
            </T>
          ) : null}
        </View>
      </View>
    ) : null;
  return (
    <Section title="Calendar" action={<SmallButton label={past ? "Hide past days" : "Show past days"} onPress={() => setPast((x) => !x)} testID="cal-past" />}>
      <View>
        {days.map((d) => (
          <View key={d.date} testID={`cal-${d.date}`} style={{ paddingVertical: space[3], gap: space[2], borderTopWidth: 1, borderColor: c.hairline }}>
            <T v="bodyStrong">
              {d.date === today ? "Today, " : ""}
              {dateLabel(d.date)}
            </T>
            {line(d, "morning")}
            {line(d, "evening")}
          </View>
        ))}
        {!days.length ? (
          <T v="small" tone="muted">
            No OPD days in the range. Add seats in Settings.
          </T>
        ) : null}
      </View>
      {canWrite ? (
        <T v="small" tone="muted">
          Tap a name to move that student. Past days and the next two stay as they are.
        </T>
      ) : null}
      {moving ? <MoveSeatSheet seat={moving.seat} from={moving.from} plan={plan} onClose={() => setMoving(null)} /> : null}
    </Section>
  );
}

function Body({ d }: { d: OpdAdmin }) {
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [publish, setPublish] = React.useState(false);
  const c = useTheme();
  const p = d.plan;
  const fallback = useCohortId();
  const cohortId = d.cohortId ?? fallback ?? "";
  const status = p.status === "draft" ? "Draft, not published yet. Students do not see it." : p.status === "published" ? "Published. Students see their OPD days." : "No OPD timetable yet.";
  return (
    <View style={{ gap: layout.section }}>
      <View style={{ gap: space[3] }}>
        <Swap k={p.status}>
          <Notice tone={p.status === "draft" ? "warn" : "plain"} testID="opd-status">
            <T v="small">{status}</T>
          </Notice>
        </Swap>
        {p.short.length ? (
          <Notice tone="alert" testID="opd-short">
            <T v="small">Not enough seats for {p.short.map((x) => `${x.name.split(" ")[0]} (${x.visits} more ${x.visits === 1 ? "visit" : "visits"})`).join(", ")}.</T>
          </Notice>
        ) : null}
        {p.noBatch.length ? (
          <Notice tone="plain" testID="opd-nobatch">
            <T v="small">No batch yet, so not in the plan: {p.noBatch.map((x) => x.name).join(", ")}. Set it under Allowances.</T>
          </Notice>
        ) : null}
        {canWrite ? (
          <View style={{ gap: space[2] }}>
            <Button kind={p.status === "draft" ? "quiet" : "primary"} label={p.status === "none" ? "Generate a draft" : "Generate again"} icon={<Sparkles size={20} color={p.status === "draft" ? c.ink : c.onPrimary} />} busy={busy === "clinic"} onPress={() => void run("clinic", () => adminClinicCalls.generate(cohortId), { done: "Draft ready. Check it, then publish." })} testID="opd-generate" />
            {p.status !== "none" ? (
              <T v="small" tone="muted">
                Generating again fills gaps from the day after tomorrow on. Past days and the next two stay.
              </T>
            ) : null}
            {p.status === "draft" ? <Button label="Publish" onPress={() => setPublish(true)} testID="opd-publish" /> : null}
            {p.status === "draft" ? <Button kind="text" label="Throw away the draft" busy={busy === "discard"} onPress={() => void run("clinic", () => adminClinicCalls.discard(cohortId), { done: "Draft thrown away", tag: "discard" })} testID="opd-discard" /> : null}
          </View>
        ) : null}
        <Pressable accessibilityRole="link" onPress={() => go("/admin/clinic/allowances")} style={{ minHeight: 44, justifyContent: "center" }} testID="opd-quotas">
          <T v="small" tone="link">
            Cases for each student and paid extras
          </T>
        </Pressable>
      </View>
      <Calendar plan={p} canWrite={canWrite} />
      <SettingsBlock s={d.settings} canWrite={canWrite} cohortId={cohortId} />
      <ConfirmSheet open={publish} onClose={() => setPublish(false)} title="Publish the OPD timetable?" body="Every student gets a notification with their OPD days." confirm="Publish" busy={busy === "publish"} onConfirm={() => void run("clinic", () => adminClinicCalls.publish(cohortId), { done: (r) => `Published. ${r.notified} ${r.notified === 1 ? "student" : "students"} told.`, tag: "publish" }).then(() => setPublish(false))} testID="publish-confirm" />
    </View>
  );
}

/** OPD timetable: generate a fair draft from seats and quotas, check it as a calendar, move names, publish. */
export function AdminOpdScreen() {
  const q = useOpdAdmin();
  const { refresh, refreshing } = useRefreshAdmin();
  return (
    <Screen testID="admin-opd" title="OPD timetable" onRefresh={refresh} refreshing={refreshing}>
      <ClinicLoaded admin q={q} what="the OPD timetable" skeleton={<RowsSkeleton rows={6} />}>
        {(d) => <Body d={d} />}
      </ClinicLoaded>
    </Screen>
  );
}

