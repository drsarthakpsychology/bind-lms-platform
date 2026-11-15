import { Stack } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import type { Progress, TopicScore } from "@/api/contract";
import { useProgress } from "@/api/queries";
import { EmptyState, Loaded, ProgressLine, Row, RowList, RowsSkeleton, Screen, Section, Stat, T } from "@/ds";
import { openTarget } from "@/nav/targets";
import { space, useTheme } from "@/theme";

function hours(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h ? `${h} h ${m} m` : `${m} m`;
}

/** Fourteen thin bars: points per day, oldest first. Today in ink, the rest quieter. */
function Days({ days }: { days: Progress["days"] }) {
  const c = useTheme();
  const max = Math.max(1, ...days.map((d) => d.xp));
  const total = days.reduce((s, d) => s + d.xp, 0);
  return (
    <View accessible accessibilityLabel={`Points in the last 14 days: ${total}`} style={{ gap: space[2] }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", height: 72, gap: 4 }}>
        {days.map((d, i) => (
          <View key={d.day} style={{ flex: 1, height: Math.max(3, (d.xp / max) * 72), borderRadius: 2, backgroundColor: i === days.length - 1 ? (c.dark ? c.primary : c.ink) : c.cardLine }} />
        ))}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <T v="caption" tone="muted">
          Two weeks ago
        </T>
        <T v="caption" tone="muted">
          Today
        </T>
      </View>
    </View>
  );
}

function Topics({ items }: { items: TopicScore[] }) {
  return (
    <RowList>
      {items.map((t) => (
        <Row key={t.id} title={t.title} meta={`${t.n} answers`} trailing={`${Math.round(t.p * 100)}%`} onPress={() => openTarget(t.studyTarget ?? t.practiceTarget)} />
      ))}
    </RowList>
  );
}

/** Where you stand: numbers in one row, the last two weeks, then your topics. */
export function ProgressBody({ p }: { p: Progress }) {
  const lect = p.lectures.reduce((a, l) => ({ done: a.done + l.completed, total: a.total + l.total }), { done: 0, total: 0 });
  return (
    <>
      <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: space[6], rowGap: space[4] }}>
        <Stat value={`${lect.done}/${lect.total}`} label="Lectures" />
        {p.study ? <Stat value={`${p.study.modulesDone}/${p.study.modulesTotal}`} label="Modules" /> : null}
        {p.study ? <Stat value={String(p.study.streak)} label="Day streak" /> : null}
        {p.study ? <Stat value={hours(p.study.seconds)} label="Studied" /> : null}
      </View>
      {p.lectures.map((l) => {
        const pct = l.total ? Math.round((l.completed / l.total) * 100) : 0;
        return (
          <View key={l.courseId} style={{ gap: space[2] }}>
            <T v="small" tone="muted">
              {l.title} · {pct}%
            </T>
            <ProgressLine value={pct} label={`${l.title}: ${pct}%`} />
          </View>
        );
      })}
      {p.days.length ? (
        <Section title="Last two weeks">
          <Days days={p.days} />
        </Section>
      ) : null}
      {p.strengths?.hasData ? (
        <>
          <Section title="Needs work">
            <Topics items={p.strengths.weakest} />
          </Section>
          <Section title="Strongest">
            <Topics items={p.strengths.strongest} />
          </Section>
        </>
      ) : p.study ? (
        <EmptyState title="Your topics show up soon" body="Answer a few practice questions and we will show where you are strong and what needs work." />
      ) : null}
    </>
  );
}

export function ProgressScreen() {
  const q = useProgress();
  return (
    <Screen testID="progress" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Stack.Screen options={{ title: "Progress" }} />
      <Loaded q={q} what="your progress" skeleton={<RowsSkeleton rows={5} />}>
        {(p) => <ProgressBody p={p} />}
      </Loaded>
    </Screen>
  );
}
