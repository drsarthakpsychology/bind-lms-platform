import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { Linking, View } from "react-native";

import type { AllowDeviceChangeResult } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { useAdminStudent } from "@/api/queries";
import { api } from "@/auth";
import { Button, Loaded, ProgressLine, Row, RowList, RowsSkeleton, Screen, Section, T } from "@/ds";
import { toast } from "@/ds/toast";
import { when } from "@/screens/notifications/list";
import { space } from "@/theme";
import { studentMeta } from "./students";

/** One student: who, how far, their phone, what they did lately. */
export function AdminStudent() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const q = useAdminStudent(String(id));
  const [busy, setBusy] = React.useState(false);
  const allow = async () => {
    setBusy(true);
    try {
      await api.post<AllowDeviceChangeResult>("/admin/devices/allow-change", { userId: String(id) });
      toast.show("They can change phone again now");
    } catch (e) {
      toast.show(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen testID="admin-student">
      <Loaded q={q} soon what="this student" skeleton={<RowsSkeleton rows={6} />}>
        {(s) => (
          <>
            <View style={{ gap: space[1] }}>
              <T v="h1">{s.name}</T>
              <T v="small" tone="muted">
                {studentMeta(s)}
              </T>
            </View>
            <View style={{ gap: space[3] }}>
              <T v="small" tone="muted" num>
                Lectures {s.lectures.done} of {s.lectures.total}
              </T>
              <ProgressLine value={(s.lectures.done / Math.max(1, s.lectures.total)) * 100} label="Lectures watched" />
              {s.study ? (
                <>
                  <T v="small" tone="muted" num>
                    Study sections {s.study.done} of {s.study.total}
                  </T>
                  <ProgressLine value={(s.study.done / Math.max(1, s.study.total)) * 100} label="Study sections read" />
                </>
              ) : null}
            </View>
            <Section title="Contact" quiet>
              <RowList>
                {s.email ? <Row title="Email" meta={s.email} onPress={() => void Linking.openURL(`mailto:${s.email}`)} /> : null}
                {s.mobile ? <Row title="WhatsApp" meta={s.mobile} onPress={() => void Linking.openURL(`https://wa.me/91${s.mobile!.replace(/\D/g, "").slice(-10)}`)} /> : null}
              </RowList>
            </Section>
            {s.phone ? (
              <Section title="Phone" quiet>
                <RowList>
                  <Row title={s.phone.name} trailing={`${s.phone.changesUsed} of ${s.phone.limit} changes`} />
                </RowList>
                {s.phone.changesUsed >= s.phone.limit ? <Button kind="quiet" label="Allow one more phone change" busy={busy} onPress={() => void allow()} /> : null}
              </Section>
            ) : null}
            <Section title="Lately">
              <RowList>
                {s.recent.map((r, i) => (
                  <Row key={i} title={r.what} trailing={when(r.at)} />
                ))}
              </RowList>
            </Section>
          </>
        )}
      </Loaded>
    </Screen>
  );
}
