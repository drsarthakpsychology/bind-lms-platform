import * as React from "react";
import Animated, { useAnimatedProps, useReducedMotion, useSharedValue, withTiming, type SharedValue } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { curves, dur } from "@/motion";
import { fixed } from "@/theme";

/**
 * Play and Pause as one icon that morphs (storyboard 5): the two pause bars
 * slide and narrow into the two halves of the play triangle, 180ms. Each
 * half is four points, so the shapes match point for point. With Reduce
 * Motion it simply swaps.
 */
const AnimatedPath = Animated.createAnimatedComponent(Path);

type Quad = [number, number, number, number, number, number, number, number];
// 24 by 24 box. Pause: two bars. Play: a triangle cut down its middle.
export const PAUSE: [Quad, Quad] = [
  [6, 4, 10, 4, 10, 20, 6, 20],
  [14, 4, 18, 4, 18, 20, 14, 20],
];
export const PLAY: [Quad, Quad] = [
  [7, 3.5, 13, 7.25, 13, 16.75, 7, 20.5],
  [13, 7.25, 20, 12, 20, 12, 13, 16.75],
];

export function quad(a: Quad, b: Quad, t: number): string {
  "worklet";
  // Never NaN in path data: Android's PathParser throws and closes the app (src/lib/svg-safe.ts).
  const k = Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : 1;
  const p = (i: number) => a[i]! + (b[i]! - a[i]!) * k;
  return `M${p(0)} ${p(1)}L${p(2)} ${p(3)}L${p(4)} ${p(5)}L${p(6)} ${p(7)}Z`;
}

function Half({ i, t, color }: { i: 0 | 1; t: SharedValue<number>; color: string }) {
  const props = useAnimatedProps(() => ({ d: quad(PAUSE[i], PLAY[i], t.value) }));
  return <AnimatedPath animatedProps={props} fill={color} strokeLinejoin="round" stroke={color} strokeWidth={1} />;
}

export function PlayPause({ playing, size = 30, color = fixed.onVideo as string }: { playing: boolean; size?: number; color?: string }) {
  const reduce = useReducedMotion();
  // 1 = play triangle (paused), 0 = pause bars (playing).
  const t = useSharedValue(playing ? 0 : 1);
  React.useEffect(() => {
    t.set(reduce ? (playing ? 0 : 1) : withTiming(playing ? 0 : 1, { duration: dur.state, easing: curves.inOut }));
  }, [playing, reduce, t]);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" testID={playing ? "icon-pause" : "icon-play"}>
      <Half i={0} t={t} color={color} />
      <Half i={1} t={t} color={color} />
    </Svg>
  );
}
