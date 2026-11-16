import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

import { config } from "@/lib/config";
import { secure } from "@/lib/storage";

/**
 * Fingerprint or face unlock, as an opt-in next to the PIN (Settings > This
 * phone). The PIN stays the way in: the phone's own check only opens the lock
 * screen, never the sign-in, and five wrong PINs still sign out. The choice is
 * kept in the keystore and dropped on sign-out (src/auth/index.ts).
 */
const KEY = "vibha.biometric.v1";

export type BiometricKind = "fingerprint" | "face" | "other";

/** True when this phone has a fingerprint or face set up that the app may use. */
export async function biometricAvailable(): Promise<boolean> {
  if (!config.biometrics || Platform.OS === "web") return false;
  try {
    return (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync());
  } catch {
    return false;
  }
}

/** What the phone uses, for the words on the switch and the button. */
export async function biometricKind(): Promise<BiometricKind> {
  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) return "fingerprint";
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return "face";
  } catch {
    /* fall through */
  }
  return "other";
}

/** The person switched it on in Settings (and the phone still supports it). */
export async function biometricEnabled(): Promise<boolean> {
  try {
    return (await secure.get(KEY)) === "on" && (await biometricAvailable());
  } catch {
    return false;
  }
}

export async function setBiometricEnabled(on: boolean): Promise<void> {
  try {
    if (on) await secure.set(KEY, "on");
    else await secure.remove(KEY);
  } catch {
    /* the keystore refused: it simply stays off */
  }
}

/** Ask the phone. True only for a real match; cancel, failure or any error is false. */
export async function unlockWithBiometric(prompt = "Open Vibha Psychology"): Promise<boolean> {
  if (!(await biometricAvailable())) return false;
  try {
    const r = await LocalAuthentication.authenticateAsync({ promptMessage: prompt, cancelLabel: "Use PIN", disableDeviceFallback: true });
    return r.success;
  } catch {
    return false;
  }
}
