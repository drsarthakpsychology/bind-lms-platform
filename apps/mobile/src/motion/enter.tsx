import * as React from "react";
import { Platform, type StyleProp, type ViewStyle } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutUp, LinearTransition, useReducedMotion, withDelay, withSpring, withTiming, ZoomIn } from "react-native-reanimated";

import { curves, dur, shift, springs, stagger } from "./tokens";

/** Delay for the i-th item of a staggered group, capped so long lists never wait. */
export function staggerDelay(i: number, base = 0): number {
  return base + Math.min(Math.max(0, i), stagger.max) * stagger.step;
}

/**
 * The web build (react-native-web, used only for screenshots) gets no layout
 * animations: its CSS emulation leaves views misplaced after a re-render.
 * Phones get every one of them.
 */
const native = Platform.OS !== "web";
const memo = new Map<string, unknown>();
function cached<B>(key: string, make: () => B): B | undefined {
  if (!native) return undefined;
  if (!memo.has(key)) memo.set(key, make());
  return memo.get(key) as B;
}

/**
 * Layout animation presets (Reanimated `entering` / `exiting` / `layout`).
 * They run on the UI thread. Each call with the same arguments returns the
 * same object, so re-renders never hand Reanimated a "new" animation. Pass
 * `undefined` when motion is reduced (the `useEnter` hook does that for you).
 */
export const presets = {
  /** A row or block arriving: rises 10px and fades in on the smooth spring. */
  rise: (delay = 0) =>
    cached(`rise${delay}`, () =>
      FadeInDown.delay(delay)
        .springify()
        .stiffness(springs.smooth.stiffness)
        .damping(springs.smooth.damping)
        .mass(springs.smooth.mass)
        .withInitialValues({ opacity: 0, transform: [{ translateY: stagger.rise }] }),
    ),
  /** Plain fade, for content replacing a skeleton. */
  fade: (delay = 0) => cached(`fade${delay}`, () => FadeIn.delay(delay).duration(dur.enter).easing(curves.out)),
  /** A quick fade for a state change (controls showing, a block revealed, a screen arriving): 180ms. */
  fadeState: (delay = 0) => cached(`fadeState${delay}`, () => FadeIn.delay(delay).duration(dur.state).easing(curves.standard)),
  /** Something small appearing in place (a badge, a check): from 0.9, never from 0. */
  pop: (delay = 0) => cached(`pop${delay}`, () => ZoomIn.delay(delay).springify().stiffness(springs.bouncy.stiffness).damping(springs.bouncy.damping).mass(springs.bouncy.mass).withInitialValues({ transform: [{ scale: 0.9 }] })),
  /** Leaving: quicker than entering. */
  out: () => cached("out", () => FadeOut.duration(dur.exit).easing(curves.out)),
  /** A removed row lifts away. */
  outUp: () => cached("outUp", () => FadeOutUp.duration(dur.exit).easing(curves.out)),
  /** Rows sliding into the gap when one is added or removed. */
  layout: () => cached("layout", () => LinearTransition.springify().stiffness(springs.snappy.stiffness).damping(springs.snappy.damping).mass(springs.snappy.mass)),
  /**
   * Keyed content arriving (a question, a round): fade and an 8px move from
   * the direction of travel, 180ms. `dir` 1 = from the right, -1 = from the
   * left, 0 = rises. Prefer the `Swap` part, which also plays the old one out.
   */
  swap: (dir: -1 | 0 | 1 = 0) =>
    cached(`swap${dir}`, () => () => {
      "worklet";
      const t = { duration: dur.swapIn, easing: curves.out };
      return {
        initialValues: { opacity: 0, transform: [{ translateX: dir * shift.swapIn }, { translateY: dir ? 0 : shift.swapIn }] },
        animations: { opacity: withTiming(1, t), transform: [{ translateX: withTiming(0, t) }, { translateY: withTiming(0, t) }] },
      };
    }),
  /** Keyed content leaving: fade and 6px up, 100ms. */
  swapOut: () => cached("swapOut", () => FadeOutUp.duration(dur.swapOut).easing(curves.out).withInitialValues({ opacity: 1, transform: [{ translateY: 0 }] })),
  /** A verdict band: readable by 120ms, then settles the last 16px on the smooth spring. */
  verdict: (delay = 0) =>
    cached(`verdict${delay}`, () => () => {
      "worklet";
      return {
        initialValues: { opacity: 0, transform: [{ translateY: 16 }] },
        animations: { opacity: withTiming(1, { duration: 120, easing: curves.out }), transform: [{ translateY: withSpring(0, springs.smooth) }] },
      };
    }),
  /**
   * Screen choreography, part 1: the header (title and lead line) arrives
   * first, fading in and lifting 10px into place, 220ms. `low`: the fade only.
   */
  head: (low = false) =>
    cached(`head${low}`, () => () => {
      "worklet";
      const t = { duration: low ? dur.state : 220, easing: curves.out };
      return low
        ? { initialValues: { opacity: 0 }, animations: { opacity: withTiming(1, t) } }
        : { initialValues: { opacity: 0, transform: [{ translateY: 10 }] }, animations: { opacity: withTiming(1, t), transform: [{ translateY: withTiming(0, t) }] } };
    }),
  /**
   * Screen choreography, part 2: the body follows the header 70ms later,
   * fading in and lifting 8px, 240ms, so the whole screen has landed by
   * ~310ms (the native slide is 320). `low`: a fade only, 40ms after.
   */
  body: (low = false) =>
    cached(`body${low}`, () => () => {
      "worklet";
      const t = { duration: low ? dur.state : 240, easing: curves.out };
      const delay = low ? 40 : 70;
      return low
        ? { initialValues: { opacity: 0 }, animations: { opacity: withDelay(delay, withTiming(1, t)) } }
        : {
            initialValues: { opacity: 0, transform: [{ translateY: shift.swapIn }] },
            animations: { opacity: withDelay(delay, withTiming(1, t)), transform: [{ translateY: withDelay(delay, withTiming(0, t)) }] },
          };
    }),
  /**
   * Continuity from a list row to its page: the page's title starts where the
   * row's title was on screen (`fromY`, window coordinates) and glides into its
   * own place while the page slides in, a little smaller and lighter at first,
   * so the row reads as having opened into the page. The distance is capped at
   * 160px so a row near the bottom never flies across the screen.
   */
  fromRow: (fromY: number) =>
    // Rows sit at many heights: kept in 8px steps so the cache stays small.
    cached(`fromRow${Math.round(fromY / 8) * 8}`, () => (values: { targetGlobalOriginY: number }) => {
      "worklet";
      const dy = Math.max(-160, Math.min(160, fromY - values.targetGlobalOriginY));
      const move = springs.morph;
      return {
        initialValues: { opacity: 0.35, transform: [{ translateY: dy }, { scale: 0.94 }] },
        animations: { opacity: withTiming(1, { duration: dur.state, easing: curves.out }), transform: [{ translateY: withSpring(0, move) }, { scale: withSpring(1, move) }] },
      };
    }),
  /** A toast rising in from the bottom edge: 12px and a fade, 180ms. */
  toast: () =>
    cached("toast", () => () => {
      "worklet";
      const t = { duration: dur.toastIn, easing: curves.out };
      return { initialValues: { opacity: 0, transform: [{ translateY: shift.toast }] }, animations: { opacity: withTiming(1, t), transform: [{ translateY: withTiming(0, t) }] } };
    }),
  /** A toast leaving the way it came: drops 12px and fades, 140ms. */
  toastOut: () =>
    cached("toastOut", () => () => {
      "worklet";
      const t = { duration: dur.toastOut, easing: curves.out };
      return { initialValues: { opacity: 1, transform: [{ translateY: 0 }] }, animations: { opacity: withTiming(0, t), transform: [{ translateY: withTiming(shift.toast, t) }] } };
    }),
} as const;

