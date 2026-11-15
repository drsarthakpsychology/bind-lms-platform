import { router } from "expo-router";
import { Bookmark, BookOpen, CirclePlay, ClipboardList, Layers, NotebookText } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { useAssignments, useNotes } from "@/api/learn";
import { useCourses, useMe, useStudyHome } from "@/api/queries";
import { ProgressLine, Row, RowList, Screen, Section } from "@/ds";
import { TabTop } from "@/nav/top";
import { space, useTheme } from "@/theme";

/**
 * Learn: the hub for Lectures and Study. A title, then one group of rows per
 * kind of learning (the website's LEARN_GROUPS: Lectures, Modules, Notes,
 * Quick reference), plus Assignments and Saved. Each row says where you are.
 */
export function LearnHub() {
  const c = useTheme();
  const me = useMe();
  const can = me.data?.access.can;
  const courses = useCourses();
  const study = useStudyHome();
  const notes = useNotes(can?.study !== false && !me.data?.access.lecturesOnly);
  const assignments = useAssignments();
  const toHandIn = (assignments.data?.items ?? []).filter((a) => a.status === "not_started").length;
  const notesRead = (notes.data?.notes ?? []).filter((n) => n.readOn).length;
  const course = courses.data?.courses[0];
  const lecturePct = course && course.totalLessons ? Math.round((course.completedCount / course.totalLessons) * 100) : null;
  const modules = study.data?.modules ?? [];
  const modsDone = modules.filter((m) => m.status.complete).length;
  const icon = { size: 20, color: c.muted };

  return (
    <Screen tab top={<TabTop />} title="Learn" testID="learn" onRefresh={() => void Promise.all([courses.refetch(), study.refetch(), notes.refetch(), assignments.refetch()])} refreshing={courses.isRefetching || study.isRefetching}>
      {can?.lectures !== false ? (
        <Section title="Classes">
          <RowList>
            <Row
              testID="learn-lectures"
              title="Lectures"
              meta={course ? `${course.completedCount} of ${course.totalLessons} watched${course.next ? ` · Next: ${course.next.title}` : ""}` : "Your recorded classes"}
              icon={<CirclePlay {...icon} />}
              below={
                lecturePct !== null ? (
                  <View style={{ paddingTop: space[2] }}>
                    <ProgressLine value={lecturePct} height={4} label={`${lecturePct}% of lectures watched`} />
                  </View>
                ) : undefined
              }
              onPress={() => router.push("/lectures")}
            />
            {assignments.data?.items.length ? (
              <Row testID="learn-assignments" title="Assignments" meta={toHandIn ? `${toHandIn} to hand in` : "All handed in"} icon={<ClipboardList {...icon} />} onPress={() => router.push("/assignments")} />
            ) : null}
          </RowList>
        </Section>
      ) : null}
      {can?.study !== false ? (
        <Section title="Study">
          <RowList>
            <Row testID="learn-study" title="Modules" meta={modules.length ? `${modsDone} of ${modules.length} complete${study.data?.next && study.data.next.kind !== "done" ? ` · Next: ${study.data.next.label}` : ""}` : "Reading, checkpoints and module tests"} icon={<BookOpen {...icon} />} onPress={() => router.push("/study")} />
            <Row testID="learn-notes" title="Notes" meta={notes.data?.notes.length ? `${notesRead} of ${notes.data.notes.length} read` : "One page on each topic"} icon={<NotebookText {...icon} />} onPress={() => router.push("/notes")} />
            <Row testID="learn-reference" title="Quick reference" meta="Disorders, medicines and terms, A to Z" icon={<Layers {...icon} />} onPress={() => router.push("/reference")} />
            <Row testID="learn-saved" title="Saved" meta="Your bookmarks and notes" icon={<Bookmark {...icon} />} onPress={() => router.push("/saved")} />
          </RowList>
        </Section>
      ) : null}
    </Screen>
  );
}
