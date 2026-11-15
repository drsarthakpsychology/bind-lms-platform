import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ThumbsUp } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import type { DoubtActionResult, DoubtReply, DoubtThread } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { keys, useDoubt } from "@/api/queries";
import { api } from "@/auth";
import { Button, Field, Loaded, RowsSkeleton, Screen, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { when } from "@/screens/notifications/list";
import { layout, space, useTheme } from "@/theme";

function Reply({ r, thread, onThread }: { r: DoubtReply; thread: DoubtThread; onThread: (t: DoubtThread) => void }) {
  const c = useTheme();
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
    <View testID={`reply-${r.id}`} style={{ paddingVertical: space[4], gap: space[2], borderTopWidth: 1, borderColor: c.hairline }}>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: space[2], flexWrap: "wrap" }}>
        <T v="bodyStrong">{r.mine ? "You" : r.author}</T>
        <T v="small" tone="muted">
          {when(r.createdAt)}
        </T>
        {r.isSolution ? (
          <T v="small" tone="link">
            · Solution
          </T>
        ) : null}
      </View>
      <T v="reading">{r.body}</T>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
        <Pressable accessibilityRole="button" accessibilityLabel={r.youVoted ? `Remove your vote. ${r.votes} votes` : `This helped. ${r.votes} votes`} accessibilityState={{ selected: r.youVoted }} onPress={() => void vote()} style={{ minHeight: layout.target, flexDirection: "row", alignItems: "center", gap: space[2] }}>
          <ThumbsUp size={18} color={r.youVoted ? c.link : c.muted} fill={r.youVoted ? c.link : "none"} />
          <T v="small" tone={r.youVoted ? "link" : "muted"} num>
            {r.votes}
          </T>
        </Pressable>
        {thread.mine && !r.mine ? <Button kind="text" label={r.isSolution ? "Not the solution" : "Mark as solution"} onPress={() => void solve()} /> : null}
      </View>
    </View>
  );
}

/** One doubt: the question as the title, answers under hairlines, the answer box last. */
export function DoubtScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
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
    <Screen testID="doubt" gap={space[5]}>
      <Loaded q={q} what="this doubt" skeleton={<RowsSkeleton rows={4} />}>
        {(d) => (
          <>
            <View style={{ gap: space[2] }}>
              <T v="h1">{d.title}</T>
              <T v="small" tone="muted">
                {[d.topic, d.mine ? "You" : d.author, when(d.createdAt), d.status === "solved" ? "Solved" : null].filter(Boolean).join(" · ")}
              </T>
            </View>
            {d.body ? <T v="reading">{d.body}</T> : null}
            <View>
              <T v="h3" style={{ paddingBottom: space[2] }}>
                {d.replies.length ? `${d.replies.length} answer${d.replies.length === 1 ? "" : "s"}` : "No answers yet"}
              </T>
              {d.replies.map((r) => (
                <Reply key={r.id} r={r} thread={d} onThread={setThread} />
              ))}
            </View>
            <View style={{ gap: space[3] }}>
              <Field label="Your answer" value={text} onChangeText={setText} area testID="reply-text" />
              <Button kind="quiet" label="Post answer" busy={busy} disabled={!text.trim()} onPress={() => void send()} testID="reply-send" />
            </View>
          </>
        )}
      </Loaded>
    </Screen>
  );
}
