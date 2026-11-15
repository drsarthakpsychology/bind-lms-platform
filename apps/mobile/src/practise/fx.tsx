/**
 * Game feel for Practise, in one small kit (kept inside the games folder;
 * the app-wide motion kit lives in src/motion). Every part:
 *   - runs on the UI thread with Reanimated (60fps); only CountUp draws text,
 *     once per changed digit,
 *   - does nothing when Reduce Motion is on (the state still shows at once),
 *   - never delays an answer: motion follows the tap, it never blocks it.
 *
 *   Stagger   children rise in one after another (lists, end stats)
 *   Feel      wraps an answer: a spring pop when right, a short shake when wrong
 *   Press     a springy press-in for big game tiles
 *   CountUp   a number that counts to its value (score, XP, streak)
 *   Bump      a number that pops when it changes (the HUD score)
 *   Burst     a burst of lime and blue confetti, once (a won round)
 *   Flip      a card that turns over to show its back (a reveal)
 *   Rise      the verdict band sliding up under the answer
 *
 * References (round R2, Screenrove motion library): interior-like-burst (spring in
 * from 0.55, small square sparks on a 440ms ease out), interior-otp-input (a
 * wrong entry shakes the row once), interior-value-flash (a changed number
 * lifts to about 1.05 and settles), and the Duolingo-style pattern of a
 * bounce on right, a shake on wrong and a verdict band rising from the thumb
 * with the next button; a count-up score on the end screen.
 */
import * as React from "react";
import { Pressable, type PressableProps, type StyleProp, View, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { useTheme } from "@/theme";

const SPRING = { damping: 14, stiffness: 260, mass: 0.7 };

/** Children rise in one after another, 40ms apart (never more than 400ms in all). */
export function Stagger({ children, gap = 0, step = 40 }: { children: React.ReactNode; gap?: number; step?: number }) {
  const reduce = useReducedMotion();
  const items = React.Children.toArray(children);
  return (
    <View style={{ gap }}>
      {items.map((ch, i) => (
        <Animated.View key={i} entering={reduce ? undefined : FadeInDown.duration(260).delay(Math.min(400, i * step)).easing(Easing.out(Easing.cubic))}>
          {ch}
        </Animated.View>
      ))}
    </View>
  );
}

export type FeelState = "idle" | "right" | "wrong" | string;

/** A spring pop when `state` turns "right", a short sideways shake when it turns "wrong". */
export function Feel({ state, children, style }: { state: FeelState; children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduce = useReducedMotion();
  const scale = useSharedValue(1);
  const x = useSharedValue(0);
  const last = React.useRef(state);
  React.useEffect(() => {
    if (last.current === state) return;
    last.current = state;
    if (reduce) return;
    if (state === "right") scale.value = withSequence(withTiming(1.04, { duration: 110 }), withSpring(1, SPRING));
    if (state === "wrong") x.value = withSequence(withTiming(-7, { duration: 45 }), withTiming(7, { duration: 70 }), withTiming(-4, { duration: 60 }), withTiming(0, { duration: 60 }));
  }, [state, reduce, scale, x]);
  const a = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { scale: scale.value }] }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

/** A pressable that sinks in on press with a spring, for big game tiles and cards. */
export function Press({ children, style, onPressIn, onPressOut, ...rest }: PressableProps & { style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  const sink: PressableProps["onPressIn"] = (e) => {
    if (!reduce) s.value = withTiming(0.96, { duration: 90 });
    onPressIn?.(e);
  };
  const lift: PressableProps["onPressOut"] = (e) => {
    if (!reduce) s.value = withSpring(1, SPRING);
    onPressOut?.(e);
  };
  return (
    <Pressable {...rest} onPressIn={sink} onPressOut={lift}>
      <Animated.View style={[style, a]}>{children}</Animated.View>
    </Pressable>
  );
}

/**
 * A number that counts up to `to` (ease out, about 0.9s). Draws text only
 * when the shown whole number changes (at most one short text per frame, so
 * it stays cheap). A light tick of haptics at the end when `tick` is set.
 */
export function CountUp({ to, from = 0, suffix = "", prefix = "", ms = 900, delay = 150, style, testID, tick }: { to: number; from?: number; suffix?: string; prefix?: string; ms?: number; delay?: number; style?: React.ComponentProps<typeof T>["style"]; testID?: string; tick?: boolean }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = React.useState(from);
  React.useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let t0 = 0;
    let last = from;
    const step = (t: number) => {
      if (!t0) t0 = t;
      const k = Math.min(1, Math.max(0, (t - t0 - delay) / ms));
      const n = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (n !== last) {
        last = n;
        setShown(n);
      }
      if (k < 1) raf = requestAnimationFrame(step);
      else if (tick) haptic.tap();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, from, ms, delay, reduce, tick]);
  return (
    <T style={style} num testID={testID} accessibilityLabel={`${prefix}${to}${suffix}`}>
      {`${prefix}${reduce ? to : shown}${suffix}`}
    </T>
  );
}

/** Wraps a number (the HUD score) and pops it each time it changes. */
export function Bump({ value, children }: { value: string | number; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  const y = useSharedValue(0);
  const last = React.useRef(value);
  React.useEffect(() => {
    if (last.current === value) return;
    last.current = value;
    if (reduce) return;
    s.value = withSequence(withTiming(1.15, { duration: 110 }), withSpring(1, SPRING));
    y.value = withSequence(withTiming(-4, { duration: 110 }), withSpring(0, SPRING));
  }, [value, reduce, s, y]);
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }, { scale: s.value }] }));
  return <Animated.View style={a}>{children}</Animated.View>;
}

