import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { settingsStore } from "./settings";

/**
 * Haptics, used sparingly: picking something, a right answer, a gentle
 * warning for a wrong one, finishing. Off when the student turns them off;
 * the phone's own setting is respected by the system.
 */
function on(): boolean {
  return Platform.OS !== "web" && settingsStore.get().haptics;
}
const quiet = (p: Promise<void>) => void p.catch(() => undefined);

export const haptic = {
  /** Picking an option, a tab, a switch. */
  select: () => on() && quiet(Haptics.selectionAsync()),
  /** The primary button. */
  tap: () => on() && quiet(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  success: () => on() && quiet(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  /** A wrong answer or a wrong PIN: a warning, not an error buzz. */
  warn: () => on() && quiet(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
};
