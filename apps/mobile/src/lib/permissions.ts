import { Camera } from "expo-camera";
import * as Notifications from "expo-notifications";
import * as React from "react";
import { AppState, Linking, Platform } from "react-native";

import { prefs } from "./storage";

/**
 * The two system permissions the app asks for: notifications (class and
 * leave updates) and the camera (scanning the attendance code).
 *
 * One state for both, in the words the screens need:
 *  - "unknown": still reading it from the phone
 *  - "ask": never asked; Allow shows the phone's own question
 *  - "retry": said no once, the phone still lets the app ask again
 *  - "blocked": said no for good; only the phone's Settings can turn it on
 *  - "granted": allowed
 *  - "unavailable": this build or device has no such thing (web, simulator)
 */
export type PermState = "unknown" | "ask" | "retry" | "blocked" | "granted" | "unavailable";
export type PermKind = "notifications" | "camera";

type Response = { granted?: boolean; canAskAgain?: boolean; status?: string } | null | undefined;

/** The phone's answer (expo PermissionResponse) as one of the states above. */
export function stateOf(r: Response): PermState {
  if (!r) return "unknown";
  if (r.granted) return "granted";
  if (r.status === "undetermined") return "ask";
  return r.canAskAgain === false ? "blocked" : "retry";
}

async function read(kind: PermKind): Promise<PermState> {
  if (Platform.OS === "web") return "unavailable";
  try {
    const r = kind === "camera" ? await Camera.getCameraPermissionsAsync() : await Notifications.getPermissionsAsync();
    return stateOf(r);
  } catch {
    return "unavailable";
  }
}

/** Shows the phone's own question (only when it may still be asked) and returns the new state. */
async function request(kind: PermKind): Promise<PermState> {
  if (Platform.OS === "web") return "unavailable";
  try {
    if (kind === "camera") return stateOf(await Camera.requestCameraPermissionsAsync());
    // Android 13+ shows the notification question only once a channel exists.
    if (Platform.OS === "android") {
      // eslint-disable-next-line import/namespace -- re-exported with export *
      await Notifications.setNotificationChannelAsync("default", { name: "Messages and reminders", importance: Notifications.AndroidImportance.DEFAULT, lightColor: "#1d44d8" }).catch(() => undefined);
    }
    return stateOf(await Notifications.requestPermissionsAsync());
  } catch {
    return read(kind);
  }
}

export const permissions = { read, request };

/** The app's page in the phone's Settings, where a "blocked" permission is turned on. */
export function openPhoneSettings(): void {
  try {
    void Linking.openSettings().catch(() => undefined);
  } catch {
    /* no settings app (web) */
  }
}

/**
 * One permission, live: read on mount and again every time the app comes
 * back to the front (the student may have just turned it on in Settings).
 * `ask()` shows the phone's question when it still can, and opens Settings
 * when it cannot.
 */
export function usePermission(kind: PermKind): { state: PermState; ask: () => Promise<PermState>; refresh: () => void } {
  const [state, setState] = React.useState<PermState>("unknown");
  const live = React.useRef(true);
  const refresh = React.useCallback(() => {
    void read(kind).then((s) => {
      if (live.current) setState(s);
    });
  }, [kind]);
  React.useEffect(() => {
    live.current = true;
    refresh();
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") refresh();
    });
    return () => {
      live.current = false;
      sub.remove();
    };
  }, [refresh]);
  const ask = React.useCallback(async () => {
    const now = await read(kind);
    if (now === "blocked") {
      openPhoneSettings();
      return now;
    }
    if (now === "granted" || now === "unavailable") {
      if (live.current) setState(now);
      return now;
    }
    const s = await request(kind);
    if (live.current) setState(s);
    return s;
  }, [kind]);
  return { state, ask, refresh };
}

/** A short word for a state, for the Settings rows. */
export function stateLabel(s: PermState): string {
  switch (s) {
    case "granted":
      return "Allowed";
    case "ask":
      return "Not asked yet";
    case "retry":
    case "blocked":
      return "Off";
    case "unavailable":
      return "Not on this device";
    default:
      return "";
  }
}

/* The first-run step: shown once on this phone, after sign-in. */
const INTRO_KEY = "vibha.permissions.intro.v1";
let introDone: boolean | null = null;

export async function introSeen(): Promise<boolean> {
  if (introDone !== null) return introDone;
  try {
    introDone = (await prefs.get(INTRO_KEY)) === "1";
  } catch {
    introDone = false;
  }
  return introDone;
}

export function markIntroSeen(): void {
  introDone = true;
  void prefs.set(INTRO_KEY, "1").catch(() => undefined);
}

/** Tests only: forget the in-memory flag. */
export function resetIntroForTests(): void {
  introDone = null;
}
