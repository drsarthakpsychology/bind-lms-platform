import * as React from "react";
import { View } from "react-native";

import { Loaded, RowsSkeleton, Screen, Section, Stat, T } from "@/ds";
import { ProgressRing } from "@/motion";
import { AreaProvider, layout, space, useAccent, useTheme } from "@/theme";
import { useMyAttendance } from "../api";
import { clockOf, dateLabel, relDay, todayIST } from "../logic";
import { StateWord } from "../parts";

/** My attendance: the percent, the counts, and every session so far with in and out times. */
export function AttendanceScreen() {
  const q = useMyAttendance();
  const a = useAccent();
  const c = useTheme();
  const today = todayIST();
  return (
    <AreaProvider area="home">
      <Screen testID="clinic-attendance" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
        <Loaded q={q} what="your attendance" soon skeleton={<RowsSkeleton rows={5} />}>
          {(d) => (
            <View style={{ gap: layout.section }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space[5] }}>
                <ProgressRing pct={d.pct ?? 0} size={96} stroke={8} color={a.deep} track={a.wash} label={d.pct === null ? "No sessions yet" : `${d.pct} percent present`}>
                  <T v="h2" num testID="att-pct">
                    {d.pct === null ? "0%" : `${d.pct}%`}
                  </T>
                </ProgressRing>
                <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", gap: space[5] }}>
                  <Stat value={String(d.present)} label="Present" />
                  <Stat value={String(d.late)} label="Late" />
                  <Stat value={String(d.missed)} label="Missed" />
                  <Stat value={String(d.onLeave)} label="On leave" />
                </View>
              </View>
              {d.hours ? (
                <T v="small" tone="muted" num>
                  {d.hours} hours present so far
                </T>
              ) : null}
              <Section title="Sessions">
                {d.rows.length ? (
                  <View>
                    {d.rows.map((r) => (
                      <View key={r.sessionId} testID={`att-${r.sessionId}`} style={{ minHeight: layout.row, paddingVertical: space[3], flexDirection: "row", alignItems: "center", gap: space[3], borderTopWidth: 1, borderColor: c.hairline }}>
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <T v="bodyStrong">{r.title}</T>
                          <T v="small" tone="muted" num>
                            {r.date === today ? relDay(r.date, today) : dateLabel(r.date)}
                            {r.inAt ? ` · In ${clockOf(r.inAt)}` : ""}
                            {r.outAt ? ` · Out ${clockOf(r.outAt)}` : ""}
                          </T>
                        </View>
                        <StateWord s={r.state} late={r.late} />
                      </View>
                    ))}
                  </View>
                ) : (
                  <T v="small" tone="muted">
                    Your sessions show here after the first one.
                  </T>
                )}
              </Section>
            </View>
          )}
        </Loaded>
      </Screen>
    </AreaProvider>
  );
}
