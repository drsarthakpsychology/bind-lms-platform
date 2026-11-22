import { Stack } from "expo-router";
import { Play } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { CourseSummary } from "@/api/contract";
import { go } from "@/api/prefetch";
import { useCourse, useCourses } from "@/api/queries";
import { Jyo, Label, ProgressLine, QuietEmpty, Screen, Stone, T } from "@/ds";
import { Enter, StaggerList } from "@/motion";
import { useFocusedValue } from "@/nav/focused-value";
import { openTarget } from "@/nav/targets";
import { TabTop } from "@/nav/top";
import { space, useTheme } from "@/theme";
import { WeekList } from "./course";
import { Fetched, Group, TilesSkeleton } from "./parts";

/** "Lecture 5 · Week 3" */
export function nextLine(n: NonNullable<CourseSummary["next"]>): string {
  const what = n.kind === "assignment" ? "Assignment" : n.number ? `Lecture ${n.number}` : "Lecture";
  return `${what} · Week ${n.week}`;
}

/** A course card's line: it fills when the student comes back to this list (after marking a lecture watched). */
function CourseLine({ pct, title }: { pct: number; title: string }) {
  const shown = useFocusedValue(pct);
  return <ProgressLine value={shown} height={6} label={`${shown}% of ${title}`} />;
}

const NoLectures = () => <QuietEmpty testID="lectures-empty" art={<Jyo pose="resting" size={64} />} title="No lectures yet" body="Your lectures appear here as soon as your cohort starts." />;

/** The lecture to carry on with: a stone that grows into the lecture, with the one lime play. */
export function ContinueCard({ course, testID = "lectures-continue" }: { course: CourseSummary; testID?: string }) {
  const c = useTheme();
  const n = course.next;
  if (!n) return null;
  const word = n.midway ? "Continue watching" : n.kind === "assignment" ? "Open the assignment" : course.started ? "Watch next" : "Start here";
  return (
    <Group>
      <Label>{word}</Label>
      <Stone testID={testID} accessibilityLabel={`${word}: ${n.title}. ${nextLine(n)}`} grow={() => openTarget(n.target)}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
            <Play size={20} color={c.onLime} fill={c.onLime} />
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
            <T v="h2">{n.title}</T>
            <T v="small" tone="muted" num>
              {[nextLine(n), n.midway ? "You stopped part way" : null].filter(Boolean).join(" · ")}
            </T>
          </View>
        </View>
      </Stone>
    </Group>
  );
}

/** One Continue, then every course as a card with its progress line. */
export function LecturesBody({ courses }: { courses: CourseSummary[] }) {
  if (!courses.length) return <NoLectures />;
  const current = courses.find((x) => x.next) ?? null;
  return (
    <>
      {current?.next ? (
        <Enter i={0}>
          <ContinueCard course={current} />
        </Enter>
      ) : null}
      <Enter i={1}>
        <Group>
          <Label>{courses.length > 1 ? "Your courses" : "Your course"}</Label>
          <StaggerList style={{ gap: space[2] }}>
            {courses.map((x) => {
              const pct = x.totalLessons ? Math.round((x.completedCount / x.totalLessons) * 100) : 0;
              return (
                <Stone key={x.id} testID={`course-row-${x.id}`} accessibilityLabel={`${x.title}. ${x.completedCount} of ${x.totalLessons} lectures watched`} grow={() => go(`/course/${encodeURIComponent(x.id)}`)}>
                  <View style={{ gap: space[3] }}>
                    <View style={{ gap: 2 }}>
                      <T v="h3">{x.title}</T>
                      <T v="small" tone="muted" num>
                        {x.completedCount} of {x.totalLessons} lectures watched
                      </T>
                    </View>
                    <CourseLine pct={pct} title={x.title} />
                  </View>
                </Stone>
              );
            })}
          </StaggerList>
        </Group>
      </Enter>
    </>
  );
}

function leadOf(courses: CourseSummary[] | undefined): string | undefined {
  if (!courses?.length) return undefined;
  const done = courses.reduce((n, x) => n + x.completedCount, 0);
  const total = courses.reduce((n, x) => n + x.totalLessons, 0);
  return `${done} of ${total} watched`;
}

/** The Lectures screen, opened from Learn. */
export function LecturesScreen() {
  const q = useCourses();
  return (
    <Screen testID="lectures" title="Lectures" lead={leadOf(q.data?.courses)} gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Stack.Screen options={{ title: "" }} />
      <Fetched q={q} what="your lectures" skeleton={<TilesSkeleton card rows={2} />}>
        {(d) => <LecturesBody courses={d.courses} />}
      </Fetched>
    </Screen>
  );
}

/** One course's weeks, loaded on their own. The title shows only when there is more than one course. */
function CourseWeeks({ summary, titled }: { summary: CourseSummary; titled: boolean }) {
  const q = useCourse(summary.id);
  return (
    <View style={{ gap: space[5] }}>
      {titled ? <T v="h2">{summary.title}</T> : null}
      <Fetched q={q} what="your lectures" skeleton={<TilesSkeleton rows={5} />}>
        {(d) => (d.empty ? <QuietEmpty title="No lectures yet" body="Lectures appear here week by week." /> : <WeekList course={d} />)}
      </Fetched>
    </View>
  );
}

/**
 * The Lectures tab of a lectures-only account: Home already carries the one
 * Continue, so this is the full list, grouped by week.
 */
export function LecturesTab() {
  const q = useCourses();
  return (
    <Screen tab top={<TabTop />} title="Lectures" lead={leadOf(q.data?.courses)} testID="lectures-tab" gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Fetched q={q} what="your lectures" skeleton={<TilesSkeleton rows={6} />}>
        {(d) =>
          d.courses.length ? (
            <View style={{ gap: space[6] }}>
              {d.courses.map((x) => (
                <CourseWeeks key={x.id} summary={x} titled={d.courses.length > 1} />
              ))}
            </View>
          ) : (
            <NoLectures />
          )
        }
      </Fetched>
    </Screen>
  );
}
