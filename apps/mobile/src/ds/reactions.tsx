import * as React from "react";
import { AccessibilityInfo, Image, Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MessageCircleOff } from "lucide-react-native";

import { haptic } from "@/lib/haptics";
import { pickReaction, type Reaction } from "@/lib/reactions/pick";
import { GOOD_MOODS, moodForScore, type Mood } from "@/lib/reactions/stickers";
import { decide, newRun, type AnswerCtx, type Run } from "@/lib/reactions/trigger";
import { settingsStore, updateSettings } from "@/lib/settings";
import { createStore } from "@/lib/store";
import { curves } from "@/motion";
import { useTheme } from "@/theme";
import { T } from "./text";

/**
 * The website's funny reactions (src/components/reactions), in the app: a
 * meme sticker and a cheeky line in a speech bubble, bottom right. The same
 * rules decide when one shows (lib/reactions/trigger: first right, streaks of
 * 3, 5 and 10, two wrong in a row, a comeback, else about 1 in 4; never more
 * than one in 15 seconds, never while a clock runs) and the same lines and
 * stickers are picked. A round's end always shows one. It stays 10 seconds; a
 * tap closes it, and the small button turns reactions off (Settings has the
 * same switch).
 */

export type { AnswerCtx, Mood };
export { moodForScore };

type Shown = Reaction & { key: number };
const store = createStore<{ shown: Shown | null }>({ shown: null });
let lastAt = 0;
let seq = 0;
/** Bumped by a full dismiss, so a reaction still waiting never lands afterwards. */
let gen = 0;

/** A sticker stays this long (the website's 10 seconds); a tap removes it at once. */
export const SHOW_MS = 10_000;
/** Let the right/wrong mark land first (the website's settle time). */
const SETTLE_MS = 320;

const on = () => settingsStore.get().reactions;

function show(mood: Mood) {
  if (!on()) return;
  lastAt = Date.now();
  const r = pickReaction(mood);
  const mine = gen;
  setTimeout(() => {
    if (mine !== gen || !on()) return;
    store.set({ shown: { ...r, key: ++seq } });
    AccessibilityInfo.announceForAccessibility(`${r.sticker.alt}. ${r.line}`);
  }, SETTLE_MS);
}

export const reactions = {
  /** Show one now (no throttle), e.g. a round's end. */
  show(mood: Mood) {
    lastAt = 0;
    show(mood);
  },
  /** Close the one on screen. With no key, also cancel one still waiting. */
  dismiss(key?: number) {
    if (key === undefined) gen++;
    const cur = store.get().shown;
    if (!cur || (key !== undefined && cur.key !== key)) return;
    store.set({ shown: null });
  },
  current: () => store.get().shown,
  /** Tests only. */
  reset() {
    gen++;
    lastAt = 0;
    store.set({ shown: null });
  },
};

/**
 * One round's reactions (the website's useReaction). `answer` after each
 * marked answer: it plays the right/wrong haptic and may show a sticker; it
 * never changes the score. Pass `{ timed: true }` while a clock runs and
 * `{ partial: true }` for a near miss. `finish` at the end always shows one.
 */
export function useReactions() {
  const run = React.useRef<Run>(newRun());
  return React.useMemo(
    () => ({
      /** `feel: false` where the screen already buzzes for the answer (VerdictBand does). */
      answer(right: boolean, ctx: AnswerCtx = {}, feel = true) {
        if (feel && right) haptic.success();
        else if (feel) haptic.warn();
        const d = decide(run.current, right, ctx, { now: Date.now(), lastShownAt: lastAt, rand: Math.random, enabled: on() });
        run.current = d.run;
        if (d.mood) show(d.mood);
      },
      finish(outcome: "won" | "lost" | "mixed") {
        reactions.show(outcome === "won" ? "streak" : outcome === "lost" ? "wrong" : "near");
      },
      reset() {
        run.current = newRun();
      },
    }),
    [],
  );
}

/**
 * The end of a round outside the games (study checks, map practice): shows
 * the end sticker once per `seed`. Renders nothing itself.
 */
export function EndReaction({ right, total, mood, seed = "" }: { right?: number; total?: number; mood?: Mood; seed?: string | number }) {
  const m = mood ?? moodForScore(right ?? 0, total ?? 0);
  const key = `${m}|${seed}`;
  const done = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (done.current === key) return;
    done.current = key;
    reactions.show(m);
  }, [key, m]);
  return null;
}

/**
 * The sticker layer. Mount once per screen that answers questions (GameFrame
 * does). `above` is the measured height of the screen's pinned footer (its
 * Next, Check or Play again buttons, safe area included), so the sticker
 * never covers them; without it the sticker keeps 96 points clear.
 */
