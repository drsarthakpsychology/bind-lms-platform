import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { CourseSummary } from "@/api/contract";
import { useCourses } from "@/api/queries";
import { EmptyState, Hero, Loaded, ProgressLine, Row, RowList, RowsSkeleton, Screen, Section, Skeleton } from "@/ds";
import { openTarget } from "@/nav/targets";
import { TabTop } from "@/nav/top";
import { space, useTheme } from "@/theme";

/** "Lecture 5 · Week 3" */
export function nextLine(n: NonNullable<CourseSummary["next"]>): string {
  const what = n.kind === "assignment" ? "Assignment" : n.number ? `Lecture ${n.number}` : "Lecture";
  return `${what} · Week ${n.week}`;
}

/** One Continue, then every course as a row with a thin progress line. */
export function LecturesBody({ courses }: { courses: CourseSummary[] }) {
  const c = useTheme();
  if (!courses.length) return <EmptyState title="No lectures yet" body="Your lectures appear here as soon as your cohort starts." />;
  const current = courses.find((x) => x.next) ?? null;
  return (
    <>
      {current?.next ? (
        <Hero
          context={nextLine(current.next)}
          title={current.next.title}
          meta={current.next.midway ? "You stopped part way through" : current.started ? undefined : "Start here"}
          action={{ label: current.next.midway ? "Continue watching" : current.next.kind === "assignment" ? "Open the assignment" : "Start watching", onPress: () => openTarget(current.next!.target), icon: <ArrowRight size={20} color={c.onPrimary} />, testID: "lectures-continue" }}
        />
      ) : null}
      <Section title={courses.length > 1 ? "Your courses" : "Your course"}>
        <RowList>
          {courses.map((x) => {
            const pct = x.totalLessons ? Math.round((x.completedCount / x.totalLessons) * 100) : 0;
            return (
              <Row
                key={x.id}
                testID={`course-row-${x.id}`}
                title={x.title}
                meta={`${x.completedCount} of ${x.totalLessons} lectures`}
                below={
                  <View style={{ paddingTop: space[2] }}>
                    <ProgressLine value={pct} height={4} label={`${pct}% of ${x.title}`} />
                  </View>
                }
                onPress={() => router.push(`/course/${encodeURIComponent(x.id)}`)}
              />
            );
          })}
        </RowList>
      </Section>
    </>
  );
}

function LecturesSkeleton() {
  return (
    <View style={{ gap: 32 }}>
      <View style={{ gap: space[3] }}>
        <Skeleton w="34%" h={14} />
        <Skeleton w="88%" h={30} />
        <Skeleton w="60%" h={30} />
        <Skeleton h={52} r={12} />
      </View>
      <RowsSkeleton rows={2} />
    </View>
  );
}

/** The Lectures screen, opened from Learn. */
export function LecturesScreen() {
  const q = useCourses();
  return (
    <Screen testID="lectures" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} what="your lectures" skeleton={<LecturesSkeleton />}>
        {(d) => <LecturesBody courses={d.courses} />}
      </Loaded>
    </Screen>
  );
}

/** The same, as the Lectures tab of a lectures-only account. */
export function LecturesTab() {
  const q = useCourses();
  return (
    <Screen tab top={<TabTop />} title="Lectures" testID="lectures-tab" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} what="your lectures" skeleton={<LecturesSkeleton />}>
        {(d) => <LecturesBody courses={d.courses} />}
      </Loaded>
    </Screen>
  );
}
