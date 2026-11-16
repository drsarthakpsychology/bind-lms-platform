import { useFocusEffect } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import * as React from "react";
import { Appearance, Platform, StyleSheet, useColorScheme, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";

import { settingsStore } from "@/lib/settings";
import { setNavigationBarDark } from "../../modules/system-bars/src";
import { useAreaName, neutralSwatch } from "./area";
import { dark, light, type Palette, type Swatch } from "./tokens";

export * from "./tokens";
export { AreaProvider, neutralSwatch, useAreaName } from "./area";

const ThemeContext = React.createContext<Palette>(light);

/**
 * Tells the phone which look the app uses, so the parts the phone draws match:
 * the keyboard and alerts (through Appearance), the window behind the app (no
 * white flash when the keyboard opens or a screen slides), and the Android
 * navigation bar buttons. The status bar follows `<StatusBar>` in the root layout.
 */
function tellPhone(choice: "system" | "light" | "dark", p: Palette) {
  try {
    if (Platform.OS !== "web" && typeof Appearance.setColorScheme === "function") Appearance.setColorScheme(choice === "system" ? "unspecified" : choice);
  } catch {
    /* an older phone without the override: the app still draws its own colours */
  }
  SystemUI.setBackgroundColorAsync(p.bg).catch(() => undefined);
  setNavigationBarDark(p.dark);
}

/**
 * Follows the phone's light or dark setting unless the student chose one in
 * Settings. A change fades the old background away over the new colours.
 * `force` pins a look for a small part (no fade, nothing told to the phone).
 */
export function ThemeProvider({ children, force }: { children: React.ReactNode; force?: "light" | "dark" }) {
  const system = useColorScheme();
  const choice = settingsStore.use((s) => s.theme);
  const mode = force ?? (choice === "system" ? (system === "dark" ? "dark" : "light") : choice);
  const palette = mode === "dark" ? dark : light;

  // The colour the screen had before the last change, for the fade.
  const [shown, setShown] = React.useState(mode);
  const [from, setFrom] = React.useState<string | null>(null);
  if (shown !== mode) {
    setFrom((shown === "dark" ? dark : light).bg);
    setShown(mode);
  }

  React.useEffect(() => {
    if (!force) tellPhone(choice, palette);
  }, [force, choice, palette]);

  // A forced look (tests, a light island such as a button on video) only changes the colours.
  if (force) return <ThemeContext.Provider value={palette}>{children}</ThemeContext.Provider>;
  return (
    <ThemeContext.Provider value={palette}>
      <View style={{ flex: 1, backgroundColor: palette.bg }}>
        {children}
        {from ? <Fade key={`${shown}-${from}`} color={from} onDone={() => setFrom(null)} /> : null}
      </View>
    </ThemeContext.Provider>
  );
}

/** The old background, fading out over the new theme. Never blocks a touch. */
function Fade({ color, onDone }: { color: string; onDone: () => void }) {
  const reduce = useReducedMotion();
  const o = useSharedValue(1);
  const done = React.useRef(onDone);
  React.useEffect(() => {
    done.current = onDone;
  });
  React.useEffect(() => {
    const ms = reduce ? 120 : 320;
    o.value = withTiming(0, { duration: ms, easing: Easing.bezier(0.23, 1, 0.32, 1) });
    const t = setTimeout(() => done.current(), ms + 40);
    return () => clearTimeout(t);
  }, [o, reduce]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View pointerEvents="none" testID="theme-fade" style={[StyleSheet.absoluteFill, { backgroundColor: color }, style]} />;
}

/** The current colours. */
export function useTheme(): Palette {
  return React.useContext(ThemeContext);
}

/** The accent family of the area this part sits in (neutral greys outside one), and whether there is one. */
export function useAccent(): Swatch & { on: boolean } {
  const c = useTheme();
  const a = useAreaName();
  return a ? { ...c.areas[a], on: true } : { ...neutralSwatch(c), on: false };
}

/**
 * For a screen with a fixed dark top (the lecture player): light status bar
 * icons while it is in front, back to the theme's when it leaves.
 */
export function useLightStatusBar() {
  const c = useTheme();
  useFocusEffect(
    React.useCallback(() => {
      setStatusBarStyle("light");
      return () => setStatusBarStyle(c.dark ? "light" : "dark");
    }, [c.dark]),
  );
}
