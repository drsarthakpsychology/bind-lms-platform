import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { Button, Chips, EmptyState, Loaded, Row, RowList, RowsSkeleton, Screen } from "@/ds";
import { space } from "@/theme";
import { useActivity, useBehind, useCohorts, useRefreshAdmin } from "../api";
import { ago, day, pct } from "../format";
import { Block, Dot, Figures, Meter, Quiet, SmallButton, Status } from "../kit";
import { AdminTop, openCompose, openStudent } from "../nav";
import { useAdminRole } from "../role";
import { ScrollTabs } from "./student";

const VIEWS = [
  { id: "live" as const, name: "Live" },
  { id: "behind" as const, name: "Falling behind" },
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
                  <Row key={l.userId} testID={`live-${l.userId}`} icon={<Dot tone={l.watching ? "ok" : "info"} />} title={l.name ?? "A student"} meta={l.where} trailing={ago(l.since).replace(" ago", "")} onPress={() => openStudent(l.userId, "activity")} />
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
          <Chips scroll label="Cohort" value={cohort} onChange={setCohort} options={[{ id: "", name: "All cohorts" }, ...d.cohorts.map((c) => ({ id: c.id, name: c.name }))]} />
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
            <EmptyState mood="sleepy" title="Nobody is behind" body="Everyone is keeping up with their cohort." />
          )}
        </>
      )}
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
      {view === "live" ? <Live /> : view === "behind" ? <Behind /> : <Cohorts />}
    </Screen>
  );
}
