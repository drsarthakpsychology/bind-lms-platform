import { Stack, router, useLocalSearchParams } from "expo-router";
import { FileText, NotebookPen, Play } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { CourseDetail, CourseLesson } from "@/api/contract";
import { go } from "@/api/prefetch";
import { useCourse } from "@/api/queries";
import { FieldProgress, Label, QuietEmpty, Screen, Stone, T, TabRow } from "@/ds";
import { toast } from "@/ds/toast";
import { Enter, StaggerList, Swap } from "@/motion";
import { useFocusedValue } from "@/nav/focused-value";
import { openTarget } from "@/nav/targets";
import { space, useTheme } from "@/theme";
import { nextLine } from "./lectures";
import { Fetched, Group, Pill, StateMark, Tile, TilesSkeleton } from "./parts";

type Tab = "lectures" | "materials" | "assignments";

const LESSON_WORD: Partial<Record<CourseLesson["state"], string>> = { done: "Watched", started: "Started", next: "Up next", live: "Opens soon", later: "Opens in a later week" };
const WEEK_WORD: Record<CourseDetail["weeks"][number]["status"], string> = { complete: "Done", "in-progress": "In progress", upcoming: "Coming up", "not-started": "" };

/** Every lecture of the course, grouped by week, each a stone with a mark for where it stands. */
export function WeekList({ course }: { course: CourseDetail }) {
  return (
    <>
      {course.weeks.map((w) => (
        <Group key={w.num}>
          <Label
            action={
              WEEK_WORD[w.status] ? (
                <T v="caption" tone="muted" num>
                  {w.total ? `${w.done} of ${w.total} · ` : ""}
                  {WEEK_WORD[w.status]}
                </T>
              ) : undefined
            }
          >
            {`Week ${w.num}${w.isCurrent ? " · This week" : ""}`}
          </Label>
          <StaggerList style={{ gap: space[2] }}>
            {w.lessons.map((l) => {
              const now = l.state === "started" || l.state === "next";
              return (
                <Tile
                  key={l.id}
                  testID={`lesson-${l.id}`}
                  title={l.title}
                  accessibilityLabel={`Lecture ${l.number}. ${l.title}. ${LESSON_WORD[l.state] ?? ""}`}
                  meta={LESSON_WORD[l.state] && !now ? LESSON_WORD[l.state] : `Lecture ${l.number}`}
                  lead={<StateMark state={l.state === "done" ? "done" : l.openable ? "todo" : "locked"} n={l.number} />}
                  trailing={now ? <Pill tone="ink">{l.state === "started" ? "Started" : "Next"}</Pill> : undefined}
                  quiet={!l.openable}
                  plain
                  grow={l.openable ? () => go(`/lecture/${encodeURIComponent(l.id)}`) : undefined}
                  onPress={l.openable ? undefined : () => toast.show(l.state === "live" ? "This lecture opens soon." : "This lecture opens in a later week.")}
                />
              );
            })}
          </StaggerList>
        </Group>
      ))}
    </>
  );
}

/** On the field: how much of the course is watched. The bar fills in view on the way back from a lecture. */
function CourseField({ course }: { course: CourseDetail }) {
  const done = useFocusedValue(course.completedCount);
  return <FieldProgress done={done} total={Math.max(1, course.totalLessons)} label={`${done} of ${course.totalLessons} watched`} />;
}

export function CourseBody({ course }: { course: CourseDetail }) {
  const c = useTheme();
  const [tab, setTab] = React.useState<Tab>("lectures");
  const [dir, setDir] = React.useState<1 | -1>(1);
  const materials = course.weeks.flatMap((w) => w.materials.map((m) => ({ ...m, week: w.num })));
  const assignments = course.weeks.flatMap((w) => w.assignments.map((a) => ({ ...a, week: w.num })));
  const tabs: { id: Tab; name: string }[] = [{ id: "lectures", name: "Lectures" }];
  if (materials.length) tabs.push({ id: "materials", name: `Materials · ${materials.length}` });
  if (assignments.length) tabs.push({ id: "assignments", name: `Assignments · ${assignments.length}` });
  const n = course.next;

  return (
    <>
      {n ? (
        <Enter i={0}>
          <Group>
            <Label>{n.midway ? "Continue watching" : course.started ? "Watch next" : "Start here"}</Label>
            <Stone testID="course-continue" accessibilityLabel={`${n.midway ? "Continue watching" : "Start"}: ${n.title}. ${nextLine(n)}`} grow={() => openTarget(n.target)}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
                  <Play size={20} color={c.onLime} fill={c.onLime} />
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                  <T v="h2">{n.title}</T>
                  <T v="small" tone="muted" num>
                    {nextLine(n)}
                  </T>
                </View>
              </View>
            </Stone>
          </Group>
        </Enter>
      ) : null}
      {tabs.length > 1 ? (
        <TabRow
          tabs={tabs}
          value={tab}
          onChange={(t) => {
            setDir(tabs.findIndex((x) => x.id === t) >= tabs.findIndex((x) => x.id === tab) ? 1 : -1);
            setTab(t);
          }}
        />
      ) : null}
      {course.empty ? <QuietEmpty title="No lectures yet" body="Lectures appear here week by week." /> : null}
      <Swap k={tab} dir={dir} style={{ gap: space[5] }} testID="course-tab-body">
        {tab === "lectures" ? <WeekList course={course} /> : null}
        {tab === "materials" ? (
          <StaggerList style={{ gap: space[2] }}>
            {materials.map((m) => (
              <Tile key={m.id} testID={`course-material-${m.id}`} icon={FileText} title={m.title} meta={`Week ${m.week} · ${m.meta}`} dim={!m.openable} onPress={m.openable ? () => openTarget({ screen: "material", courseId: course.id, materialId: m.id, web: "/" }) : () => toast.show("This opens with its lecture.")} />
            ))}
          </StaggerList>
        ) : null}
        {tab === "assignments" ? (
          <StaggerList style={{ gap: space[2] }}>
            {assignments.map((a) => (
              <Tile
                key={a.id}
                testID={`course-assignment-${a.id}`}
                icon={NotebookPen}
                title={a.title}
                meta={`Week ${a.week} · ${a.lessonTitle}`}
                trailing={a.status === "graded" ? <Pill>Marked</Pill> : a.status === "submitted" ? <Pill>Handed in</Pill> : a.isNext ? <Pill tone="ink">To do</Pill> : undefined}
                dim={!(a.lessonId && a.openable)}
                onPress={a.lessonId && a.openable ? () => router.push(`/assignment/${encodeURIComponent(a.lessonId!)}`) : () => toast.show("This opens with its lecture.")}
              />
            ))}
          </StaggerList>
        ) : null}
      </Swap>
    </>
  );
}

export function CourseScreen() {
  const { courseId = "" } = useLocalSearchParams<{ courseId: string }>();
  const q = useCourse(String(courseId));
  const d = q.data;
  return (
    <Screen testID="course" title={d?.title} lead={d?.myCohorts[0]?.name} field={d && d.totalLessons ? <CourseField course={d} /> : undefined} gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Stack.Screen options={{ title: "" }} />
      <Fetched q={q} what="this course" skeleton={<TilesSkeleton card rows={5} />}>
        {(x) => <CourseBody course={x} />}
      </Fetched>
    </Screen>
  );
}
