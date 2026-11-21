import { router, Stack } from "expo-router";
import { Check, MessagesSquare, Plus } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { doubtListView } from "@/api/adapt-learn";
import type { DoubtList, DoubtRow } from "@/api/contract";
import { go } from "@/api/prefetch";
import { useDoubts } from "@/api/queries";
import { api } from "@/auth";
import { Button, Chips, Jyo, QuietEmpty, Screen, Stone, T } from "@/ds";
import { MoreButton, useMorePages } from "@/ds/more";
import { StaggerList } from "@/motion";
import { TabTop } from "@/nav/top";
import { Fetched, Pill, Tile, TilesSkeleton } from "@/screens/learn/parts";
import { when } from "@/screens/notifications/list";
import { space, useTheme } from "@/theme";

export function doubtMeta(d: DoubtRow): string {
  const replies = d.replies === 0 ? "No answers yet" : d.replies === 1 ? "1 answer" : `${d.replies} answers`;
  return [d.topic, d.mine ? "You" : d.author, replies, when(d.createdAt)].filter(Boolean).join(" · ");
}

/** One doubt on a stone: the question, who asked and when, and one word for where it stands. */
function DoubtCard({ d }: { d: DoubtRow }) {
  const c = useTheme();
  const answers = d.replies === 0 ? "No answers yet" : d.replies === 1 ? "1 answer" : `${d.replies} answers`;
  return (
    <Stone testID={`doubt-${d.id}`} pad={space[3] + 2} accessibilityLabel={`${d.title}. ${doubtMeta(d)}${d.status === "solved" ? ". Solved" : ""}`} onPress={() => go(`/doubt/${encodeURIComponent(d.id)}`)}>
      <View style={{ gap: space[2] }}>
        <T v="bodyStrong">{d.title}</T>
        <T v="small" tone="muted" num>
          {[d.topic, d.mine ? "You" : d.author, when(d.createdAt)].filter(Boolean).join(" · ")}
        </T>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          {d.status === "solved" ? (
            <Pill tone="ink" icon={<Check size={12} color={c.bg} strokeWidth={3} />}>
              Solved
            </Pill>
          ) : null}
          <Pill>{answers}</Pill>
          {d.lastReplyBy === "faculty" && d.status !== "solved" ? <Pill>The team answered</Pill> : null}
          {d.kind === "complaint" ? <Pill tone="warm">Something is wrong</Pill> : null}
        </View>
      </View>
    </Stone>
  );
}

function DoubtsBody() {
  const [mine, setMine] = React.useState<"all" | "mine">("all");
  const q = useDoubts(mine === "mine");
  return (
    <>
      <Chips
        label="Show"
        options={[
          { id: "all", name: "Everyone's" },
          { id: "mine", name: "Mine" },
        ]}
        value={mine}
        onChange={setMine}
      />
      <Fetched q={q} what="doubts" skeleton={<TilesSkeleton rows={4} />}>
        {(d) => (
          <>
            {d.wall ? <Tile testID="doubts-wall" quiet icon={MessagesSquare} title="Class wall" meta="Talk with your batch, with or without your name" onPress={() => router.push("/wall")} /> : null}
            {d.items.length ? (
              <DoubtRows key={mine} first={d} mine={mine === "mine"} />
            ) : (
              <QuietEmpty testID="doubts-empty" art={<Jyo pose="resting" size={64} />} title={mine === "mine" ? "You have not asked anything yet" : "No doubts yet"} body="Ask about anything from the lectures or the reading. The faculty and your batch answer here." />
            )}
          </>
        )}
      </Fetched>
    </>
  );
}

/** Every doubt, 50 at a time (a whole batch asks far more than one page). */
function DoubtRows({ first, mine }: { first: DoubtList; mine: boolean }) {
  const m = useMorePages(first, async (cursor) => doubtListView(await api.get<unknown>("/doubts", { query: { mine: mine ? 1 : undefined, limit: 50, cursor } })));
  return (
    <>
      <StaggerList style={{ gap: space[2] }}>
        {m.items.map((x) => (
          <DoubtCard key={x.id} d={x} />
        ))}
      </StaggerList>
      <MoreButton more={m.more} busy={m.busy} error={m.error} onPress={() => void m.loadMore()} testID="doubts-more" />
    </>
  );
}

const ask = (c: ReturnType<typeof useTheme>) => <Button label="Ask a doubt" icon={<Plus size={20} color={c.onPrimary} />} onPress={() => router.push("/doubts/ask")} testID="doubts-ask" />;

/** Doubts, opened from Learn or Me: read and ask. Ask is the one lime button, pinned low. */
export function DoubtsScreen() {
  const c = useTheme();
  return (
    <Screen testID="doubts" title="Doubts" lead="Asked by your batch, answered by the team" gap={space[4]} footer={ask(c)}>
      <Stack.Screen options={{ title: "" }} />
      <DoubtsBody />
    </Screen>
  );
}

/** The Doubts tab of a lectures-only account. */
export function DoubtsTab() {
  const c = useTheme();
  return (
    <Screen tab top={<TabTop />} title="Doubts" lead="Asked by your batch, answered by the team" testID="doubts-tab" gap={space[4]} footer={ask(c)}>
      <DoubtsBody />
    </Screen>
  );
}
