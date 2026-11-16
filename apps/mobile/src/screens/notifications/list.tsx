import { useQueryClient } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import * as React from "react";
import { Platform } from "react-native";

import type { NotificationList, NotificationRow, ReadAllResult } from "@/api/contract";
import { notificationListView } from "@/api/adapt-learn";
import { keys, useNotifications } from "@/api/queries";
import { api } from "@/auth";
import { Button, EmptyState, Loaded, Row, RowList, Screen } from "@/ds";
import { MoreButton, useMorePages } from "@/ds/more";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";

/** "Today 12:40", "Yesterday", "12 Nov". */
export function when(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const days = Math.floor((new Date(now).setHours(0, 0, 0, 0) - new Date(iso).setHours(0, 0, 0, 0)) / 86_400_000);
  if (days <= 0) return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function NotificationRows({ items }: { items: NotificationRow[] }) {
  return (
    <RowList>
      {items.map((n) => (
        <Row key={n.id} testID={`notification-${n.id}`} unread={!n.readAt} title={n.title} meta={n.body} trailing={when(n.createdAt)} chevron={false} onPress={() => router.push(`/notification/${encodeURIComponent(n.id)}`)} accessibilityLabel={`${n.readAt ? "" : "Unread. "}${n.title}. ${n.body}`} />
      ))}
    </RowList>
  );
}

/** Every notification, 50 at a time. */
function AllNotifications({ first }: { first: NotificationList }) {
  const m = useMorePages(first, async (cursor) => notificationListView(await api.get<unknown>("/notifications", { query: { limit: 50, cursor } })));
  return (
    <>
      <NotificationRows items={m.items} />
      <MoreButton more={m.more} busy={m.busy} error={m.error} onPress={() => void m.loadMore()} testID="notifications-more" />
    </>
  );
}

/** Notifications: one list, newest first, a blue dot and bold title when unread. */
export function NotificationsScreen() {
  const qc = useQueryClient();
  const q = useNotifications();
  const [busy, setBusy] = React.useState(false);
  const readAll = async () => {
    setBusy(true);
    try {
      await api.post<ReadAllResult>("/notifications/read-all");
      haptic.select();
      await Promise.all([qc.invalidateQueries({ queryKey: keys.notifications }), qc.invalidateQueries({ queryKey: keys.me })]);
    } catch {
      toast.show("Could not mark them read. Try again.");
    } finally {
      setBusy(false);
    }
  };
  const unread = q.data?.unread ?? 0;
  return (
    <Screen testID="notifications" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Stack.Screen options={{ headerRight: () => (unread ? <Button kind="text" label="Mark all read" busy={busy} onPress={() => void readAll()} testID="read-all" style={{ marginRight: Platform.OS === "web" ? 16 : 0 }} /> : null) }} />
      <Loaded q={q} what="your notifications">
        {(d) => (d.items.length ? <AllNotifications first={d} /> : <EmptyState mood="clear" title="Nothing new" body="Messages from the school and answers to your doubts show up here." testID="notifications-empty" />)}
      </Loaded>
    </Screen>
  );
}
