import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { View } from "react-native";

import { Button, Field, Row, RowsSkeleton, T } from "@/ds";
import { space, useTheme } from "@/theme";
import { FilterChips } from "../kit";
import { boardPath, type AdminFilter } from "@/practise/board";
import { readQuery } from "@/practise/api";
import type { Leaderboard } from "@/practise/contract";
import { EmptyState, Panel, PlainLoaded, Screen } from "../ui";

/**
 * The full leaderboard, the admin's way: every student with full names, any
 * cohort, searchable. No "you" row, no points to chase. A row opens the student.
 */
const ADMIN_BOARDS = [
  { id: "league", name: "This week" },
  { id: "overall", name: "All time" },
  { id: "quiz", name: "Games" },
] as const;
type BoardId = (typeof ADMIN_BOARDS)[number]["id"];

/** Every student on a board (GET /leaderboards/:board answers an admin with full names, cohorts, search and pages). */
export function AdminLeaderboardScreen() {
  const c = useTheme();
  const [board, setBoardRaw] = React.useState<BoardId>("league");
  const [f, setF] = React.useState<AdminFilter>({ q: "", cohort: "", sort: "rank", page: 1 });
  const [draft, setDraft] = React.useState("");
  const patch = (x: Partial<AdminFilter>) => setF((o) => ({ ...o, page: 1, ...x }));
  const setBoard = (b: BoardId) => {
    setBoardRaw(b);
    setF((o) => ({ ...o, page: 1 }));
  };
  // While the next page loads, the last one stays up (no blank).
  const q = useQuery({ ...readQuery<Leaderboard>(boardPath(`/leaderboards/${board}`, board, f)), placeholderData: (prev) => (prev?.board === board ? prev : undefined) });
  const d = q.data;
  const admin = d?.admin;
  return (
    <Screen title="Leaderboard" lead={admin ? `${admin.total.toLocaleString("en-IN")} students` : undefined} testID="admin-leaderboard">
      <FilterChips label="Board" value={board} onChange={setBoard} testID="board-kind" options={ADMIN_BOARDS.map((b) => ({ id: b.id, name: b.name }))} />
      {admin && admin.cohorts.length > 1 ? <FilterChips label="Cohort" value={f.cohort} onChange={(v) => patch({ cohort: v })} testID="board-cohort" options={[{ id: "", name: "All cohorts" }, ...admin.cohorts.map((x) => ({ id: x.id, name: x.name }))]} /> : null}
      <Field label="Find a student" value={draft} onChangeText={setDraft} onSubmitEditing={() => patch({ q: draft })} returnKeyType="search" placeholder="Name" testID="board-search" />
      <FilterChips label="Sort" value={f.sort} onChange={(v) => patch({ sort: v })} testID="board-sort" options={[{ id: "rank", name: "By rank" }, { id: "name", name: "By name" }, { id: "cohort", name: "By cohort" }]} />
      <PlainLoaded q={q} what="the leaderboard" skeleton={<RowsSkeleton rows={8} />}>
        {(b) =>
          b.rows.length ? (
            <View style={{ gap: space[3] }}>
              <Panel rows>
                {b.rows.map((r, i) => (
                  <Row
                    key={`${r.rank}-${r.name}-${i}`}
                    testID={`board-row-${i}`}
                    title={r.name}
                    meta={r.title ?? "No cohort"}
                    icon={
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: r.rank <= 3 ? c.ink : c.bg, alignItems: "center", justifyContent: "center" }}>
                        <T v="caption" num style={{ color: r.rank <= 3 ? c.bg : c.ink }}>
                          {r.rank}
                        </T>
                      </View>
                    }
                    trailing={r.points.toLocaleString("en-IN")}
                    accessibilityLabel={`Rank ${r.rank}. ${r.name}. ${r.points} points. ${r.title ?? "No cohort"}`}
                  />
                ))}
              </Panel>
              {b.admin && b.admin.pages > 1 ? (
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3] }}>
                  <Button kind="quiet" small label="Previous" disabled={b.admin.page <= 1} onPress={() => setF((o) => ({ ...o, page: o.page - 1 }))} testID="board-prev" />
                  <T v="small" tone="muted" num>{`Page ${b.admin.page} of ${b.admin.pages}`}</T>
                  <Button kind="quiet" small label="Next" disabled={b.admin.page >= b.admin.pages} onPress={() => setF((o) => ({ ...o, page: o.page + 1 }))} testID="board-next" />
                </View>
              ) : null}
            </View>
          ) : (
            <EmptyState title={f.q ? `Nobody called "${f.q}"` : "Nobody on this board yet"} body={f.q ? "Try part of the name." : "Students show here once they earn points."} />
          )
        }
      </PlainLoaded>
    </Screen>
  );
}
