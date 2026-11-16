import * as React from "react";
import { View } from "react-native";
import Animated, { useAnimatedProps, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming, type SharedValue } from "react-native-reanimated";
import Svg, { Path, Rect } from "react-native-svg";

import { finite, safePath } from "@/lib/svg-safe";
import { curves, dur } from "@/motion";
import { inkPaths, type InkOpts, type Shape } from "@/sketch/ink";
import { useTheme } from "@/theme";

/**
 * Small drawing parts for the hero moments. They follow the motion plan's
 * kit shapes (DrawInk, PixelBurst, Sprite) and move to src/motion's versions
 * when those land. One shared value each; transform, opacity and
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

/** Rough path length from its numbers (an over-estimate is fine: it only sizes the dash). */
function roughLength(d: string): number {
  const n = (d.match(/-?\d*\.?\d+(e-?\d+)?/g) ?? []).map(Number);
  let len = 0;
  for (let i = 2; i + 1 < n.length; i += 2) len += Math.hypot(n[i]! - n[i - 2]!, n[i + 1]! - n[i - 1]!);
  return finite(len, 100) + 4;
}

function Stroke({ d, stroke, sw, p, from, to }: { d: string; stroke: string; sw: number; p: SharedValue<number>; from: number; to: number }) {
  const len = roughLength(d);
  const props = useAnimatedProps(() => {
    const raw = Number.isFinite(p.value) ? p.value : 1;
    const k = Math.min(1, Math.max(0, (raw - from) / Math.max(0.001, to - from)));
    return { strokeDashoffset: len * (1 - k) };
  });
  return <AnimatedPath d={safePath(d)} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={[len, len]} animatedProps={props} />;
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

/* ------------------------------------------------------------ pixel burst */

function Cell({ i, n, p, reach, size, color, ring }: { i: number; n: number; p: SharedValue<number>; reach: number; size: number; color: string; ring: number }) {
  const a = (i / n) * Math.PI * 2 + ring * 0.4;
  const dist = reach * (0.55 + ring * 0.45);
  const style = useAnimatedStyle(() => {
    const t = p.value;
    // Pixel steps: the cell jumps outward in 4 hard steps, like the brand's pixel art.
    const s = Math.floor(t * 4) / 4;
    return { opacity: t <= 0 || t >= 1 ? 0 : 1 - t * 0.6, transform: [{ translateX: Math.cos(a) * dist * s }, { translateY: Math.sin(a) * dist * s }] };
  });
  return <Animated.View style={[{ position: "absolute", width: size, height: size, backgroundColor: color }, style]} />;
}

/**
 * Pixel fireworks: square cells in two rings jumping out from the centre of
 * the parent in pixel steps (lime, blue, ink; lighter on dark). `fire` is a
 * counter. 24 cells at most; nothing with Reduce Motion.
 */
export function PixelPop({ fire, reach = 48, cells = 24, size = 5 }: { fire: number; reach?: number; cells?: number; size?: number }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const p = useSharedValue(0);
  React.useEffect(() => {
    if (reduce || fire <= 0) return;
    p.set(0);
    p.set(withTiming(1, { duration: dur.burst, easing: curves.out }));
  }, [fire, reduce, p]);
  if (reduce || fire <= 0) return null;
  const colors = c.dark ? [c.primary, c.sk.blue, "#ffffff"] : [c.primary, c.brand, c.ink];
  const half = Math.ceil(Math.min(24, cells) / 2);
  return (
    <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
      {[0, 1].map((ring) => Array.from({ length: half }, (_, i) => <Cell key={`${ring}-${i}`} i={i} n={half} p={p} reach={reach} size={ring ? size - 1 : size} ring={ring} color={colors[(i + ring) % colors.length]!} />))}
    </View>
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
export function PixelFlame({ size = 72, delay = 0, still = false, ink = "#111111", core = "#1d44d8" }: { size?: number; delay?: number; still?: boolean; ink?: string; core?: string }) {
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
