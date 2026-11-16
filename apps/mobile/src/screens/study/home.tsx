import { ArrowRight, Check } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { ModuleSummary, StudyHome } from "@/api/contract";
import { useStudyHome } from "@/api/queries";
import { EmptyState, Hero, Loaded, ProgressLine, Row, RowList, RowsSkeleton, Screen, Section, T } from "@/ds";
import { Enter, Stamp } from "@/motion";
import { go } from "@/api/prefetch";
import { openTarget } from "@/nav/targets";
import { streakLine } from "@/screens/home/home";
import { space, useTheme } from "@/theme";

export function moduleMeta(m: ModuleSummary): string {
  if (m.status.complete) return `Complete${m.status.best !== null && m.status.total ? ` · Test ${m.status.best} of ${m.status.total}` : ""}`;
  if (m.status.readDone) return `${m.status.readDone} of ${m.status.readTotal} sections read · ${m.when}`;
  return `${m.when} · About ${Math.round(m.minutes / 5) * 5} min`;
}

export function StudyHomeBody({ d }: { d: StudyHome }) {
  const c = useTheme();
  const now = d.modules.filter((m) => !m.status.complete && m.status.readDone > 0);
  const later = d.modules.filter((m) => !m.status.complete && m.status.readDone === 0);
  const done = d.modules.filter((m) => m.status.complete);
  const shelf = (title: string, items: ModuleSummary[]) =>
    items.length ? (
      <Section title={title}>
        <RowList>
          {items.map((m) => (
            <Row
              key={m.id}
              testID={`module-${m.id}`}
              title={`${m.num}. ${m.title}`}
              meta={moduleMeta(m)}
              trailing={m.status.complete ? <Check size={20} color={c.ink} /> : undefined}
              below={
                !m.status.complete && m.status.pct > 0 ? (
                  <View style={{ paddingTop: space[2] }}>
                    <ProgressLine value={m.status.pct} height={4} label={`${m.status.pct}% of ${m.title}`} />
                  </View>
                ) : undefined
              }
              onPress={() => go(`/study/${encodeURIComponent(m.id)}`)}
            />
          ))}
        </RowList>
      </Section>
    ) : null;
  if (!d.modules.length) return <EmptyState mood="soon" title="Modules open soon" body="Your first module opens here when your course starts." testID="study-empty" />;
  return (
    <>
      {d.next.kind !== "done" ? (
        <Enter i={0}>
          <Hero context="Next in Study" title={d.next.label} action={{ label: d.next.kind === "test" || d.next.kind === "retest" ? "Take the test" : "Carry on", onPress: () => openTarget(d.next.target), icon: <ArrowRight size={20} color={c.onPrimary} />, testID: "study-continue" }} />
        </Enter>
      ) : (
        <View style={{ gap: space[2] }}>
          <Stamp rotate={-2}>
            <T v="h1">Every module done</T>
          </Stamp>
          <T tone="muted">Re-tests appear here when they are due.</T>
        </View>
      )}
      <T v="small" tone="muted" num>
        {d.goal.points} of {d.goal.goal} points today · {streakLine(d.goal.streak)}
      </T>
      {shelf("Reading now", now)}
      {shelf("Coming up", later)}
      {shelf("Done", done)}
    </>
  );
}

/** Study: one Continue, then the modules on three shelves as rows. */
export function StudyHomeScreen() {
  const q = useStudyHome();
  return (
    <Screen testID="study" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} what="your modules" skeleton={<RowsSkeleton rows={5} />}>
        {(d) => <StudyHomeBody d={d} />}
      </Loaded>
    </Screen>
  );
}
