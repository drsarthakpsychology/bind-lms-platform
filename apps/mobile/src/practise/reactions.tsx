import * as React from "react";
import { Image, Pressable, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { haptic } from "@/lib/haptics";
import { settingsStore } from "@/lib/settings";
import { createStore } from "@/lib/store";
import { motion } from "@/theme";
import { STICKERS, type Mood } from "@/lib/reactions/stickers";

/**
 * The website's reaction stickers (public/reactions, the same art): cat and
 * dog memes in blue riso on lime (good) or cream (bad). One shows when a
 * round ends ("won" a happy one, "lost" a sad one, "mixed" the crying thumbs
 * up), and now and then after an answer (a streak, a run of misses). Off when
 * the student turns reactions off in Settings. A tap removes it.
 */
export type { Mood } from "@/lib/reactions/stickers";

/** A round's share right as a mood (the website's moodForScore). */
export function moodForScore(right: number, total: number): Mood {
  if (total <= 0) return "near";
  const r = right / total;
  if (r >= 0.85) return "streak";
  if (r >= 0.6) return "right";
  if (r >= 0.35) return "near";
  return "wrong";
}

export function stickerFor(mood: Mood, seed: number): (typeof STICKERS)[number] {
  const pool = STICKERS.filter((s) => s.mood === mood);
  return pool[Math.abs(seed) % pool.length]!;
}

type Shown = { id: string; mood: Mood; key: number } | null;
const store = createStore<{ shown: Shown; lastAt: number }>({ shown: null, lastAt: 0 });
/** A sticker stays this long; a tap removes it at once. */
export const SHOW_MS = 4_000;
/** No more than one answer sticker in this window (end stickers always show). */
const THROTTLE_MS = 15_000;

export const reactions = {
  show(mood: Mood, seed = Date.now()) {
    if (!settingsStore.get().reactions) return;
    const s = stickerFor(mood, seed);
    store.set({ shown: { id: s.id, mood, key: Date.now() }, lastAt: Date.now() });
  },
  dismiss() {
    store.set({ shown: null });
  },
  current: () => store.get().shown,
};

/**
 * One round's reactions. `answer` after each marked answer (never changes the
 * score): three right in a row, or three misses in a row, may show a sticker.
 * `finish` at the end always shows one.
 */
export function useReactions() {
  const run = React.useRef({ streak: 0, misses: 0 });
  return React.useMemo(
    () => ({
      answer(right: boolean) {
        if (right) haptic.success();
        else haptic.warn();
        const r = run.current;
        if (right) {
          r.streak += 1;
          r.misses = 0;
        } else {
          r.misses += 1;
          r.streak = 0;
        }
        const now = Date.now();
        if (now - store.get().lastAt < THROTTLE_MS) return;
        if (r.streak === 3 || r.streak === 6) reactions.show("streak", r.streak);
        else if (r.misses === 3) reactions.show("wrong", r.misses);
      },
      finish(outcome: "won" | "lost" | "mixed", seed = Date.now()) {
        reactions.show(outcome === "won" ? "streak" : outcome === "lost" ? "wrong" : "near", seed);
      },
      reset() {
        run.current = { streak: 0, misses: 0 };
      },
    }),
    [],
  );
}

/** The sticker layer: bottom corner, above the pinned action, never under a finger for long. */
export function StickerLayer() {
  const shown = store.use((s) => s.shown);
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const scale = useSharedValue(1);
  const fade = useSharedValue(1);
  React.useEffect(() => {
    if (!shown) return;
    scale.set(reduce ? 1 : withSequence(withTiming(1.12, { duration: 160, easing: Easing.bezier(...motion.easeOut) }), withTiming(1, { duration: 220, easing: Easing.bezier(...motion.easeOut) })));
    fade.set(reduce ? 1 : withTiming(1, { duration: motion.state }));
    const id = setTimeout(() => reactions.dismiss(), SHOW_MS);
    return () => clearTimeout(id);
  }, [shown, reduce, scale, fade]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { rotate: "-4deg" }], opacity: fade.value }));
  if (!shown) return null;
  const s = STICKERS.find((x) => x.id === shown.id)!;
  const w = 132;
  const h = Math.round((s.h / s.w) * w);
  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0 }}>
      <Animated.View style={[{ position: "absolute", right: 16, bottom: insets.bottom + 96 }, style]}>
        <Pressable accessibilityRole="image" accessibilityLabel={`${s.alt}. Tap to close.`} onPress={() => reactions.dismiss()} testID="sticker">
          <Image source={s.src} style={{ width: w, height: h }} resizeMode="contain" />
        </Pressable>
      </Animated.View>
    </View>
  );
}
