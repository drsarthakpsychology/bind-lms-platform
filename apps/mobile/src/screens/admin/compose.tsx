import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import type { AdminSendBody, AdminSendResult } from "@/api/extra";
import { messageOf } from "@/api/errors";
import { keys } from "@/api/queries";
import { api } from "@/auth";
import { Button, Chips, Field, Screen, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { space } from "@/theme";

/** New message to everyone or a cohort. It lands in the bell and as a push. */
export function AdminCompose() {
  const qc = useQueryClient();
  const [to, setTo] = React.useState<AdminSendBody["to"]>("cohort");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const send = async () => {
    if (!title.trim() || !body.trim()) return setError("Write a title and a message.");
    setBusy(true);
    setError(null);
    try {
      const r = await api.post<AdminSendResult>("/admin/messages", { to, toId: to === "cohort" ? "c2" : undefined, title: title.trim(), body: body.trim() } satisfies AdminSendBody);
      haptic.success();
      toast.show(`Sent to ${r.sent} student${r.sent === 1 ? "" : "s"}`);
      void qc.invalidateQueries({ queryKey: keys.admin("messages") });
      router.back();
    } catch (e) {
      haptic.warn();
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen testID="compose" gap={space[5]} footer={<Button label="Send" busy={busy} onPress={() => void send()} testID="compose-send" />}>
      <View style={{ gap: space[2] }}>
        <T v="small">To</T>
        <Chips
          label="To"
          options={[
            { id: "cohort" as const, name: "Cohort Two" },
            { id: "everyone" as const, name: "Everyone" },
          ]}
          value={to}
          onChange={setTo}
        />
      </View>
      <Field label="Title" value={title} onChangeText={setTitle} maxLength={120} testID="compose-title" />
      <Field label="Message" value={body} onChangeText={setBody} area error={error} maxLength={2000} testID="compose-body" />
    </Screen>
  );
}
