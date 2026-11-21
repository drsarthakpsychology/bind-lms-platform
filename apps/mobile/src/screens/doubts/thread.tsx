import { useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ArrowUp, Check, ThumbsUp } from "lucide-react-native";
import * as React from "react";
import { TextInput, View } from "react-native";

import type { DoubtActionResult, DoubtReply, DoubtThread } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { useOffline } from "@/api/online";
import { keys, useDoubt } from "@/api/queries";
import { api } from "@/auth";
import { Button, Flame, Jyo, Label, QuietEmpty, Screen, Skeleton, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { Enter, FromRow, Press, RollingNumber, Stamp } from "@/motion";
import { Fetched, Pill } from "@/screens/learn/parts";
import { when } from "@/screens/notifications/list";
import { layout, space, type, useTheme } from "@/theme";

/**
 * One doubt as a conversation (the chat recipe of docs/DESIGN.md): the
 * question on top, each answer a stone bubble (yours on the right in the
 * Learn wash, others on the left), the solution marked in words, and the
 * answer box pinned low with a round lime send.
 */

function Reply({ r, thread, onThread }: { r: DoubtReply; thread: DoubtThread; onThread: (t: DoubtThread) => void }) {
  const c = useTheme();
  // The thumb lands like a stamp when you add your vote.
  const [pop, setPop] = React.useState(0);
  const vote = async () => {
    haptic.select();
    try {
      const res = await api.post<DoubtActionResult>(`/doubts/${encodeURIComponent(thread.id)}/replies/${encodeURIComponent(r.id)}/vote`, { on: !r.youVoted });
      onThread(res.thread);
    } catch (e) {
      toast.show(messageOf(e));
    }
  };
  const solve = async () => {
    try {
      const res = await api.post<DoubtActionResult>(`/doubts/${encodeURIComponent(thread.id)}/solved`, { replyId: r.isSolution ? null : r.id });
      haptic.success();
      onThread(res.thread);
    } catch (e) {
      toast.show(messageOf(e));
    }
  };
  return (
    <Enter kind="rise" testID={`reply-${r.id}`} style={{ alignSelf: r.mine ? "flex-end" : "flex-start", maxWidth: "92%", gap: space[1] }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], flexWrap: "wrap", paddingHorizontal: space[1], justifyContent: r.mine ? "flex-end" : "flex-start" }}>
        <T v="caption">{r.mine ? "You" : r.author}</T>
        <T v="caption" tone="muted">
          {when(r.createdAt)}
        </T>
        {r.isSolution ? (
          <Pill tone="ink" icon={<Check size={12} color={c.bg} strokeWidth={3} />}>
            Solution
          </Pill>
        ) : null}
      </View>
      <View style={[{ backgroundColor: r.mine ? c.areas.learn.wash : c.card, borderRadius: layout.radius, paddingVertical: space[3], paddingHorizontal: space[4] }, r.mine ? { borderBottomRightRadius: 6 } : { borderBottomLeftRadius: 6 }]}>
        <T v="reading">{r.body}</T>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[3], justifyContent: r.mine ? "flex-end" : "flex-start" }}>
        <Press
          feel="none"
          scale={0.92}
          accessibilityRole="button"
          accessibilityLabel={r.youVoted ? `Remove your vote. ${r.votes} votes` : `This helped. ${r.votes} votes`}
          accessibilityState={{ selected: r.youVoted }}
          onPress={() => {
            if (!r.youVoted) setPop((n) => n + 1);
            void vote();
          }}
          innerStyle={{ minHeight: 44, minWidth: 44, flexDirection: "row", alignItems: "center", gap: space[2], paddingHorizontal: space[1] }}
        >
          <View style={{ width: 18, height: 18, alignItems: "center", justifyContent: "center" }}>
            <Stamp fire={pop}>
              <ThumbsUp size={18} color={r.youVoted ? c.link : c.muted} fill={r.youVoted ? c.link : "none"} />
            </Stamp>
          </View>
          <RollingNumber value={r.votes} v="small" tone={r.youVoted ? "link" : "muted"} />
          <T v="small" tone={r.youVoted ? "link" : "muted"}>
            {r.youVoted ? "Helped" : "This helped"}
          </T>
        </Press>
        {thread.mine && !r.mine ? <Button kind="text" label={r.isSolution ? "Unmark solution" : "Mark as solution"} onPress={() => void solve()} testID={`reply-solve-${r.id}`} /> : null}
      </View>
    </Enter>
  );
}

