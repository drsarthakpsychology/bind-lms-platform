import { CalendarCheck, CalendarOff, ChevronLeft, ChevronRight, ClipboardList, Hospital } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { go } from "@/api/prefetch";
import { IconButton, IconDot, Row, RowList, RowsSkeleton, Screen, Section, Skeleton, T } from "@/ds";
import { Swap } from "@/motion";
import { AreaProvider, layout, space, useAccent, useTheme } from "@/theme";
import { useClinicWeek } from "../api";
import { ClinicLoaded } from "../loaded";
import type { ClinicWeek } from "../contract";
import { addDays, BATCH_NAME, dateLabel, dayShort, mondayOf, rangeLabel, relDay, todayIST, weekdayOf } from "../logic";
import { Band, openLink, SessionLine, SessionList } from "../parts";

/** "16 to 22 Nov" (or "28 Nov to 4 Dec"). */
export function weekLabel(from: string, to: string): string {
  const [, , d1] = from.split("-").map(Number);
  const [, , d2] = to.split("-").map(Number);
  const m1 = dateLabel(from).split(" ")[2] ?? "";
  const m2 = dateLabel(to).split(" ")[2] ?? "";
  return m1 === m2 ? `${d1} to ${d2} ${m2}` : `${d1} ${m1} to ${d2} ${m2}`;
}

/** Seven day buttons; a dot under a day with sessions, a filled one for my OPD day. */
function DayStrip({ week, day, onPick, today }: { week: ClinicWeek; day: string; onPick: (d: string) => void; today: string }) {
  const c = useTheme();
  const a = useAccent();
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: "row", gap: space[1] }}>
      {week.days.map((d) => {
        const on = d.date === day;
        const opd = week.opdDays.some((o) => o.date === d.date);
        const has = d.sessions.some((s) => s.status !== "cancelled");
        const n = Number(d.date.slice(8));
        return (
          <Pressable
            key={d.date}
            testID={`day-${d.date}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${dateLabel(d.date, true)}${d.date === today ? ", today" : ""}${opd ? ", your OPD day" : ""}${has ? "" : ", nothing on"}`}
            onPress={() => {
              onPick(d.date);
            }}
            style={{ flex: 1, minHeight: 64, borderRadius: 12, alignItems: "center", justifyContent: "center", gap: 2, backgroundColor: on ? a.deep : "transparent", borderWidth: d.date === today && !on ? 1.5 : 0, borderColor: a.deep }}
          >
            <T v="caption" style={{ color: on ? a.onDeep : c.muted }}>
              {dayShort(weekdayOf(d.date))}
            </T>
            <T v="bodyStrong" num style={{ color: on ? a.onDeep : c.ink }}>
              {n}
            </T>
            <View style={{ height: 6, flexDirection: "row", gap: 3 }}>
              {opd ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: on ? a.onDeep : a.deep }} /> : null}
              {has && !opd ? <View style={{ width: 6, height: 6, borderRadius: 3, borderWidth: 1.5, borderColor: on ? a.onDeep : c.faint }} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function DayBody({ week, day, today }: { week: ClinicWeek; day: string; today: string }) {
  const d = week.days.find((x) => x.date === day);
  const opd = week.opdDays.find((o) => o.date === day);
  return (
    <View style={{ gap: space[3] }}>
      <T v="h3" testID="day-title">
        {relDay(day, today) === dateLabel(day) ? dateLabel(day, true) : `${relDay(day, today)}, ${dateLabel(day)}`}
      </T>
      {opd ? (
        <Band testID="day-opd">
          <T v="bodyStrong">
            Your OPD day, {opd.batch} {rangeLabel(opd.start, opd.end)}
          </T>
        </Band>
      ) : null}
      {d?.note ? (
        <Band tone="plain">
          <T v="caption" tone="muted">
            From the admin
          </T>
          <T>{d.note}</T>
        </Band>
      ) : null}
      {d?.sessions.length ? (
        <SessionList>
          {d.sessions.map((s) => (
            <SessionLine key={s.id} s={s} testID={`week-s-${s.id}`} onPress={s.link && s.status !== "cancelled" ? () => openLink(s.link!) : undefined} />
          ))}
        </SessionList>
      ) : (
        <T v="small" tone="muted" testID="day-empty">
          Nothing on this day.
        </T>
      )}
    </View>
  );
}

function WeekSkeleton() {
  return (
    <View style={{ gap: space[4] }}>
      <View style={{ flexDirection: "row", gap: space[1] }}>
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} h={64} r={12} style={{ flex: 1 }} />
        ))}
      </View>
      <RowsSkeleton rows={3} />
    </View>
  );
}

