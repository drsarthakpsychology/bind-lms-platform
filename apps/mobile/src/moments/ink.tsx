import * as React from "react";
import Animated, { useAnimatedProps, useReducedMotion, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { curves, dur } from "@/motion";
import { finite, safePath } from "@/lib/svg-safe";
import { inkPaths } from "@/sketch/ink";
import { useTheme } from "@/theme";

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * A hand-drawn underline that draws itself on (260ms) once, in the rough.js
 * wobble of the sketch kit. Used under the lecture intro and section titles.
 * With Reduce Motion it is drawn already.
 */
export function InkUnderline({ width, color, delay = 0, k, sw = 2.4 }: { width: number; color?: string; delay?: number; k: string; sw?: number }) {
  const p = useTheme();
  const reduce = useReducedMotion();
  const h = 10;
  const paths = React.useMemo(() => inkPaths(k, { t: "line", x1: 2, y1: h / 2 + 1, x2: width - 2, y2: h / 2 - 1 }, { sw, rough: 1.1, bow: 1.4, single: true, stroke: color ?? "@lime" }, p), [k, width, sw, color, p]);
  // A rough line is a little longer than its span; a generous dash hides it fully.
  const len = finite(width * 1.25, 1);
  const t = useSharedValue(reduce ? 1 : 0);
  React.useEffect(() => {
    if (!reduce) t.set(withDelay(delay, withTiming(1, { duration: dur.enter, easing: curves.out })));
  }, [reduce, delay, t]);
  const props = useAnimatedProps(() => {
    const v = Number.isFinite(t.value) ? t.value : 1;
    return { strokeDashoffset: len * (1 - v) };
  });
  return (
    <Svg width={width} height={h} pointerEvents="none">
      {paths.map((d, i) => (
        <AnimatedPath key={i} d={safePath(d.d)} stroke={color ?? d.stroke} strokeWidth={d.strokeWidth} fill="none" strokeLinecap="round" strokeDasharray={[len, len]} animatedProps={props} />
      ))}
    </Svg>
  );
}
