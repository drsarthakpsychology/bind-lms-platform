import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Send } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { AskDoubtBody, AskDoubtResult } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { useMe, useStudyHome } from "@/api/queries";
import { api } from "@/auth";
import { Button, Chips, Field, Label, Screen, Stone, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { space, useTheme } from "@/theme";

const KINDS = [
  { id: "doubt" as const, name: "A doubt" },
  { id: "complaint" as const, name: "Something is wrong" },
];

/** The modules you are on now (the next one first), as topic chips, at most four. */
function useTopicChoices(enabled: boolean): { id: string; name: string }[] {
  const q = useStudyHome();
  if (!enabled || !q.data) return [];
  const next = "moduleId" in q.data.next ? q.data.next.moduleId : null;
  const mods = q.data.modules;
  const now = [...mods.filter((m) => m.id === next), ...mods.filter((m) => m.id !== next && m.status.pct > 0 && !m.status.complete)];
  const picked = (now.length ? now : mods.filter((m) => !m.status.complete)).slice(0, 4);
  return picked.map((m) => ({ id: m.title, name: m.title }));
}

/** Ask a doubt: the question, a little detail, topic chips from what you are studying, one action pinned low. */
export function AskScreen() {
  const qc = useQueryClient();
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [kind, setKind] = React.useState<"doubt" | "complaint">("doubt");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const me = useMe().data;
  const studyOpen = me?.access?.can?.study !== false && !me?.access?.lecturesOnly;
  const topics = useTopicChoices(studyOpen);
  const submit = async () => {
    if (title.trim().length < 8) {
      haptic.warn();
      return setError("Write your question in a full sentence.");
    }
    setBusy(true);
    setError(null);
    try {
      const b: AskDoubtBody = { title: title.trim(), body: body.trim(), topic: topic.trim() || undefined, markAs: kind };
      const r = await api.post<AskDoubtResult>("/doubts", b);
      haptic.success();
      toast.show("Posted");
      await qc.invalidateQueries({ queryKey: ["doubts"] });
      router.replace(`/doubt/${encodeURIComponent(r.id)}`);
    } catch (e) {
      haptic.warn();
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  const c = useTheme();
  const ready = title.trim().length >= 8;
  return (
    <Screen plain testID="ask" gap={space[5]} footer={<Button label="Post" icon={<Send size={18} color={c.onPrimary} />} busy={busy} needsServer onPress={() => void submit()} testID="ask-submit" />}>
      {/* The preview: how it will look in the list, updating as you type. */}
      <Stone quiet={!ready} testID="ask-preview">
        <View style={{ gap: space[1] }}>
          <T v="label" tone="muted">
            {kind === "complaint" ? "Something is wrong" : "Your doubt"}
            {topic.trim() ? ` · ${topic.trim()}` : ""}
          </T>
          <T v="h3" tone={title.trim() ? "ink" : "muted"}>
            {title.trim() || "Your question shows here as you type"}
          </T>
        </View>
      </Stone>
      <Field label="Your question" value={title} onChangeText={setTitle} error={error} maxLength={200} returnKeyType="next" placeholder="Ask it in one full sentence" testID="ask-title" />
      <Field label="More detail (optional)" value={body} onChangeText={setBody} area maxLength={4000} testID="ask-body" />
      <View style={{ gap: space[2] }}>
        <Field label="Topic (optional)" value={topic} onChangeText={setTopic} placeholder="For example: Depression" maxLength={120} testID="ask-topic" />
        {topics.length ? <Chips label="Your topics" options={topics} value={topic} onChange={setTopic} /> : null}
      </View>
      <View style={{ gap: space[2] }}>
        <Label>This is</Label>
        <Chips label="This is" options={KINDS} value={kind} onChange={setKind} />
      </View>
    </Screen>
  );
}
