import { useQueryClient } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { Award, Bell, BellRing, Mail, Medal, MessageCircleQuestionMark, SlidersHorizontal } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { NotificationList, NotificationRow, ReadAllResult } from "@/api/contract";
import { notificationListView } from "@/api/adapt-learn";
import { ApiFailure } from "@/api/errors";
import { go } from "@/api/prefetch";
import { queueWrite } from "@/api/queued";
import { keys, useNotifications } from "@/api/queries";
import { api } from "@/auth";
import { FieldCard, Jyo, QuietEmpty, Row, RowsSkeleton, Screen } from "@/ds";
import { MoreButton, useMorePages } from "@/ds/more";
import { toast } from "@/ds/toast";
import { Group, IconPatch, Load } from "@/screens/me/parts";
import { space, type Area } from "@/theme";

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

const KIND: Record<string, { icon: typeof Bell; area: Area }> = {
  message: { icon: Mail, area: "learn" },
  nudge: { icon: BellRing, area: "home" },
  achievement: { icon: Medal, area: "me" },
  certificate: { icon: Award, area: "me" },
  doubt: { icon: MessageCircleQuestionMark, area: "library" },
};

/** The rows under Today, This week and Earlier headings (newest first, as the server sends them). */
export function NotificationGroups({ items, now }: { items: NotificationRow[]; now: number }) {
  const groups = (["Today", "This week", "Earlier"] as const).map((g) => ({ g, rows: items.filter((n) => dayGroup(n.createdAt, now) === g) })).filter((x) => x.rows.length);
  return (
    <>
      {groups.map(({ g, rows }) => (
        <NotificationRows key={g} title={g} items={rows} />
      ))}
    </>
  );
}

export function NotificationRows({ items, title }: { items: NotificationRow[]; title?: string }) {
  return (
    <Group title={title}>
      {items.map((n) => {
        const k = KIND[n.type] ?? { icon: Bell, area: "me" as const };
        return <Row key={n.id} testID={`notification-${n.id}`} unread={!n.readAt} title={n.title} meta={n.body} icon={<IconPatch icon={k.icon} area={k.area} size={36} />} trailing={when(n.createdAt)} chevron={false} onPress={() => go(`/notification/${encodeURIComponent(n.id)}`)} accessibilityLabel={`${n.readAt ? "" : "Unread. "}${n.title}. ${n.body}`} />;
      })}
    </Group>
  );
}

/** Every notification, 50 at a time, under the day headings; "Show older" brings the next 50 into them. */
function AllNotifications({ first, now }: { first: NotificationList; now: number }) {
  const m = useMorePages(first, async (cursor) => notificationListView(await api.get<unknown>("/notifications", { query: { limit: 50, cursor } })));
  return (
    <View style={{ gap: space[5] }}>
      <NotificationGroups items={m.items} now={now} />
      <MoreButton more={m.more} busy={m.busy} error={m.error} onPress={() => void m.loadMore()} testID="notifications-more" />
    </View>
  );
}

/**
 * Notifications: newest first under Today, This week and Earlier; a dot and a
 * bold title when unread. The count of unread sits on the field with the one
 * action, Mark all read. The last row opens what you get notified about.
 */
export function NotificationsScreen() {
  const qc = useQueryClient();
  const q = useNotifications();
  const [busy, setBusy] = React.useState(false);
  const readAll = async () => {
    if (busy) return;
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
    <Screen
      testID="notifications"
      title="Notifications"
      lead={q.data ? (unread ? undefined : "You are all caught up.") : undefined}
      gap={space[5]}
      onRefresh={() => void q.refetch()}
      refreshing={q.isRefetching}
      field={unread ? <FieldCard testID="notifications-unread" live title={`${unread} unread`} meta="Open one to read it" action={{ label: busy ? "Marking" : "Mark all read", onPress: () => void readAll(), testID: "read-all" }} /> : undefined}
    >
      <Stack.Screen options={{ title: "", headerRight: undefined }} />
      <Load q={q} what="your notifications" skeleton={<RowsSkeleton rows={5} />}>
        {(d) => (d.items.length ? <AllNotifications first={d} now={now} /> : <QuietEmpty testID="notifications-empty" title="Nothing new" body="Messages from the school and answers to your doubts show up here." art={<Jyo pose="resting" size={56} />} />)}
      </Load>
      <Group>
        <Row testID="notifications-settings" title="Choose what you get" meta="Messages, doubt answers, badges, a daily reminder" icon={<IconPatch icon={SlidersHorizontal} area="me" size={36} />} onPress={() => router.push("/notification-settings")} />
      </Group>
    </Screen>
  );
}
