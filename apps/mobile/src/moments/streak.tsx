import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { curves, dur, RollingNumber } from "@/motion";
import { fixed, fonts, layout, space } from "@/theme";
import { PixelFlame, PixelPop } from "./parts";

/**
 * Streak kept (storyboard 4, "keep the flame"), once a day after the first
 * finished activity, when the student has left that activity's result:
 *     0ms  a lime panel slides up from the bottom (sheet curve, 320ms)
 *   200ms  the pixel flame builds from the bottom row up, flickers twice, stops
 *   560ms  the count rolls from yesterday's to today's; success haptic as it lands
 *   700ms  the week row: today's box fills with a pixel burst
 *   900ms  one line and "Keep going". Closes by itself after 3s if untouched.
 * Reduce Motion: the panel fades in complete; the haptic stays.
 */
export const STREAK_AT = { flame: 200, roll: 560, land: 800, week: 700, copy: 900, auto: 3900 } as const;

const LIME = fixed.lime;
const INK = fixed.ink;
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function StreakPanel({ days, onClose }: { days: number; onClose: () => void }) {
  const reduce = useReducedMotion();
  const insets = useSafeAreaInsets();
  const [shown, setShown] = React.useState(reduce ? days : Math.max(0, days - 1));
  const [first] = React.useState(shown);
  const [today, setToday] = React.useState(!!reduce);
  const [touched, setTouched] = React.useState(false);
  const up = useSharedValue(0);
  const copy = useSharedValue(reduce ? 1 : 0);
  React.useEffect(() => {
    up.set(withTiming(1, { duration: reduce ? dur.state : 320, easing: curves.sheet }));
    if (!reduce) copy.set(withDelay(STREAK_AT.copy, withTiming(1, { duration: dur.enter, easing: curves.out })));
    const ids = [
      setTimeout(() => setShown(days), reduce ? 0 : STREAK_AT.roll),
      setTimeout(() => setToday(true), reduce ? 0 : STREAK_AT.week),
      setTimeout(() => haptic.success(), reduce ? 0 : STREAK_AT.land),
    ];
    return () => ids.forEach(clearTimeout);
  }, [days, reduce, up, copy]);
  // Leaving: the panel drops back down, quicker than it came (exit 180ms), then the moment closes.
  const leaving = React.useRef(false);
  const leave = React.useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    up.set(withTiming(0, { duration: dur.exit, easing: curves.out }));
    setTimeout(onClose, dur.exit);
  }, [up, onClose]);
  React.useEffect(() => {
    if (touched) return;
    const id = setTimeout(leave, STREAK_AT.auto);
    return () => clearTimeout(id);
  }, [touched, leave]);
  const scrimStyle = useAnimatedStyle(() => ({ opacity: up.value }));
  const panelStyle = useAnimatedStyle(() => (reduce ? { opacity: up.value } : { transform: [{ translateY: (1 - up.value) * 420 }] }));
  const copyStyle = useAnimatedStyle(() => ({ opacity: copy.value, transform: [{ translateY: (1 - copy.value) * 8 }] }));
  const filled = Math.min(7, days);
  const dow = new Date().getDay();
  const line = days === 1 ? "Day one. Come back tomorrow to keep it going." : `${days} days in a row. Keep the flame going tomorrow.`;
  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }} testID="moment-streak" onTouchStart={() => setTouched(true)}>
      <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.32)" }, scrimStyle]}>
        <Pressable accessibilityLabel="Close" onPress={leave} style={{ flex: 1 }} />
      </Animated.View>
      <Animated.View accessibilityViewIsModal style={[{ backgroundColor: LIME, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 2, borderBottomWidth: 0, borderColor: INK, paddingHorizontal: layout.gutter, paddingTop: space[5], paddingBottom: insets.bottom + space[4], gap: space[4] }, panelStyle]}>
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: space[4] }} accessible accessibilityLabel={`${days} day streak`}>
          <PixelFlame size={72} delay={STREAK_AT.flame} />
          <View>
            <RollingNumber value={shown} from={first} style={{ fontFamily: fonts.pixelDigits, fontSize: 56, lineHeight: 62, color: INK }} testID="streak-count" />
            <T v="caption" style={{ color: INK, fontFamily: fonts.pixel, letterSpacing: 1 }}>
              DAY STREAK
            </T>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: space[2] }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {Array.from({ length: 7 }, (_, i) => {
            const isToday = i === 6;
            const on = isToday ? today : i >= 7 - filled;
            return (
              <View key={i} style={{ flex: 1, alignItems: "center", gap: 4 }}>
                <View style={{ width: "100%", aspectRatio: 1, maxWidth: 40, borderRadius: 6, borderWidth: 2, borderColor: INK, backgroundColor: on ? INK : "transparent" }}>
                  {isToday ? <PixelPop fire={today && !reduce ? 1 : 0} reach={26} cells={16} size={4} /> : null}
                </View>
                <T v="caption" style={{ color: INK }}>
                  {DAYS[(dow + i + 1) % 7]}
                </T>
              </View>
            );
          })}
        </View>
        <Animated.View style={[{ gap: space[3] }, copyStyle]}>
          <T v="bodyStrong" style={{ color: INK }}>
            {line}
          </T>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Keep going"
            onPress={() => {
              haptic.tap();
              leave();
            }}
            testID="moment-streak-close"
            style={({ pressed }) => ({ minHeight: layout.primary, borderRadius: layout.radius, backgroundColor: INK, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] })}
          >
            <T v="button" style={{ color: LIME }}>
              Keep going
            </T>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
