import { useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import type { NotificationPrefs, Settings } from "@/api/contract";
import { messageOf } from "@/api/errors";
import { keys, useSettings } from "@/api/queries";
import { api } from "@/auth";
import { Chips, Label, RowsSkeleton, Screen, Stone, SwitchRow } from "@/ds";
import { toast } from "@/ds/toast";
import { disablePush, enablePush, setStudyReminder } from "@/push";
import { Group, Load } from "@/screens/me/parts";
import { PermissionsSection } from "@/screens/me/permissions";
import { space } from "@/theme";

const TIMES = [
  { id: "07:00", name: "7 am" },
  { id: "13:00", name: "1 pm" },
  { id: "19:00", name: "7 pm" },
  { id: "21:00", name: "9 pm" },
];

/** The switches for each kind of notification. Each change shows at once and is put back if the server says no. */
export function NotificationPrefsBody({ prefs }: { prefs: NotificationPrefs }) {
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
    <View style={{ gap: space[5] }}>
      <Group title="On this phone" note={prefs.push ? undefined : "Turn this on to choose the kinds below."}>
        <SwitchRow testID="pref-push" title="Notifications on this phone" meta="One switch for everything the school sends" value={prefs.push} onChange={(v) => void save({ push: v })} />
      </Group>
      <Group title="What you get">
        <SwitchRow testID="pref-messages" title="Messages from the school" meta="Class changes and notices" value={prefs.messages} disabled={!prefs.push} onChange={(v) => void save({ messages: v })} />
        <SwitchRow testID="pref-doubts" title="Answers to my doubts" value={prefs.doubtReplies} disabled={!prefs.push} onChange={(v) => void save({ doubtReplies: v })} />
        <SwitchRow testID="pref-achievements" title="Badges and certificates" value={prefs.achievements} disabled={!prefs.push} onChange={(v) => void save({ achievements: v })} />
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
