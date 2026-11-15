import * as React from "react";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOutDown, useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createStore } from "@/lib/store";
import { layout, motion, space, useTheme } from "@/theme";
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

/** Mounted once at the root. The toast sits above the tab bar, in ink. */
export function ToastHost() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const { id, text } = store.use((s) => s);
  if (!text) return null;
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: insets.bottom + 84, alignItems: "center", paddingHorizontal: layout.gutter }}>
      <Animated.View
        key={id}
        entering={reduce ? undefined : FadeInDown.duration(motion.state)}
        exiting={reduce ? undefined : FadeOutDown.duration(motion.state)}
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        style={{ maxWidth: 420, borderRadius: layout.radius, backgroundColor: c.band, paddingHorizontal: space[4], paddingVertical: space[3] }}
      >
        <T v="small" tone="onBand" testID="toast">
          {text}
        </T>
      </Animated.View>
    </View>
  );
}