/** The week: seven days, my sessions on the picked day, my OPD days, and the links to leave, cases and attendance. */
export function ScheduleScreen() {
  const today = todayIST();
  const [from, setFrom] = React.useState(() => mondayOf(today));
  const [day, setDay] = React.useState(today);
  const [dir, setDir] = React.useState<-1 | 0 | 1>(0);
  const q = useClinicWeek(from);
  const c = useTheme();
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
  return (
    <AreaProvider area="home">
      <Screen area="home" testID="clinic-schedule" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
          <IconButton label="Last week" onPress={() => shiftWeek(-1)} testID="week-prev">
            <ChevronLeft size={22} color={c.ink} />
          </IconButton>
          <View style={{ flex: 1, alignItems: "center" }}>
            <T v="h3" num testID="week-label">
              {weekLabel(from, addDays(from, 6))}
            </T>
            {from !== mondayOf(today) ? (
              <Pressable accessibilityRole="button" onPress={() => shiftWeek(Math.round((Date.parse(mondayOf(today)) - Date.parse(from)) / (7 * 86400_000)))} style={{ minHeight: 32, justifyContent: "center" }} testID="week-now">
                <T v="small" tone="link">
                  Back to this week
                </T>
              </Pressable>
            ) : (
              <T v="small" tone="muted">
                This week
              </T>
            )}
          </View>
          <IconButton label="Next week" onPress={() => shiftWeek(1)} testID="week-next">
            <ChevronRight size={22} color={c.ink} />
          </IconButton>
        </View>
        <ClinicLoaded q={q} what="your schedule" skeleton={<WeekSkeleton />}>
          {(w) => (
            <View style={{ gap: layout.section }}>
              <DayStrip week={w} day={day} onPick={pick} today={today} />
              <Swap k={day} dir={dir}>
                <DayBody week={w} day={day} today={today} />
              </Swap>
              <Section title="My OPD days this week">
                {w.opdDays.length ? (
                  <RowList>
                    {w.opdDays.map((o) => (
                      <Row key={o.date + o.batch} title={relDay(o.date, today)} meta={`${BATCH_NAME[o.batch]}, ${rangeLabel(o.start, o.end)}`} icon={<IconDot icon={Hospital} />} onPress={() => pick(o.date)} chevron={false} testID={`opd-day-${o.date}`} />
                    ))}
                  </RowList>
                ) : (
                  <T v="small" tone="muted">
                    No OPD days this week.
                  </T>
                )}
              </Section>
            </View>
          )}
        </ClinicLoaded>
        <RowList>
          <Row title="Leave" meta="Ask for a day off or to leave early" icon={<IconDot icon={CalendarOff} />} onPress={() => go("/clinic/leave")} testID="go-leave" />
          <Row title="OPD cases" meta="Your batch, visits and case logs" icon={<IconDot icon={ClipboardList} />} onPress={() => go("/clinic/opd")} testID="go-opd" />
          <Row title="My attendance" icon={<IconDot icon={CalendarCheck} />} onPress={() => go("/clinic/attendance")} testID="go-attendance" />
        </RowList>
      </Screen>
    </AreaProvider>
  );
}
