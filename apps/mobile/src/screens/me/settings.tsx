import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { Linking, View } from "react-native";

import type { DeletionRequestResult, NotificationPrefs, Settings } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { keys, useSettings } from "@/api/queries";
import { api, session } from "@/auth";
import { Button, Chips, Field, Loaded, Row, RowList, RowsSkeleton, Screen, Section, Sheet, SwitchRow, T } from "@/ds";
import { toast } from "@/ds/toast";
import { config } from "@/lib/config";
import { haptic } from "@/lib/haptics";
import { settingsStore, updateSettings } from "@/lib/settings";
import { disablePush, enablePush, setStudyReminder } from "@/push";
import { PhoneSecurity } from "@/screens/me/security";
import { space } from "@/theme";

const TIMES = [
  { id: "07:00", name: "7 am" },
  { id: "13:00", name: "1 pm" },
  { id: "19:00", name: "7 pm" },
  { id: "21:00", name: "9 pm" },
];
const THEMES = [
  { id: "system" as const, name: "Match phone" },
  { id: "light" as const, name: "Light" },
  { id: "dark" as const, name: "Dark" },
];

function Notifications({ prefs }: { prefs: NotificationPrefs }) {
  const qc = useQueryClient();
  const save = async (patch: Partial<NotificationPrefs>) => {
    const prev = qc.getQueryData<Settings>(keys.settings);
    if (prev) qc.setQueryData<Settings>(keys.settings, { ...prev, notifications: { ...prev.notifications, ...patch } });
    try {
      if (patch.push === true) {
        const s = await enablePush();
        if (s === "denied") toast.show("Notifications are off for this app in the phone's settings.");
      }
      if (patch.push === false) await disablePush();
      if (patch.studyReminder !== undefined || patch.studyReminderTime) await setStudyReminder(patch.studyReminder ?? prefs.studyReminder, patch.studyReminderTime ?? prefs.studyReminderTime);
      await api.put<NotificationPrefs>("/notifications/preferences", patch);
    } catch (e) {
      if (prev) qc.setQueryData(keys.settings, prev);
      toast.show(messageOf(e));
    }
  };
  return (
    <Section title="Notifications" quiet>
      <RowList>
        <SwitchRow testID="pref-push" title="Notifications on this phone" value={prefs.push} onChange={(v) => void save({ push: v })} />
        <SwitchRow title="Messages from the school" value={prefs.messages} disabled={!prefs.push} onChange={(v) => void save({ messages: v })} />
        <SwitchRow title="Answers to my doubts" value={prefs.doubtReplies} disabled={!prefs.push} onChange={(v) => void save({ doubtReplies: v })} />
        <SwitchRow title="Badges and certificates" value={prefs.achievements} disabled={!prefs.push} onChange={(v) => void save({ achievements: v })} />
        <SwitchRow testID="pref-reminder" title="A daily study reminder" meta="Made on this phone; nothing is sent to us." value={prefs.studyReminder} onChange={(v) => void save({ studyReminder: v })} />
      </RowList>
      {prefs.studyReminder ? (
        <View style={{ gap: space[2] }}>
          <T v="small" tone="muted">
            Remind me at
          </T>
          <Chips label="Remind me at" options={TIMES.some((t) => t.id === prefs.studyReminderTime) ? TIMES : [...TIMES, { id: prefs.studyReminderTime, name: prefs.studyReminderTime }]} value={prefs.studyReminderTime} onChange={(t) => void save({ studyReminderTime: t })} />
        </View>
      ) : null}
      {!prefs.synced ? (
        <T v="small" tone="muted">
          These choices are kept on this phone for now.
        </T>
      ) : null}
    </Section>
  );
}

