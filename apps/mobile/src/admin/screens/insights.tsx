import { router } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { Row, RowsSkeleton, T } from "@/ds";
import { LoadSwap } from "@/motion";
import { space, useTheme } from "@/theme";
import { FilterChips } from "../kit";
import { openStudent } from "../nav";
import { Group, MockNote, Panel, Screen, ShareBar, Tiles, useSample } from "../ui";
import { BOARD, BOARD_KINDS, INSIGHTS } from "./mock";

/** Active students per day, as plain bars with the number on top. Still: admin numbers do not move. */
function DayChart({ days, of }: { days: { day: string; active: number }[]; of: number }) {
  const c = useTheme();
  const max = Math.max(1, ...days.map((d) => d.active));
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={`Students active each day: ${days.map((d) => `${d.day} ${d.active}`).join(", ")}. Out of ${of}.`} style={{ flexDirection: "row", alignItems: "flex-end", gap: space[2], height: 132 }}>
      {days.map((d) => (
        <View key={d.day} style={{ flex: 1, alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
          <T v="caption" num>
            {d.active}
          </T>
          <View style={{ width: "100%", height: `${Math.max(4, (d.active / max) * 70)}%`, borderRadius: 6, backgroundColor: d.active === max ? c.ink : c.hairline }} />
          <T v="caption" tone="muted">
            {d.day}
          </T>
        </View>
      ))}
    </View>
  );
}

/**
 * Learning insights for the whole class: how many are learning, what they get
 * wrong most, where they stop, and who has gone quiet. Every line opens the
 * place to act on it.
 */
export function InsightsScreen() {
  const sample = useSample(INSIGHTS);
  const d = INSIGHTS;
  return (
    <Screen title="Learning insights" lead={d.window} testID="admin-insights">
      <LoadSwap ready={sample.ready} skeleton={<RowsSkeleton rows={6} />}>
        <View style={{ gap: space[5] }}>
          <Tiles
            items={[
              { value: d.totals.active, label: `of ${d.totals.students} active` },
              { value: d.totals.minutesPerStudent, label: "minutes a student" },
              { value: d.totals.firstTryRight, suffix: "%", label: "right first try" },
            ]}
          />
          <Group title="Active each day">
            <Panel>
              <DayChart days={d.byDay} of={d.totals.students} />
            </Panel>
          </Group>
          <Group title="Hardest topics" action={{ label: "Answer keys", onPress: () => router.push("/admin/teaching") }}>
            <Panel style={{ gap: space[3] }}>
              {d.topics.map((t) => (
                <View key={t.topic} style={{ gap: 4 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[2] }}>
                    <T v="small" style={{ flex: 1 }}>
                      {t.topic}
                    </T>
                    <T v="caption" tone="muted" num>
                      {t.answers} answers
                    </T>
                  </View>
                  <ShareBar pct={t.rightPct} tone={t.rightPct < 60 ? "warn" : "plain"} label={`${t.topic}: ${t.rightPct} percent right first try`} />
                </View>
              ))}
              <T v="caption" tone="muted">
                Share of answers right at the first try. Under 60% is marked.
              </T>
            </Panel>
          </Group>
          <Group title="Where students stop">
            <Panel rows>
              {d.stuck.map((s) => (
                <Row key={s.where} title={s.where} meta="Started, not finished in 7 days" trailing={`${s.students} students`} onPress={() => router.push(s.href as never)} />
              ))}
            </Panel>
          </Group>
          <Group title="Gone quiet" action={{ label: "All activity", onPress: () => router.push("/admin/activity") }}>
            <Panel rows>
              {d.quiet.map((s) => (
                <Row key={s.id} title={s.name} meta={`No visit for ${s.days} days`} onPress={() => openStudent(s.id)} testID={`quiet-${s.id}`} />
              ))}
            </Panel>
          </Group>
          <Group title="This week">
            <Panel rows>
              <Row title="Sections read" trailing={String(d.totals.sectionsRead)} />
              <Row title="Questions answered" trailing={d.totals.questions.toLocaleString("en-IN")} />
            </Panel>
          </Group>
          <MockNote />
        </View>
      </LoadSwap>
    </Screen>
  );
}

/**
 * The full leaderboard, the admin's way: every student with full names, any
 * cohort, searchable. No "you" row, no points to chase. A row opens the student.
 */
export function AdminLeaderboardScreen() {
  const c = useTheme();
  const sample = useSample(BOARD);
  const [kind, setKind] = React.useState<(typeof BOARD_KINDS)[number]["id"]>("week");
  const [cohort, setCohort] = React.useState("");
  const [sort, setSort] = React.useState<"rank" | "name" | "streak">("rank");
  const cohorts = Array.from(new Set(BOARD.map((r) => r.cohort)));
  // Each board has its own order: the sample reshuffles the same students so the tabs read as different boards.
  const k = BOARD_KINDS.findIndex((b) => b.id === kind);
  const ranked = BOARD.map((r, i) => ({ ...r, points: kind === "all" ? r.points * 6 + ((i * 37) % 90) : kind === "week" ? r.points : Math.round(r.points / (k + 1)) + ((i * (k + 3) * 29) % 160) }))
    .sort((a, b) => b.points - a.points)
    .map((r, i) => ({ ...r, rank: i + 1 }));
  const rows = ranked.filter((r) => !cohort || r.cohort === cohort).sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "streak" ? b.streak - a.streak : a.rank - b.rank));
  return (
    <Screen title="Leaderboard" lead={`${rows.length} students`} testID="admin-leaderboard">
      <FilterChips label="Board" value={kind} onChange={setKind} testID="board-kind" options={BOARD_KINDS.map((b) => ({ id: b.id, name: b.name }))} />
      <FilterChips label="Cohort" value={cohort} onChange={setCohort} testID="board-cohort" options={[{ id: "", name: "All cohorts" }, ...cohorts.map((x) => ({ id: x, name: x }))]} />
      <LoadSwap ready={sample.ready} skeleton={<RowsSkeleton rows={8} />}>
        <View style={{ gap: space[3] }}>
          <FilterChips label="Sort" value={sort} onChange={setSort} testID="board-sort" options={[{ id: "rank", name: "By rank" }, { id: "name", name: "By name" }, { id: "streak", name: "By streak" }]} />
          <Panel rows>
            {rows.map((r) => (
              <Row
                key={r.id}
                testID={`board-${r.id}`}
                title={r.name}
                meta={`${r.cohort} · ${r.games} games · ${r.streak} day streak`}
                icon={
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: r.rank <= 3 ? c.ink : c.bg, alignItems: "center", justifyContent: "center" }}>
                    <T v="caption" num style={{ color: r.rank <= 3 ? c.bg : c.ink }}>
                      {r.rank}
                    </T>
                  </View>
                }
                trailing={r.points.toLocaleString("en-IN")}
                accessibilityLabel={`Rank ${r.rank}. ${r.name}. ${r.points} points. ${r.cohort}`}
                onPress={() => openStudent(r.id)}
              />
            ))}
          </Panel>
          <MockNote />
        </View>
      </LoadSwap>
    </Screen>
  );
}