/**
 * The entry animation for the i-th item, or nothing when motion is reduced.
 * `<Animated.View entering={useEnter(i)}>`
 */
export function useEnter(i = 0, kind: "rise" | "fade" | "pop" = "rise", base = 0) {
  const reduce = useReducedMotion();
  if (reduce) return undefined;
  return presets[kind](staggerDelay(i, base));
}

/**
 * Wrap a block so it rises in when it first appears. Give each block on a
 * screen its order with `i` and they arrive one after another, 40ms apart.
 * Only the first appearance animates; re-renders do not replay it.
 */
export function Enter({ i = 0, kind = "rise", base = 0, children, style, testID }: { i?: number; kind?: "rise" | "fade" | "pop"; /** Extra delay before this group starts (ms). */ base?: number; children?: React.ReactNode; style?: StyleProp<ViewStyle>; testID?: string }) {
  const entering = useEnter(i, kind, base);
  return (
    <Animated.View testID={testID} entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}

/**
 * A list whose rows arrive one after another, and slide to close the gap
 * when one is added or removed. Children keep their own keys.
 */
export function StaggerList({ children, style, base = 0 }: { children?: React.ReactNode; style?: StyleProp<ViewStyle>; base?: number }) {
  const reduce = useReducedMotion();
  const items = React.Children.toArray(children).filter(Boolean);
  const slide = !reduce;
  return (
    <Animated.View style={style}>
      {items.map((child, i) => (
        <Animated.View key={(React.isValidElement(child) && child.key) || i} entering={reduce ? undefined : presets.rise(staggerDelay(i, base))} exiting={slide ? presets.outUp() : undefined} layout={slide ? presets.layout() : undefined}>
          {child}
        </Animated.View>
      ))}
    </Animated.View>
  );
}
