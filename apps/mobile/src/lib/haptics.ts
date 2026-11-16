import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { settingsStore, type HapticStrength } from "./settings";

/**
 * Haptics for the moments that matter, never for plain navigation:
 *   select   picking a choice (an answer, a switch, a chip, a stepper)
 *   tap      an action that commits (long-press, start recording, vote)
 *   success  a right answer, a save that landed, a scan done
 *   warn     a wrong answer, a wrong PIN, a failed action, a destructive confirm
 * Do not call these for opening a screen, switching tabs, opening a sheet,
 * expanding a row or scrolling.
 *
 * Every kind goes through the strength in Settings (Off, Light, Medium,
 * Strong; Light by default). Light is soft ticks and gentle bumps only. On
 * Android, Light and Medium use the phone's own haptic engine (short and
 * crisp, respects the system setting); only Strong uses the vibration motor.
 */
export type HapticKind = "select" | "tap" | "success" | "warn";
export const HAPTIC_STRENGTHS: readonly HapticStrength[] = ["off", "light", "medium", "strong"];

type A = Haptics.AndroidHaptics;
const AH = Haptics.AndroidHaptics;
/** One native call. Android "engine" effects name a fallback for phones older than Android 11. */
export type HapticPlan =
  | { via: "selection" }
  | { via: "impact"; style: Haptics.ImpactFeedbackStyle }
  | { via: "notification"; type: Haptics.NotificationFeedbackType }
  | { via: "engine"; type: A; fallback?: A };

const I = Haptics.ImpactFeedbackStyle;
const N = Haptics.NotificationFeedbackType;

const IOS: Record<Exclude<HapticStrength, "off">, Record<HapticKind, HapticPlan>> = {
  light: {
    select: { via: "selection" },
    tap: { via: "impact", style: I.Soft },
    success: { via: "impact", style: I.Soft },
    warn: { via: "impact", style: I.Light },
  },
  medium: {
    select: { via: "impact", style: I.Light },
    tap: { via: "impact", style: I.Medium },
    success: { via: "notification", type: N.Success },
    warn: { via: "notification", type: N.Warning },
  },
  strong: {
    select: { via: "impact", style: I.Medium },
    tap: { via: "impact", style: I.Heavy },
    success: { via: "notification", type: N.Success },
    warn: { via: "notification", type: N.Warning },
  },
};

const ANDROID: Record<Exclude<HapticStrength, "off">, Record<HapticKind, HapticPlan>> = {
  light: {
    select: { via: "engine", type: AH.Clock_Tick },
    tap: { via: "engine", type: AH.Context_Click },
    success: { via: "engine", type: AH.Confirm, fallback: AH.Clock_Tick },
    warn: { via: "engine", type: AH.Reject, fallback: AH.Context_Click },
  },
  medium: {
    select: { via: "engine", type: AH.Virtual_Key },
    tap: { via: "engine", type: AH.Long_Press },
    success: { via: "engine", type: AH.Confirm, fallback: AH.Virtual_Key },
    warn: { via: "engine", type: AH.Reject, fallback: AH.Long_Press },
  },
  strong: {
    select: { via: "impact", style: I.Light },
    tap: { via: "impact", style: I.Medium },
    success: { via: "notification", type: N.Success },
    warn: { via: "notification", type: N.Warning },
  },
};

/** What a kind becomes at a strength on a platform; null means nothing plays. */
export function planHaptic(kind: HapticKind, strength: HapticStrength, os: string = Platform.OS): HapticPlan | null {
  if (strength === "off" || (os !== "ios" && os !== "android")) return null;
  const table = os === "android" ? ANDROID : IOS;
  return (table[strength] ?? table.light)[kind];
}

/** A pick right after another haptic is dropped, so a slider drag or quick taps never buzz in a row. */
export const SELECT_GAP_MS = 80;
let last = 0;

const quiet = (p: Promise<void>) => p.catch(() => undefined);
function run(p: HapticPlan): void {
  switch (p.via) {
    case "selection":
      void quiet(Haptics.selectionAsync());
      return;
    case "impact":
      void quiet(Haptics.impactAsync(p.style));
      return;
    case "notification":
      void quiet(Haptics.notificationAsync(p.type));
      return;
    case "engine": {
      const fb = p.fallback;
      void Haptics.performAndroidHapticsAsync(p.type).catch(() => (fb ? quiet(Haptics.performAndroidHapticsAsync(fb)) : undefined));
      return;
    }
  }
}

function play(kind: HapticKind): void {
  const plan = planHaptic(kind, settingsStore.get().haptics);
  if (!plan) return;
  const now = Date.now();
  if (kind === "select" && now - last < SELECT_GAP_MS) return;
  last = now;
  run(plan);
}

export const haptic = {
  /** Picking a choice: an answer option, a switch, a chip, a stepper. Not navigation. */
  select: () => play("select"),
  /** An action that commits: long-press, start recording, cast a vote. */
  tap: () => play("tap"),
  /** Right answer, saved, scan done. */
  success: () => play("success"),
  /** Wrong answer, wrong PIN, something failed, a destructive confirm: a warning, not an error buzz. */
  warn: () => play("warn"),
};

/** For tests: forget the last haptic time. */
export function resetHapticGap(): void {
  last = 0;
}