/** The answer box, pinned low: a stone field that grows to four lines and a round lime send. */
function Compose({ value, onChange, busy, onSend }: { value: string; onChange: (s: string) => void; busy: boolean; onSend: () => void }) {
  const c = useTheme();
  const offline = useOffline();
  const can = !!value.trim() && !busy && !offline;
  return (
    <View style={{ gap: space[1] }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: space[2] }}>
        <View style={{ flex: 1, minHeight: 48, maxHeight: 132, borderRadius: 24, backgroundColor: c.card, paddingHorizontal: space[4], justifyContent: "center" }}>
          <TextInput testID="reply-text" accessibilityLabel="Your answer" value={value} onChangeText={onChange} multiline maxLength={10000} placeholder="Write an answer" placeholderTextColor={c.faint} selectionColor={c.accent} cursorColor={c.link} keyboardAppearance={c.dark ? "dark" : "light"} maxFontSizeMultiplier={1.4} style={[type.body, { color: c.ink, paddingVertical: space[3] }, { outlineStyle: "none" } as object]} />
        </View>
        <Press testID="reply-send" accessibilityRole="button" accessibilityLabel={offline ? "Post answer. Waiting for the internet" : "Post answer"} accessibilityState={{ disabled: !can, busy }} disabled={!can} onPress={onSend} squish scale={0.9} innerStyle={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.lime, alignItems: "center", justifyContent: "center", opacity: can || busy ? 1 : 0.45 }}>
          {busy ? <Flame size={22} /> : <ArrowUp size={22} color={c.onLime} strokeWidth={2.6} />}
        </Press>
      </View>
      {offline ? (
        <T v="caption" tone="muted" style={{ paddingHorizontal: space[2] }}>
          You are offline. Your answer posts when you are back online.
        </T>
      ) : null}
    </View>
  );
}

export function DoubtScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const c = useTheme();
  const q = useDoubt(String(id));
  const [text, setText] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const setThread = (t: DoubtThread) => {
    qc.setQueryData(keys.doubt(t.id), t);
    void qc.invalidateQueries({ queryKey: ["doubts"] });
  };
  const send = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const res = await api.post<DoubtActionResult>(`/doubts/${encodeURIComponent(String(id))}/replies`, { body: text.trim() });
      haptic.success();
      setText("");
      setThread(res.thread);
    } catch (e) {
      haptic.warn();
      toast.show(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen plain testID="doubt" gap={space[5]} footer={q.data ? <Compose value={text} onChange={setText} busy={busy} onSend={() => void send()} /> : undefined}>
      <Stack.Screen options={{ title: "Doubt" }} />
      <Fetched
        q={q}
        what="this doubt"
        skeleton={
          <View style={{ gap: space[3] }}>
            <Skeleton w="90%" h={28} />
            <Skeleton w="50%" h={14} />
            <Skeleton h={90} r={layout.radius} />
            <Skeleton w="80%" h={70} r={layout.radius} />
          </View>
        }
      >
        {(d) => (
          <>
            <View style={{ gap: space[2] }}>
              <FromRow title={d.title}>
                <T v="h1" accessibilityRole="header">
                  {d.title}
                </T>
              </FromRow>
              <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: space[2] }}>
                {d.status === "solved" ? (
                  <Pill tone="ink" icon={<Check size={12} color={c.bg} strokeWidth={3} />}>
                    Solved
                  </Pill>
                ) : null}
                <T v="small" tone="muted">
                  {[d.topic, d.mine ? "You" : d.author, when(d.createdAt)].filter(Boolean).join(" · ")}
                </T>
              </View>
              {d.body ? <T v="reading">{d.body}</T> : null}
            </View>
            <View style={{ gap: space[4] }}>
              <Label>{d.replies.length ? `${d.replies.length} answer${d.replies.length === 1 ? "" : "s"}` : "Answers"}</Label>
              {d.replies.length ? d.replies.map((r) => <Reply key={r.id} r={r} thread={d} onThread={setThread} />) : <QuietEmpty testID="doubt-empty" art={<Jyo pose="resting" size={56} />} title="No answers yet" body="Be the first to answer, or check back soon. The team reads every doubt." />}
            </View>
          </>
        )}
      </Fetched>
    </Screen>
  );
}
