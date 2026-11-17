import * as Haptics from "expo-haptics";

import { haptic, HAPTIC_STRENGTHS, planHaptic, resetHapticGap, type HapticKind } from "@/lib/haptics";
import { loadSettings, settingsStore, toStrength } from "@/lib/settings";
import { prefs } from "@/lib/storage";

const KINDS: HapticKind[] = ["select", "tap", "success", "warn"];
const sel = Haptics.selectionAsync as jest.Mock;
const imp = Haptics.impactAsync as jest.Mock;
const note = Haptics.notificationAsync as jest.Mock;
const eng = Haptics.performAndroidHapticsAsync as jest.Mock;
const all = () => sel.mock.calls.length + imp.mock.calls.length + note.mock.calls.length + eng.mock.calls.length;

beforeEach(() => {
  [sel, imp, note, eng].forEach((m) => m.mockClear());
  resetHapticGap();
  settingsStore.set({ haptics: "light" });
});
afterAll(() => settingsStore.set({ haptics: "light" }));

describe("haptic strength", () => {
  it("is Light by default", () => {
    expect(toStrength(undefined)).toBe("light");
  });

  it("maps the old on/off switch: off stays off, on becomes Light", () => {
    expect(toStrength(false)).toBe("off");
    expect(toStrength(true)).toBe("light");
    expect(toStrength("strong")).toBe("strong");
    expect(toStrength("loud")).toBe("light");
  });

  it("reads a saved choice and the old boolean from the phone", async () => {
    await prefs.set("vibha.settings.v1", JSON.stringify({ haptics: false }));
    await loadSettings();
    expect(settingsStore.get().haptics).toBe("off");
    await prefs.set("vibha.settings.v1", JSON.stringify({ haptics: "medium" }));
    await loadSettings();
    expect(settingsStore.get().haptics).toBe("medium");
    await prefs.remove("vibha.settings.v1");
  });

  it("Off plays nothing for any kind on any phone", () => {
    for (const os of ["ios", "android"]) for (const k of KINDS) expect(planHaptic(k, "off", os)).toBeNull();
    settingsStore.set({ haptics: "off" });
    KINDS.forEach((k) => haptic[k]());
    expect(all()).toBe(0);
  });

  it("web never plays", () => {
    for (const s of HAPTIC_STRENGTHS) expect(planHaptic("success", s, "web")).toBeNull();
  });

  it("Light is soft ticks and gentle bumps only: no notification buzz, no vibration motor", () => {
    for (const k of KINDS) {
      const ios = planHaptic(k, "light", "ios")!;
      expect(ios.via === "selection" || (ios.via === "impact" && ["soft", "light"].includes(ios.style))).toBe(true);
      expect(planHaptic(k, "light", "android")!.via).toBe("engine");
    }
  });

  it("Medium keeps Android on the phone's haptic engine; only Strong uses the motor", () => {
    for (const k of KINDS) {
      expect(planHaptic(k, "medium", "android")!.via).toBe("engine");
      expect(planHaptic(k, "strong", "android")!.via).not.toBe("engine");
    }
  });

  it("gets stronger, never weaker, from Light to Strong on iOS", () => {
    const rank = (p: ReturnType<typeof planHaptic>) => (p ? ({ selection: 0, soft: 1, light: 2, medium: 3, notification: 3, heavy: 4 } as Record<string, number>)[p.via === "impact" ? p.style : p.via]! : -1);
    for (const k of KINDS) {
      const [l, m, s] = (["light", "medium", "strong"] as const).map((x) => rank(planHaptic(k, x, "ios")));
      expect(l).toBeLessThanOrEqual(m!);
      expect(m).toBeLessThanOrEqual(s!);
    }
  });

  it("success and warn sound different at every strength", () => {
    for (const os of ["ios", "android"]) for (const s of ["light", "medium", "strong"] as const) expect(planHaptic("success", s, os)).not.toEqual(planHaptic("warn", s, os));
  });

  it("plays through the chosen strength (tests run as iOS)", () => {
    haptic.success();
    expect(imp).toHaveBeenCalledWith("soft");
    expect(note).not.toHaveBeenCalled();
    resetHapticGap();
    settingsStore.set({ haptics: "medium" });
    haptic.success();
    expect(note).toHaveBeenCalledWith("success");
  });

  it("drops a pick that follows another haptic straight away, but never drops a result", () => {
    haptic.select();
    haptic.select();
    haptic.select();
    expect(sel).toHaveBeenCalledTimes(1);
    haptic.warn();
    expect(imp).toHaveBeenCalledWith("light");
  });

  it("a failing native call never throws", async () => {
    sel.mockImplementationOnce(async () => {
      throw new Error("no engine");
    });
    expect(() => haptic.select()).not.toThrow();
    await Promise.resolve();
  });
});
