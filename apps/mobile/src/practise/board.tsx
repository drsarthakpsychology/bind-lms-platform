import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { Button, Chips, EmptyState, Field, LoadError, RowList, RowsSkeleton, Screen, StillTrying, T } from "@/ds";
import { fonts, layout, space, useTheme } from "@/theme";
import { isSoon, readQuery } from "./api";
import type { Leaderboard, LeaderboardAdmin, LeaderboardRow } from "./contract";
import { Stagger } from "./fx";
import { SoonState } from "./soon";

/** The boards the server keeps (GET /leaderboards/:board and /leaderboards/games/:game). */
const BOARDS = [
  { id: "league", name: "League", path: "/leaderboards/league" },
  { id: "quiz", name: "Games", path: "/leaderboards/quiz" },
  { id: "overall", name: "All time", path: "/leaderboards/overall" },
  { id: "rx", name: "Rx Detective", path: "/leaderboards/games/rx" },
  { id: "mse", name: "MSE Lab", path: "/leaderboards/games/mse" },
  { id: "comorbid", name: "Comorbid", path: "/leaderboards/games/comorbid" },
];

/** The boards that answer an admin with every student (search, cohort, sort, pages). */
const ADMIN_BOARDS = new Set(["league", "quiz", "overall"]);

export type AdminFilter = { q: string; cohort: string; sort: LeaderboardAdmin["sort"]; page: number };
const NO_FILTER: AdminFilter = { q: "", cohort: "", sort: "rank", page: 1 };

/** The board's path with the admin query (only what differs from the defaults). Pure. */
export function boardPath(path: string, board: string, f: AdminFilter): string {
  if (!ADMIN_BOARDS.has(board)) return path;
  const qs = new URLSearchParams();
  if (f.q.trim()) qs.set("q", f.q.trim());
  if (f.cohort) qs.set("cohort", f.cohort);
  if (f.sort !== "rank") qs.set("sort", f.sort);
  if (f.page > 1) qs.set("page", String(f.page));
  const s = qs.toString();
  return s ? `${path}?${s}` : path;
}

/** The small line under a name on the admin board: cohort, then the board's own numbers. */
function adminMeta(board: string, r: LeaderboardRow): string {
  const x = r.extra ?? {};
  const own = board === "league" ? `${String(x.tier ?? "Neuron")} league` : board === "quiz" ? `${Number(x.xp ?? 0)} XP all time` : board === "overall" ? `Level ${Number(x.level ?? 1)} · ${Number(x.hours ?? 0)} h` : null;
  return [r.title ?? "No cohort", own].filter(Boolean).join(" · ");
}

