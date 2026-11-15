import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Two key-value stores.
 *  - secure: sign-in tokens and the PIN record. On phones this is the system
 *    keystore (expo-secure-store). The web build (used only for screenshots
 *    and development) falls back to ordinary storage.
 *  - prefs: settings that are not secret (theme, haptics).
 */
export type KeyValue = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
};

const plain: KeyValue = {
  get: (k) => AsyncStorage.getItem(k),
  set: (k, v) => AsyncStorage.setItem(k, v),
  remove: (k) => AsyncStorage.removeItem(k),
};

const keystore: KeyValue = {
  get: (k) => SecureStore.getItemAsync(k),
  set: (k, v) => SecureStore.setItemAsync(k, v, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }),
  remove: (k) => SecureStore.deleteItemAsync(k),
};

export const secure: KeyValue = Platform.OS === "web" ? plain : keystore;
export const prefs: KeyValue = plain;

/** An in-memory store, for tests. */
export function memoryStore(seed: Record<string, string> = {}): KeyValue & { dump: () => Record<string, string> } {
  const m = new Map(Object.entries(seed));
  return {
    get: async (k) => m.get(k) ?? null,
    set: async (k, v) => void m.set(k, v),
    remove: async (k) => void m.delete(k),
    dump: () => Object.fromEntries(m),
  };
}
