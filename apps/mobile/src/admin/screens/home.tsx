import { router } from "expo-router";
import { openLink } from "@/lib/open";
import { Lock, PenLine } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { AdminTodayBlock } from "@/clinic/admin/today";
import { useAdminClinicToday } from "@/clinic/api";
import { Row, RowsSkeleton, T } from "@/ds";
import { config } from "@/lib/config";
import { space, useTheme } from "@/theme";
import { useAdminHome } from "../api";
import { useFailedEmails, useWallReports } from "../live";
import type { AdminHome } from "../contract";
import { todoHref } from "../safe";
import { attentionGroups } from "../format";
import { Dot, Loaded, Meter } from "../kit";
import { openCompose, openStudent } from "../nav";
import { useAdminRole, VIEW_ONLY_LINE } from "../role";
import { BarAction, Group, Panel, Screen, Tiles } from "../ui";

/** One line of the Needs attention list: the count, what it is, who. */
function TodoRow({ count, label, detail, urgent, onPress, testID }: { count: number; label: string; detail: string; urgent?: boolean; onPress: () => void; testID?: string }) {
  const c = useTheme();
  return (
    <Row
      testID={testID}
      title={label}
      meta={detail}
      icon={
        <View style={{ minWidth: 32, height: 32, borderRadius: 16, paddingHorizontal: 6, backgroundColor: urgent ? c.warnBg : c.bg, alignItems: "center", justifyContent: "center" }}>
          <T v="bodyStrong" num style={urgent ? { color: c.warnFg } : undefined}>
            {count}
          </T>
        </View>
      }
      onPress={onPress}
    />
  );
}

/** A Home to-do: the app's own screen when it has one, the website otherwise. */
function openTodo(web: string) {
  const to = todoHref(web);
  if ("app" in to) router.push(to.app as never);
  else void openLink(`${config.site}${to.web}`);
}

/**
 * Admin Home: what needs attention right now, the numbers that matter, who is
 * on, and how each cohort is doing. (Today's sessions with Show code sit above
 * this, from the clinic.)
 */
