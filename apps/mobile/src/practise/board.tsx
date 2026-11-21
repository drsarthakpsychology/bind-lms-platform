import { useQuery } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ArrowRight, ShoppingBag } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, Chips, Field, FieldCard, QuietEmpty, RowsSkeleton, Screen, StillTrying, Stone, T } from "@/ds";
import { RollingNumber } from "@/motion";
import { IconPatch, QuietError, Rise } from "@/screens/me/parts";
import { fonts, layout, space, useTheme } from "@/theme";
import { useMe } from "@/api/queries";
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

/** The first three, as steps that rise: second, first, third. The first step is the lime one. */
function Podium({ rows }: { rows: LeaderboardRow[] }) {
  const c = useTheme();
  const order = [rows[1], rows[0], rows[2]].filter(Boolean) as LeaderboardRow[];
  const H: Record<number, number> = { 1: 104, 2: 80, 3: 64 };
  return (
    <View testID="board-podium" style={{ flexDirection: "row", alignItems: "flex-end", gap: space[2] }}>
      {order.map((r, i) => {
        const first = r.rank === 1;
        return (
          <View key={`${r.rank}-${r.name}`} testID={r.me ? "board-you" : undefined} accessible accessibilityLabel={`${r.rank}. ${r.name}${r.me ? " (you)" : ""}, ${r.points} points`} style={{ flex: 1, gap: space[2] }}>
            <View style={{ alignItems: "center", gap: 2 }}>
              <T v="bodyStrong" center numberOfLines={1} tone={r.me ? "link" : "ink"}>
                {r.name}
              </T>
              <T v="caption" tone="muted" center>
                {r.me ? "You" : " "}
              </T>
            </View>
            <Rise i={i * 3} h={H[r.rank] ?? 64} radius={layout.radius} color={first ? c.lime : c.card} style={{ alignItems: "center", justifyContent: "center", gap: 2 }}>
              <T maxFontSizeMultiplier={1.2} style={{ fontFamily: fonts.big, fontSize: first ? 30 : 24, lineHeight: first ? 32 : 26, color: first ? c.onLime : c.ink }} num>
                {r.rank}
              </T>
              <RollingNumber v="small" value={r.points} format={(n) => n.toLocaleString("en-IN")} style={{ color: first ? c.onLime : c.muted, fontFamily: fonts.semibold }} />
            </Rise>
          </View>
        );
      })}
    </View>
  );
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
  const canShop = useMe().data?.role === "student";
  const podium = !admin && d && d.rows.length >= 3 && d.rows[0]?.rank === 1;
  const rest = d ? (podium ? d.rows.slice(3) : d.rows) : [];
  const mine = d && !admin && d.me.rank ? { title: `You are number ${d.me.rank} of ${d.me.total}`, meta: d.period } : null;
  return (
    <Screen testID="board" title={d?.label ?? "Leaderboard"} lead={d ? [mine ? null : d.period, d.scope].filter(Boolean).join(" · ") || undefined : undefined} gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching} field={mine ? <FieldCard testID="board-mine" live title={mine.title} meta={mine.meta} /> : undefined}>
      <Stack.Screen options={{ title: "" }} />
      <Chips scroll label="Board" options={BOARDS.map((b) => ({ id: b.id, name: b.name }))} value={board} onChange={setBoard} />
      {admin ? (
        <View style={{ gap: space[3] }} testID="board-admin">
          <Field label="Find a student" placeholder="Name" value={draft} onChangeText={setDraft} returnKeyType="search" autoCapitalize="none" autoCorrect={false} onSubmitEditing={() => patch({ q: draft })} testID="board-search" />
          <Chips scroll label="Cohort" options={[{ id: "", name: "All cohorts" }, ...admin.cohorts.map((x) => ({ id: x.id, name: x.name }))]} value={admin.cohort ?? ""} onChange={(cohort) => patch({ cohort })} />
          <Chips label="Sort" options={[{ id: "rank" as const, name: "Rank" }, { id: "name" as const, name: "Name" }, { id: "cohort" as const, name: "Cohort" }]} value={admin.sort} onChange={(sort) => patch({ sort })} />
        </View>
      ) : null}
      {(q.isError && q.data === undefined) ? (
        isSoon(q.error) ? <SoonState web="/leaderboard" /> : <QuietError what="the board" error={q.error} onRetry={() => void q.refetch()} />
      ) : !d ? (
        <View style={{ gap: space[3] }}>
          <RowsSkeleton rows={8} />
          <StillTrying failed={q.failureCount > 0} />
        </View>
      ) : !d.rows.length ? (
        admin ? <QuietEmpty title={admin.q ? "No student matches" : "No students here yet"} body={admin.q ? `Nobody called "${admin.q}" on this board.` : "Add students to this cohort and they show up here."} /> : <QuietEmpty testID="board-empty" title="Nobody on the board yet" body="Play this week and your name shows up here." action={{ label: "Open Practise", onPress: () => router.push("/practise") }} />
      ) : (
        <View style={{ gap: space[4] }}>
          {podium ? <Podium rows={d.rows} /> : null}
          {rest.length ? (
            <Stone pad={space[2]}>
              <Stagger>
                {rest.map((r) => (
                  <View key={`${r.rank}-${r.name}`} accessible accessibilityLabel={`${r.rank}. ${r.name}${r.me ? " (you)" : ""}, ${r.points} points`} style={{ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[3], paddingHorizontal: space[3], borderRadius: layout.radius, backgroundColor: r.me ? c.areas.me.wash : "transparent" }} testID={r.me ? "board-you" : undefined}>
                    <T v="bodyStrong" numberOfLines={1} tone="muted" style={{ minWidth: 34, flexShrink: 0, color: r.me ? c.areas.me.deep : c.muted }} num>
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
                      <T v="bodyStrong" style={{ flex: 1, minWidth: 0, color: r.me ? c.areas.me.deep : c.ink }}>
                        {r.me ? `${r.name} (you)` : r.name}
                      </T>
                    )}
                    <T v="bodyStrong" numberOfLines={1} style={{ flexShrink: 0, color: r.me ? c.areas.me.deep : c.ink }} num>
                      {r.points.toLocaleString("en-IN")}
                    </T>
                  </View>
                ))}
              </Stagger>
            </Stone>
          ) : null}
        </View>
      )}
      {admin && admin.matched ? (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3] }} testID="board-pager">
          {admin.page > 1 ? <Button kind="quiet" full={false} label="Back" onPress={() => setFilter((f) => ({ ...f, page: admin.page - 1 }))} testID="board-prev" /> : <View />}
          <T v="small" tone="muted" num>
            {`Page ${admin.page} of ${admin.pages} · ${admin.matched} ${admin.matched === 1 ? "student" : "students"}`}
          </T>
          {admin.page < admin.pages ? <Button kind="quiet" full={false} label="Next" onPress={() => setFilter((f) => ({ ...f, page: admin.page + 1 }))} testID="board-next" /> : <View />}
        </View>
      ) : null}
      {d?.explainer ? (
        <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
          {d.explainer}
        </T>
      ) : null}
      {canShop && !admin ? (
        <Stone quiet grow={() => router.push("/shop")} testID="board-shop" accessibilityLabel="XP shop. Spend what you earn on name frames, titles and a streak repair">
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
            <IconPatch icon={ShoppingBag} area="home" />
            <View style={{ flex: 1, minWidth: 0 }}>
              <T v="bodyStrong">XP shop</T>
              <T v="small" tone="muted">
                Spend what you earn on name frames and titles
              </T>
            </View>
            <ArrowRight size={20} color={c.muted} />
          </View>
        </Stone>
      ) : null}
    </Screen>
  );
}
