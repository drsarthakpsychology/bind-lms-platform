import { Stack } from "expo-router";
import { CalendarCheck, CalendarOff, ChevronLeft, ChevronRight, ClipboardList, Hospital } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { go } from "@/api/prefetch";
import { IconDot, Label, QuietEmpty, RoundButton, Row, RowList, RowsSkeleton, Screen, Skeleton, Stone, T } from "@/ds";
import { Swap } from "@/motion";
import { AreaProvider, fonts, space, useTheme } from "@/theme";
import { useClinicWeek } from "../api";
import { ClinicLoaded } from "../loaded";
import type { ClinicSession, ClinicWeek } from "../contract";
import { addDays, BATCH_NAME, dateLabel, dayShort, mondayOf, rangeLabel, relDay, todayIST, weekdayOf } from "../logic";
import { SessionSheet } from "../session-sheet";
import { SessionLine2, StoneList } from "../ui";

/** "16 to 22 Nov" (or "28 Nov to 4 Dec"). */
export function weekLabel(from: string, to: string): string {
  const [, , d1] = from.split("-").map(Number);
  const [, , d2] = to.split("-").map(Number);
  const m1 = dateLabel(from).split(" ")[2] ?? "";
  const m2 = dateLabel(to).split(" ")[2] ?? "";
  return m1 === m2 ? `${d1} to ${d2} ${m2}` : `${d1} ${m1} to ${d2} ${m2}`;
}

/**
 * The week on the blue field: seven day pills (today lime, the picked day
 * ink), a dot under a day with sessions, a filled one for my OPD day.
 */
