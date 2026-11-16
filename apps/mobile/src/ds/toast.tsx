import * as React from "react";
import { View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createStore } from "@/lib/store";
import { presets } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { bottomChrome, toastBottom } from "./bottom-chrome";
import { T } from "./text";

type ToastState = { id: number; text: string | null };
const store = createStore<ToastState>({ id: 0, text: null });
let timer: ReturnType<typeof setTimeout> | undefined;

/** One short line that confirms something ("Saved", "Sent"). Goes away by itself. */
export const toast = {
  show(text: string, ms = 2800) {
    if (timer) clearTimeout(timer);
    store.set((s) => ({ id: s.id + 1, text }));
    timer = setTimeout(() => store.set({ text: null }), ms);
  },
  hide() {
    if (timer) clearTimeout(timer);
    store.set({ text: null });
  },
};

/**
 * Mounted once at the root. The toast sits above the front screen's pinned
 * footer and the tab bar (both measured, see bottom-chrome.ts), in ink. The
 * host stays mounted so a toast leaves the way it came (rises 12px in 180ms,
 * drops and fades in 140ms); a new toast pushes the old one out.
 */
export function ToastHost() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const { id, text } = store.use((s) => s);
  const bottom = bottomChrome.use((s) => toastBottom(s, insets.bottom)) + space[3];
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom, alignItems: "center", paddingHorizontal: layout.gutter }}>
      {text ? (
        <Animated.View
          key={id}
          entering={reduce ? undefined : presets.toast()}
          exiting={reduce ? undefined : presets.toastOut()}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          style={{ maxWidth: 420, borderRadius: layout.radius, backgroundColor: c.band, paddingHorizontal: space[4], paddingVertical: space[3] }}
        >
          <T v="small" tone="onBand" testID="toast">
            {text}
          </T>
        </Animated.View>
      ) : null}
    </View>
  );
}
