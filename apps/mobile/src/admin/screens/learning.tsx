import { router, useLocalSearchParams } from "expo-router";
import { FileCheck, MessageCircleQuestion, Trophy, Video } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, IconDot, Row, RowsSkeleton, T } from "@/ds";
import { config } from "@/lib/config";
import { openLink } from "@/lib/open";
import { space } from "@/theme";
import { ago, plural } from "../format";
import { FilterChips, Loaded, Quiet, SearchBox, Status } from "../kit";
import { useLearner, useLearning, sortLearners, type Learner, type LearnerRow, type LearnSort, type Learning } from "../live";
import { openStudent } from "../nav";
import { EmptyState, Group, Panel, Screen, ShareBar, Tiles } from "../ui";

/**
 * Learning: every student's study in one list, from the website's own data
 * (lectures watched, modules read, checkpoint and practice scores, weak
 * topics, last active). Search, a cohort, and three orders. A row opens that
 * student's full learning record. The Class view is the whole group at once.
 */

const SORTS: { id: LearnSort; name: string }[] = [
  { id: "behind", name: "Behind first" },
  { id: "active", name: "Most active" },
  { id: "name", name: "Name" },
];
const PAGE = 40;

/** One line under a student's name: what they have done, in plain words. */
export function learnerLine(r: LearnerRow): string {
  const parts = [
    r.lecturesAvailable ? `${r.lecturesDone} of ${r.lecturesAvailable} lectures` : "No lectures open",
    r.modulesTotal ? `${r.modulesDone} of ${r.modulesTotal} modules` : null,
    r.avgTestPct !== null ? `tests ${r.avgTestPct}%` : null,
  ].filter(Boolean);
  return `${parts.join(" · ")}\n${r.lastActive ? `Last active ${ago(r.lastActive).toLowerCase()}` : "Never active"}`;
}

function StudentList({ d }: { d: Learning }) {
  const [q, setQ] = React.useState("");
  const [cohort, setCohort] = React.useState("");
  const [sort, setSort] = React.useState<LearnSort>("behind");
  const [shown, setShown] = React.useState(PAGE);
  const rows = React.useMemo(() => sortLearners(d.students, { q, cohort, sort }), [d.students, q, cohort, sort]);
  const behind = d.students.filter((r) => r.behind).length;
  const week = d.students.filter((r) => r.minutes7 > 0).length;
  const tests = d.students.filter((r) => r.avgTestPct !== null);
  return (
    <>
      <Tiles
        items={[
          { value: behind, label: "behind", tone: behind ? "warn" : "plain", onPress: () => setSort("behind"), testID: "learn-behind" },
          { value: week, label: `of ${d.students.length} studied this week`, onPress: () => setSort("active") },
          { value: tests.length ? Math.round(tests.reduce((a, r) => a + r.avgTestPct!, 0) / tests.length) : 0, suffix: "%", label: "average test score" },
        ]}
      />
      <View style={{ gap: space[2] }}>
        <SearchBox value={q} onChange={setQ} placeholder="Name or email" label="Search students" testID="learn-search" />
        {d.cohorts.length > 1 ? <FilterChips label="Cohort" value={cohort} onChange={setCohort} testID="learn-cohort" options={[{ id: "", name: "All cohorts" }, ...d.cohorts.map((c) => ({ id: c.id, name: c.name }))]} /> : null}
        <FilterChips label="Order" value={sort} onChange={setSort} testID="learn-sort" options={SORTS} />
      </View>
      {rows.length ? (
        <Group title="Students" count={rows.length}>
          <Panel rows>
            {rows.slice(0, shown).map((r) => (
              <Row
                key={r.id}
                testID={`learner-${r.id}`}
                title={r.name}
                meta={learnerLine(r)}
                trailing={r.behind ? <Status tone="warn">Behind</Status> : r.account !== "active" ? <Status tone="quiet">Paused</Status> : undefined}
                below={r.weak.length ? <T v="caption" tone="muted">Weak: {r.weak.slice(0, 2).join(", ")}</T> : undefined}
                onPress={() => router.push(`/admin/learning/${r.id}`)}
              />
            ))}
          </Panel>
          {rows.length > shown ? <Button kind="quiet" label={`Show ${Math.min(PAGE, rows.length - shown)} more`} onPress={() => setShown((n) => n + PAGE)} testID="learn-more" /> : null}
        </Group>
      ) : (
        <EmptyState title={d.students.length ? "Nobody matches" : "No students yet"} body={d.students.length ? "Try another name, or all cohorts." : "Students show here once they are added to a cohort."} />
      )}
    </>
  );
}

function ClassView({ d }: { d: Learning }) {
  const c = d.class;
  return (
    <>
      <Tiles
        items={[
          { value: c.started, label: `of ${c.students} have started a module` },
          { value: c.modules.reduce((a, m) => a + m.completed, 0), label: "modules finished, all students" },
        ]}
        per={2}
      />
      <Group title="Hardest modules" testID="class-hardest">
        {c.hardest.length ? (
          <Panel rows>
            {c.hardest.map((m) => (
              <Row key={m.id} title={m.title} meta={`${plural(m.takers, "student")} took the test`} trailing={<Status tone="warn">{`${m.avgTestPct}%`}</Status>} />
            ))}
          </Panel>
        ) : (
          <Quiet>No module has a low average yet.</Quiet>
        )}
      </Group>
      <Group title="Often mixed up">
        {c.mixups.length ? (
          <Panel rows>
            {c.mixups.map((m) => (
              <Row key={m.label} title={m.label} meta={`${plural(m.times, "time")} by ${plural(m.students, "student")}`} />
            ))}
          </Panel>
        ) : (
          <Quiet>Nothing mixed up often yet.</Quiet>
        )}
      </Group>
      <Group title="Every module" count={c.modules.length}>
        <Panel style={{ gap: space[3] }}>
          {c.modules.map((m) => (
            <View key={m.id} style={{ gap: 4 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[2] }}>
                <T v="small" style={{ flex: 1 }}>
                  {m.title}
                </T>
                <T v="caption" tone="muted" num>
                  {m.avgTestPct !== null ? `tests ${m.avgTestPct}%` : "no tests yet"}
                </T>
              </View>
              <ShareBar pct={c.students ? Math.round((m.completed / c.students) * 100) : 0} label={`${m.completed} finished, ${m.started} started`} />
              <T v="caption" tone="muted" num>
                {m.completed} finished · {m.started} started
              </T>
            </View>
          ))}
        </Panel>
      </Group>
    </>
  );
}

