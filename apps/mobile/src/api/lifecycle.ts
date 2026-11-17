import { focusManager } from "@tanstack/react-query";
import { AppState, Platform, type AppStateStatus } from "react-native";

import { setForeground } from "./online";
import { outbox } from "./outbox";
import { resumeWrites } from "./queued";

/**
 * What the app does when it comes back to the front, and once it is open.
 * TanStack Query only knows a browser tab's focus, so on a phone it never
 * refreshed a screen after the app had been away (and a "Could not load"
 * from a train tunnel stayed until a pull). The save outbox was only sent
 * when something new was added, so saves kept from an earlier day waited.
 */
export function onAppState(status: AppStateStatus, signedIn: boolean): void {
  if (Platform.OS === "web") return;
  const active = status === "active";
  focusManager.setFocused(active);
  // No server checks while the app is away; one at once on return if it was offline.
  setForeground(active);
  if (active && signedIn) {
    void outbox.flush().catch(() => undefined);
    void resumeWrites();
  }
}

/** Call once from the root layout. Returns the unsubscribe. */
export function installAppLifecycle(signedIn: () => boolean): () => void {
  const sub = AppState.addEventListener("change", (s) => onAppState(s, signedIn()));
  return () => sub.remove();
}

/** The app is open for a signed-in account: send what is waiting. */
export function onOpened(): void {
  void outbox.flush().catch(() => undefined);
  void resumeWrites();
}

/** The phone's cache copy has been read back (PersistQueryClientProvider onSuccess): send the writes kept in it. */
export function onRestored(): void {
  void resumeWrites();
}
