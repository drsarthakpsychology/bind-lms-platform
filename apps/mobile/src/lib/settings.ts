import { createStore } from "./store";
import { prefs } from "./storage";

/** Choices kept on this phone (the server keeps notification choices). */
export type LocalSettings = {
  theme: "system" | "light" | "dark";
  haptics: boolean;
  /** Reaction pictures after answers (the web's reactions switch). */
  reactions: boolean;
  /** How study text is explained: the website's Student / Clinician switch. */
  readAs: "student" | "clinician";
  loaded: boolean;
};

const KEY = "vibha.settings.v1";

export const settingsStore = createStore<LocalSettings>({ theme: "system", haptics: true, reactions: true, readAs: "student", loaded: false });

export async function loadSettings(): Promise<void> {
  try {
    const raw = await prefs.get(KEY);
    if (raw) settingsStore.set({ ...(JSON.parse(raw) as Partial<LocalSettings>), loaded: true });
    else settingsStore.set({ loaded: true });
  } catch {
    settingsStore.set({ loaded: true });
  }
}

export function updateSettings(patch: Partial<Omit<LocalSettings, "loaded">>): void {
  settingsStore.set(patch);
  const { loaded: _loaded, ...rest } = settingsStore.get();
  void prefs.set(KEY, JSON.stringify(rest)).catch(() => undefined);
}
