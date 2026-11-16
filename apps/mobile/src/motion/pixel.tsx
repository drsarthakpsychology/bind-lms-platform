import * as React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming, type SharedValue } from "react-native-reanimated";

import { finite } from "@/lib/svg-safe";
import { useTheme } from "@/theme";
import { scaled, useMotionTier } from "./tier";
import { curves } from "./tokens";

/** One burst's run (ms) and the wait between bursts. */
const RUN = 1100;
const GAP = 380;

/** A ring of square cells; the whole ring scales out as one view (one animated style per ring). */
function Ring({ p, n, r, cell, colors, turn, from }: { p: SharedValue<number>; n: number; r: number; cell: number; colors: string[]; turn: number; from: number }) {
  const style = useAnimatedStyle(() => {
    const t = p.value;
    return {
      opacity: t <= 0 || t >= 1 ? 0 : t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45,
      transform: [{ scale: from + (1 - from) * t }, { rotate: `${turn + t * 12}deg` }],
    };
  });
  const size = r * 2 + cell;
  return (
    <Animated.View pointerEvents="none" style={[{ position: "absolute", width: size, height: size }, style]}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return <View key={i} style={{ position: "absolute", left: finite(r + Math.cos(a) * r), top: finite(r + Math.sin(a) * r), width: cell, height: cell, backgroundColor: colors[i % colors.length] }} />;
      })}
    </Animated.View>
  );
}

function One({ fire, i, reach, cell, cells, colors, dx, dy }: { fire: number; i: number; reach: number; cell: number; cells: number; colors: string[]; dx: number; dy: number }) {
  const p = useSharedValue(0);
  React.useEffect(() => {
    if (fire <= 0) return;
    p.set(0);
    p.set(withDelay(i * GAP, withTiming(1, { duration: RUN - i * 200, easing: curves.out })));
  }, [fire, i, p]);
  const outer = Math.ceil(cells * 0.6);
  return (
    <View pointerEvents="none" style={{ position: "absolute", alignItems: "center", justifyContent: "center", transform: [{ translateX: dx }, { translateY: dy }] }}>
      <Ring p={p} n={outer} r={reach} cell={cell} colors={colors} turn={0} from={0.3} />
      <Ring p={p} n={cells - outer} r={reach * 0.55} cell={Math.max(2, cell - 1)} colors={[...colors].reverse()} turn={180 / Math.max(1, cells - outer)} from={0.2} />
    </View>
  );
}

/**
 * Pixel fireworks for a rare win (goal met, level up, certificate): dotted
 * rings of square cells in lime, blue and ink pop out of the centre of the
 * parent, up to 3 bursts 380ms apart. Change `fire` (a counter) to play it.
 * Put it in a View with `position: relative`. Budget: 3 bursts, 24 cells
 * each, 2 animated views per burst; half the cells on low-end phones.
 * Reduce Motion: draws nothing (keep the haptic and show the result).
 *
 *   <View><ProgressRing pct={100} /><PixelBurst fire={won} bursts={2} /></View>
 */
export function PixelBurst({ fire, bursts = 1, reach = 48, cell = 5, cells = 24 }: { fire: number; bursts?: 1 | 2 | 3; /** Outer ring radius (px). */ reach?: number; cell?: number; cells?: number }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const tier = useMotionTier();
  if (reduce) return null;
  const colors = c.dark ? [c.primary, c.sk.blue, "#ffffff"] : [c.primary, c.brand, c.ink];
  const n = scaled(Math.min(24, cells), tier);
  const offsets = [
    [0, 0],
    [-reach * 0.5, -reach * 0.35],
    [reach * 0.55, -reach * 0.2],
  ];
  return (
    <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
      {offsets.slice(0, bursts).map(([dx, dy], i) => (
        <One key={i} fire={fire} i={i} reach={i ? reach * 0.6 : reach} cell={cell} cells={i ? Math.ceil(n * 0.6) : n} colors={colors} dx={dx!} dy={dy!} />
      ))}
    </View>
  );
}
