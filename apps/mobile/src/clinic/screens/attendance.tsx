import * as React from "react";
import { View } from "react-native";

import { go } from "@/api/prefetch";
import { BackBar, OwnHeader, Label, QuietEmpty, Skeleton, Screen, Stone, T } from "@/ds";
import { ProgressRing, RollingNumber } from "@/motion";
import { AreaProvider, space, useTheme } from "@/theme";
import { useMyAttendance } from "../api";
import { ClinicLoaded } from "../loaded";
import type { MyAttendance } from "../contract";
import { clockOf, dateLabel, hoursLine, relDay, todayIST } from "../logic";
import { Line, StatePill, StoneList } from "../ui";

/** One count in its own small stone: the number rolls in, the word under it. */
function Count({ value, label, testID }: { value: number; label: string; testID?: string }) {
  return (
    <Stone pad={space[3]} style={{ flex: 1 }} testID={testID}>
      <View accessible accessibilityLabel={`${label}: ${value}`}>
        <RollingNumber v="h2" value={value} />
        <T v="caption" tone="muted" numberOfLines={1} maxFontSizeMultiplier={1.3}>
          {label}
        </T>
      </View>
    </Stone>
  );
}

function AttendanceSkeleton() {
  return (
    <View style={{ gap: space[4] }}>
      <Skeleton h={128} r={26} />
      <View style={{ flexDirection: "row", gap: space[3] }}>
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} h={68} r={26} style={{ flex: 1 }} />
        ))}
      </View>
      <Skeleton h={220} r={26} />
    </View>
  );
}

function Body({ d }: { d: MyAttendance }) {
  const c = useTheme();
  const today = todayIST();
  const pct = d.pct ?? 0;
  return (
    <View style={{ gap: space[5] }}>
      <Stone pad={space[5]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[5] }}>
          <ProgressRing pct={pct} size={104} stroke={9} color={c.dark ? c.lime : c.brand} track={c.dark ? c.fieldTint : c.hairline} label={d.pct === null ? "No sessions yet" : `${d.pct} percent present`}>
            <RollingNumber v="h2" value={pct} suffix="%" testID="att-pct" />
          </ProgressRing>
          <View style={{ flex: 1, minWidth: 0, gap: space[1] }}>
            <T v="h3">{d.pct === null ? "No sessions yet" : "Present"}</T>
            <T v="small" tone="muted" num>
              {d.pct === null ? "Your percent starts with your first session." : `${d.present} of ${d.total - d.onLeave} sessions that counted. Leave is left out.`}
            </T>
            {d.minutes ? (
              <T v="small" tone="muted" num>
                {hoursLine(d.minutes)} in all
              </T>
            ) : null}
          </View>
        </View>
      </Stone>
      <View style={{ flexDirection: "row", gap: space[2] }}>
        <Count value={d.present} label="Present" />
        <Count value={d.late} label="Late" />
        <Count value={d.missed} label="Missed" />
        <Count value={d.onLeave} label="On leave" />
      </View>
      {d.noOut ? (
        <T v="small" style={{ color: c.warnFg, paddingHorizontal: space[1] }} num>
          {d.noOut === 1 ? "1 session has no scan out. Remember to mark OUT when you leave." : `${d.noOut} sessions have no scan out. Remember to mark OUT when you leave.`}
        </T>
      ) : null}
      <View style={{ gap: space[2] }}>
        <Label>Sessions</Label>
        {d.rows.length ? (
          <StoneList>
            {d.rows.map((r) => (
              <Line key={r.sessionId} testID={`att-${r.sessionId}`} label={`${r.title}, ${r.date === today ? "today" : dateLabel(r.date)}${r.inAt ? `, in ${clockOf(r.inAt)}` : ""}${r.outAt ? `, out ${clockOf(r.outAt)}` : ""}`}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <T v="bodyStrong">{r.title}</T>
                  <T v="small" tone="muted" num>
                    {r.date === today ? relDay(r.date, today) : dateLabel(r.date)}
                    {r.inAt ? ` · In ${clockOf(r.inAt)}` : ""}
                    {r.outAt ? ` · Out ${clockOf(r.outAt)}` : ""}
                  </T>
                </View>
                <StatePill s={r.state} late={r.late} />
              </Line>
            ))}
          </StoneList>
        ) : (
          <QuietEmpty title="Nothing yet" body="Your sessions show here after the first one." action={{ label: "See the week", onPress: () => go("/clinic/schedule") }} />
        )}
      </View>
    </View>
  );
}

/** My attendance: the percent drawn in a ring, the counts, and every session so far with in and out times. */
export function AttendanceScreen() {
  const q = useMyAttendance();
  const lead = q.data ? (q.data.pct === null ? "No sessions yet" : `${q.data.present} present, ${q.data.missed} missed`) : undefined;
  return (
    <AreaProvider area="home">
      <OwnHeader />
      <Screen area="home" safeTop top={<BackBar home="/home" />} title="My attendance" lead={lead} testID="clinic-attendance" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
        <ClinicLoaded q={q} what="your attendance" skeleton={<AttendanceSkeleton />}>
          {(d) => <Body d={d} />}
        </ClinicLoaded>
      </Screen>
    </AreaProvider>
  );
}
