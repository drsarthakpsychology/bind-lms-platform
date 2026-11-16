import { router, useLocalSearchParams } from "expo-router";
import { PenLine } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, EmptyState, Row, RowList, RowsSkeleton, Screen, T } from "@/ds";
import { space, useTheme } from "@/theme";
import { useCohort, useCohorts, useRefreshAdmin } from "../api";
import type { CohortStatus } from "../extra";
import { accountLabel, accountTone, ago, day, pct, plural, type Tone } from "../format";
import { Figures, Loaded, Meter, Quiet, ScrollTabs, Status } from "../kit";
import { openCompose, openStudent } from "../nav";
import { useAdminRole } from "../role";

export const COHORT_STATUS: Record<CohortStatus, { label: string; tone: Tone }> = {
  upcoming: { label: "Upcoming", tone: "info" },
  active: { label: "Running", tone: "ok" },
  ended: { label: "Finished", tone: "quiet" },
};

/** Cohorts: pick one. */
export function AdminCohortsScreen() {
  const q = useCohorts();
  const { refresh, refreshing } = useRefreshAdmin();
  return (
    <Screen title="Cohorts" testID="admin-cohorts" onRefresh={refresh} refreshing={refreshing}>
      <Loaded q={q} soon what="cohorts" skeleton={<RowsSkeleton rows={3} />}>
        {(d) =>
          d.items.length ? (
            <RowList>
              {d.items.map((c) => (
                <Row
                  key={c.id}
                  testID={`cohort-${c.id}`}
                  title={c.name}
                  meta={[c.course, c.status === "upcoming" ? `starts ${day(c.starts)}` : plural(c.members, "student")].filter(Boolean).join(" · ")}
                  trailing={<Status tone={COHORT_STATUS[c.status].tone}>{COHORT_STATUS[c.status].label}</Status>}
                  below={c.status === "upcoming" ? undefined : <View style={{ paddingTop: space[1] }}><Meter pct={c.pct} label={`${c.pct}%`} /></View>}
                  onPress={() => router.push(`/admin/cohort/${c.id}`)}
                />
              ))}
            </RowList>
          ) : (
            <EmptyState mood="empty" title="No cohorts yet" body="Make one on the website." />
          )
        }
      </Loaded>
    </Screen>
  );
}

const TABS = [
  { id: "members" as const, name: "Members" },
  { id: "progress" as const, name: "Progress" },
  { id: "messages" as const, name: "Messages" },
];

/** One cohort's workspace, to read: who is in it, how far each got, what was sent. */
export function AdminCohortScreen() {
  const c = useTheme();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const q = useCohort(String(id));
  const [tab, setTab] = React.useState<(typeof TABS)[number]["id"]>("members");
  const { canWrite } = useAdminRole();
  return (
    <Screen testID="admin-cohort" gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching} footer={canWrite && q.data?.people.length ? <Button label="Message this cohort" icon={<PenLine size={20} color={c.onPrimary} />} onPress={() => openCompose({ cohort: String(id) })} testID="cohort-message" /> : undefined}>
      <Loaded q={q} soon what="this cohort" skeleton={<RowsSkeleton rows={6} />}>
        {(d) => (
          <>
            <View style={{ gap: space[2] }}>
              <T v="h1">{d.name}</T>
              <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", columnGap: space[3], rowGap: space[1] }}>
                <Status tone={COHORT_STATUS[d.status].tone}>{COHORT_STATUS[d.status].label}</Status>
                <T v="small" tone="muted">
                  {[d.course, d.starts ? `${day(d.starts, true)}${d.ends ? ` to ${day(d.ends)}` : ""}` : null].filter(Boolean).join(" · ")}
                </T>
              </View>
            </View>
            <Figures
              items={[
                { value: String(d.people.length), label: "students" },
                { value: String(d.activeWeek), label: "active this week" },
                { value: `${d.pct}%`, label: "lectures finished" },
                { value: String(d.behind), label: "behind", onPress: d.behind ? () => router.push(`/admin/activity?view=behind`) : undefined },
              ]}
            />
            {d.sessions.length ? (
              <Quiet>
                Next: {d.sessions[0]!.title}, {day(d.sessions[0]!.at, true)}
              </Quiet>
            ) : null}
            <ScrollTabs tabs={TABS} value={tab} onChange={setTab} />
            {tab === "members" ? (
              d.people.length ? (
                <RowList>
                  {d.people.map((m) => (
                    <Row key={m.id} title={m.name} meta={`${m.rollNumber ?? "No roll number"} · ${m.presence === "now" ? "on now" : `seen ${ago(m.lastSeen).toLowerCase()}`}`} trailing={<Status tone={accountTone(m.account)}>{accountLabel(m.account)}</Status>} onPress={() => openStudent(m.id)} />
                  ))}
                </RowList>
              ) : (
                <Quiet>No students in this cohort yet.</Quiet>
              )
            ) : tab === "progress" ? (
              <RowList>
                {[...d.people]
                  .sort((a, b) => pct(a.done, a.available) - pct(b.done, b.available))
                  .map((m) => {
                    const p = pct(m.done, m.available);
                    return <Row key={m.id} title={m.name} below={<View style={{ paddingTop: space[1] }}><Meter pct={p} tone={p < 34 ? "warn" : "info"} label={`${m.done}/${m.available}`} /></View>} onPress={() => openStudent(m.id, "activity")} />;
                  })}
              </RowList>
            ) : d.messages.length ? (
              <RowList>
                {d.messages.map((b) => (
                  <Row key={b.batchId} title={b.title} meta={ago(b.sentAt)} trailing={`${b.opened} of ${b.total} opened`} />
                ))}
              </RowList>
            ) : (
              <Quiet>Nothing sent to this cohort yet.</Quiet>
            )}
          </>
        )}
      </Loaded>
    </Screen>
  );
}
