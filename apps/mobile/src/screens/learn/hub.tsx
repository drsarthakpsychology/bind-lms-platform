import { router } from "expo-router";
import { ArrowRight, CirclePlay, ClipboardList, LibraryBig, MessageCircleQuestion, Play } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { CourseSummary, CourseWeek } from "@/api/contract";
import { useAssignments } from "@/api/learn";
import { go } from "@/api/prefetch";
import { useCourse, useCourses, useMe, useStudyHome } from "@/api/queries";
import { Button, IconDot, Jyo, Label, Pebbles, QuietEmpty, Screen, Skeleton, Stone, T } from "@/ds";
import { toast } from "@/ds/toast";
import { Enter, ProgressRing, StaggerList } from "@/motion";
import { openTarget } from "@/nav/targets";
import { hasStudy, STUDY_MODULES } from "@/nav/study";
import { TabTop } from "@/nav/top";
import { layout, space, useTheme } from "@/theme";
import { dueWord } from "./assignments";
import { nextLine } from "./lectures";
import { Group, Pill, StateMark, Tile, TilesSkeleton } from "./parts";

/**
 * Learn, the tab. On the field: the title and where the course stands.
 * On the layer, top to bottom:
 *   1. Pick up: the lecture to carry on with (it grows into the lecture)
 *   2. This week: this week's lectures and what is due
 *   3. Three pebbles: Lectures, Hand-ins, Doubts
 *   4. A card to Study, where modules and notes live (when the account has them)
 */

/** "Pick up": the next lecture, with a ring for how much of the course is watched and the one lime play. */
function Resume({ course }: { course: CourseSummary }) {
  const c = useTheme();
  const n = course.next;
  if (!n) return null;
  const pct = course.totalLessons ? Math.round((course.completedCount / course.totalLessons) * 100) : 0;
  const meta = [nextLine(n), n.midway ? "You stopped part way" : null].filter(Boolean).join(" · ");
  return (
    <Group>
      <Label>{n.midway ? "Pick up where you stopped" : course.started ? "Next lecture" : "Start here"}</Label>
      <Stone testID="learn-resume" accessibilityLabel={`${n.midway ? "Continue" : "Open"}: ${n.title}. ${meta}`} grow={() => openTarget(n.target)}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
          <ProgressRing pct={pct} size={58} stroke={5} delay={200} color={c.dark ? c.lime : c.brand} track={c.hairline} label={`${pct}% of the lectures watched`}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
              <Play size={15} color={c.onLime} fill={c.onLime} />
            </View>
          </ProgressRing>
          <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
            <T v="h2">{n.title}</T>
            <T v="small" tone="muted" num>
              {meta}
            </T>
          </View>
        </View>
      </Stone>
    </Group>
  );
}

/** The week the cohort is in (or the first one with something left to watch). */
export function weekNow(weeks: CourseWeek[]): CourseWeek | null {
  return weeks.find((w) => w.isCurrent) ?? weeks.find((w) => !w.isFuture && w.done < w.total) ?? null;
}

function ThisWeek({ courseId }: { courseId: string }) {
  const q = useCourse(courseId);
  const assignments = useAssignments();
  const [now] = React.useState(() => Date.now());
  const all = () => go(`/course/${encodeURIComponent(courseId)}`);
  const head = (n?: number) => <Label action={<Button kind="text" small label="All lectures" onPress={all} testID="learn-week-all" />}>{n ? `This week · Week ${n}` : "This week"}</Label>;
  if (!q.data)
    return q.isError ? null : (
      <Group>
        {head()}
        <TilesSkeleton rows={2} />
      </Group>
    );
  const w = weekNow(q.data.weeks);
  if (!w) return null;
  const due = (assignments.data?.items ?? []).filter((a) => a.status === "not_started" && a.week === w.num);
  return (
    <Group>
      {head(w.num)}
      <StaggerList style={{ gap: space[2] }}>
        {w.lessons.slice(0, 4).map((l) => (
          <Tile
            key={l.id}
            testID={`learn-week-${l.id}`}
            title={l.title}
            meta={l.state === "done" ? "Watched" : l.state === "started" ? "Started" : l.state === "next" ? "Up next" : l.state === "live" ? "Opens soon" : l.state === "later" ? "Opens later" : `Lecture ${l.number}`}
            lead={<StateMark state={l.state === "done" ? "done" : l.openable ? "todo" : "locked"} n={l.number} />}
            quiet={!l.openable}
            plain={!l.openable}
            grow={l.openable ? () => go(`/lecture/${encodeURIComponent(l.id)}`) : undefined}
            onPress={l.openable ? undefined : () => toast.show(l.state === "live" ? "This lecture opens soon." : "This lecture opens in a later week.")}
          />
        ))}
        {due.map((a) => (
          <Tile key={a.id} testID={`learn-due-${a.id}`} icon={ClipboardList} title={a.title} meta="Assignment to hand in" below={dueWord(a.dueAt, now) ? <View style={{ paddingTop: space[1] }}><Pill tone="warm">{dueWord(a.dueAt, now)!}</Pill></View> : undefined} onPress={() => router.push(`/assignment/${encodeURIComponent(a.lessonId)}`)} />
        ))}
      </StaggerList>
    </Group>
  );
}

