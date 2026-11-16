import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { Button, EmptyState, Row, RowList, RowsSkeleton, Screen } from "@/ds";
import { space } from "@/theme";
import { useActivity, useBehind, useCohorts, useRefreshAdmin } from "../api";
import { ago, day, pct } from "../format";
import { Block, Dot, FilterChips, Figures, Loaded, Meter, Quiet, SmallButton, Status } from "../kit";
import { AdminTop, openCompose, openStudent } from "../nav";
import { useAdminRole } from "../role";
import { ScrollTabs } from "./student";

const VIEWS = [
  { id: "live" as const, name: "Live" },
  { id: "behind" as const, name: "Falling behind" },
  { id: "students" as const, name: "Each student" },
  { id: "cohorts" as const, name: "Cohorts" },
];
type View_ = (typeof VIEWS)[number]["id"];

function Live() {
  const q = useActivity();
  return (
    <Loaded q={q} soon what="activity" skeleton={<RowsSkeleton rows={6} />}>
      {({ data: d }) => (
        <>
          <Figures
            items={[
              { value: String(d.totals.activeNow), label: "on now" },
              { value: `${d.totals.active7}/${d.totals.students}`, label: "active this week" },
              { value: `${d.totals.hours30} h`, label: "studied in 30 days" },
              { value: String(d.totals.lecturesDone), label: "lectures finished" },
            ]}
          />
          <Block title="On VIBHA now" count={d.live.length || undefined}>
            {d.live.length ? (
              <RowList>
                {d.live.map((l) => (
                  <Row key={l.userId} testID={`live-${l.userId}`} icon={<Dot tone={l.watching ? "ok" : "info"} />} title={l.name || "A student"} meta={l.where ?? l.meta ?? undefined} trailing={l.since ? ago(l.since).replace(" ago", "") : undefined} onPress={() => openStudent(l.userId, "activity")} />
                ))}
              </RowList>
            ) : (
              <Quiet>Nobody is on right now.</Quiet>
            )}
          </Block>
          {d.pages.length ? (
            <Block title="Where the time goes">
              <View style={{ gap: space[3] }}>
                {d.pages.map((p) => {
                  const top = d.pages[0]!.min || 1;
                  return (
                    <View key={p.label} style={{ gap: space[1] }}>
                      <Row title={p.label} trailing={`${Math.round(p.min / 60)} h`} />
                      <Meter pct={(p.min / top) * 100} />
                    </View>
                  );
                })}
              </View>
            </Block>
          ) : null}
        </>
      )}
    </Loaded>
  );
}

function Behind() {
  const [cohort, setCohort] = React.useState("");
  const q = useBehind(cohort);
  const { canWrite } = useAdminRole();
  return (
    <Loaded q={q} soon what="who is behind" skeleton={<RowsSkeleton rows={5} />}>
      {(d) => (
        <>
          <FilterChips label="Cohort" value={cohort} onChange={setCohort} options={[{ id: "", name: "All cohorts" }, ...d.cohorts.map((c) => ({ id: c.id, name: c.name }))]} testID="behind-cohort" />
          {d.items.length ? (
            <>
              <RowList>
                {d.items.map((r) => (
                  <Row
                    key={r.id}
                    testID={`behind-${r.id}`}
                    title={r.name}
                    meta={`${r.cohortName ?? "No cohort"} · seen ${ago(r.lastSeen).toLowerCase()}`}
                    below={
                      <View style={{ paddingTop: space[1], flexDirection: "row", alignItems: "center", gap: space[3] }}>
                        <View style={{ flex: 1 }}>
                          <Meter tone="warn" pct={pct(r.done, r.available)} label={`${r.done}/${r.available}`} />
                        </View>
                        {canWrite ? <SmallButton label="Nudge" testID={`nudge-${r.id}`} onPress={() => openCompose({ to: [r.id], title: "Checking in" })} /> : null}
                      </View>
                    }
                    onPress={() => openStudent(r.id, "activity")}
                  />
                ))}
              </RowList>
              {canWrite ? <Button kind="quiet" label={`Nudge all ${d.items.length}`} onPress={() => openCompose({ to: d.items.map((r) => r.id), title: "Checking in" })} testID="nudge-all" /> : null}
            </>
          ) : (
            <EmptyState mood="clear" title="Nobody is behind" body="Everyone is keeping up with their cohort." />
          )}
        </>
      )}
    </Loaded>
  );
}

