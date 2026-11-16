import * as React from "react";
import { View } from "react-native";
import Animated, { cancelAnimation, Easing, useAnimatedProps, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withTiming, type SharedValue } from "react-native-reanimated";
import Svg, { Path, Rect } from "react-native-svg";

import { T } from "@/ds/text";
import { finite, safePath } from "@/lib/svg-safe";
import { curves, dur, pathLength } from "@/motion";
import { inkPaths, type InkOpts, type Shape } from "@/sketch/ink";
import { fixed, useTheme } from "@/theme";

/**
 * Small drawing parts for the hero moments, on top of the motion kit
 * (src/motion: DrawInk, PixelBurst, MaskLine). InkDraw draws several shapes
 * one after another from one value; MaskUp measures its line, so a title
 * that wraps works too. One shared value each; transform, opacity and
 * stroke-dashoffset only; Reduce Motion shows the end state.
 */

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

/** A 0..1 value that runs once after `delay` (1 at once with Reduce Motion or `still`). */
export function useRun(delay: number, duration: number, still = false, easing = curves.out): SharedValue<number> {
  const reduce = useReducedMotion();
  const v = useSharedValue(reduce || still ? 1 : 0);
  React.useEffect(() => {
    if (reduce || still) v.set(1);
    else v.set(withDelay(delay, withTiming(1, { duration, easing })));
  }, [reduce, still, delay, duration, easing, v]);
  return v;
}

function Stroke({ d, stroke, sw, p, from, to }: { d: string; stroke: string; sw: number; p: SharedValue<number>; from: number; to: number }) {
  const safe = safePath(d);
  const len = Math.max(1, pathLength(safe)) + 1;
  const props = useAnimatedProps(() => {
    const raw = Number.isFinite(p.value) ? p.value : 1;
    const k = Math.min(1, Math.max(0, (raw - from) / Math.max(0.001, to - from)));
    return { strokeDashoffset: len * (1 - k) };
  });
  if (!safe) return null;
  return <AnimatedPath d={safe} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={[len, len]} animatedProps={props} />;
}

/** Rough sketch shapes that draw themselves as `p` goes 0 to 1, one after another. */
export function InkDraw({ shapes, p, width, height, o = {} }: { shapes: { k: string; shape: Shape }[]; p: SharedValue<number>; width: number; height: number; o?: InkOpts }) {
  const theme = useTheme();
  const strokes = React.useMemo(() => shapes.flatMap((s) => inkPaths(s.k, s.shape, { single: true, ...o }, theme).map((x) => ({ d: x.d, stroke: x.stroke, sw: x.strokeWidth }))), [shapes, o, theme]);
  const n = strokes.length || 1;
  return (
    <Svg width={width} height={height} pointerEvents="none">
      {strokes.map((s, i) => (
        <Stroke key={i} d={s.d} stroke={s.stroke} sw={s.sw} p={p} from={(i / n) * 0.7} to={(i / n) * 0.7 + 0.3 + 0.3 / n} />
      ))}
    </Svg>
  );
}

/* ------------------------------------------------------------ pixel flame */

// 7 by 8 cells, bottom row first: which cells are lit.
const FLAME = ["0011100", "0122210", "1122211", "1122211", "1112110", "0111110", "0011010", "0010000"];

function FlameCell({ x, y, row, cell, p, flick, tone }: { x: number; y: number; row: number; cell: number; p: SharedValue<number>; flick: SharedValue<number>; tone: string }) {
  const props = useAnimatedProps(() => {
    // Builds row by row from the bottom; the top rows flicker twice, then hold.
    const built = p.value * FLAME.length >= row + 0.5 ? 1 : 0;
    const flicker = row >= 5 ? 1 - 0.6 * Math.abs(Math.sin(flick.value * Math.PI * 2)) * ((row + x) % 2) : 1;
    return { opacity: built * flicker };
  });
  return <AnimatedRect x={x * cell} y={y * cell} width={cell} height={cell} fill={tone} animatedProps={props} />;
}

/** The pixel flame: builds from the bottom row up, flickers twice and stops. */
export function PixelFlame({ size = 72, delay = 0, still = false, ink = fixed.ink as string, core = fixed.blue as string }: { size?: number; delay?: number; still?: boolean; ink?: string; core?: string }) {
  const reduce = useReducedMotion();
  const p = useRun(delay, 6 * 60, still, curves.standard);
  const flick = useSharedValue(0);
  React.useEffect(() => {
    if (reduce || still) return;
    flick.set(withDelay(delay + 6 * 60, withTiming(2, { duration: 2 * dur.enter })));
  }, [reduce, still, delay, flick]);
  const cell = size / 8;
  const tones = ["", ink, core];
  return (
    <Svg width={cell * 7} height={size} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {FLAME.flatMap((line, row) =>
        line.split("").map((ch, x) => (ch === "0" ? null : <FlameCell key={`${row}-${x}`} x={x} y={FLAME.length - 1 - row} row={row} cell={cell} p={p} flick={flick} tone={tones[Number(ch)]!} />)),
      )}
    </Svg>
  );
}

