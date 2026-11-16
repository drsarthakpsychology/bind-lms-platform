import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import { Platform } from "react-native";

import { fetchTransport } from "@/api/client";
import { mockTransport } from "@/api/mock/server";
import { config } from "@/lib/config";
import { prefs, secure } from "@/lib/storage";
import { setBiometricEnabled } from "./biometric";
import { createSession } from "./session";

const signedOutListeners = new Set<() => void>();
const beforeSignOutTasks = new Set<() => Promise<void>>();
/** Run something before a chosen sign-out, while the tokens still work (send waiting saves). */
export function beforeSignOut(fn: () => Promise<void>): () => void {
  beforeSignOutTasks.add(fn);
  return () => void beforeSignOutTasks.delete(fn);
}

/** Run something whenever the phone is signed out (clear cached data). */
export function onSignedOut(fn: () => void): () => void {
  signedOutListeners.add(fn);
  return () => void signedOutListeners.delete(fn);
}

/** The one session of the running app. */
export const session = createSession({
  secure,
  prefs,
  transport: config.apiMode === "mock" ? mockTransport : fetchTransport,
  hash: (text) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text),
  randomId: () => Crypto.randomUUID().replace(/[^A-Za-z0-9-]/g, ""),
  device: () => ({
    name: Device.modelName ?? Device.deviceName ?? "Phone",
    platform: Platform.OS === "ios" ? "ios" : "android",
    appVersion: config.appVersion,
    osVersion: Device.osVersion ?? undefined,
  }),
  pinMaxTries: config.pin.maxTries,
  lockAfterMs: config.pin.lockAfterMs,
  onSignedOut: () => {
    // Fingerprint or face unlock belongs to this sign-in: the next person chooses again.
    void setBiometricEnabled(false);
    signedOutListeners.forEach((fn) => fn());
  },
  beforeSignOut: async () => {
    await Promise.all([...beforeSignOutTasks].map((fn) => fn().catch(() => undefined)));
  },
});

export const api = session.api;
export const useSession = session.store.use;
