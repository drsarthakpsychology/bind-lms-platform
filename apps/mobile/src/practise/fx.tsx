/**
 * Game feel for Practise. The app's motion kit (src/motion, docs/MOTION.md)
 * gives presses, entries, rolling numbers, bursts and confetti; this file
 * only adds the few game moments the kit does not have, on the kit's tokens:
 *
 *   Stagger   the kit's StaggerList with a gap between children
 *   Feel      wraps an answer: a bouncy pop when right, one short shake when wrong
 *   Bump      a number that pops when it changes (the HUD score)
 *   Flip      a card that turns over to show its back (a reveal)
 *   Rise      the verdict band settling up under the answer
 *
 * Every part runs on the UI thread and keeps its meaning with Reduce Motion
 * (the state still shows at once). Motion follows a tap; it never blocks one.
 *
 * References (round R2, Screenrove motion library): interior-like-burst
 * (spring in, small square sparks on a 440ms ease out), interior-otp-input
 * (a wrong entry shakes the row once), interior-value-flash (a changed
 * number lifts and settles); and the pattern of a bounce on right, a shake on
 * wrong and a verdict band rising from the thumb with the next button.
 */
import * as React from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import Animated, { Easing, FadeInDown, useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";

import { dur, springs, StaggerList } from "@/motion";

/** Children rise in one after another (the kit's StaggerList), `gap` apart. */
export function Stagger({ children, gap = 0 }: { children: React.ReactNode; gap?: number }) {
  return <StaggerList style={{ gap }}>{children}</StaggerList>;
}

export type FeelState = "idle" | "right" | "wrong" | string;

/** A bouncy pop when `state` turns "right", one short sideways shake when it turns "wrong". */
export function Feel({ state, children, style }: { state: FeelState; children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduce = useReducedMotion();
  const scale = useSharedValue(1);
  const x = useSharedValue(0);
  const last = React.useRef(state);
  React.useEffect(() => {
    if (last.current === state) return;
    last.current = state;
    if (reduce) return;
    if (state === "right") scale.set(withSequence(withTiming(1.04, { duration: dur.micro }), withSpring(1, springs.bouncy)));
    if (state === "wrong") x.set(withSequence(withTiming(-7, { duration: 45 }), withTiming(7, { duration: 70 }), withTiming(-4, { duration: 60 }), withTiming(0, { duration: 60 })));
  }, [state, reduce, scale, x]);
  const a = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { scale: scale.value }] }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

/** Wraps a number (the HUD score) and pops it up a little each time it changes. */
export function Bump({ value, children }: { value: string | number; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  const y = useSharedValue(0);
  const last = React.useRef(value);
  React.useEffect(() => {
    if (last.current === value) return;
    last.current = value;
    if (reduce) return;
    s.set(withSequence(withTiming(1.15, { duration: dur.micro }), withSpring(1, springs.bouncy)));
    y.set(withSequence(withTiming(-4, { duration: dur.micro }), withSpring(0, springs.bouncy)));
  }, [value, reduce, s, y]);
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }, { scale: s.value }] }));
  return <Animated.View style={a}>{children}</Animated.View>;
}

/** A card that turns over (front, then back) when `flipped` becomes true. Cross-fades with Reduce Motion. */
export function Flip({ flipped, front, back, style }: { flipped: boolean; front: React.ReactNode; back: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduce = useReducedMotion();
  const t = useSharedValue(flipped ? 1 : 0);
  React.useEffect(() => {
    t.set(reduce ? (flipped ? 1 : 0) : withTiming(flipped ? 1 : 0, { duration: 420, easing: Easing.inOut(Easing.cubic) }));
  }, [flipped, reduce, t]);
  const f = useAnimatedStyle(() => ({ opacity: t.value < 0.5 ? 1 : 0, transform: [{ perspective: 900 }, { rotateY: `${t.value * 180}deg` }] }));
  const b = useAnimatedStyle(() => ({ opacity: t.value >= 0.5 ? 1 : 0, transform: [{ perspective: 900 }, { rotateY: `${t.value * 180 - 180}deg` }] }));
  return (
    <View style={style}>
      <Animated.View style={f} pointerEvents={flipped ? "none" : "auto"}>
        {front}
      </Animated.View>
      <Animated.View style={[{ position: "absolute", left: 0, right: 0, top: 0 }, b]} pointerEvents={flipped ? "auto" : "none"}>
        {back}
      </Animated.View>
    </View>
  );
}

/** The verdict band: settles up under the answer on the kit's smooth spring. */
export function Rise({ children, testID }: { children: React.ReactNode; testID?: string }) {
  const reduce = useReducedMotion();
  return (
    <Animated.View testID={testID} entering={reduce ? undefined : FadeInDown.springify().stiffness(springs.smooth.stiffness).damping(springs.smooth.damping).mass(springs.smooth.mass)}>
      {children}
    </Animated.View>
  );
}

