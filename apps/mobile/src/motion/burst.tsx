import * as React from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming, type SharedValue } from "react-native-reanimated";

import { useTheme } from "@/theme";
import { curves, dur, springs } from "./tokens";

/** Deterministic jitter in [0, 1): crafted, never random between renders. */
const jit = (i: number, salt = 1) => (((i + 1) * 2654435761 * salt) % 997) / 997;

/* ------------------------------------------------------------------ Burst */

function Spark({ i, n, p, color, size, reach }: { i: number; n: number; p: SharedValue<number>; color: string; size: number; reach: number }) {
  const angle = (i / n) * Math.PI * 2 - Math.PI / 2 + (jit(i) - 0.5) * 0.4;
  const dist = reach * (0.7 + jit(i, 7) * 0.5);
  const spin = (jit(i, 3) - 0.5) * 180;
  const style = useAnimatedStyle(() => {
    const t = p.value;
    return {
      opacity: t <= 0 || t >= 1 ? 0 : 1 - t * t,
      transform: [{ translateX: Math.cos(angle) * dist * t }, { translateY: Math.sin(angle) * dist * t }, { rotate: `${spin * t}deg` }, { scale: 0.6 + 0.4 * Math.min(1, t * 3) }],
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: 1.5,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

/**
 * A small burst of square sparks (VIBHA lime, blue and ink) flying out from
 * the centre of its parent, with a ring. Change `fire` (a counter) to play
 * it again. Lives on top of the thing that was won: put it in a View with
 * `position: relative` around the ring, number or check. Draws nothing with
 * Reduce Motion; the haptic success still plays wherever you call it.
 */
export function Burst({ fire, count = 10, reach = 34, size = 5 }: { fire: number; count?: number; /** How far the sparks fly (px). */ reach?: number; size?: number }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const p = useSharedValue(0);
  const ring = useSharedValue(0);
  React.useEffect(() => {
    if (reduce || fire <= 0) return;
    p.set(0);
    p.set(withTiming(1, { duration: dur.burst, easing: curves.out }));
    ring.set(0);
    ring.set(withTiming(1, { duration: dur.burst * 0.8, easing: curves.out }));
  }, [fire, reduce, p, ring]);
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ring.value <= 0 || ring.value >= 1 ? 0 : 0.6 * (1 - ring.value),
    transform: [{ scale: 0.4 + ring.value * 1.2 }],
  }));
  if (reduce) return null;
  const colors = [c.primary, c.dark ? c.sk.blue : c.brand, c.ink];
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            width: reach * 1.6,
            height: reach * 1.6,
            borderRadius: reach,
            borderWidth: 2,
            borderColor: c.dark ? c.primary : c.brand,
          },
          ringStyle,
        ]}
      />
      {Array.from({ length: count }, (_, i) => (
        <Spark key={i} i={i} n={count} p={p} color={colors[i % colors.length] ?? c.ink} size={i % 3 === 0 ? size + 1 : size} reach={reach} />
      ))}
    </View>
  );
}

/* --------------------------------------------------------------- Confetti */

function Piece({ i, p, w, h, color }: { i: number; p: SharedValue<number>; w: number; h: number; color: string }) {
  const x0 = jit(i, 11) * w;
  const drift = (jit(i, 5) - 0.5) * 120;
  const speed = 0.75 + jit(i, 13) * 0.5;
  const lag = jit(i, 17) * 0.25;
  const spin = 360 + jit(i, 19) * 540;
  const sz = 6 + Math.round(jit(i, 23) * 5);
  const style = useAnimatedStyle(() => {
    const t = Math.max(0, Math.min(1, (p.value - lag) / (1 - lag)));
    const fall = t * speed * (h + 60);
    return {
      opacity: t <= 0 || t >= 1 ? 0 : 1 - Math.max(0, t - 0.75) * 4,
      transform: [{ translateX: x0 + drift * t + Math.sin(t * 9 + i) * 10 }, { translateY: -30 + fall }, { rotate: `${spin * t}deg` }, { scaleX: Math.cos(t * 12 + i) }],
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          width: sz,
          height: sz * 1.4,
          borderRadius: 1,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

/**
 * Square confetti falling across the whole screen for 1.6s: for the big
 * wins only (a certificate earned, every quest done). Touches pass through
 * it. Change `fire` (a counter) to play it. Nothing with Reduce Motion.
 */
export function Confetti({ fire, count = 36 }: { fire: number; count?: number }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const p = useSharedValue(0);
  React.useEffect(() => {
    if (reduce || fire <= 0) return;
    p.set(0);
    p.set(withTiming(1, { duration: dur.confetti, easing: Easing.linear }));
  }, [fire, reduce, p]);
  if (reduce || fire <= 0) return null;
  const colors = [c.primary, c.dark ? c.sk.blue : c.brand, c.ink, c.primary];
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        zIndex: 50,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <Piece key={i} i={i} p={p} w={width} h={height} color={colors[i % colors.length] ?? c.ink} />
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ Stamp */

/**
 * The rubber stamp landing (the website's stamp-in): a one-shot scale from
 * 1.35 to 1 with a small overshoot, at an optional tilt. Wrap a badge,
 * a check or "Done" with it; change `fire` to land it again.
 */
export function Stamp({ fire = 1, children, rotate = 0 }: { /** 0 shows it still; each new value lands it again. */ fire?: number; children?: React.ReactNode; rotate?: number }) {
  const reduce = useReducedMotion();
  const still = reduce || fire <= 0;
  const s = useSharedValue(still ? 1 : 1.35);
  const o = useSharedValue(still ? 1 : 0);
  React.useEffect(() => {
    if (reduce || fire <= 0) return;
    s.set(withSequence(withTiming(1.35, { duration: 0 }), withSpring(1, springs.bouncy)));
    o.set(withSequence(withTiming(0.4, { duration: 0 }), withTiming(1, { duration: dur.press })));
  }, [fire, reduce, s, o]);
  const style = useAnimatedStyle(() => ({
    opacity: o.value,
    transform: [{ rotate: `${rotate}deg` }, { scale: s.value }],
  }));
  return <Animated.View style={[{ alignSelf: "flex-start" }, style]}>{children}</Animated.View>;
}