function DeleteAccount() {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const send = async () => {
    setBusy(true);
    try {
      await api.post<DeletionRequestResult>("/me/deletion-request", { reason: reason.trim() || undefined });
      haptic.success();
      setOpen(false);
      toast.show("Request sent. We will write to you within 7 days.");
    } catch (e) {
      toast.show(messageOf(e));
    } finally {
      setBusy(false);
    }
  };
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <>
      <Row testID="delete-account" title="Ask to delete my account" danger onPress={() => setOpen(true)} chevron={false} />
      <Sheet open={open} onClose={close} title="Delete your account?">
        <View style={{ gap: space[4] }}>
          <T tone="muted">We delete your account, progress and certificates after checking it is you. Issued certificates can no longer be verified. This cannot be undone.</T>
          <Field label="Anything you want to tell us (optional)" value={reason} onChangeText={setReason} area />
          <Button kind="quiet" label="Send the request" busy={busy} onPress={() => void send()} testID="delete-send" />
          <Button kind="text" full label="Keep my account" onPress={close} />
        </View>
      </Sheet>
    </>
  );
}

/** Settings: grouped rows like the phone's own settings, real switches, nothing in boxes. */
export function SettingsScreen() {
  const q = useSettings();
  const theme = settingsStore.use((s) => s.theme);
  const haptics = settingsStore.use((s) => s.haptics);
  const reactions = settingsStore.use((s) => s.reactions);
  const [leaving, setLeaving] = React.useState(false);
  return (
    <Screen testID="settings" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} what="your settings" skeleton={<RowsSkeleton rows={6} />}>
        {(s) => (
          <>
            <Section title="Account" quiet>
              <RowList>
                <Row title="Name" trailing={s.account.name ?? "Not set"} />
                <Row title="Email" meta={s.account.email ?? "Not set"} />
                {s.account.rollNumber ? <Row title="Roll number" trailing={s.account.rollNumber} /> : null}
                <Row title="WhatsApp number" trailing={s.account.mobileNumber ?? "Not given"} />
                <Row title="Account" trailing={s.account.roleLabel} />
              </RowList>
            </Section>
            <Section title="This phone" quiet>
              <RowList>
                <Row title={s.device.current?.name ?? "This phone"} meta={s.device.enforced ? "VIBHA works on one phone at a time. Signing in on another phone signs this one out." : undefined} />
                {s.device.limit !== null ? <Row title="Phone changes in the last 30 days" trailing={`${s.device.changesUsed} of ${s.device.limit}`} /> : null}
                <PhoneSecurity />
              </RowList>
            </Section>
            <Notifications prefs={s.notifications} />
            <Section title="App" quiet>
              <View style={{ gap: space[2] }}>
                <T v="small" tone="muted">
                  Appearance
                </T>
                <Chips label="Appearance" options={THEMES} value={theme} onChange={(t) => updateSettings({ theme: t })} />
              </View>
              <RowList>
                <SwitchRow testID="pref-haptics" title="Vibration on taps" value={haptics} onChange={(v) => updateSettings({ haptics: v })} />
                <SwitchRow testID="pref-reactions" title="Funny reactions" meta="A meme and a cheeky line after some answers. This phone only." value={reactions} onChange={(v) => updateSettings({ reactions: v })} />
              </RowList>
            </Section>
            <Section title="Privacy and terms" quiet>
              <RowList>
                <Row title="Privacy policy" onPress={() => void Linking.openURL(s.legal.privacyUrl)} />
                <Row title="Terms" onPress={() => void Linking.openURL(s.legal.termsUrl)} />
              </RowList>
            </Section>
            <Section>
              <RowList>
                <Row
                  testID="sign-out"
                  title={leaving ? "Signing out..." : "Sign out"}
                  danger
                  chevron={false}
                  onPress={() => {
                    setLeaving(true);
                    void session.signOut();
                  }}
                />
                <DeleteAccount />
              </RowList>
              <T v="caption" tone="muted">
                {config.appName} {config.appVersion}
              </T>
            </Section>
          </>
        )}
      </Loaded>
    </Screen>
  );
}