/* --------------------------------------------------------------- mask up */

/**
 * A line of type rising out of its own clip (the Welcome headline's mask):
 * measured, so a title that wraps works too. Reduce Motion: in place.
 */
export function MaskUp({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  const t = useRun(delay, dur.enter + 120);
  const h = useSharedValue(40);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - t.value) * h.value }] }));
  return (
    <View style={{ overflow: "hidden" }}>
      <Animated.View style={style} onLayout={(e) => h.set(finite(e.nativeEvent.layout.height, 40) + 4)}>
        {children}
      </Animated.View>
    </View>
  );
}

/* ------------------------------------------------------------ pixel star */

// 7 by 7: the pixel star of a level up.
const STAR = ["0001000", "0001000", "0011100", "1111111", "0111110", "0110110", "1000001"];

/**
 * The level-up star: a pixel star grows from small behind the badge,
 * overshoots and fades as the new level settles (`fire` is a counter).
 * Nothing with Reduce Motion.
 */
export function PixelStar({ fire, size = 96, color }: { fire: number; size?: number; color?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const p = useSharedValue(0);
  React.useEffect(() => {
    if (reduce || fire <= 0) return;
    p.set(0);
    p.set(withTiming(1, { duration: dur.fill, easing: curves.out }));
  }, [fire, reduce, p]);
  const style = useAnimatedStyle(() => {
    const t = p.value;
    return { opacity: t <= 0 || t >= 1 ? 0 : t < 0.5 ? 1 : 1 - (t - 0.5) * 2, transform: [{ scale: 0.4 + t * 0.9 }, { rotate: `${Math.floor(t * 4) * 15}deg` }] };
  });
  if (reduce || fire <= 0) return null;
  const cell = size / 7;
  return (
    <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={style}>
        <Svg width={size} height={size}>
          {STAR.flatMap((line, y) => line.split("").map((ch, x) => (ch === "1" ? <Rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={color ?? c.primary} /> : null)))}
        </Svg>
      </Animated.View>
    </View>
  );
}

/* ----------------------------------------------------------- pixel loader */

// The 3x3 chevron wave: each step lights one diagonal of cells.
const WAVE = [0, 1, 2, 1, 2, 3, 2, 3, 4];

function LoaderCell({ i, t, cell, color }: { i: number; t: SharedValue<number>; cell: number; color: string }) {
  const props = useAnimatedProps(() => {
    const step = Math.floor(t.value * 5) % 5;
    return { opacity: step === WAVE[i] ? 1 : Math.abs(step - WAVE[i]!) === 1 ? 0.45 : 0.15 };
  });
  return <AnimatedRect x={(i % 3) * (cell + 2)} y={Math.floor(i / 3) * (cell + 2)} width={cell} height={cell} fill={color} animatedProps={props} />;
}

/**
 * The pixel loader for waits over a second: a 3x3 grid lighting in a
 * chevron wave (650ms a cycle), with the action word ("Loading the round").
 * Loops only while it is on screen. Reduce Motion: the grid stays still.
 */
export function PixelLoader({ label, color, testID }: { label: string; color?: string; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const t = useSharedValue(0.4);
  React.useEffect(() => {
    if (reduce) return;
    t.set(0);
    t.set(withRepeat(withTiming(1, { duration: 650, easing: Easing.linear }), -1, false));
    return () => cancelAnimation(t);
  }, [reduce, t]);
  const cell = 6;
  const tone = color ?? (c.dark ? c.primary : c.brand);
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={label} testID={testID ?? "pixel-loader"} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Svg width={cell * 3 + 4} height={cell * 3 + 4}>
        {Array.from({ length: 9 }, (_, i) => (
          <LoaderCell key={i} i={i} t={t} cell={cell} color={tone} />
        ))}
      </Svg>
      <T v="small" tone="muted">
        {label}
      </T>
    </View>
  );
}

/** True once `on` has stayed true for `after` ms (a wait long enough for a loader). */
export function useSlow(on: boolean, after = 1000): boolean {
  const [slow, setSlow] = React.useState(false);
  if (!on && slow) setSlow(false);
  React.useEffect(() => {
    if (!on) return;
    const id = setTimeout(() => setSlow(true), after);
    return () => clearTimeout(id);
  }, [on, after]);
  return on && slow;
}
