import * as React from "react";
import Animated, { cancelAnimation, Easing, useAnimatedProps, useReducedMotion, useSharedValue, withRepeat, withTiming, type SharedValue } from "react-native-reanimated";
import Svg, { Rect } from "react-native-svg";

import { finite } from "@/lib/svg-safe";
import { useTheme } from "@/theme";

const ARect = Animated.createAnimatedComponent(Rect);

/** One frame: rows of the grid, "#" = cell on, anything else = off. */
export type SpriteFrame = string[];

/** Ready-made pixel sprites in the brand's square-cell look. */
export const sprites = {
  /** 3x3 loader: a chevron wave running left to right (650ms a loop). */
  loader: [
    ["#..", "#..", "#.."],
    ["##.", "#..", "##."],
    [".##", "##.", ".##"],
    ["..#", ".##", "..#"],
    ["...", "..#", "..."],
  ],
  /** Pixel tick building up stroke by stroke. */
  tick: [
    [".....", ".....", ".....", "#....", "....."],
    [".....", ".....", ".....", "#....", ".#..."],
    [".....", ".....", "...#.", "#.#..", ".#..."],
    ["....#", "...#.", "..#..", "#.#..", ".#..."],
  ],
  /** Pixel star twinkling (grows, then sparkles). */
  star: [
    [".....", ".....", "..#..", ".....", "....."],
    [".....", "..#..", ".###.", "..#..", "....."],
    ["..#..", ".###.", "#####", ".###.", "..#.."],
    ["#.#.#", ".###.", "##.##", ".###.", "#.#.#"],
  ],
  /** Pixel flame flickering (streak). */
  flame: [
    ["..#..", ".##..", ".###.", "#####", ".###."],
    ["...#.", "..##.", ".###.", "#####", ".###."],
    ["..#..", "..##.", ".###.", "#####", ".###."],
  ],
} as const satisfies Record<string, readonly SpriteFrame[]>;

function Cell({ x, y, size, color, on, f }: { x: number; y: number; size: number; color: string; on: number[]; f: SharedValue<number> }) {
  const props = useAnimatedProps(() => {
    const n = on.length;
    const i = Math.min(n - 1, Math.max(0, Math.floor(f.value) % n));
    return { opacity: on[i] ?? 0 };
  });
  return <ARect x={x} y={y} width={size} height={size} fill={color} animatedProps={props} />;
}

/**
 * A small pixel animation: a grid of square cells (up to 8x8) in one Svg,
 * stepping through `frames`. One shared value picks the frame; each cell's
 * opacity comes from it on the UI thread. Loops `loops` times (default 2:
 * decorative loops stop, budget rule 7); pass `loops={-1}` only for a
 * loader shown while something is really loading. Reduce Motion: shows the
 * last frame, still.
 *
 *   <Sprite frames={sprites.loader} cell={6} frameMs={130} loops={-1} />
 */
export function Sprite({ frames, cell = 6, gap = 1, frameMs = 120, loops = 2, color, playing = true, testID }: { frames: readonly SpriteFrame[]; cell?: number; gap?: number; frameMs?: number; /** -1 = until unmounted. */ loops?: number; color?: string; playing?: boolean; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const n = Math.max(1, frames.length);
  const rows = Math.min(8, Math.max(0, ...frames.map((fr) => fr.length)));
  const cols = Math.min(8, Math.max(0, ...frames.flatMap((fr) => fr.map((r) => r.length))));
  const f = useSharedValue(reduce ? n - 1 : 0);
  React.useEffect(() => {
    if (reduce || !playing || n < 2) {
      f.set(n - 1);
      return;
    }
    f.set(0);
    // Counts 0..n (exclusive) once per loop; the last loop ends on the last frame.
    f.set(withRepeat(withTiming(n - 0.001, { duration: n * finite(frameMs, 120), easing: Easing.linear }), loops < 0 ? -1 : Math.max(1, loops), false));
    return () => cancelAnimation(f);
  }, [reduce, playing, n, frameMs, loops, f]);
  const fill = color ?? (c.dark ? c.primary : c.ink);
  const step = cell + gap;
  const cells: { x: number; y: number; on: number[] }[] = [];
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const on = frames.map((fr) => (fr[y]?.[x] === "#" ? 1 : 0));
      if (on.some(Boolean)) cells.push({ x, y, on });
    }
  const w = Math.max(1, cols * step - gap);
  const h = Math.max(1, rows * step - gap);
  return (
    <Svg width={w} height={h} testID={testID} accessible={false}>
      {cells.map((k) => (
        <Cell key={`${k.x}-${k.y}`} x={k.x * step} y={k.y * step} size={cell} color={fill} on={k.on} f={f} />
      ))}
    </Svg>
  );
}
