import { Stack, router, useLocalSearchParams } from "expo-router";
import { ArrowRight, Check, FileText, Lock, NotebookPen } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { CourseDetail, CourseLesson } from "@/api/contract";
import { useCourse } from "@/api/queries";
import { Button, EmptyState, Loaded, ProgressLine, Row, RowList, RowsSkeleton, Screen, Section, T, TabRow } from "@/ds";
import { toast } from "@/ds/toast";
import { openTarget } from "@/nav/targets";
import { space, useTheme } from "@/theme";
import { nextLine } from "./lectures";

type Tab = "lectures" | "materials" | "assignments";

function LessonMark({ l }: { l: CourseLesson }) {
  const c = useTheme();
  if (l.state === "done") return <Check size={20} color={c.ink} accessibilityLabel="Watched" />;
  if (l.state === "later") return <Lock size={18} color={c.muted} accessibilityLabel="Opens later" />;
  const word = l.state === "started" ? "Started" : l.state === "next" ? "Next" : l.state === "live" ? "Opens soon" : null;
  return word ? (
    <T v="small" tone={l.state === "next" || l.state === "started" ? "link" : "muted"}>
      {word}
    </T>
  ) : null;
}

const WEEK_WORD: Record<CourseDetail["weeks"][number]["status"], string> = { complete: "Done", "in-progress": "In progress", upcoming: "Coming up", "not-started": "" };

/** Every lecture of the course, grouped by week, with a mark for where each one stands. */
export function WeekList({ course }: { course: CourseDetail }) {
  return (
    <>
      {course.weeks.map((w) => (
        <Section key={w.num} title={`Week ${w.num}${w.isCurrent ? " · This week" : ""}`} action={WEEK_WORD[w.status] ? <T v="small" tone="muted">{WEEK_WORD[w.status]}</T> : undefined}>
          <RowList>
            {w.lessons.map((l) => (
              <Row
                key={l.id}
                testID={`lesson-${l.id}`}
                title={`${l.number}. ${l.title}`}
                current={l.state === "started" || l.state === "next"}
                trailing={<LessonMark l={l} />}
                chevron={false}
                onPress={l.openable ? () => router.push(`/lecture/${encodeURIComponent(l.id)}`) : () => toast.show(l.state === "live" ? "This lecture opens soon." : "This lecture opens in a later week.")}
              />
            ))}
          </RowList>
        </Section>
      ))}
    </>
  );
}

export function CourseBody({ course }: { course: CourseDetail }) {
  const c = useTheme();
  const [tab, setTab] = React.useState<Tab>("lectures");
  const pct = course.totalLessons ? Math.round((course.completedCount / course.totalLessons) * 100) : 0;
  const materials = course.weeks.flatMap((w) => w.materials.map((m) => ({ ...m, week: w.num })));
  const assignments = course.weeks.flatMap((w) => w.assignments.map((a) => ({ ...a, week: w.num })));
  const tabs: { id: Tab; name: string }[] = [{ id: "lectures", name: "Lectures" }];
  if (materials.length) tabs.push({ id: "materials", name: "Materials" });
  if (assignments.length) tabs.push({ id: "assignments", name: "Assignments" });

  return (
    <>
      <View style={{ gap: space[3] }}>
        <T v="h1">{course.title}</T>
        <T v="small" tone="muted" num>
          {course.completedCount} of {course.totalLessons} lectures watched{course.myCohorts[0] ? ` · ${course.myCohorts[0].name}` : ""}
        </T>
        <ProgressLine value={pct} label={`${pct}% watched`} />
      </View>
      {course.next ? (
        <View style={{ gap: space[3] }}>
          <View style={{ gap: space[1] }}>
            <T v="small" tone="muted">
              {nextLine(course.next)}
            </T>
            <T v="h3">{course.next.title}</T>
          </View>
          <Button label={course.next.midway ? "Continue watching" : "Start"} icon={<ArrowRight size={20} color={c.onPrimary} />} onPress={() => openTarget(course.next!.target)} testID="course-continue" />
        </View>
      ) : null}
      <View style={{ gap: space[5] }}>
        {tabs.length > 1 ? <TabRow tabs={tabs} value={tab} onChange={setTab} /> : null}
        {course.empty ? <EmptyState title="No lectures yet" body="Lectures appear here week by week." /> : null}
        {tab === "lectures" ? <WeekList course={course} /> : null}
        {tab === "materials" ? (
          <RowList>
            {materials.map((m) => (
              <Row key={m.id} title={m.title} meta={`Week ${m.week} · ${m.meta}`} icon={<FileText size={20} color={c.muted} />} onPress={m.openable ? () => openTarget({ screen: "material", courseId: course.id, materialId: m.id, web: "/" }) : undefined} />
            ))}
          </RowList>
        ) : null}
        {tab === "assignments" ? (
          <RowList>
            {assignments.map((a) => (
              <Row
                key={a.id}
                title={a.title}
                meta={`Week ${a.week} · ${a.lessonTitle}`}
                icon={<NotebookPen size={20} color={c.muted} />}
                trailing={a.status === "graded" ? "Marked" : a.status === "submitted" ? "Handed in" : a.isNext ? "To do" : undefined}
                onPress={a.lessonId && a.openable ? () => router.push(`/lecture/${encodeURIComponent(a.lessonId!)}?tab=assignment`) : undefined}
              />
            ))}
          </RowList>
        ) : null}
      </View>
    </>
  );
}

export function CourseScreen() {
  const { courseId = "" } = useLocalSearchParams<{ courseId: string }>();
  const q = useCourse(String(courseId));
  return (
    <Screen testID="course" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Stack.Screen options={{ title: "" }} />
      <Loaded q={q} what="this course" skeleton={<RowsSkeleton rows={6} />}>
        {(d) => <CourseBody course={d} />}
      </Loaded>
    </Screen>
  );
}
