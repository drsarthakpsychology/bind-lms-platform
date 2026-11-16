import { router } from "expo-router";
import { MessagesSquare, Plus } from "lucide-react-native";
import * as React from "react";

import { doubtListView } from "@/api/adapt-learn";
import type { DoubtList, DoubtRow } from "@/api/contract";
import { useDoubts } from "@/api/queries";
import { api } from "@/auth";
import { Button, Chips, EmptyState, Loaded, Row, RowList, Screen, T } from "@/ds";
import { MoreButton, useMorePages } from "@/ds/more";
import { when } from "@/screens/notifications/list";
import { TabTop } from "@/nav/top";
import { useTheme } from "@/theme";

export function doubtMeta(d: DoubtRow): string {
  const replies = d.replies === 0 ? "No answers yet" : d.replies === 1 ? "1 answer" : `${d.replies} answers`;
  return [d.topic, d.mine ? "You" : d.author, replies, when(d.createdAt)].filter(Boolean).join(" · ");
}

function DoubtsBody() {
  const c = useTheme();
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
      <Loaded q={q} what="doubts">
        {(d) => (
          <>
            {d.wall ? (
              <RowList>
                <Row testID="doubts-wall" icon={<MessagesSquare size={20} color={c.ink} />} title="Class wall" meta="Talk with your batch, with or without your name" onPress={() => router.push("/wall")} />
              </RowList>
            ) : null}
            {d.items.length ? (
              <DoubtRows key={mine} first={d} mine={mine === "mine"} />
            ) : (
              <EmptyState title={mine === "mine" ? "You have not asked anything yet" : "No doubts yet"} body="Ask about anything from the lectures or the reading. The faculty and your batch answer here." testID="doubts-empty" />
            )}
          </>
        )}
      </Loaded>
    </>
  );
}

/** Every doubt, 50 at a time (a whole batch asks far more than one page). */
function DoubtRows({ first, mine }: { first: DoubtList; mine: boolean }) {
  const c = useTheme();
  const m = useMorePages(first, async (cursor) => doubtListView(await api.get<unknown>("/doubts", { query: { mine: mine ? 1 : undefined, limit: 50, cursor } })));
  return (
    <>
      <RowList>
        {m.items.map((x) => (
          <Row key={x.id} testID={`doubt-${x.id}`} title={x.title} meta={doubtMeta(x)} trailing={x.status === "solved" ? <SolvedWord color={c.link} /> : undefined} onPress={() => router.push(`/doubt/${encodeURIComponent(x.id)}`)} />
        ))}
      </RowList>
      <MoreButton more={m.more} busy={m.busy} error={m.error} onPress={() => void m.loadMore()} testID="doubts-more" />
    </>
  );
}

function SolvedWord({ color }: { color: string }) {
  return (
    <T v="small" style={{ color }}>
      Solved
    </T>
  );
}

const ask = (c: ReturnType<typeof useTheme>) => <Button label="Ask a doubt" icon={<Plus size={20} color={c.onPrimary} />} onPress={() => router.push("/doubts/ask")} testID="doubts-ask" />;

/** Doubts, opened from Me: read and ask. Ask is pinned at the bottom. */
export function DoubtsScreen() {
  const c = useTheme();
  return (
    <Screen testID="doubts" footer={ask(c)}>
      <DoubtsBody />
    </Screen>
  );
}

/** The Doubts tab of a lectures-only account. */
export function DoubtsTab() {
  const c = useTheme();
  return (
    <Screen tab top={<TabTop />} title="Doubts" testID="doubts-tab" footer={ask(c)}>
      <DoubtsBody />
    </Screen>
  );
}