function DayStrip({ week, day, onPick, today }: { week: ClinicWeek | undefined; day: string; onPick: (d: string) => void; today: string }) {
  const c = useTheme();
  if (!week) return <View style={{ height: 64 }} />;
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: "row", gap: 4 }}>
      {week.days.map((d) => {
        const on = d.date === day;
        const isToday = d.date === today;
        const opd = week.opdDays.some((o) => o.date === d.date);
        const has = d.sessions.some((s) => s.status !== "cancelled");
        const n = Number(d.date.slice(8));
        const bg = on ? c.ink : isToday ? c.lime : c.fieldTint;
        const fg = on ? c.bg : isToday ? c.onLime : c.onField;
        return (
          <Pressable
            key={d.date}
            testID={`day-${d.date}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${dateLabel(d.date, true)}${isToday ? ", today" : ""}${opd ? ", your OPD day" : ""}${has ? "" : ", nothing on"}`}
            onPress={() => {
              onPick(d.date);
            }}
            style={{ flex: 1, minHeight: 64, borderRadius: 18, alignItems: "center", justifyContent: "center", gap: 1, backgroundColor: bg }}
          >
            <T v="caption" style={{ color: fg, opacity: on || isToday ? 1 : 0.8 }} maxFontSizeMultiplier={1.2}>
              {dayShort(weekdayOf(d.date))}
            </T>
            <T num style={{ color: fg, fontFamily: fonts.bold, fontSize: 17, lineHeight: 22 }} maxFontSizeMultiplier={1.2}>
              {n}
            </T>
            <View style={{ height: 6, flexDirection: "row", gap: 3 }}>
              {opd ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: fg }} /> : null}
              {has && !opd ? <View style={{ width: 6, height: 6, borderRadius: 3, borderWidth: 1.5, borderColor: fg }} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function DayBody({ week, day, today, onOpen }: { week: ClinicWeek; day: string; today: string; onOpen: (s: ClinicSession) => void }) {
  const c = useTheme();
  const d = week.days.find((x) => x.date === day);
  const opd = week.opdDays.find((o) => o.date === day);
  return (
    <View style={{ gap: space[3] }}>
      <Label>{relDay(day, today) === dateLabel(day) ? dateLabel(day, true) : `${relDay(day, today)}, ${dateLabel(day)}`}</Label>
      {opd ? (
        <Stone testID="day-opd" onPress={() => go("/clinic/opd")} accessibilityLabel={`Your OPD day, ${BATCH_NAME[opd.batch].toLowerCase()} batch, ${rangeLabel(opd.start, opd.end)}. Opens OPD cases`}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
              <Hospital size={18} color={c.onLime} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <T v="bodyStrong">Your OPD day</T>
              <T v="small" tone="muted" num>
                {BATCH_NAME[opd.batch]} batch, {rangeLabel(opd.start, opd.end)}
              </T>
            </View>
            <ChevronRight size={18} color={c.muted} />
          </View>
        </Stone>
      ) : null}
      {d?.note ? (
        <View style={{ backgroundColor: c.card, borderRadius: 18, borderTopLeftRadius: 6, paddingVertical: space[3], paddingHorizontal: space[4] }}>
          <T v="caption" tone="muted">
            From the admin
          </T>
          <T>{d.note}</T>
        </View>
      ) : null}
      {d?.sessions.length ? (
        <StoneList>
          {d.sessions.map((s) => (
            <SessionLine2 key={s.id} s={s} testID={`week-s-${s.id}`} onPress={() => onOpen(s)} />
          ))}
        </StoneList>
      ) : opd ? null : (
        <QuietEmpty testID="day-empty" title="Nothing on this day" body="Pick another day above, or use the arrows to see another week." />
      )}
    </View>
  );
}

function WeekSkeleton() {
  return (
    <View style={{ gap: space[3] }}>
      <Skeleton h={18} w="40%" />
      <Skeleton h={180} r={26} />
      <RowsSkeleton rows={2} />
    </View>
  );
}

/**
 * Schedule. On the field: the week, with arrows, and its seven days. On the
 * layer: the picked day's sessions in one stone (a tap opens the session),
 * my OPD days this week, and the ways on to leave, cases and attendance.
 */
export function ScheduleScreen() {
  const today = todayIST();
  const [from, setFrom] = React.useState(() => mondayOf(today));
  const [day, setDay] = React.useState(today);
  const [dir, setDir] = React.useState<-1 | 0 | 1>(0);
  const [open, setOpen] = React.useState<ClinicSession | null>(null);
  const q = useClinicWeek(from);
  const c = useTheme();
  const thisWeek = from === mondayOf(today);
  const shiftWeek = (weeks: number) => {
    const next = addDays(from, weeks * 7);
    setFrom(next);
    setDir(weeks > 0 ? 1 : -1);
    setDay(next <= today && today <= addDays(next, 6) ? today : next);
  };
  const pick = (d: string) => {
    setDir(d > day ? 1 : d < day ? -1 : 0);
    setDay(d);
  };
  const week = q.data;
  const field = (
    <View style={{ gap: space[3] }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
        <RoundButton onField label="Last week" onPress={() => shiftWeek(-1)} testID="week-prev">
          <ChevronLeft size={20} color={c.onField} />
        </RoundButton>
        <View style={{ flex: 1, alignItems: "center" }}>
          <T v="bodyStrong" tone="onField" num testID="week-label">
            {weekLabel(from, addDays(from, 6))}
          </T>
          {thisWeek ? (
            <T v="caption" tone="onFieldMuted">
              This week
            </T>
          ) : (
            <Pressable accessibilityRole="button" accessibilityLabel="Back to this week" onPress={() => shiftWeek(Math.round((Date.parse(mondayOf(today)) - Date.parse(from)) / (7 * 86400_000)))} hitSlop={10} testID="week-now">
              <T v="caption" tone="onField" style={{ textDecorationLine: "underline" }}>
                Back to this week
              </T>
            </Pressable>
          )}
        </View>
        <RoundButton onField label="Next week" onPress={() => shiftWeek(1)} testID="week-next">
          <ChevronRight size={20} color={c.onField} />
        </RoundButton>
      </View>
      <DayStrip week={week} day={day} onPick={pick} today={today} />
    </View>
  );
  return (
    <AreaProvider area="home">
      <Stack.Screen options={{ title: "" }} />
      <Screen area="home" title="Schedule" field={field} testID="clinic-schedule" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
        <ClinicLoaded q={q} what="your schedule" skeleton={<WeekSkeleton />}>
          {(w) => (
            <View style={{ gap: space[5] }}>
              <Swap k={day} dir={dir}>
                <DayBody week={w} day={day} today={today} onOpen={setOpen} />
              </Swap>
              <View style={{ gap: space[2] }}>
                <Label>My OPD days this week</Label>
                {w.opdDays.length ? (
                  <RowList bare>
                    {w.opdDays.map((o) => (
                      <Row key={o.date + o.batch} title={relDay(o.date, today)} meta={`${BATCH_NAME[o.batch]}, ${rangeLabel(o.start, o.end)}`} icon={<IconDot icon={Hospital} />} onPress={() => pick(o.date)} chevron={false} testID={`opd-day-${o.date}`} />
                    ))}
                  </RowList>
                ) : (
                  <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
                    No OPD days this week.
                  </T>
                )}
              </View>
              <SessionSheet s={open} onClose={() => setOpen(null)} today={today} />
            </View>
          )}
        </ClinicLoaded>
        <View style={{ gap: space[2] }}>
          <Label>More</Label>
          <RowList bare>
            <Row title="Leave" meta="Ask for a day off or to leave early" icon={<IconDot icon={CalendarOff} />} onPress={() => go("/clinic/leave")} testID="go-leave" />
            <Row title="OPD cases" meta="Your batch, visits and case logs" icon={<IconDot icon={ClipboardList} />} onPress={() => go("/clinic/opd")} testID="go-opd" />
            <Row title="My attendance" meta="Your percent and every session" icon={<IconDot icon={CalendarCheck} />} onPress={() => go("/clinic/attendance")} testID="go-attendance" />
          </RowList>
        </View>
      </Screen>
    </AreaProvider>
  );
}
