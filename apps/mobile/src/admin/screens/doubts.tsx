import { router, useLocalSearchParams } from "expo-router";
import { ShieldAlert } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { DoubtRow } from "@/api/contract";
import { Button, EmptyState, Field, Loaded, Row, RowList, RowsSkeleton, Screen, T } from "@/ds";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminAction, useAdminDoubt, useAdminDoubts, useRefreshAdmin } from "../api";
import { ago, type Tone } from "../format";
import { Notice, Status, Tag } from "../kit";
import { useAdminRole, VIEW_ONLY_LINE } from "../role";
import { ScrollTabs } from "./student";

export function doubtState(d: Pick<DoubtRow, "status" | "replies">): { tone: Tone; label: string } {
  if (d.status === "hidden") return { tone: "quiet", label: "Hidden" };
  if (d.status === "solved") return { tone: "ok", label: "Solved" };
  return d.replies ? { tone: "quiet", label: "Open" } : { tone: "warn", label: "No answer yet" };
}

const VIEWS = [
  { id: "waiting" as const, name: "Waiting" },
  { id: "all" as const, name: "All" },
  { id: "complaint" as const, name: "Concerns" },
];
type V = (typeof VIEWS)[number]["id"];

/** Doubts and concerns: what is waiting first. A row opens the doubt to answer it. */
export function AdminDoubtsScreen() {
  const c = useTheme();
  const params = useLocalSearchParams<{ view?: string }>();
  const [view, setView] = React.useState<V>(VIEWS.some((v) => v.id === params.view) ? (params.view as V) : "waiting");
  const q = useAdminDoubts(view === "complaint" ? "complaint" : "");
  const { refresh, refreshing } = useRefreshAdmin();
  return (
    <Screen title="Doubts and concerns" lead="Private concerns are seen only by the student and the VIBHA team." testID="admin-doubts" gap={space[5]} onRefresh={refresh} refreshing={refreshing}>
      <ScrollTabs tabs={VIEWS} value={view} onChange={setView} />
      <Loaded q={q} soon what="doubts" skeleton={<RowsSkeleton rows={5} />}>
        {(d) => {
          const items = view === "waiting" ? d.items.filter((x) => x.status === "open") : d.items;
          return items.length ? (
            <RowList>
              {items.map((x) => {
                const st = doubtState(x);
                return <Row key={x.id} testID={`doubt-${x.id}`} icon={x.kind === "complaint" ? <ShieldAlert size={18} color={c.alertFg} accessibilityLabel="Private concern" /> : undefined} title={x.title} meta={`${x.author} · ${ago(x.createdAt)}${x.replies ? ` · ${x.replies} ${x.replies === 1 ? "reply" : "replies"}` : ""}`} trailing={<Status tone={st.tone}>{st.label}</Status>} onPress={() => router.push(`/admin/doubt/${x.id}`)} />;
              })}
            </RowList>
          ) : (
            <EmptyState mood="sleepy" title={view === "waiting" ? "Nothing waiting" : "No doubts yet"} body={view === "waiting" ? "Every doubt has an answer." : "Doubts students ask show here."} />
          );
        }}
      </Loaded>
    </Screen>
  );
}

/** One doubt: the question, the answers, and the box to answer as the VIBHA team. */
export function AdminDoubtScreen() {
  const c = useTheme();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const q = useAdminDoubt(String(id));
  const { canWrite } = useAdminRole();
  const { run, busy } = useAdminAction();
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const answer = async () => {
    if (!text.trim()) return setError("Write an answer first.");
    setError(null);
    const r = await run("answer-doubt", () => adminCalls.answerDoubt(String(id), text.trim()), { done: "Answer posted. The student gets a notice." });
    if (r) setText("");
  };
  return (
    <Screen testID="admin-doubt" gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching} footer={canWrite && q.data && q.data.status !== "hidden" ? <Button label="Post answer" busy={busy === "answer-doubt"} onPress={() => void answer()} testID="doubt-answer" /> : undefined}>
      <Loaded q={q} soon what="this doubt" skeleton={<RowsSkeleton rows={4} />}>
        {(d) => {
          const st = doubtState({ status: d.status, replies: d.replies.length });
          return (
            <>
              <View style={{ gap: space[2] }}>
                {d.kind === "complaint" ? <Tag tone="alert">Private concern</Tag> : d.topic ? <Tag>{d.topic}</Tag> : null}
                <T v="h2">{d.title}</T>
                <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", columnGap: space[3], rowGap: space[1] }}>
                  <Status tone={st.tone}>{st.label}</Status>
                  <T v="small" tone="muted">
                    {d.author} · {ago(d.createdAt)}
                  </T>
                </View>
              </View>
              {d.body ? <T style={{ maxWidth: 620 }}>{d.body}</T> : null}
              <View style={{ gap: space[4] }}>
                <T v="h3">{d.replies.length ? `Answers ${d.replies.length}` : "No answers yet"}</T>
                {d.replies.map((r) => (
                  <View key={r.id} style={{ gap: space[1], paddingLeft: space[3], borderLeftWidth: 2, borderColor: r.isSolution ? c.link : c.hairline }}>
                    <View style={{ flexDirection: "row", gap: space[2], alignItems: "baseline", flexWrap: "wrap" }}>
                      <T v="bodyStrong">{r.mine ? "You" : r.author}</T>
                      <T v="caption" tone="muted">
                        {ago(r.createdAt)}
                        {r.isSolution ? " · Marked as the answer" : ""}
                      </T>
                    </View>
                    <T>{r.body}</T>
                  </View>
                ))}
              </View>
              {canWrite ? (
                <>
                  {d.status !== "hidden" ? <Field label="Answer as the VIBHA team" value={text} onChangeText={setText} area error={error} maxLength={4000} testID="doubt-text" /> : null}
                  <Button kind={d.status === "hidden" ? "quiet" : "danger"} label={d.status === "hidden" ? "Show it to students again" : "Hide from students"} busy={busy === "hide-doubt"} onPress={() => void run("hide-doubt", () => adminCalls.hideDoubt(d.id, d.status !== "hidden"), { done: d.status === "hidden" ? "Shown again" : "Hidden from students" })} testID="doubt-hide" />
                </>
              ) : (
                <Notice testID="view-only-note">{VIEW_ONLY_LINE}</Notice>
              )}
            </>
          );
        }}
      </Loaded>
    </Screen>
  );
}
