import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import type { AskDoubtBody, AskDoubtResult } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { api } from "@/auth";
import { Button, Chips, Field, Screen, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { space } from "@/theme";

const KINDS = [
  { id: "doubt" as const, name: "A doubt" },
  { id: "complaint" as const, name: "Something is wrong" },
];

/** Ask a doubt: the question, a little detail, one action pinned low. */
export function AskScreen() {
  const qc = useQueryClient();
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [kind, setKind] = React.useState<"doubt" | "complaint">("doubt");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
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
      await qc.invalidateQueries({ queryKey: ["doubts"] });
      router.replace(`/doubt/${encodeURIComponent(r.id)}`);
    } catch (e) {
      haptic.warn();
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen testID="ask" gap={space[5]} footer={<Button label="Post" busy={busy} onPress={() => void submit()} testID="ask-submit" />}>
      <Field label="Your question" value={title} onChangeText={setTitle} error={error} maxLength={200} testID="ask-title" />
      <Field label="More detail (optional)" value={body} onChangeText={setBody} area maxLength={4000} testID="ask-body" />
      <Field label="Topic (optional)" value={topic} onChangeText={setTopic} placeholder="For example: Depression" maxLength={120} testID="ask-topic" />
      <View style={{ gap: space[2] }}>
        <T v="small">This is</T>
        <Chips label="This is" options={KINDS} value={kind} onChange={setKind} />
      </View>
    </Screen>
  );
}