/** A board: your cohort only, first name and initial. You are marked. Admins see every student, with search and pages. */
export function BoardScreen() {
  const c = useTheme();
  const p = useLocalSearchParams<{ board?: string; game?: string }>();
  const want = p.board ?? p.game;
  const [board, setBoardRaw] = React.useState(want && BOARDS.some((g) => g.id === want) ? want : "league");
  const [filter, setFilter] = React.useState<AdminFilter>(NO_FILTER);
  const [draft, setDraft] = React.useState("");
  const setBoard = (b: string) => {
    setBoardRaw(b);
    setFilter((f) => ({ ...f, page: 1 }));
  };
  // While the next page or search loads, the last page of the same board stays up (no blank, the search box keeps focus).
  const q = useQuery({ ...readQuery<Leaderboard>(boardPath(BOARDS.find((b) => b.id === board)!.path, board, filter)), placeholderData: (prev) => (prev?.board === board ? prev : undefined) });
  const d = q.data;
  const admin = d?.admin;
  const patch = (x: Partial<AdminFilter>) => setFilter((f) => ({ ...f, page: 1, ...x }));
  return (
    <Screen testID="board" title={d?.label ?? "Boards"} lead={d ? [d.period, d.scope].filter(Boolean).join(" · ") : undefined} gap={space[5]}>
      <Chips scroll label="Board" options={BOARDS.map((b) => ({ id: b.id, name: b.name }))} value={board} onChange={setBoard} />
      {admin ? (
        <View style={{ gap: space[3] }} testID="board-admin">
          <Field label="Find a student" placeholder="Name" value={draft} onChangeText={setDraft} returnKeyType="search" autoCapitalize="none" autoCorrect={false} onSubmitEditing={() => patch({ q: draft })} testID="board-search" />
          <Chips scroll label="Cohort" options={[{ id: "", name: "All cohorts" }, ...admin.cohorts.map((x) => ({ id: x.id, name: x.name }))]} value={admin.cohort ?? ""} onChange={(cohort) => patch({ cohort })} />
          <Chips label="Sort" options={[{ id: "rank" as const, name: "Rank" }, { id: "name" as const, name: "Name" }, { id: "cohort" as const, name: "Cohort" }]} value={admin.sort} onChange={(sort) => patch({ sort })} />
        </View>
      ) : null}
      {/* The XP shop lives in Me now (uxme adds the row there): the board is the list only. */}
      {d?.explainer ? (
        <T v="small" tone="muted">
          {d.explainer}
        </T>
      ) : null}
      {q.isError ? (
        isSoon(q.error) ? <SoonState web="/leaderboard" /> : <LoadError error={q.error} onRetry={() => void q.refetch()} />
      ) : !d ? (
        <View style={{ gap: space[3] }}>
          <RowsSkeleton rows={8} />
          <StillTrying failed={q.failureCount > 0} />
        </View>
      ) : !d.rows.length ? (
        admin ? <EmptyState mood="empty" title={admin.q ? "No student matches" : "No students here yet"} body={admin.q ? `Nobody called "${admin.q}" on this board.` : "Add students to this cohort and they show up here."} /> : <EmptyState mood="empty" title="Nobody on the board yet" body="Play this week and your name shows up here." />
      ) : (
        <Stagger>
        <RowList>
          {d.rows.map((r) => (
            <View key={`${r.rank}-${r.name}`} accessible accessibilityLabel={`${r.rank}. ${r.name}${r.me ? " (you)" : ""}, ${r.points} points`} style={{ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[4], marginHorizontal: -space[2], paddingHorizontal: space[2], borderRadius: 8, backgroundColor: r.me ? c.tint : "transparent" }} testID={r.me ? "board-you" : undefined}>
              <T numberOfLines={1} style={{ fontFamily: fonts.pixelDigits, fontSize: 18, lineHeight: 24, minWidth: 40, flexShrink: 0, color: r.rank <= 3 ? c.link : c.muted }} num>
                {r.rank}
              </T>
              {admin ? (
                <View style={{ flex: 1, minWidth: 0 }}>
                  <T v="bodyStrong" numberOfLines={1}>
                    {r.name}
                  </T>
                  <T v="caption" tone="muted" numberOfLines={1}>
                    {adminMeta(board, r)}
                  </T>
                </View>
              ) : (
                <T v="bodyStrong" style={{ flex: 1, minWidth: 0 }} tone={r.me ? "link" : "ink"}>
                  {r.me ? `${r.name} (you)` : r.name}
                </T>
              )}
              <T numberOfLines={1} style={{ fontFamily: fonts.pixelDigits, fontSize: 18, lineHeight: 24, flexShrink: 0, color: c.ink }} num>
                {r.points.toLocaleString("en-IN")}
              </T>
            </View>
          ))}
        </RowList>
        </Stagger>
      )}
      {admin && admin.matched ? (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3] }} testID="board-pager">
          {admin.page > 1 ? <Button kind="quiet" label="Back" onPress={() => setFilter((f) => ({ ...f, page: admin.page - 1 }))} testID="board-prev" /> : <View />}
          <T v="small" tone="muted" num>
            {`Page ${admin.page} of ${admin.pages} · ${admin.matched} ${admin.matched === 1 ? "student" : "students"}`}
          </T>
          {admin.page < admin.pages ? <Button kind="quiet" label="Next" onPress={() => setFilter((f) => ({ ...f, page: admin.page + 1 }))} testID="board-next" /> : <View />}
        </View>
      ) : null}
    </Screen>
  );
}
