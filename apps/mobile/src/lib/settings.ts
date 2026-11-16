import { createStore } from "./store";
import { prefs } from "./storage";

/** How strong haptics are. Light by default: soft ticks and gentle bumps only. */
export type HapticStrength = "off" | "light" | "medium" | "strong";
const STRENGTHS: readonly HapticStrength[] = ["off", "light", "medium", "strong"];

/** Reads a saved value; the old on/off switch maps to Light or Off. */
export function toStrength(v: unknown): HapticStrength {
  if (v === false) return "off";
  return STRENGTHS.includes(v as HapticStrength) ? (v as HapticStrength) : "light";
}

/** Choices kept on this phone (the server keeps notification choices). */
export type LocalSettings = {
  theme: "system" | "light" | "dark";
  haptics: HapticStrength;
  /** Reaction pictures after answers (the web's reactions switch). */
  reactions: boolean;
  /** How study text is explained: the website's Student / Clinician switch. */
  readAs: "student" | "clinician";
  /** Reading text size in the reader, notes and quick reference (Aa sheet and Settings, Text size). */
  textSize: "small" | "normal" | "large" | "larger";
  /** Space between lines in the same places. */
  lineSpacing: "normal" | "roomy";
  loaded: boolean;
};

const KEY = "vibha.settings.v1";

export const settingsStore = createStore<LocalSettings>({ theme: "system", haptics: "light", reactions: true, readAs: "student", textSize: "normal", lineSpacing: "normal", loaded: false });

export async function loadSettings(): Promise<void> {
  try {
    const raw = await prefs.get(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<LocalSettings>;
      settingsStore.set({ ...saved, haptics: toStrength(saved.haptics), loaded: true });
    }
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
