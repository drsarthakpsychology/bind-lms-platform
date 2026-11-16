import * as React from "react";
import Animated, { useAnimatedProps, useReducedMotion, useSharedValue, withDelay, withTiming, type SharedValue } from "react-native-reanimated";
import { G, Path } from "react-native-svg";

import { finite, safePath } from "@/lib/svg-safe";
import { inkPaths, type InkOpts, type Shape } from "@/sketch/ink";
import { useTheme } from "@/theme";
import { curves } from "./tokens";

const APath = Animated.createAnimatedComponent(Path);

/**
 * Length of SVG path data made of absolute M, L and C commands (what rough.js
 * writes), worked out in JS: lines exactly, curves from 8 samples.
 */
export function pathLength(d: string): number {
  const tok = d.match(/[MLCmlc]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  let i = 0;
  let x = 0;
  let y = 0;
  let len = 0;
  let cmd = "M";
  const num = () => finite(Number(tok[i++]));
  while (i < tok.length) {
    if (/[A-Za-z]/.test(tok[i]!)) cmd = tok[i++]!.toUpperCase();
    if (cmd === "M") {
      x = num();
      y = num();
      cmd = "L";
    } else if (cmd === "L") {
      const nx = num();
      const ny = num();
      len += Math.hypot(nx - x, ny - y);
      x = nx;
      y = ny;
    } else if (cmd === "C") {
      const [x1, y1, x2, y2, x3, y3] = [num(), num(), num(), num(), num(), num()];
      let px = x;
      let py = y;
      for (let s = 1; s <= 8; s++) {
        const t = s / 8;
        const u = 1 - t;
        const qx = u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
        const qy = u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
        len += Math.hypot(qx - px, qy - py);
        px = qx;
        py = qy;
      }
      x = x3;
      y = y3;
    } else i++;
  }
  return finite(len);
}

function Stroke({ d, len, stroke, sw, fill, i, n, p, stagger }: { d: string; len: number; stroke?: string; sw: number; fill?: string; i: number; n: number; p: SharedValue<number>; stagger: number }) {
  const solid = !!fill && fill !== "none";
  const span = Math.max(0.0001, 1 - stagger * (n - 1));
  const props = useAnimatedProps((): { opacity: number; strokeDashoffset?: number } => {
    const t = Math.min(1, Math.max(0, (p.value - stagger * i) / span));
    // Solid fills cannot draw on: they fade in with their stroke.
    return solid ? { opacity: t } : { strokeDashoffset: len * (1 - t), opacity: t > 0 ? 1 : 0 };
  });
  return <APath d={d} stroke={stroke} strokeWidth={sw} fill={fill ?? "none"} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={solid ? undefined : [len + 1, len + 1]} animatedProps={props} />;
}

/**
 * A rough.js shape that draws itself on, like ink from a pen: each stroke's
 * dash offset runs from its full length to 0 on the UI thread, strokes one
 * after another. Same props as `Ink` (src/sketch/ink.tsx), inside an <Svg>.
 * Drive it with your own `progress` (0..1) or let it play once on mount
 * (`delay`, `duration`). Budget: at most 12 paths drawing at once on a
 * screen. Reduce Motion: drawn in full at once.
 *
 *   <Svg width={120} height={40}><DrawInk k="underline" shape={{ t: "line", x1: 4, y1: 30, x2: 116, y2: 28 }} duration={260} /></Svg>
 */
export function DrawInk({ k, shape, o = {}, progress, delay = 0, duration = 500, stagger = 0.15 }: { k: string; shape: Shape; o?: InkOpts; progress?: SharedValue<number>; delay?: number; duration?: number; /** Share of the run each later stroke waits (0..1). */ stagger?: number }) {
  const pal = useTheme();
  const reduce = useReducedMotion();
  const own = useSharedValue(reduce ? 1 : 0);
  React.useEffect(() => {
    if (reduce || progress) return;
    own.set(withDelay(delay, withTiming(1, { duration, easing: curves.out })));
  }, [reduce, progress, delay, duration, own]);
  const paths = React.useMemo(() => {
    try {
      return inkPaths(k, shape, o, pal)
        .map((x) => ({ ...x, d: safePath(x.d) }))
        .filter((x) => x.d !== "")
        .map((x) => ({ ...x, len: Math.max(1, pathLength(x.d)) }));
    } catch {
      return [];
    }
  }, [k, shape, o, pal]);
  const full = useSharedValue(1);
  const p = reduce ? full : (progress ?? own);
  const st = Math.min(stagger, paths.length > 1 ? 0.9 / (paths.length - 1) : 0);
  return (
    <G opacity={o.opacity === undefined ? undefined : finite(o.opacity, 1)}>
      {paths.map((x, i) => (
        <Stroke key={i} d={x.d} len={x.len} stroke={x.stroke} sw={finite(x.strokeWidth, 1)} fill={x.fill} i={i} n={paths.length} p={p} stagger={st} />
      ))}
    </G>
  );
}
