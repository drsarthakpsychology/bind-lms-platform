import * as React from "react";
import { View, type LayoutChangeEvent } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";

import { fonts } from "@/theme";

/** Spots the watermark moves between, as shares of the free space (x, y). */
export const SPOTS: [number, number][] = [
  [0.06, 0.1],
  [0.7, 0.18],
  [0.38, 0.5],
  [0.08, 0.78],
  [0.74, 0.72],
  [0.5, 0.08],
];

/** The next spot: never the same one twice in a row. */
export function nextSpot(current: number, rand: () => number = Math.random): number {
  const n = Math.floor(rand() * (SPOTS.length - 1));
  return n >= current ? n + 1 : n;
}

/**
 * The name and roll number over the video. It drifts to a new place every
 * eight seconds (a slow glide, or a jump when motion is reduced), never
 * catches touches, and is not read out by screen readers.
 */
export function Watermark({ text, every = 8000 }: { text: string; every?: number }) {
  const reduce = useReducedMotion();
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const [label, setLabel] = React.useState({ w: 180, h: 18 });
  const spot = React.useRef(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  React.useEffect(() => {
    if (!box.w) return;
    const place = () => {
      spot.current = nextSpot(spot.current);
      const [sx, sy] = SPOTS[spot.current]!;
      const tx = Math.max(0, box.w - label.w) * sx;
      const ty = Math.max(0, box.h - label.h) * sy;
      const cfg = { duration: reduce ? 0 : 2400, easing: Easing.inOut(Easing.quad) };
      x.set(withTiming(tx, cfg));
      y.set(withTiming(ty, cfg));
    };
    place();
    const id = setInterval(place, every);
    return () => clearInterval(id);
  }, [box.w, box.h, label.w, label.h, every, reduce, x, y]);

  const moved = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { translateY: y.value }] }));
  return (
    <View pointerEvents="none" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden onLayout={(e: LayoutChangeEvent) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} testID="watermark">
      <Animated.Text
        onLayout={(e: LayoutChangeEvent) => setLabel({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
        allowFontScaling={false}
        style={[{ position: "absolute", left: 0, top: 0, color: "rgba(255,255,255,0.42)", fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, textShadowColor: "rgba(0,0,0,0.5)", textShadowRadius: 2 }, moved]}
      >
        {text}
      </Animated.Text>
    </View>
  );
}
