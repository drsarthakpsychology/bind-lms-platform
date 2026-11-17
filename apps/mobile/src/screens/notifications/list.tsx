import { useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as React from "react";
import { Platform } from "react-native";

import type { NotificationList, NotificationRow, ReadAllResult } from "@/api/contract";
import { notificationListView } from "@/api/adapt-learn";
import { ApiFailure } from "@/api/errors";
import { go } from "@/api/prefetch";
import { queueWrite } from "@/api/queued";
import { keys, useNotifications } from "@/api/queries";
import { api } from "@/auth";
import { Button, EmptyState, Loaded, Row, RowList, Screen, Section } from "@/ds";
import { MoreButton, useMorePages } from "@/ds/more";
import { toast } from "@/ds/toast";

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

/** Today, This week (the last 7 days) or Earlier. */
export function dayGroup(iso: string | null | undefined, now = Date.now()): "Today" | "This week" | "Earlier" {
  const t = iso ? Date.parse(iso) : NaN;
  if (!Number.isFinite(t)) return "Earlier";
  const days = Math.floor((new Date(now).setHours(0, 0, 0, 0) - new Date(t).setHours(0, 0, 0, 0)) / 86_400_000);
  if (days <= 0) return "Today";
  if (days < 7) return "This week";
  return "Earlier";
}

/** The rows under Today, This week and Earlier headings (newest first, as the server sends them). */
export function NotificationGroups({ items, now }: { items: NotificationRow[]; now: number }) {
  const groups = (["Today", "This week", "Earlier"] as const).map((g) => ({ g, rows: items.filter((n) => dayGroup(n.createdAt, now) === g) })).filter((x) => x.rows.length);
  return (
    <>
      {groups.map(({ g, rows }) => (
        <Section key={g} title={g} quiet>
          <NotificationRows items={rows} />
        </Section>
      ))}
    </>
  );
}

export function NotificationRows({ items }: { items: NotificationRow[] }) {
  return (
    <RowList>
      {items.map((n) => (
        <Row key={n.id} testID={`notification-${n.id}`} unread={!n.readAt} title={n.title} meta={n.body} trailing={when(n.createdAt)} chevron={false} onPress={() => go(`/notification/${encodeURIComponent(n.id)}`)} accessibilityLabel={`${n.readAt ? "" : "Unread. "}${n.title}. ${n.body}`} />
      ))}
    </RowList>
  );
}

/** Every notification, 50 at a time, under the day headings; "Show older" brings the next 50 into them. */
function AllNotifications({ first, now }: { first: NotificationList; now: number }) {
  const m = useMorePages(first, async (cursor) => notificationListView(await api.get<unknown>("/notifications", { query: { limit: 50, cursor } })));
  return (
    <>
      <NotificationGroups items={m.items} now={now} />
      <MoreButton more={m.more} busy={m.busy} error={m.error} onPress={() => void m.loadMore()} testID="notifications-more" />
    </>
  );
}

/** Notifications: newest first under Today, This week and Earlier; a blue dot and bold title when unread. */
export function NotificationsScreen() {
  const qc = useQueryClient();
  const q = useNotifications();
  const [busy, setBusy] = React.useState(false);
  const readAll = async () => {
    setBusy(true);
    try {
      await api.post<ReadAllResult>("/notifications/read-all");
      await Promise.all([qc.invalidateQueries({ queryKey: keys.notifications }), qc.invalidateQueries({ queryKey: keys.me })]);
    } catch (e) {
      if (e instanceof ApiFailure && e.code === "network") {
        // Offline: mark them read here now, and tell the server when the internet is back.
        const at = new Date().toISOString();
        qc.setQueryData<NotificationList>(keys.notifications, (l) => (l ? { ...l, unread: 0, items: l.items.map((n) => (n.readAt ? n : { ...n, readAt: at })) } : l));
        void queueWrite({ method: "POST", path: "/notifications/read-all", scope: "read-all" })
          .then(() => Promise.all([qc.invalidateQueries({ queryKey: keys.notifications }), qc.invalidateQueries({ queryKey: keys.me })]))
          .catch(() => undefined);
      } else toast.show("Could not mark them read. Try again.");
    } finally {
      setBusy(false);
    }
  };
  const unread = q.data?.unread ?? 0;
  const [now] = React.useState(() => Date.now());
  return (
    <Screen testID="notifications" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Stack.Screen options={{ headerRight: () => (unread ? <Button kind="text" label="Mark all read" busy={busy} onPress={() => void readAll()} testID="read-all" style={{ marginRight: Platform.OS === "web" ? 16 : 0 }} /> : null) }} />
      <Loaded q={q} what="your notifications">
        {(d) => (d.items.length ? <AllNotifications first={d} now={now} /> : <EmptyState mood="clear" title="Nothing new" body="Messages from the school and answers to your doubts show up here." testID="notifications-empty" />)}
      </Loaded>
    </Screen>
  );
}