export function AdminHomeView({ data }: { data: AdminHome }) {
  const clinic = useAdminClinicToday().data;
  const failed = useFailedEmails().data?.items.length ?? 0;
  const reports = useWallReports().data?.length ?? 0;
  const groups = attentionGroups(data.needsLook);
  const names = (rows: { name: string }[]) => (rows.length <= 2 ? rows.map((r) => r.name).join(" and ") : `${rows[0]!.name}, ${rows[1]!.name} and ${rows.length - 2} more`);
  const toGrade = data.today.submissionsToGrade;
  // The server's own list (the website's Home, same words and counts) when it sends one.
  const fromServer = data.todo.map((t) => ({ key: t.id, count: t.count, label: t.label, detail: t.detail, urgent: t.urgent, go: () => openTodo(t.target.web) }));
  const todo = fromServer.length ? fromServer : [
    ...groups.map((g) => ({ key: g.flag as string, count: g.students.length, label: g.label, detail: names(g.students), urgent: false, go: () => (g.students.length === 1 ? openStudent(g.students[0]!.id) : router.push(`/admin/students?flag=${g.flag}`)) })),
    ...(data.counts.openComplaints ? [{ key: "concerns", count: data.counts.openComplaints, label: "Private concerns", detail: "Students raised a concern. Answer them first.", urgent: true, go: () => router.push("/admin/doubts?view=complaint") }] : []),
    ...(toGrade ? [{ key: "grade", count: toGrade, label: "Waiting for a grade", detail: "Hand-ins students sent in.", urgent: false, go: () => router.push("/admin/review") }] : []),
  ];
  if (clinic?.pendingLeaves) todo.push({ key: "leave", count: clinic.pendingLeaves, label: "Leave requests", detail: "Students asked for leave. Approve or turn down.", urgent: false, go: () => router.push("/admin/clinic/leaves") });
  if (clinic?.logsDue) todo.push({ key: "logs", count: clinic.logsDue, label: "Case logs due", detail: "OPD days with no cases logged yet.", urgent: false, go: () => router.push("/admin/clinic/trackers") });
  if (reports && !todo.some((t) => t.key.includes("wall"))) todo.push({ key: "wall", count: reports, label: "Wall reports", detail: "Posts students reported. Read and mark handled.", urgent: false, go: () => router.push("/admin/wall-reports") });
  if (failed && !todo.some((t) => t.key.includes("email") && t.label.toLowerCase().includes("fail"))) todo.push({ key: "failed-emails", count: failed, label: "Emails that did not arrive", detail: "Send them again, or clear them.", urgent: false, go: () => router.push("/admin/failed-emails") });
  const total = todo.reduce((n, t) => n + t.count, 0);
  return (
    <>
      <Group title="To do today" count={total || undefined} testID="needs-look">
        {todo.length ? (
          <Panel rows>
            {todo.map((t) => (
              <TodoRow key={t.key} testID={`todo-${t.key}`} count={t.count} label={t.label} detail={t.detail} urgent={t.urgent} onPress={t.go} />
            ))}
          </Panel>
        ) : (
          <Panel>
            <T v="bodyStrong">All clear today</T>
            <T v="small" tone="muted">
              Nothing needs you right now. New doubts, leave requests and hand-ins show here.
            </T>
          </Panel>
        )}
      </Group>
      <Group title="Numbers">
        <Tiles
          items={[
            { value: data.counts.students, label: "students", onPress: () => router.push("/admin/students"), testID: "home-students" },
            { value: data.counts.activeThisWeek, label: "active this week", onPress: () => router.push("/admin/activity") },
            { value: data.counts.locked, label: "paused", tone: "warn", onPress: () => router.push("/admin/students?account=locked"), testID: "home-locked" },
          ]}
        />
        <Panel rows>
          <Row
            testID="home-live"
            title={data.live.length ? `${data.live.length} on VIBHA now` : "Nobody on VIBHA right now"}
            meta={data.live.length ? "See who and what they are doing" : "See this week in Activity"}
            icon={<Dot tone={data.live.length ? "ok" : "quiet"} />}
            onPress={() => router.push(data.live.length ? "/admin/activity?view=live" : "/admin/activity")}
          />
          <Row testID="home-insights" title="Learning" meta="Who is behind, and what the class finds hard" onPress={() => router.push("/admin/teaching")} />
        </Panel>
      </Group>
      {data.cohorts.length ? (
        <Group title="Cohorts" action={{ label: "All cohorts", onPress: () => router.push("/admin/cohorts") }}>
          <Panel rows>
            {data.cohorts.map((x) => (
              <Row key={x.id} title={x.name} meta={`${x.week} active this week${x.behind ? ` · ${x.behind} behind` : ""}`} trailing={`${x.members} students`} below={<View style={{ paddingTop: space[1] }}><Meter pct={x.pct} label={`${x.pct}%`} /></View>} onPress={() => router.push(`/admin/cohort/${x.id}`)} />
            ))}
          </Panel>
        </Group>
      ) : null}
    </>
  );
}

export function AdminHomeScreen() {
  const q = useAdminHome();
  const { canWrite } = useAdminRole();
  return (
    <Screen
      tab
      title="Today"
      lead={q.data?.dateLine || undefined}
      testID="admin-home"
      onRefresh={() => void q.refetch()}
      refreshing={q.isRefetching}
      right={canWrite ? <BarAction label="Send a message" icon={PenLine} onPress={() => openCompose()} testID="admin-compose" /> : <BarAction label={`Send a message. ${VIEW_ONLY_LINE}`} icon={Lock} onPress={() => router.push("/admin/messages")} testID="admin-compose-locked" />}
    >
      <AdminTodayBlock />
      <Loaded q={q} soon what="today" skeleton={<RowsSkeleton rows={6} />}>
        {(d) => <AdminHomeView data={d} />}
      </Loaded>
    </Screen>
  );
}
