import * as Device from "expo-device";
import { PixelRatio, Platform } from "react-native";

export type MotionTier = {
  /** True on a low-end Android phone (2GB RAM or less, Android 10 or older, or a low-density screen). */
  low: boolean;
  /** Multiply particle counts by this (bursts, confetti): 0.5 on low-end. */
  particles: number;
  /** Whether a sheet may scale the page behind it (Vaul's step back). Off on low-end. */
  pageBehind: boolean;
};

const GB = 1024 * 1024 * 1024;

function detect(): MotionTier {
  let low = false;
  if (Platform.OS === "android") {
    let mem: number | null = null;
    try {
      mem = Device.totalMemory ?? null;
    } catch {
      mem = null;
    }
    const version = typeof Platform.Version === "number" ? Platform.Version : Number(Platform.Version);
    low = (mem !== null && mem <= 2.2 * GB) || (Number.isFinite(version) && version <= 29) || PixelRatio.get() <= 2;
  }
  return { low, particles: low ? 0.5 : 1, pageBehind: !low };
}

let cached: MotionTier | undefined;

/**
 * How much motion this phone can carry (motion budget rule 8). Worked out
 * once per launch. Low-end: half the particles, no page-behind scale, no blur;
 * everything else stays. Reduce Motion is separate (`useReducedMotion`).
 *
 *   const tier = useMotionTier();
 *   <Confetti count={Math.round(36 * tier.particles)} />
 */
export function useMotionTier(): MotionTier {
  if (!cached) cached = detect();
  return cached;
}

/** A particle count scaled for the tier, never below 1. */
export function scaled(n: number, tier: MotionTier): number {
  return Math.max(1, Math.round(n * tier.particles));
}