/* ------------------------------------------------------------------ Burst */

type Bit = { dx: number; dy: number; rot: number; size: number; color: number; delay: number; round: boolean };
/** Fixed confetti (no random in render): 18 bits fanned out over a half circle. */
const BITS: Bit[] = Array.from({ length: 18 }, (_, i) => {
  const angle = Math.PI * (0.08 + (0.84 * i) / 17);
  const reach = 120 + ((i * 37) % 70);
  return { dx: Math.cos(angle) * reach * (i % 2 ? 1 : -1), dy: -Math.sin(angle) * reach - 20, rot: ((i * 83) % 360) - 180, size: 7 + ((i * 5) % 6), color: i % 3, delay: (i % 6) * 18, round: i % 4 === 0 };
});

function Piece({ b, colors }: { b: Bit; colors: string[] }) {
  const t = useSharedValue(0);
  React.useEffect(() => {
    t.value = withDelay(b.delay, withTiming(1, { duration: 1100, easing: Easing.out(Easing.quad) }));
  }, [b.delay, t]);
  const a = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 0.1, 0.75, 1], [0, 1, 1, 0]),
    transform: [{ translateX: b.dx * t.value }, { translateY: b.dy * t.value + 160 * t.value * t.value }, { rotate: `${b.rot * t.value}deg` }, { scale: interpolate(t.value, [0, 0.15, 1], [0.3, 1, 0.8]) }],
  }));
  return <Animated.View style={[{ position: "absolute", width: b.size, height: b.round ? b.size : b.size * 0.55, borderRadius: b.round ? b.size / 2 : 1.5, backgroundColor: colors[b.color] }, a]} />;
}

/** A one-time burst of confetti from the middle of its box. Draws nothing with Reduce Motion. */
export function Burst({ fire = true, testID }: { fire?: boolean; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  if (!fire || reduce) return null;
  const colors = [c.primary, c.brand, c.ink];
  return (
    <View pointerEvents="none" testID={testID} style={{ position: "absolute", left: "50%", top: "40%", width: 0, height: 0 }}>
      {BITS.map((b, i) => (
        <Piece key={i} b={b} colors={colors} />
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------- Flip */

/** A card that turns over (front, then back) when `flipped` becomes true. Cross-fades with Reduce Motion. */
export function Flip({ flipped, front, back, style }: { flipped: boolean; front: React.ReactNode; back: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduce = useReducedMotion();
  const t = useSharedValue(flipped ? 1 : 0);
  React.useEffect(() => {
    t.value = reduce ? (flipped ? 1 : 0) : withTiming(flipped ? 1 : 0, { duration: 420, easing: Easing.inOut(Easing.cubic) });
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

/* ------------------------------------------------------------------- Rise */

/** The verdict band: slides up with a little spring. */
export function Rise({ children, testID }: { children: React.ReactNode; testID?: string }) {
  const reduce = useReducedMotion();
  return (
    <Animated.View testID={testID} entering={reduce ? undefined : FadeInDown.springify().damping(16).stiffness(200).mass(0.8)}>
      {children}
    </Animated.View>
  );
}
