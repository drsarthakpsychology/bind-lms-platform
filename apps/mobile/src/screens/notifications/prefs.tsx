import { useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as React from "react";
import { Linking, View } from "react-native";

import type { NotificationPrefs, ReminderPrefs, Settings } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { keys, useSettings } from "@/api/queries";
import { api } from "@/auth";
import { Button, Chips, Label, RowsSkeleton, Screen, Stone, SwitchRow, T } from "@/ds";
import { toast } from "@/ds/toast";
import { disablePush, enablePush, setStudyReminder, usePushProblem, type PushProblem } from "@/push";
import { Group, Load } from "@/screens/me/parts";
import { PermissionsSection } from "@/screens/me/permissions";
import { space } from "@/theme";

const TIMES = [
  { id: "07:00", name: "7 am" },
  { id: "13:00", name: "1 pm" },
  { id: "19:00", name: "7 pm" },
  { id: "21:00", name: "9 pm" },
];

const REMINDERS_ON: ReminderPrefs = { opdDay: true, sessionSoon: true, scanOut: true, caseLog: true, leaveLow: true };

/** The clinic reminders, in the order of a day. */
const REMINDER_ROWS: { key: keyof ReminderPrefs; title: string; meta: string }[] = [
  { key: "opdDay", title: "OPD day", meta: "In the morning of your OPD day" },
  { key: "sessionSoon", title: "Before a class or OPD", meta: "30 minutes before one you must attend" },
  { key: "scanOut", title: "Forgot to scan out", meta: "Just after a session ends" },
  { key: "caseLog", title: "Log your cases", meta: "The evening after OPD, if you have not yet" },
  { key: "leaveLow", title: "Only 1 leave left", meta: "Once, when it happens" },
];

/** What Settings says when phone notifications cannot work. Null: nothing to say. */
export function pushProblemLine(p: PushProblem | null): string | null {
  if (!p || p === "web") return null;
  if (p === "denied") return "Notifications are turned off for this app in your phone's settings. Turn them on there to get them.";
  return "Phone notifications are not set up in this version of the app yet. Everything still shows under the bell in the app. An update will turn them on.";
}

/** A plain notice when push cannot reach this phone. */
function PushNotice({ problem }: { problem: PushProblem | null }) {
  const line = pushProblemLine(problem);
  if (!line) return null;
  return (
    <Stone testID="push-notice" pad={space[4]} style={{ gap: space[3] }}>
      <T v="bodyStrong">{problem === "denied" ? "Notifications are off on this phone" : "Notifications are not working yet"}</T>
      <T v="small" tone="muted">
        {line}
      </T>
      {problem === "denied" ? <Button testID="push-open-settings" kind="raised" small label="Open phone settings" onPress={() => void Linking.openSettings().catch(() => undefined)} /> : null}
    </Stone>
  );
}

/** The switches for each kind of notification. Each change shows at once and is put back if the server says no. */
export function NotificationPrefsBody({ prefs }: { prefs: NotificationPrefs }) {
  const qc = useQueryClient();
  const problem = usePushProblem();
  const cannot = problem !== null && problem !== "web";
  const reminders = { ...REMINDERS_ON, ...prefs.reminders };
  const save = async (patch: Partial<Omit<NotificationPrefs, "reminders">> & { reminders?: Partial<ReminderPrefs> }) => {
    const prev = qc.getQueryData<Settings>(keys.settings);
    if (prev) qc.setQueryData<Settings>(keys.settings, { ...prev, notifications: { ...prev.notifications, ...patch, reminders: { ...REMINDERS_ON, ...prev.notifications.reminders, ...patch.reminders } } });
    try {
      if (patch.push === true) {
        const s = await enablePush();
        if (s === "denied") toast.show("Notifications are off for this app in the phone's settings.");
        if (s === "unavailable" && problem !== "web") toast.show("Phone notifications are not set up in this version of the app yet.");
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
    <View style={{ gap: space[5] }}>
      <PushNotice problem={problem} />
      <Group title="On this phone" note={cannot ? undefined : prefs.push ? undefined : "Turn this on to choose the kinds below."}>
        <SwitchRow testID="pref-push" title="Notifications on this phone" meta="One switch for everything the school sends" value={prefs.push && !cannot} disabled={cannot} onChange={(v) => void save({ push: v })} />
      </Group>
      <Group title="What you get">
        <SwitchRow testID="pref-messages" title="Messages from the school" meta="Class changes and notices" value={prefs.messages} disabled={!prefs.push} onChange={(v) => void save({ messages: v })} />
        <SwitchRow testID="pref-doubts" title="Answers to my doubts" value={prefs.doubtReplies} disabled={!prefs.push} onChange={(v) => void save({ doubtReplies: v })} />
        <SwitchRow testID="pref-achievements" title="Badges and certificates" value={prefs.achievements} disabled={!prefs.push} onChange={(v) => void save({ achievements: v })} />
      </Group>
      <Group testID="pref-reminders" title="Clinic reminders" note="These also show under the bell. Each one comes once.">
        {REMINDER_ROWS.map((r) => (
          <SwitchRow key={r.key} testID={`pref-rem-${r.key}`} title={r.title} meta={r.meta} value={reminders[r.key]} onChange={(v) => void save({ reminders: { [r.key]: v } })} />
        ))}
      </Group>
      <Group title="A nudge to study" note={prefs.synced ? undefined : "These choices are kept on this phone for now."}>
        <SwitchRow testID="pref-reminder" title="A daily study reminder" meta="Made on this phone; nothing is sent to us." value={prefs.studyReminder} onChange={(v) => void save({ studyReminder: v })} />
      </Group>
      {prefs.studyReminder ? (
        <View style={{ gap: space[2] }}>
          <Label>Remind me at</Label>
          <Stone pad={space[3]}>
            <Chips label="Remind me at" options={TIMES.some((t) => t.id === prefs.studyReminderTime) ? TIMES : [...TIMES, { id: prefs.studyReminderTime, name: prefs.studyReminderTime }]} value={prefs.studyReminderTime} onChange={(t) => void save({ studyReminderTime: t })} />
          </Stone>
        </View>
      ) : null}
    </View>
  );
}

/** Notification settings: one master switch, a switch for each kind, the daily reminder, and the phone's own permission. */
export function NotificationSettingsScreen() {
  const q = useSettings();
  return (
    <Screen testID="notification-settings" title="What you get" lead="Choose which notifications reach this phone." gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Stack.Screen options={{ title: "" }} />
      <Load q={q} what="your notification choices" skeleton={<RowsSkeleton rows={5} />}>
        {(s) => <NotificationPrefsBody prefs={s.notifications} />}
      </Load>
      <PermissionsSection only="notifications" />
    </Screen>
  );
}