function StudentWork() {
  return (
    <Group title="Student work">
      <Panel rows>
        <Row title="Doubts and concerns" meta="Questions students asked you" icon={<IconDot icon={MessageCircleQuestion} />} onPress={() => router.push("/admin/doubts")} testID="learn-doubts" />
        <Row title="Assignments to mark" meta="Work students handed in" icon={<IconDot icon={FileCheck} />} onPress={() => router.push("/admin/review")} testID="learn-review" />
        <Row title="Leaderboard" meta="Points, every student" icon={<IconDot icon={Trophy} />} onPress={() => router.push("/admin/leaderboard")} testID="learn-board" />
        <Row title="Courses and lectures" meta="Add or edit them on the website" icon={<IconDot icon={Video} />} onPress={() => void openLink(`${config.site}/admin/courses`)} testID="learn-courses" />
      </Panel>
    </Group>
  );
}

export function LearningScreen() {
  const params = useLocalSearchParams<{ view?: string }>();
  const [view, setView] = React.useState<"students" | "class">(params.view === "class" ? "class" : "students");
  const q = useLearning();
  return (
    <Screen tab title="Learning" lead="How every student is studying" testID="admin-learning" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <FilterChips label="View" value={view} onChange={setView} testID="learn-view" options={[{ id: "students", name: "Each student" }, { id: "class", name: "Whole class" }]} />
      <Loaded q={q} what="learning" skeleton={<RowsSkeleton rows={8} />}>
        {(d) => (view === "class" ? <ClassView d={d} /> : <StudentList d={d} />)}
      </Loaded>
      <StudentWork />
    </Screen>
  );
}

/* ------------------------------------------------------ one student */

/** One student's learning, module by module. Used on its own page and in the student page's Record tab. */
export function LearnerRecord({ d }: { d: Learner }) {
  const r = d.row;
  return (
    <>
      <Tiles
        items={[
          { value: r.lecturesDone, label: `of ${r.lecturesAvailable} lectures watched` },
          { value: r.modulesDone, label: `of ${r.modulesTotal} modules done` },
          { value: r.avgTestPct ?? 0, suffix: r.avgTestPct === null ? "" : "%", label: r.avgTestPct === null ? "no tests yet" : "average test score" },
        ]}
      />
      <Panel style={{ gap: space[1] }}>
        <T v="small" num>
          {r.answered ? `${plural(r.answered, "practice question")} answered${r.rightPct !== null ? `, ${r.rightPct}% right` : ""}` : "No practice questions answered yet"}
        </T>
        <T v="caption" tone="muted" num>
          {r.lastActive ? `Last active ${ago(r.lastActive).toLowerCase()}` : "Never active"} · {r.minutes7} min this week · {d.xp.toLocaleString("en-IN")} points
        </T>
      </Panel>
      <Group title="Weak topics">
        {d.weak.length ? (
          <Panel rows>
            {d.weak.map((w) => (
              <Row key={w.label} title={w.label} meta={w.why} />
            ))}
          </Panel>
        ) : (
          <Quiet>No weak topics yet.</Quiet>
        )}
      </Group>
      <Group title="Modules" count={d.modules.length}>
        <Panel style={{ gap: space[3] }}>
          {d.modules.map((m) => (
            <View key={m.id} style={{ gap: 4 }} testID={`learner-module-${m.id}`}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[2] }}>
                <T v="small" style={{ flex: 1 }}>
                  {m.title}
                </T>
                <T v="caption" tone="muted" num>
                  {m.testPct === null ? "No test yet" : `Test ${m.testPct}%`}
                </T>
              </View>
              <ShareBar pct={m.sections ? Math.round((m.sectionsDone / m.sections) * 100) : 0} tone={m.testPct !== null && m.testPct < 60 ? "warn" : "plain"} label={`${m.sectionsDone} of ${m.sections} parts read`} />
            </View>
          ))}
        </Panel>
      </Group>
    </>
  );
}

/** The student page's Record tab: their learning, read from the server. */
export function StudentLearning({ id }: { id: string }) {
  const q = useLearner(id);
  return (
    <Loaded q={q} what="their learning" skeleton={<RowsSkeleton rows={5} />}>
      {(d) => <LearnerRecord d={d} />}
    </Loaded>
  );
}

export function LearnerScreen() {
  const id = String(useLocalSearchParams<{ id: string }>().id ?? "");
  const q = useLearner(id);
  return (
    <Screen title={q.data?.row.name ?? "Learning"} lead={q.data?.row.cohorts.map((c) => c.name).join(", ") || undefined} testID="admin-learner" onRefresh={() => void q.refetch()} refreshing={q.isRefetching} footer={<Button kind="quiet" label="Open their full page" onPress={() => openStudent(id)} testID="learner-open" />}>
      <Loaded q={q} what="their learning" skeleton={<RowsSkeleton rows={6} />}>
        {(d) => <LearnerRecord d={d} />}
      </Loaded>
    </Screen>
  );
}
