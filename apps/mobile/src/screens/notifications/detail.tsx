import { useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { openLink } from "@/lib/open";
import { View } from "react-native";

import type { MessageBlock, MessageSpan } from "@/api/contract";
import { keys, useNotification } from "@/api/queries";
import { Button, RowsSkeleton, Screen, T } from "@/ds";
import { Load } from "@/screens/me/parts";
import { openTarget } from "@/nav/targets";
import { space, fonts } from "@/theme";
import { when } from "./list";

function Spans({ spans }: { spans: MessageSpan[] }) {
  return (
    <>
      {spans.map((s, i) => {
        const style = { fontFamily: s.bold ? fonts.bold : undefined, fontStyle: s.italic ? ("italic" as const) : undefined };
        if (s.link) {
          const link = s.link;
          return (
            <T key={i} v="reading" tone="link" accessibilityRole="link" style={[style, { textDecorationLine: "underline" }]} onPress={() => (link.target ? openTarget(link.target) : link.url ? void openLink(link.url) : undefined)}>
              {s.text}
            </T>
          );
        }
        return (
          <T key={i} v="reading" style={style}>
            {s.text}
          </T>
        );
      })}
    </>
  );
}

/** A message drawn from blocks (never HTML): paragraphs, headings and lists. */
export function MessageBody({ blocks }: { blocks: MessageBlock[] }) {
  return (
    <View style={{ gap: space[4] }}>
      {blocks.map((b, i) => {
        if (b.t === "p")
          return (
            <T key={i} v="reading">
              <Spans spans={b.spans} />
            </T>
          );
        if (b.t === "h")
          return (
            <T key={i} v="h3">
              {b.spans.map((s) => s.text).join("")}
            </T>
          );
        return (
          <View key={i} style={{ gap: space[2] }}>
            {b.items.map((item, j) => (
              <View key={j} style={{ flexDirection: "row", gap: space[3] }}>
                <T v="reading" tone="muted" style={{ minWidth: 18 }}>
                  {b.t === "ol" ? `${j + 1}.` : "•"}
                </T>
                <T v="reading" style={{ flex: 1 }}>
                  <Spans spans={item} />
                </T>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

/**
 * One message. The title and who sent it sit on the field (the title glides
 * out of the row that opened it); the words are on the layer, still, in the
 * reading size; the one thing to do next is the button at the bottom.
 */
export function NotificationScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const q = useNotification(String(id));
  // Opening marks it read: refresh the list and the bell.
  React.useEffect(() => {
    if (!q.data) return;
    void qc.invalidateQueries({ queryKey: keys.notifications });
    void qc.invalidateQueries({ queryKey: keys.me });
  }, [q.data, qc]);
  const n = q.data;
  const link = n?.links.find((l) => l.target);
  const action = n ? (link?.target ? <Button label={link.label} onPress={() => openTarget(link.target!)} testID="notification-action" /> : n.target.screen !== "notification" ? <Button label="Open" onPress={() => openTarget(n.target)} testID="notification-action" /> : undefined) : undefined;
  return (
    <Screen testID="notification" title={n?.title} lead={n ? [n.from, when(n.createdAt)].filter(Boolean).join(" · ") : undefined} footer={action}>
      <Stack.Screen options={{ title: "" }} />
      <Load q={q} what="this message" skeleton={<RowsSkeleton rows={3} />}>
        {(d) => <MessageBody blocks={d.content.length ? d.content : [{ t: "p", spans: [{ text: d.body }] }]} />}
      </Load>
    </Screen>
  );
}
