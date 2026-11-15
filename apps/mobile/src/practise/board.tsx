import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { Chips, EmptyState, LoadError, RowList, RowsSkeleton, Screen, T } from "@/ds";
import { fonts, layout, space, useTheme } from "@/theme";
import { isSoon, usePlayQuery } from "./api";
import type { Board } from "./types";

const GAMES = [
  { id: "all", name: "All of Practise" },
  { id: "blitz", name: "Blitz" },
  { id: "sort", name: "Criteria sort" },
  { id: "mse", name: "MSE Lab" },
  { id: "rx", name: "Rx Detective" },
  { id: "daily", name: "Daily case" },
];

/** This week's board: points, Monday to Sunday, your batch. You are marked. */
export function BoardScreen() {
  const c = useTheme();
  const p = useLocalSearchParams<{ game?: string }>();
  const [game, setGame] = React.useState(p.game && GAMES.some((g) => g.id === p.game) ? p.game : "all");
  const q = usePlayQuery<Board>([game], "board", "week", game);
  return (
    <Screen testID="board" title="This week's board" lead={q.data ? `${q.data.week} · your batch` : undefined} gap={space[5]}>
      <Chips scroll label="Game" options={GAMES} value={game} onChange={setGame} />
      {q.isError ? (
        isSoon(q.error) ? <EmptyState mood="sleepy" title="Coming in the next update" body="The board is ready on the website and arrives in the app soon." /> : <LoadError onRetry={() => void q.refetch()} />
      ) : !q.data ? (
        <RowsSkeleton rows={8} />
      ) : (
        <RowList>
          {q.data.rows.map((r) => (
            <View key={r.rank} accessible accessibilityLabel={`${r.rank}. ${r.name}${r.you ? " (you)" : ""}, ${r.points} points`} style={{ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[4], marginHorizontal: -space[2], paddingHorizontal: space[2], borderRadius: 8, backgroundColor: r.you ? c.tint : "transparent" }} testID={r.you ? "board-you" : undefined}>
              <T style={{ fontFamily: fonts.pixelDigits, fontSize: 18, lineHeight: 24, width: 32, color: r.rank <= 3 ? c.link : c.muted }} num>
                {r.rank}
              </T>
              <T v="bodyStrong" style={{ flex: 1 }} tone={r.you ? "link" : "ink"}>
                {r.you ? `${r.name} (you)` : r.name}
              </T>
              <T style={{ fontFamily: fonts.pixelDigits, fontSize: 18, lineHeight: 24, color: c.ink }} num>
                {r.points}
              </T>
            </View>
          ))}
        </RowList>
      )}
    </Screen>
  );
}
