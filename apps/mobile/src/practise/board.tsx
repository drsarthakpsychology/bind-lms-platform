import { router, useLocalSearchParams } from "expo-router";
import { ShoppingBag } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Chips, EmptyState, LoadError, Row, RowList, RowsSkeleton, Screen, T } from "@/ds";
import { fonts, layout, space, useTheme } from "@/theme";
import { isSoon, useRead } from "./api";
import type { Leaderboard } from "./contract";
import { Stagger } from "./fx";

/** The boards the server keeps (GET /leaderboards/:board and /leaderboards/games/:game). */
const BOARDS = [
  { id: "league", name: "League", path: "/leaderboards/league" },
  { id: "quiz", name: "Games", path: "/leaderboards/quiz" },
  { id: "overall", name: "All time", path: "/leaderboards/overall" },
  { id: "rx", name: "Rx Detective", path: "/leaderboards/games/rx" },
  { id: "mse", name: "MSE Lab", path: "/leaderboards/games/mse" },
  { id: "comorbid", name: "Comorbid", path: "/leaderboards/games/comorbid" },
];

/** A board: your cohort only, first name and initial. You are marked. */
export function BoardScreen() {
  const c = useTheme();
  const p = useLocalSearchParams<{ board?: string; game?: string }>();
  const want = p.board ?? p.game;
  const [board, setBoard] = React.useState(want && BOARDS.some((g) => g.id === want) ? want : "league");
  const q = useRead<Leaderboard>(BOARDS.find((b) => b.id === board)!.path);
  const d = q.data;
  return (
    <Screen testID="board" title={d?.label ?? "Boards"} lead={d ? [d.period, d.scope].filter(Boolean).join(" · ") : undefined} gap={space[5]}>
      <Chips scroll label="Board" options={BOARDS.map((b) => ({ id: b.id, name: b.name }))} value={board} onChange={setBoard} />
      <RowList>
        <Row testID="board-shop" title="XP shop" meta="Spend XP on name frames, titles and a streak repair" icon={<ShoppingBag size={20} color={c.muted} />} onPress={() => router.push("/shop")} />
      </RowList>
      {d?.explainer ? (
        <T v="small" tone="muted">
          {d.explainer}
        </T>
      ) : null}
      {q.isError ? (
        isSoon(q.error) ? <EmptyState mood="sleepy" title="Coming in the next update" body="The board is ready on the website and arrives in the app soon." /> : <LoadError error={q.error} onRetry={() => void q.refetch()} />
      ) : !d ? (
        <RowsSkeleton rows={8} />
      ) : !d.rows.length ? (
        <EmptyState mood="sleepy" title="Nobody on the board yet" body="Play this week and your name shows up here." />
      ) : (
        <Stagger>
        <RowList>
          {d.rows.map((r) => (
            <View key={`${r.rank}-${r.name}`} accessible accessibilityLabel={`${r.rank}. ${r.name}${r.me ? " (you)" : ""}, ${r.points} points`} style={{ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[4], marginHorizontal: -space[2], paddingHorizontal: space[2], borderRadius: 8, backgroundColor: r.me ? c.tint : "transparent" }} testID={r.me ? "board-you" : undefined}>
              <T style={{ fontFamily: fonts.pixelDigits, fontSize: 18, lineHeight: 24, minWidth: 40, color: r.rank <= 3 ? c.link : c.muted }} num>
                {r.rank}
              </T>
              <T v="bodyStrong" style={{ flex: 1 }} tone={r.me ? "link" : "ink"}>
                {r.me ? `${r.name} (you)` : r.name}
              </T>
              <T style={{ fontFamily: fonts.pixelDigits, fontSize: 18, lineHeight: 24, color: c.ink }} num>
                {r.points}
              </T>
            </View>
          ))}
        </RowList>
        </Stagger>
      )}
    </Screen>
  );
}
