import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as React from "react";
import { Platform } from "react-native";

import type { DeviceState, PushData } from "@/api/contract";
import { api, session } from "@/auth";
import { hrefFor } from "@/nav/targets";
import { router } from "expo-router";

/**
 * Push notifications (expo-notifications; FCM on Android).
 *  - Permission is asked at a meaningful moment (after the first finished
 *    lecture, or when the student turns notifications on in Settings),
 *    never at first launch.
 *  - The Expo push token is stored on this phone's row with PUT /devices/current.
 *  - Tapping a notification opens the screen it is about.
 */

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldPlaySound: false, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true }),
  });
}

export type PushStatus = "granted" | "denied" | "undetermined" | "unavailable";

export async function pushStatus(): Promise<PushStatus> {
  if (Platform.OS === "web" || !Device.isDevice) return "unavailable";
  const p = await Notifications.getPermissionsAsync();
  return p.granted ? "granted" : p.canAskAgain ? "undetermined" : "denied";
}

/** Ask (if needed), get the token, and give it to the server. Returns what happened. */
export async function enablePush(): Promise<PushStatus> {
  if (Platform.OS === "web" || !Device.isDevice) return "unavailable";
  if (Platform.OS === "android") {
    // eslint-disable-next-line import/namespace -- re-exported with export *
    await Notifications.setNotificationChannelAsync("default", { name: "Messages and reminders", importance: Notifications.AndroidImportance.DEFAULT, lightColor: "#1d44d8" }).catch(() => undefined);
  }
  let p = await Notifications.getPermissionsAsync();
  if (!p.granted && p.canAskAgain) p = await Notifications.requestPermissionsAsync();
  if (!p.granted) return p.canAskAgain ? "undetermined" : "denied";
  try {
    const projectId = (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas?.projectId ?? Constants.easConfig?.projectId;
    const token = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
    await api.put<DeviceState>("/devices/current", { pushToken: token.data });
    return "granted";
  } catch {
    // No project id or no Google services yet: permission is granted but there is no token.
    return "unavailable";
  }
}

export async function disablePush(): Promise<void> {
  await api.put<DeviceState>("/devices/current", { pushToken: null }).catch(() => undefined);
}

/** A daily study reminder made on the phone itself. `time` is "HH:MM". */
export async function setStudyReminder(on: boolean, time: string): Promise<void> {
  if (Platform.OS === "web") return;
  await Notifications.cancelAllScheduledNotificationsAsync().catch(() => undefined);
  if (!on) return;
  const [h = "19", m = "0"] = time.split(":");
  await Notifications.scheduleNotificationAsync({
    content: { title: "Time to study", body: "Ten minutes today keeps your streak going.", data: { target: { screen: "home", web: "/dashboard" } } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: Number(h), minute: Number(m), channelId: "default" },
  }).catch(() => undefined);
}

/** Where a tapped notification leads. */
export function hrefFromPush(data: unknown): string {
  const d = data as Partial<PushData> | null | undefined;
  if (d?.target && typeof d.target === "object" && "screen" in d.target) {
    const href = hrefFor(d.target);
    if (href) return href;
  }
  if (d?.notificationId) return `/notification/${encodeURIComponent(String(d.notificationId))}`;
  return "/notifications";
}

/** Mounted once: opens the right screen when a notification is tapped, also when the tap started the app. */
export function usePushRouting(): void {
  const phase = session.store.use((s) => s.phase);
  const pending = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (Platform.OS === "web") return;
    const open = (data: unknown) => {
      const href = hrefFromPush(data);
      if (session.store.get().phase === "ready") router.push(href);
      else pending.current = href;
    };
    void Notifications.getLastNotificationResponseAsync()
      .then((r) => {
        if (r) open(r.notification.request.content.data);
      })
      .catch(() => undefined);
    const sub = Notifications.addNotificationResponseReceivedListener((r) => open(r.notification.request.content.data));
    return () => sub.remove();
  }, []);

  // A tap that arrived while the app was locked opens once the PIN is in.
  React.useEffect(() => {
    if (phase === "ready" && pending.current) {
      const href = pending.current;
      pending.current = null;
      router.push(href);
    }
  }, [phase]);
}
