import { ArrowRight } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { CourseSummary } from "@/api/contract";
import { useCourse, useCourses } from "@/api/queries";
import { EmptyState, Hero, Loaded, ProgressLine, Row, RowList, RowsSkeleton, Screen, Section, Skeleton, T } from "@/ds";
import { Enter } from "@/motion";
import { useFocusedValue } from "@/nav/focused-value";
import { openTarget } from "@/nav/targets";
import { TabTop } from "@/nav/top";
import { layout, space, useTheme } from "@/theme";
import { WeekList } from "./course";
import { go } from "@/api/prefetch";

/** "Lecture 5 · Week 3" */
export function nextLine(n: NonNullable<CourseSummary["next"]>): string {
  const what = n.kind === "assignment" ? "Assignment" : n.number ? `Lecture ${n.number}` : "Lecture";
  return `${what} · Week ${n.week}`;
}

/** A course row's line: it fills when the student comes back to this list (after marking a lecture watched). */
function CourseLine({ pct, title }: { pct: number; title: string }) {
  const shown = useFocusedValue(pct);
  return <ProgressLine value={shown} height={4} label={`${shown}% of ${title}`} />;
}

/** One Continue, then every course as a row with a thin progress line. */
export function LecturesBody({ courses }: { courses: CourseSummary[] }) {
  const c = useTheme();
  if (!courses.length) return <EmptyState title="No lectures yet" body="Your lectures appear here as soon as your cohort starts." />;
  const current = courses.find((x) => x.next) ?? null;
  return (
    <>
      {current?.next ? (
        <Enter i={0}>
          <Hero
            context={nextLine(current.next)}
            title={current.next.title}
            meta={current.next.midway ? "You stopped part way through" : current.started ? undefined : "Start here"}
            action={{
              label: current.next.midway ? "Continue watching" : current.next.kind === "assignment" ? "Open the assignment" : "Start watching",
              onPress: () => openTarget(current.next!.target),
              icon: <ArrowRight size={20} color={c.onPrimary} />,
              testID: "lectures-continue",
            }}
          />
        </Enter>
      ) : null}
      <Enter i={1}>
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
                      <CourseLine pct={pct} title={x.title} />
                    </View>
                  }
                  onPress={() => go(`/course/${encodeURIComponent(x.id)}`)}
                />
              );
            })}
          </RowList>
        </Section>
      </Enter>
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

/** One course's weeks, loaded on their own. The title shows only when there is more than one course. */
function CourseWeeks({ summary, titled }: { summary: CourseSummary; titled: boolean }) {
  const q = useCourse(summary.id);
  const pct = summary.totalLessons ? Math.round((summary.completedCount / summary.totalLessons) * 100) : 0;
  return (
    <View style={{ gap: layout.section }}>
      <View style={{ gap: space[2] }}>
        {titled ? <T v="h2">{summary.title}</T> : null}
        <T v="small" tone="muted" num>
          {summary.completedCount} of {summary.totalLessons} lectures watched
        </T>
        <ProgressLine value={pct} height={4} label={`${pct}% watched`} />
      </View>
      <Loaded q={q} what="your lectures" skeleton={<RowsSkeleton rows={5} />}>
        {(d) => (d.empty ? <EmptyState title="No lectures yet" body="Lectures appear here week by week." /> : <WeekList course={d} />)}
      </Loaded>
    </View>
  );
}

/**
 * The Lectures tab of a lectures-only account: Home already carries the one
 * Continue, so this is the full list, grouped by week (no second hero).
 */
export function LecturesTab() {
  const q = useCourses();
  return (
    <Screen tab top={<TabTop />} title="Lectures" testID="lectures-tab" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} what="your lectures" skeleton={<RowsSkeleton rows={6} />}>
        {(d) =>
          d.courses.length ? (
            <View style={{ gap: layout.section }}>
              {d.courses.map((x) => (
                <CourseWeeks key={x.id} summary={x} titled={d.courses.length > 1} />
              ))}
            </View>
          ) : (
            <EmptyState title="No lectures yet" body="Your lectures appear here as soon as your cohort starts." />
          )
        }
      </Loaded>
    </Screen>
  );
}
