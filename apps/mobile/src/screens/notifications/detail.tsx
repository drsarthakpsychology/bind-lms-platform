import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { Linking, View } from "react-native";

import type { MessageBlock, MessageSpan } from "@/api/contract";
import { keys, useNotification } from "@/api/queries";
import { Button, Loaded, RowsSkeleton, Screen, T } from "@/ds";
import { openTarget } from "@/nav/targets";
import { space } from "@/theme";
import { when } from "./list";

function Spans({ spans }: { spans: MessageSpan[] }) {
  return (
    <>
      {spans.map((s, i) => {
        const style = { fontFamily: s.bold ? "Archivo-700" : undefined, fontStyle: s.italic ? ("italic" as const) : undefined };
        if (s.link) {
          const link = s.link;
          return (
            <T key={i} v="reading" tone="link" accessibilityRole="link" style={[style, { textDecorationLine: "underline" }]} onPress={() => (link.target ? openTarget(link.target) : link.url ? void Linking.openURL(link.url) : undefined)}>
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
  return (
    <Screen testID="notification">
      <Loaded q={q} what="this message" skeleton={<RowsSkeleton rows={3} />}>
        {(n) => {
          const link = n.links.find((l) => l.target);
          return (
            <>
              <View style={{ gap: space[2] }}>
                <T v="h1">{n.title}</T>
                <T v="small" tone="muted">
                  {[n.from, when(n.createdAt)].filter(Boolean).join(" · ")}
                </T>
              </View>
              <MessageBody blocks={n.content.length ? n.content : [{ t: "p", spans: [{ text: n.body }] }]} />
              {link?.target ? <Button label={link.label} onPress={() => openTarget(link.target!)} testID="notification-action" /> : n.target.screen !== "notification" ? <Button label="Open" onPress={() => openTarget(n.target)} testID="notification-action" /> : null}
            </>
          );
        }}
      </Loaded>
    </Screen>
  );
}