export function ReactionLayer({ above }: { above?: number }) {
  const shown = store.use((s) => s.shown);
  const insets = useSafeAreaInsets();
  // Leaving the screen closes the sticker (after this unmount, never during it).
  React.useEffect(
    () => () => {
      gen++;
      setTimeout(() => reactions.dismiss(), 0);
    },
    [],
  );
  if (!shown) return null;
  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
      <Popup key={shown.key} r={shown} bottom={above ? above + 12 : insets.bottom + 96} />
    </View>
  );
}

const STICKER_H = 96;
const EXIT_MS = 180;

function Popup({ r, bottom }: { r: Shown; bottom: number }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const good = GOOD_MOODS.has(r.mood);
  // Sticker: tilts in and stamps down flat (no overshoot). Bubble: slides in a moment later.
  const art = useSharedValue(0);
  const bub = useSharedValue(0);
  const out = useSharedValue(0);
  const leaving = React.useRef(false);

  const gone = React.useCallback(() => reactions.dismiss(r.key), [r.key]);
  const leave = React.useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    // The fade runs on the UI thread; the sticker is removed when it is done.
    out.set(withTiming(1, { duration: EXIT_MS, easing: curves.standard }));
    setTimeout(gone, EXIT_MS);
  }, [out, gone]);

  React.useEffect(() => {
    art.set(withTiming(1, { duration: reduce ? 200 : 380, easing: curves.out }));
    bub.set(reduce ? withTiming(1, { duration: 200 }) : withDelay(150, withTiming(1, { duration: 260, easing: curves.out })));
    const t = setTimeout(leave, SHOW_MS);
    return () => clearTimeout(t);
  }, [art, bub, reduce, leave]);

  const boxStyle = useAnimatedStyle(() => ({ opacity: 1 - out.value, transform: reduce ? [] : [{ translateY: out.value * 6 }] }));
  const artStyle = useAnimatedStyle(() => {
    const p = art.value;
    if (reduce) return { opacity: p, transform: [{ rotate: "-4deg" }] };
    return { opacity: p, transform: [{ translateY: -10 * (1 - p) }, { rotate: `${-18 + 14 * p}deg` }, { scale: 1.28 - 0.28 * p }] };
  });
  const bubStyle = useAnimatedStyle(() => {
    const p = bub.value;
    if (reduce) return { opacity: p };
    return { opacity: p, transform: [{ translateX: 10 * (1 - p) }, { scale: 0.96 + 0.04 * p }] };
  });

  const w = Math.round((r.sticker.w / r.sticker.h) * STICKER_H);
  const bg = good ? c.successBg : c.card;
  return (
    <Animated.View testID="reaction" style={[{ position: "absolute", right: 12, bottom, left: 12, flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end" }, boxStyle]} pointerEvents="box-none">
      <Animated.View style={[{ marginBottom: 20, flexShrink: 1 }, bubStyle]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Close: ${r.line}`}
          onPress={leave}
          testID="reaction-line"
          style={{ maxWidth: 224, borderWidth: 2, borderColor: c.ink, borderRadius: 10, backgroundColor: bg, paddingVertical: 8, paddingLeft: 18, paddingRight: 12, shadowColor: c.shadow, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0, elevation: 2 }}
        >
          <T v="small" style={{ fontWeight: "700", color: c.ink }}>
            {r.line}
          </T>
          {/* The tail points at the sticker. */}
          <View pointerEvents="none" style={{ position: "absolute", right: -7, top: "50%", marginTop: -6, width: 12, height: 12, backgroundColor: bg, borderTopWidth: 2, borderRightWidth: 2, borderColor: c.ink, transform: [{ rotate: "45deg" }] }} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Turn off funny reactions"
          hitSlop={8}
          onPress={() => {
            updateSettings({ reactions: false });
            leave();
          }}
          testID="reaction-off"
          style={{ position: "absolute", top: -14, left: -14, width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: c.ink, backgroundColor: c.card, alignItems: "center", justifyContent: "center" }}
        >
          <MessageCircleOff size={14} color={c.ink} />
        </Pressable>
      </Animated.View>
      {/* Tapping the sticker closes it too. */}
      <Animated.View style={[{ marginLeft: 4 }, artStyle]}>
        <Pressable accessible={false} importantForAccessibility="no" onPress={leave} testID="sticker">
          <Image source={r.sticker.src} style={{ width: w, height: STICKER_H }} resizeMode="contain" accessibilityIgnoresInvertColors />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