export function LearnHub() {
  const c = useTheme();
  const me = useMe();
  const can = me.data?.access.can;
  const lectures = can?.lectures !== false;
  const studyOn = hasStudy(me.data);
  const courses = useCourses();
  const study = useStudyHome(studyOn);
  const assignments = useAssignments();
  const toHandIn = (assignments.data?.items ?? []).filter((a) => a.status === "not_started").length;
  const list = courses.data?.courses ?? [];
  const course = list.find((x) => x.next) ?? list[0];
  const lead = course ? `${course.completedCount} of ${course.totalLessons} lectures watched` : undefined;
  const loading = lectures && !courses.data && !courses.isError;
  const failed = lectures && courses.isError && !courses.data;
  const nothing = !!courses.data && !list.length && (!studyOn || (!!study.data && !study.data.modules.length));
  const mods = study.data?.modules ?? [];
  const modsDone = mods.filter((m) => m.status.complete).length;

  return (
    <Screen tab area="learn" top={<TabTop />} title="Learn" lead={lead} testID="learn" gap={space[5]} onRefresh={() => void Promise.all([courses.refetch(), study.refetch(), assignments.refetch()])} refreshing={courses.isRefetching || assignments.isRefetching}>
      {loading ? (
        <View testID="learn-skeleton" style={{ gap: space[5] }}>
          <Skeleton w="34%" h={14} />
          <TilesSkeleton card rows={3} />
        </View>
      ) : null}
      {failed ? <QuietEmpty testID="load-error" title="Could not load your lectures" body="Check the internet and try again. What you opened before is still on this phone." action={{ label: "Try again", onPress: () => void courses.refetch() }} /> : null}
      {nothing ? <QuietEmpty testID="learn-empty" art={<Jyo pose="resting" size={64} />} title="Nothing to learn yet" body="Your lectures appear here as soon as your course starts." /> : null}
      {lectures && course?.next ? (
        <Enter i={0}>
          <Resume course={course} />
        </Enter>
      ) : null}
      {lectures && course ? (
        <Enter i={1}>
          <ThisWeek courseId={course.id} />
        </Enter>
      ) : null}
      {!loading && !nothing ? (
        <Enter i={2}>
          <Pebbles
            items={[
              ...(lectures ? [{ label: "Lectures", icon: CirclePlay, onPress: () => go("/lectures"), testID: "learn-lectures" }] : []),
              ...(lectures ? [{ label: toHandIn ? `Hand-ins · ${toHandIn}` : "Hand-ins", icon: ClipboardList, onPress: () => go("/assignments"), testID: "learn-assignments" }] : []),
              { label: "Doubts", icon: MessageCircleQuestion, onPress: () => go("/doubts"), testID: "learn-doubts" },
            ]}
          />
        </Enter>
      ) : null}
      {studyOn && !loading && !nothing ? (
        <Enter i={3}>
          <Group>
            <Label>Modules and notes</Label>
            <Stone quiet testID="learn-to-study" accessibilityLabel="Modules and revision notes are on the Study tab" onPress={() => router.push(STUDY_MODULES)}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
                <IconDot icon={LibraryBig} />
                <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
                  <T v="bodyStrong">On the Study tab</T>
                  <T v="small" tone="muted" num>
                    {mods.length ? `Modules · ${modsDone} of ${mods.length} done, and your notes` : "Your modules and revision notes"}
                  </T>
                </View>
                <ArrowRight size={18} color={c.faint} />
              </View>
            </Stone>
          </Group>
        </Enter>
      ) : null}
      <View style={{ height: layout.gutter - space[4] }} />
    </Screen>
  );
}