const SORTS = [
  { id: "active" as const, name: "Most time" },
  { id: "quiet" as const, name: "Quietest" },
  { id: "lectures" as const, name: "Most lectures" },
  { id: "seen" as const, name: "Seen last" },
];
type Sort = (typeof SORTS)[number]["id"];

/** The server's 30-day rows: one line per student, sorted the way you pick. */
export function sortActivity<T extends { min30: number; lecturesDone: number; lastSeen: string | null; name: string }>(rows: T[], by: Sort): T[] {
  const seen = (r: T) => (r.lastSeen ? Date.parse(r.lastSeen) || 0 : 0);
  const out = [...rows];
  if (by === "active") out.sort((a, b) => b.min30 - a.min30);
  else if (by === "quiet") out.sort((a, b) => a.min30 - b.min30 || seen(a) - seen(b));
  else if (by === "lectures") out.sort((a, b) => b.lecturesDone - a.lecturesDone);
  else out.sort((a, b) => seen(b) - seen(a));
  return out;
}

function Students() {
  const q = useActivity();
  const [by, setBy] = React.useState<Sort>("active");
  return (
    <Loaded q={q} soon what="activity" skeleton={<RowsSkeleton rows={8} />}>
      {({ data: d }) => {
        const rows = sortActivity(d.rows, by);
        const top = Math.max(1, ...rows.map((r) => r.min30));
        return (
          <>
            <FilterChips label="Sort" value={by} onChange={setBy} options={SORTS} testID="activity-sort" />
            {rows.length ? (
              <RowList>
                {rows.map((r) => (
                  <Row
                    key={r.id}
                    testID={`act-${r.id}`}
                    title={r.name}
                    meta={[`${Math.round(r.min30 / 60)} h in 30 days`, `${r.activeDays30} days`, `${r.lecturesDone} lectures`, r.lastSeen ? `seen ${ago(r.lastSeen).toLowerCase()}` : "never seen"].join(" · ")}
                    below={<View style={{ paddingTop: space[1] }}><Meter pct={(r.min30 / top) * 100} tone={r.min30 ? "info" : "warn"} /></View>}
                    onPress={() => openStudent(r.id, "activity")}
                  />
                ))}
              </RowList>
            ) : (
              <EmptyState mood="empty" title="No activity yet" body="Students show here once they start." />
            )}
          </>
        );
      }}
    </Loaded>
  );
}

function Cohorts() {
  const q = useCohorts();
  return (
    <Loaded q={q} soon what="cohorts" skeleton={<RowsSkeleton rows={3} />}>
      {(d) => (
        <RowList>
          {d.items.map((c) => (
            <Row
              key={c.id}
              title={c.name}
              meta={c.status === "upcoming" ? `Starts ${day(c.starts)}` : `${c.activeWeek} of ${c.members} active this week${c.behind ? ` · ${c.behind} behind` : ""}${c.never ? ` · ${c.never} never came in` : ""}`}
              trailing={<Status tone={c.status === "active" ? "ok" : c.status === "upcoming" ? "info" : "quiet"}>{c.status === "active" ? "Running" : c.status === "upcoming" ? "Upcoming" : "Finished"}</Status>}
              below={c.status === "upcoming" ? undefined : <View style={{ paddingTop: space[1] }}><Meter pct={c.pct} label={`${c.pct}%`} /></View>}
              onPress={() => router.push(`/admin/cohort/${c.id}`)}
            />
          ))}
        </RowList>
      )}
    </Loaded>
  );
}

/** Activity: who is on now, who is falling behind, how each cohort is doing. */
export function AdminActivityScreen() {
  const params = useLocalSearchParams<{ view?: string }>();
  const [view, setView] = React.useState<View_>(VIEWS.some((v) => v.id === params.view) ? (params.view as View_) : "live");
  const { refresh, refreshing } = useRefreshAdmin();
  return (
    <Screen tab top={<AdminTop />} title="Activity" testID="admin-activity" gap={space[5]} onRefresh={refresh} refreshing={refreshing}>
      <ScrollTabs tabs={VIEWS} value={view} onChange={setView} />
      {view === "live" ? <Live /> : view === "behind" ? <Behind /> : view === "students" ? <Students /> : <Cohorts />}
    </Screen>
  );
}
