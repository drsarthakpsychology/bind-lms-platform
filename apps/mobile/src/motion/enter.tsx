import * as React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutUp, LinearTransition, useReducedMotion, ZoomIn } from "react-native-reanimated";

import { curves, dur, springs, stagger } from "./tokens";

/** Delay for the i-th item of a staggered group, capped so long lists never wait. */
export function staggerDelay(i: number, base = 0): number {
  return base + Math.min(Math.max(0, i), stagger.max) * stagger.step;
}

/**
 * Layout animation presets (Reanimated `entering` / `exiting` / `layout`).
 * They run on the UI thread. Pass `undefined` when motion is reduced
 * (the `useEnter` hook does that for you).
 */
export const presets = {
  /** A row or block arriving: rises 10px and fades in on the smooth spring. */
  rise: (delay = 0) =>
    FadeInDown.delay(delay)
      .springify()
      .stiffness(springs.smooth.stiffness)
      .damping(springs.smooth.damping)
      .mass(springs.smooth.mass)
      .withInitialValues({ opacity: 0, transform: [{ translateY: stagger.rise }] }),
  /** Plain fade, for content replacing a skeleton. */
  fade: (delay = 0) => FadeIn.delay(delay).duration(dur.enter).easing(curves.out),
  /** Something small appearing in place (a badge, a check): from 0.9, never from 0. */
  pop: (delay = 0) =>
    ZoomIn.delay(delay)
      .springify()
      .stiffness(springs.bouncy.stiffness)
      .damping(springs.bouncy.damping)
      .mass(springs.bouncy.mass)
      .withInitialValues({ transform: [{ scale: 0.9 }] }),
  /** Leaving: quicker than entering. */
  out: () => FadeOut.duration(dur.exit).easing(curves.out),
  /** A removed row lifts away. */
  outUp: () => FadeOutUp.duration(dur.exit).easing(curves.out),
  /** Rows sliding into the gap when one is added or removed. */
  layout: () => LinearTransition.springify().stiffness(springs.snappy.stiffness).damping(springs.snappy.damping).mass(springs.snappy.mass),
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
  return (
    <Animated.View style={style}>
      {items.map((child, i) => (
        <Animated.View key={(React.isValidElement(child) && child.key) || i} entering={reduce ? undefined : presets.rise(staggerDelay(i, base))} exiting={reduce ? undefined : presets.outUp()} layout={reduce ? undefined : presets.layout()}>
          {child}
        </Animated.View>
      ))}
    </Animated.View>
  );
}
