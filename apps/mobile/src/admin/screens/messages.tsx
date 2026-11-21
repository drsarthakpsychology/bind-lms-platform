import { router, useLocalSearchParams } from "expo-router";
import { openLink } from "@/lib/open";
import { PenLine } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, Field, Row, RowList, RowsSkeleton, T } from "@/ds";
import { EmptyState, Screen, Locked } from "../ui";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useBatches, useInbox, useInboxThread, useRefreshAdmin } from "../api";
import type { InboxItem } from "../extra";
import { ago, plural, whatsapp } from "../format";
import { Loaded, Notice, ScrollTabs, SmallButton, TabSwap, Tag } from "../kit";
import { AdminTop, openCompose, openStudent } from "../nav";
import { useAdminRole, VIEW_ONLY_LINE } from "../role";

export function InboxLine({ i }: { i: InboxItem }) {
  const tag = i.kind === "enquiry" ? "Enquiry" : i.kind === "concern" ? "Concern" : i.kind === "doubt" ? "Doubt" : null;
  return <Row testID={`inbox-${i.id}`} unread={i.unread} title={i.from} meta={[i.subject, i.preview].filter(Boolean).join(" · ")} trailing={tag ? <Tag tone={i.kind === "concern" ? "alert" : undefined}>{tag}</Tag> : ago(i.at)} onPress={() => router.push((i.href ?? `/admin/thread/${i.id}`) as never)} />;
}

function InboxList() {
  const q = useInbox();
  return (
    <Loaded q={q} soon what="the inbox" skeleton={<RowsSkeleton rows={4} />}>
      {(d) =>
        d.items.length ? (
          <RowList>
            {d.items.map((i) => (
              <InboxLine key={i.id} i={i} />
            ))}
          </RowList>
        ) : (
          <EmptyState mood="clear" title="Nothing waiting" body="Doubts, concerns and email replies that need you land here." />
        )
      }
    </Loaded>
  );
}

function Sent() {
  const q = useBatches();
  return (
    <Loaded q={q} soon what="sent messages" skeleton={<RowsSkeleton rows={4} />}>
      {(d) =>
        d.batches.length ? (
          <RowList>
            {d.batches.map((b) => (
              <Row key={b.batchId} title={b.title} meta={`${ago(b.sentAt)} · to ${plural(b.total, "student")}`} trailing={`${b.opened} of ${b.total} opened`} />
            ))}
          </RowList>
        ) : (
          <EmptyState mood="empty" title="Nothing sent yet" body="Messages you send show here with how many opened them." />
        )
      }
    </Loaded>
  );
}

/** Messages: the inbox (replies, enquiries) and what was sent. New message is the one primary action. */
export function AdminMessagesScreen() {
  const c = useTheme();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = React.useState<"inbox" | "sent">(params.tab === "sent" ? "sent" : "inbox");
  const inbox = useInbox();
  const { canWrite } = useAdminRole();
  const { refresh, refreshing } = useRefreshAdmin();
  const unread = inbox.data?.unread ?? 0;
  return (
    <Screen title="Announcements" testID="admin-messages" gap={space[5]} onRefresh={refresh} refreshing={refreshing} footer={<Locked><Button label="New message" icon={<PenLine size={20} color={c.onPrimary} />} onPress={() => openCompose()} testID="messages-new" /></Locked>}>
      <ScrollTabs
        tabs={[
          { id: "inbox" as const, name: unread ? `Inbox ${unread}` : "Inbox" },
          { id: "sent" as const, name: "Sent" },
        ]}
        value={tab}
        onChange={setTab}
      />
      <TabSwap tabs={[{ id: "inbox" as const }, { id: "sent" as const }]} value={tab} gap={space[5]}>
        {tab === "inbox" ? <InboxList /> : <Sent />}
      </TabSwap>
    </Screen>
  );
}

/** One conversation: read it, reply under it. */
export function AdminThreadScreen() {
  const c = useTheme();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const q = useInboxThread(String(id));
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  // Opening an email marks it read on the website too (Super Admin only; quiet on failure).
  const marked = React.useRef(false);
  React.useEffect(() => {
    if (!canWrite || !q.data || marked.current) return;
    marked.current = true;
    adminCalls.markRead(q.data.id).catch(() => undefined);
  }, [canWrite, q.data]);
  const send = async () => {
    if (!text.trim()) return setError("Write a reply first.");
    setError(null);
    const r = await run("reply", () => adminCalls.replyInbox(String(id), text.trim()), { done: "Reply sent" });
    if (r) setText("");
  };
  return (
    <Screen testID="admin-thread" gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching} footer={q.data ? <Locked><Button label="Send reply" busy={busy === "reply"} onPress={() => void send()} testID="thread-send" /></Locked> : undefined}>
      <Loaded q={q} soon what="this message" skeleton={<RowsSkeleton rows={4} />}>
        {(t) => (
          <>
            <View style={{ gap: space[2] }}>
              <T v="h2">{t.subject}</T>
              <T v="small" tone="muted">
                {t.from} · {t.email}
              </T>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2], paddingTop: space[1] }}>
                {t.studentId ? <SmallButton label="Open student" onPress={() => openStudent(t.studentId!)} /> : null}
                {t.email ? <SmallButton label="Open in People" onPress={() => router.push(`/admin/person/${encodeURIComponent(t.email)}`)} /> : null}
                {t.phone ? <SmallButton label="WhatsApp" onPress={() => void openLink(whatsapp(t.phone!))} /> : null}
              </View>
            </View>
            <View style={{ gap: space[5] }}>
              {t.messages.map((m) => (
                <View key={m.id} style={{ gap: space[1], paddingLeft: m.mine ? space[3] : 0, borderLeftWidth: m.mine ? 2 : 0, borderColor: c.link }}>
                  <View style={{ flexDirection: "row", gap: space[2], alignItems: "baseline" }}>
                    <T v="bodyStrong" style={{ flexShrink: 1 }}>
                      {m.mine ? "You" : m.from}
                    </T>
                    <T v="caption" tone="muted">
                      {ago(m.at)}
                    </T>
                  </View>
                  <T style={{ maxWidth: 620 }}>{m.body}</T>
                </View>
              ))}
            </View>
            <Locked><Field label="Your reply" value={text} onChangeText={setText} area error={error} maxLength={4000} testID="thread-reply" /></Locked>
          </>
        )}
      </Loaded>
    </Screen>
  );
}

