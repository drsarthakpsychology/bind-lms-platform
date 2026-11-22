import { router } from "expo-router";
import { Bookmark, BookOpen, CirclePlay, ClipboardList, Layers, Map as MapIcon, MessageCircleQuestion, NotebookText, Play } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { CourseSummary, CourseWeek, StudyHome } from "@/api/contract";
import { useAssignments, useNotes } from "@/api/learn";
import { go } from "@/api/prefetch";
import { useCourse, useCourses, useMe, useStudyHome } from "@/api/queries";
import { Button, IconDot, Jyo, Label, Pebbles, QuietEmpty, Screen, Skeleton, Stone, T } from "@/ds";
import { toast } from "@/ds/toast";
import { Enter, Press, ProgressRing, StaggerList } from "@/motion";
import { openTarget } from "@/nav/targets";
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
 *   3. Four pebbles: Lectures, Modules, Hand-ins, Doubts
 *   4. Modules: the reading you are on, with how far through
 *   5. Also here: Your map, Saved, Notes, Quick reference
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

/** The reading you are on: a ring for the module, the next step in words. */
function ModulesCard({ d }: { d: StudyHome }) {
  const c = useTheme();
  const done = d.modules.filter((m) => m.status.complete).length;
  const id = "moduleId" in d.next ? d.next.moduleId : null;
  const mod = d.modules.find((m) => m.id === id) ?? d.modules.find((m) => !m.status.complete) ?? d.modules[0];
  if (!mod) return null;
  const allDone = d.next.kind === "done";
  return (
    <Group>
      <Label action={<Button kind="text" small label="All modules" onPress={() => go("/study")} testID="learn-study" />}>{`Modules · ${done} of ${d.modules.length} complete`}</Label>
      <Stone testID="learn-module" accessibilityLabel={allDone ? "Every module done. Open modules" : `${d.next.label}. Module ${mod.num}, ${mod.status.pct}% done`} onPress={() => (allDone ? go("/study") : openTarget(d.next.target))}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
          <ProgressRing pct={allDone ? 100 : mod.status.pct} size={58} stroke={5} delay={260} color={c.dark ? c.lime : c.brand} track={c.hairline}>
            <BookOpen size={20} color={c.ink} strokeWidth={1.9} />
          </ProgressRing>
          <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
            <T v="h3">{allDone ? "Every module done" : d.next.label}</T>
            <T v="small" tone="muted" num>
              {allDone ? "Re-tests show here when they are due" : `Module ${mod.num} · ${mod.title}`}
            </T>
          </View>
        </View>
      </Stone>
    </Group>
  );
}

/** A small square stone for the two-by-two grid at the end. */
function Square({ title, meta, icon, onPress, testID }: { title: string; meta: string; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; onPress: () => void; testID: string }) {
  const c = useTheme();
  return (
    <Press testID={testID} accessibilityRole="button" accessibilityLabel={`${title}. ${meta}`} onPress={onPress} scale={0.97} style={{ flexBasis: "47%", flexGrow: 1 }} innerStyle={{ backgroundColor: c.card, borderRadius: 22, padding: space[3] + 2, gap: space[2], minHeight: 112 }}>
      <IconDot icon={icon} />
      <View style={{ gap: 1 }}>
        <T v="bodyStrong">{title}</T>
        <T v="small" tone="muted" num>
          {meta}
        </T>
      </View>
    </Press>
  );
}

export function LearnHub() {
  const me = useMe();
  const can = me.data?.access.can;
  const lectures = can?.lectures !== false;
  const studyOn = can?.study !== false && !me.data?.access.lecturesOnly;
  const courses = useCourses();
  const study = useStudyHome(studyOn);
  const notes = useNotes(studyOn);
  const assignments = useAssignments();
  const toHandIn = (assignments.data?.items ?? []).filter((a) => a.status === "not_started").length;
  const notesRead = (notes.data?.notes ?? []).filter((n) => n.readOn).length;
  const list = courses.data?.courses ?? [];
  const course = list.find((x) => x.next) ?? list[0];
  const lead = course ? `${course.completedCount} of ${course.totalLessons} lectures watched` : undefined;
  const loading = lectures && !courses.data && !courses.isError;
  const failed = lectures && courses.isError && !courses.data;
  const nothing = !!courses.data && !list.length && (!studyOn || (!!study.data && !study.data.modules.length));

  return (
    <Screen tab area="learn" top={<TabTop />} title="Learn" lead={lead} testID="learn" gap={space[5]} onRefresh={() => void Promise.all([courses.refetch(), study.refetch(), notes.refetch(), assignments.refetch()])} refreshing={courses.isRefetching || study.isRefetching}>
      {loading ? (
        <View testID="learn-skeleton" style={{ gap: space[5] }}>
          <Skeleton w="34%" h={14} />
          <TilesSkeleton card rows={3} />
        </View>
      ) : null}
      {failed ? <QuietEmpty testID="load-error" title="Could not load your lectures" body="Check the internet and try again. What you opened before is still on this phone." action={{ label: "Try again", onPress: () => void courses.refetch() }} /> : null}
      {nothing ? <QuietEmpty testID="learn-empty" art={<Jyo pose="resting" size={64} />} title="Nothing to learn yet" body="Your lectures and modules appear here as soon as your course starts." /> : null}
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
              ...(studyOn ? [{ label: "Modules", icon: BookOpen, onPress: () => go("/study"), testID: "learn-modules" }] : []),
              ...(lectures ? [{ label: toHandIn ? `Hand-ins · ${toHandIn}` : "Hand-ins", icon: ClipboardList, onPress: () => go("/assignments"), testID: "learn-assignments" }] : []),
              { label: "Doubts", icon: MessageCircleQuestion, onPress: () => go("/doubts"), testID: "learn-doubts" },
            ]}
          />
        </Enter>
      ) : null}
      {studyOn && study.data?.modules.length ? (
        <Enter i={3}>
          <ModulesCard d={study.data} />
        </Enter>
      ) : null}
      {studyOn && !loading ? (
        <Enter i={4}>
          <Group>
            <Label>Also here</Label>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
              <Square testID="learn-map" title="Your map" meta="How well you know each topic" icon={MapIcon} onPress={() => router.push("/map")} />
              <Square testID="learn-saved" title="Saved" meta="Bookmarks and your notes" icon={Bookmark} onPress={() => router.push("/saved")} />
              <Square testID="learn-notes" title="Revision notes" meta={notes.data?.notes.length ? `${notesRead} of ${notes.data.notes.length} read` : "One page per topic"} icon={NotebookText} onPress={() => go("/notes")} />
              <Square testID="learn-reference" title="Quick reference" meta="Terms, A to Z" icon={Layers} onPress={() => go("/reference")} />
            </View>
          </Group>
        </Enter>
      ) : null}
      <View style={{ height: layout.gutter - space[4] }} />
    </Screen>
  );
}
