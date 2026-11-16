import * as React from "react";
import { Image, Platform, Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { haptic } from "@/lib/haptics";
import { settingsStore } from "@/lib/settings";
import { createStore } from "@/lib/store";
import { curves, dur, springs } from "@/motion";
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
export const SHOW_MS = 3_000;
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

/**
 * The sticker slap (motion plan 4.3): in from 0.9, tilted 8 degrees and 24px
 * low, onto -4 degrees on the bouncy spring; out by dropping 16px as it
 * fades. With Reduce Motion it only fades. `play(false)` runs the exit and
 * calls `done` after it.
 */
function useSlap(delay = 0) {
  const reduce = useReducedMotion();
  const t = useSharedValue(0);
  const o = useSharedValue(0);
  const drop = useSharedValue(0);
  const play = React.useCallback(
    (on: boolean, done?: () => void) => {
      if (on) {
        drop.set(0);
        t.set(reduce ? 1 : withDelay(delay, withSpring(1, springs.bouncy)));
        o.set(withDelay(delay, withTiming(1, { duration: reduce ? dur.state : dur.press, easing: curves.out })));
        return;
      }
      if (!reduce) drop.set(withTiming(16, { duration: dur.exit, easing: curves.out }));
      o.set(withTiming(0, { duration: dur.exit, easing: curves.out }));
      if (done) setTimeout(done, dur.exit);
    },
    [delay, reduce, t, o, drop],
  );
  const style = useAnimatedStyle(() => {
    const k = t.value;
    return {
      opacity: o.value,
      transform: [{ translateY: (1 - k) * 24 + drop.value }, { rotate: `${8 - 12 * k}deg` }, { scale: 0.9 + 0.1 * k }],
    };
  });
  return { play, style };
}

const shadow = Platform.OS === "ios" ? { shadowColor: "#000000", shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } } : null;

/**
 * Answer stickers during play: the top right corner, under the header and
 * away from the answers and the thumb. They slap in after the verdict and
 * drop away after SHOW_MS (or at a tap).
 */
export function StickerLayer() {
  const shown = store.use((s) => s.shown);
  const insets = useSafeAreaInsets();
  const [on, setOn] = React.useState<Shown>(shown);
  const { play, style } = useSlap();
  // Keep the last sticker on screen while it leaves.
  if (shown && shown !== on) setOn(shown);
  React.useEffect(() => {
    if (shown) {
      play(true);
      const id = setTimeout(() => reactions.dismiss(), SHOW_MS);
      return () => clearTimeout(id);
    }
    play(false, () => setOn(null));
    return undefined;
  }, [shown, play]);
  if (!on) return null;
  const s = STICKERS.find((x) => x.id === on.id)!;
  const w = 96;
  const h = Math.round((s.h / s.w) * w);
  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0 }}>
      <Animated.View style={[{ position: "absolute", right: 12, top: insets.top + 60 }, shadow, style]}>
        <Pressable accessibilityRole="image" accessibilityLabel={`${s.alt}. Tap to close.`} onPress={() => reactions.dismiss()} testID="sticker">
          <Image source={s.src} style={{ width: w, height: h }} resizeMode="contain" />
        </Pressable>
      </Animated.View>
    </View>
  );
}

/**
 * The end of a round's sticker, slapped onto the corner of the score card
 * (storyboard 2, at 650ms). Follows the Funny reactions switch; a tap
 * peels it off.
 */
export function EndSticker({ mood, seed, delay }: { mood: Mood; seed: number; delay: number }) {
  const enabled = settingsStore.use((x) => x.reactions);
  const [gone, setGone] = React.useState(false);
  const { play, style } = useSlap(delay);
  React.useEffect(() => {
    if (enabled) play(true);
  }, [enabled, play]);
  if (!enabled || gone) return null;
  const s = stickerFor(mood, seed);
  const w = 104;
  const h = Math.round((s.h / s.w) * w);
  return (
    <Animated.View pointerEvents="box-none" style={[{ position: "absolute", right: 0, top: -8 }, shadow, style]}>
      <Pressable accessibilityRole="image" accessibilityLabel={`${s.alt}. Tap to close.`} onPress={() => play(false, () => setGone(true))} testID="sticker">
        <Image source={s.src} style={{ width: w, height: h }} resizeMode="contain" />
      </Pressable>
    </Animated.View>
  );
}
