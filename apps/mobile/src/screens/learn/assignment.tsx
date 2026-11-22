import { Stack, router, useLocalSearchParams } from "expo-router";
import { CirclePlay } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { useLecture } from "@/api/queries";
import { Button, Label, QuietEmpty, Screen, Skeleton } from "@/ds";
import { AssignmentPart } from "@/lecture/assignment";
import { dueWord } from "./assignments";
import { HandInSlot, type FooterAction } from "@/lecture/handin-ui";
import { createStore } from "@/lib/store";
import { Enter } from "@/motion";
import { space } from "@/theme";
import { Fetched, Group, Pill, Tile } from "./parts";

/**
 * One assignment on its own page (opened from Assignments, a course, or
 * Learn). On the field: its title, the lecture it belongs to, the due date.
 * On the layer: where your hand-in stands, what to do, and the way to hand
 * it in. "Hand in" is the one lime button, pinned low. The data is the
 * lecture's (GET /lectures/:id), so nothing new is asked of the server.
 */
export function AssignmentScreen() {
  const { lessonId = "" } = useLocalSearchParams<{ lessonId: string }>();
  const q = useLecture(String(lessonId));
  const l = q.data;
  const a = l?.assignment ?? null;
  // The hand-in part puts its button in this screen's footer.
  const [footer] = React.useState(() => createStore<{ action: FooterAction | null; owner: object | null }>({ action: null, owner: null }));
  const handIn = footer.use((x) => x.action);
  const setHandIn = React.useCallback((action: FooterAction | null, owner: object) => footer.set((s) => (action ? { action, owner } : s.owner === owner ? { action: null, owner: null } : {})), [footer]);
  const [now] = React.useState(() => Date.now());
  const due = a ? dueWord(a.dueAt, now) : null;
  return (
    <Screen
      testID="assignment"
      title={a?.title ?? (l ? "Assignment" : undefined)}
      lead={l ? `Week ${l.week} · ${l.title}` : undefined}
      field={a ? <Pill tone="field">{due ?? "No due date"}</Pill> : undefined}
      gap={space[5]}
      onRefresh={() => void q.refetch()}
      refreshing={q.isRefetching}
      footer={handIn ? <Button label={handIn.label} busy={handIn.busy} disabled={handIn.disabled} needsServer onPress={handIn.onPress} testID={handIn.testID} /> : undefined}
    >
      <Stack.Screen options={{ title: "" }} />
      <Fetched
        q={q}
        what="this assignment"
        skeleton={
          <View style={{ gap: space[3] }}>
            <Skeleton h={88} r={26} />
            <Skeleton w="92%" h={16} />
            <Skeleton w="80%" h={16} />
            <Skeleton h={120} r={18} />
          </View>
        }
      >
        {(d) =>
          d.assignment ? (
            <>
              <HandInSlot.Provider value={setHandIn}>
                <AssignmentPart lecture={d} bare />
              </HandInSlot.Provider>
              <Enter i={2}>
                <Group>
                  <Label>From this lecture</Label>
                  <Tile testID="assignment-lecture" icon={CirclePlay} title={d.title} meta={`${d.number ? `Lecture ${d.number} · ` : ""}Week ${d.week}`} grow={() => router.push(`/lecture/${encodeURIComponent(d.id)}`)} />
                </Group>
              </Enter>
            </>
          ) : (
            <QuietEmpty testID="assignment-none" title="No assignment here" body="This lecture has nothing to hand in." action={{ label: "Open the lecture", onPress: () => router.replace(`/lecture/${encodeURIComponent(d.id)}`) }} />
          )
        }
      </Fetched>
    </Screen>
  );
}
