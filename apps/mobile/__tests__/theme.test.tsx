import { act, render, screen } from "@testing-library/react-native";
import * as React from "react";
import { Appearance, Text } from "react-native";

import { settingsStore } from "@/lib/settings";
import { ThemeProvider, dark, light, useTheme } from "@/theme";

jest.mock("expo-system-ui", () => ({ setBackgroundColorAsync: jest.fn(() => Promise.resolve()) }));

function Probe() {
  const c = useTheme();
  return <Text testID="probe">{c.dark ? "dark" : "light"}</Text>;
}

/** WCAG contrast of two #rrggbb colours. */
function contrast(a: string, b: string) {
  const lum = (h: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * bl!;
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
}

describe("theme", () => {
  afterEach(async () => {
    await act(async () => settingsStore.set({ theme: "system" }));
  });

  it("follows the Appearance choice and fades between looks", async () => {
    const set = jest.spyOn(Appearance, "setColorScheme").mockImplementation(() => undefined);
    await act(async () => settingsStore.set({ theme: "light" }));
    await render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("probe").props.children).toBe("light");
    expect(screen.queryByTestId("theme-fade")).toBeNull();
    await act(async () => settingsStore.set({ theme: "dark" }));
    expect(screen.getByTestId("probe").props.children).toBe("dark");
    expect(screen.getByTestId("theme-fade")).toBeTruthy();
    expect(set).toHaveBeenLastCalledWith("dark");
    await act(async () => settingsStore.set({ theme: "system" }));
    expect(set).toHaveBeenLastCalledWith("unspecified");
    set.mockRestore();
  });

  it("keeps text, the readable blue and field outlines above WCAG AA on both looks", () => {
    for (const p of [light, dark]) {
      for (const surface of [p.bg, p.card, p.raised]) {
        expect(contrast(p.ink, surface)).toBeGreaterThanOrEqual(7);
        expect(contrast(p.muted, surface)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(p.faint, surface)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(p.accent, surface)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(p.ok, surface)).toBeGreaterThanOrEqual(3);
        expect(contrast(p.warn, surface)).toBeGreaterThanOrEqual(3);
      }
      expect(contrast(p.onAccent, p.accent)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(p.onPrimary, p.primary)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(p.link, p.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(p.warnFg, p.warnBg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(p.onPaper, p.paper)).toBeGreaterThanOrEqual(7);
    }
  });
});
