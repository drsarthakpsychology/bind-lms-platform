import * as React from "react";
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { useTheme } from "@/theme";
import { presets } from "./enter";
import { dur } from "./tokens";

const BAND = 140;

/**
 * A soft light band that sweeps across a skeleton shape, left to right,
 * every 1.3s. Transform only, on the UI thread. Every skeleton mounted in
 * the same frame sweeps in step, so a whole screen shimmers as one.
 * Nothing moves with Reduce Motion.
 */
export function Shimmer() {
  const c = useTheme();
  const reduce = useReducedMotion();
  const w = useSharedValue(0);
  const t = useSharedValue(0);
  React.useEffect(() => {
    if (reduce) return;
    t.set(withRepeat(withDelay(200, withTiming(1, { duration: dur.shimmer, easing: Easing.inOut(Easing.quad) })), -1, false));
  }, [reduce, t]);
  const band = useAnimatedStyle(() => ({
    transform: [{ translateX: -BAND + t.value * (w.value + BAND * 2) }],
  }));
  if (reduce) return null;
  const hi = c.dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.75)";
  return (
    <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }} onLayout={(e: LayoutChangeEvent) => w.set(e.nativeEvent.layout.width)}>
      <Animated.View style={[{ position: "absolute", top: 0, bottom: 0, width: BAND }, band]}>
        <Svg width={BAND} height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="sh" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={hi} stopOpacity={0} />
              <Stop offset="0.5" stopColor={hi} stopOpacity={1} />
              <Stop offset="1" stopColor={hi} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={BAND} height="100%" fill="url(#sh)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

/**
 * Wraps a skeleton so it only shows when loading takes longer than 120ms
 * (a fast load never flashes grey), then fades in.
 */
export function SkeletonIn({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduce = useReducedMotion();
  return (
    <Animated.View entering={reduce ? undefined : presets.fade(dur.skeletonDelay)} style={style}>
      {children}
    </Animated.View>
  );
}

/**
 * Wraps loaded content so it settles in where the skeleton was: a fade with
 * a 6px rise. Put it around the first render of data; refreshes do not replay it.
 */
export function Reveal({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduce = useReducedMotion();
  return (
    <Animated.View entering={reduce ? undefined : presets.rise(0)} style={style}>
      {children}
    </Animated.View>
  );
}
