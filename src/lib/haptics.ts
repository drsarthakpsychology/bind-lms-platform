"use client";

/**
 * Haptic feedback for meaningful actions.
 *
 * Uses the Vibration API (Android/Chrome). iOS Safari does NOT support
 * navigator.vibrate, so haptics degrade silently there — Android-only unless a
 * future route (e.g. the DeviceMotion API on iOS, which requires user gesture
 * and permissions) is added. That's a deliberate, documented trade-off.
 */

type HapticPattern = "tap" | "success" | "warning";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  tap: 8,
  success: [15, 40, 25],
  warning: [30, 60, 30, 60, 30],
};

/**
 * Fire a vibration if the browser supports it. Silent no-op elsewhere.
 * Must be called from a user gesture to have effect in some browsers.
 */
export function haptic(pattern: HapticPattern = "tap"): void {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(PATTERNS[pattern]);
    }
  } catch {
    /* unsupported — ignore */
  }
}
