import * as React from "react";
import { View, type LayoutChangeEvent } from "react-native";
import Animated, { useAnimatedProps, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { useTheme } from "@/theme";
import { curves, dur } from "./tokens";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const clamp = (n: number) => Math.max(0, Math.min(100, n));

/**
 * The fill value for a progress part: starts at 0 and eases to `pct` on
 * mount (700ms, strong ease-out), then eases between later values.
 * Instant with Reduce Motion.
 */
export function useFill(pct: number, delay = 0) {
  const reduce = useReducedMotion();
  const target = clamp(pct) / 100;
  const v = useSharedValue(reduce ? target : 0);
  React.useEffect(() => {
    v.set(reduce ? target : withDelay(delay, withTiming(target, { duration: dur.fill, easing: curves.out })));
  }, [target, reduce, delay, v]);
  return v;
}

/**
 * A ring that fills to `pct` (0 to 100). Ink in light mode, lime in dark;
 * pass `color` for a different fill. The stroke animates on the UI thread.
 */
export function ProgressRing({ pct, size = 28, stroke = 4, color, track, delay = 0, children, label }: { pct: number; size?: number; stroke?: number; color?: string; track?: string; delay?: number; /** Centred inside the ring (a number, an icon). */ children?: React.ReactNode; label?: string }) {
  const c = useTheme();
  const r = (size - stroke) / 2;
  const len = 2 * Math.PI * r;
  const fill = useFill(pct, delay);
  const props = useAnimatedProps(() => ({ strokeDashoffset: len * (1 - fill.value) }));
  return (
    <View accessible={!!label} accessibilityRole={label ? "progressbar" : undefined} accessibilityLabel={label} accessibilityValue={label ? { min: 0, max: 100, now: Math.round(clamp(pct)) } : undefined} style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke={track ?? c.cardLine} />
        <AnimatedCircle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" stroke={color ?? (c.dark ? c.primary : c.ink)} strokeDasharray={`${len}`} animatedProps={props} />
      </Svg>
      {children}
    </View>
  );
}

/**
 * A thin bar that fills to `pct`. Moves with transform (no layout work):
 * the fill is a full-width bar slid in from the left inside a clipped track.
 */
export function ProgressFill({ pct, height = 6, color, track, delay = 0 }: { pct: number; height?: number; color?: string; track?: string; delay?: number }) {
  const c = useTheme();
  const w = useSharedValue(0);
  const fill = useFill(pct, delay);
  const bar = useAnimatedStyle(() => ({
    opacity: w.value > 0 ? 1 : 0,
    transform: [{ translateX: -(1 - fill.value) * w.value }],
  }));
  return (
    <View
      onLayout={(e: LayoutChangeEvent) => w.set(e.nativeEvent.layout.width)}
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: track ?? c.cardLine,
        overflow: "hidden",
        alignSelf: "stretch",
      }}
    >
      <Animated.View
        style={[
          {
            height: "100%",
            width: "100%",
            borderRadius: height / 2,
            backgroundColor: color ?? (c.dark ? c.primary : c.brand),
          },
          bar,
        ]}
      />
    </View>
  );
}
