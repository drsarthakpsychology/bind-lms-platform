import { router } from "expo-router";
import { PenLine } from "lucide-react-native";
import * as React from "react";
import { Linking, Pressable, View } from "react-native";

import { Button, EmptyState, Row, RowList, RowsSkeleton, Screen, T } from "@/ds";
import { config } from "@/lib/config";
import { space, useTheme } from "@/theme";
import { useAdminHome } from "../api";
import type { AdminHome } from "../contract";
import { todoHref } from "../safe";
import { attentionGroups, plural } from "../format";
import { Block, Dot, Loaded, Meter, Notice } from "../kit";
import { AdminTop, openCompose, openStudent } from "../nav";
import { useAdminRole } from "../role";

/** One line of the Needs a look list: the count, what it is, who. */
function TodoRow({ count, label, detail, onPress, testID }: { count: number; label: string; detail: string; onPress: () => void; testID?: string }) {
  return <Row testID={testID} title={label} meta={detail} icon={<T v="h3" num style={{ minWidth: 28, textAlign: "right" }}>{count}</T>} onPress={onPress} />;
}

/** A Home to-do: the app's own screen when it has one, the website otherwise. */
function openTodo(web: string) {
  const to = todoHref(web);
  if ("app" in to) router.push(to.app as never);
  else void Linking.openURL(`${config.site}${to.web}`);
}

/** Admin Home: what needs a look right now, how many are on VIBHA (the list is in Activity), how each cohort is doing. */
export function AdminHomeView({ data }: { data: AdminHome }) {
  const c = useTheme();
  const { viewOnly } = useAdminRole();
  const groups = attentionGroups(data.needsLook);
  const names = (rows: { name: string }[]) => (rows.length <= 2 ? rows.map((r) => r.name).join(" and ") : `${rows[0]!.name}, ${rows[1]!.name} and ${rows.length - 2} more`);
  const toGrade = data.today.submissionsToGrade;
  // The server's own list (the website's Home, same words and counts) when it sends one.
  const fromServer = data.todo.map((t) => ({ key: t.id, count: t.count, label: t.label, detail: t.detail, go: () => openTodo(t.target.web) }));
  const todo = fromServer.length ? fromServer : [
    ...groups.map((g) => ({ key: g.flag, count: g.students.length, label: g.label, detail: names(g.students), go: () => (g.students.length === 1 ? openStudent(g.students[0]!.id) : router.push(`/admin/students?flag=${g.flag}`)) })),
    ...(data.counts.openComplaints ? [{ key: "concerns", count: data.counts.openComplaints, label: "Private concerns", detail: "Students raised a concern. Answer them first.", go: () => router.push("/admin/doubts?view=complaint") }] : []),
    ...(toGrade ? [{ key: "grade", count: toGrade, label: "Waiting for a grade", detail: "Hand-ins students sent in.", go: () => router.push("/admin/review") }] : []),
  ];
  const total = todo.reduce((n, t) => n + t.count, 0);
  const link = (label: string, onPress: () => void, testID?: string) => (
    <Pressable testID={testID} accessibilityRole="link" onPress={onPress} style={{ minHeight: 44, justifyContent: "center" }}>
      <T v="small" tone="muted" num style={{ textDecorationLine: "underline", textDecorationColor: c.cardLine }}>
        {label}
      </T>
    </Pressable>
  );
  return (
    <>
      <View style={{ gap: space[2] }}>
        {data.dateLine ? (
          <T v="caption" tone="muted">
            {data.dateLine}
          </T>
        ) : null}
        <T v="h1">Today</T>
        <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: space[4] }}>
          {link(plural(data.counts.students, "student"), () => router.push("/admin/students"), "home-students")}
          {link(`${data.counts.activeThisWeek} active this week`, () => router.push("/admin/activity"))}
          {data.counts.locked ? link(`${data.counts.locked} locked`, () => router.push("/admin/students?account=locked")) : null}
        </View>
      </View>
      {viewOnly ? <Notice testID="view-only-note">You can see everything here, but not change it. Ask a Super Admin for changes.</Notice> : null}
      <Block title="Needs a look" count={total || undefined} testID="needs-look">
        {todo.length ? (
          <RowList>
            {todo.map((t) => (
              <TodoRow key={t.key} testID={`todo-${t.key}`} count={t.count} label={t.label} detail={t.detail} onPress={t.go} />
            ))}
          </RowList>
        ) : (
          <EmptyState mood="clear" title="All clear" body="Nothing needs you right now." />
        )}
      </Block>
      <RowList>
        <Row
          testID="home-live"
          title={data.live.length ? `${data.live.length} on VIBHA now` : "Nobody on VIBHA right now"}
          meta={data.live.length ? "See who and what they are doing" : "See this week in Activity"}
          icon={<Dot tone={data.live.length ? "ok" : "quiet"} />}
          onPress={() => router.push(data.live.length ? "/admin/activity?view=live" : "/admin/activity")}
        />
      </RowList>
      {data.cohorts.length ? (
        <Block title="Cohorts" action={{ label: "All cohorts", onPress: () => router.push("/admin/cohorts") }}>
          <RowList>
            {data.cohorts
              .map((x) => (
                <Row key={x.id} title={x.name} meta={`${x.week} active this week${x.behind ? ` · ${x.behind} behind` : ""}`} trailing={`${x.members} students`} below={<View style={{ paddingTop: space[1] }}><Meter pct={x.pct} label={`${x.pct}%`} /></View>} onPress={() => router.push(`/admin/cohort/${x.id}`)} />
              ))}
          </RowList>
        </Block>
      ) : null}
    </>
  );
}

export function AdminHomeScreen() {
  const c = useTheme();
  const q = useAdminHome();
  const { canWrite } = useAdminRole();
  return (
    <Screen
      tab
      top={<AdminTop />}
      testID="admin-home"
      onRefresh={() => void q.refetch()}
      refreshing={q.isRefetching}
      footer={canWrite ? <Button label="Send a message" icon={<PenLine size={20} color={c.onPrimary} />} onPress={() => openCompose()} testID="admin-compose" /> : undefined}
    >
      <Loaded q={q} soon what="today" skeleton={<RowsSkeleton rows={6} />}>
        {(d) => <AdminHomeView data={d} />}
      </Loaded>
    </Screen>
  );
}
