import { Delete } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

import { T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { fonts, motion, space, useTheme } from "@/theme";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"] as const;

/**
 * Four dots and a number pad. Calls `onComplete` when the last digit goes in.
 * `shake` (any changing number) makes the dots shake: a wrong PIN.
 * The pad is the app's own, so the PIN never passes through a keyboard app.
 */
export function PinPad({ value, onChange, onComplete, length = 4, shake = 0, disabled }: { value: string; onChange: (next: string) => void; onComplete: (pin: string) => void; length?: number; shake?: number; disabled?: boolean }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const x = useSharedValue(0);
  React.useEffect(() => {
    if (!shake || reduce) return;
    x.value = withSequence(withTiming(-10, { duration: 50 }), withTiming(10, { duration: 70 }), withTiming(-6, { duration: 60 }), withTiming(0, { duration: 60 }));
  }, [shake, reduce, x]);
  const dots = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  const press = (k: string) => {
    if (disabled) return;
    if (k === "del") {
      if (value.length) {
        haptic.select();
        onChange(value.slice(0, -1));
      }
      return;
    }
    if (value.length >= length) return;
    haptic.select();
    const next = value + k;
    onChange(next);
    if (next.length === length) onComplete(next);
  };

  return (
    <View style={{ alignItems: "center", gap: space[6] }}>
      <Animated.View accessible accessibilityRole="text" accessibilityLabel={`${value.length} of ${length} digits entered`} accessibilityLiveRegion="polite" style={[{ flexDirection: "row", gap: space[4], height: 20, alignItems: "center" }, dots]}>
        {Array.from({ length }, (_, i) => (
          <View key={i} testID={`pin-dot-${i}`} style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: i < value.length ? c.ink : c.cardLine, backgroundColor: i < value.length ? c.ink : "transparent" }} />
        ))}
      </Animated.View>
      <View style={{ width: 288, flexDirection: "row", flexWrap: "wrap", rowGap: space[2] }}>
        {KEYS.map((k, i) =>
          k === "" ? (
            <View key={i} style={{ width: 96, height: 72 }} />
          ) : (
            <Pressable
              key={i}
              testID={k === "del" ? "pin-del" : `pin-key-${k}`}
              accessibilityRole="button"
              accessibilityLabel={k === "del" ? "Delete last digit" : k}
              disabled={disabled}
              onPress={() => press(k)}
              android_ripple={{ color: c.tint, borderless: true, radius: 36 }}
              style={{ width: 96, height: 72, alignItems: "center", justifyContent: "center" }}
            >
              {({ pressed }) => (
                <View style={{ width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", backgroundColor: pressed ? c.tint : "transparent", transform: [{ scale: pressed ? 0.96 : 1 }], opacity: disabled ? 0.4 : 1 }}>
                  {k === "del" ? <Delete size={26} color={c.ink} /> : <T style={{ fontFamily: fonts.bold, fontSize: 30, lineHeight: 36 }} maxFontSizeMultiplier={1.2}>{k}</T>}
                </View>
              )}
            </Pressable>
          ),
        )}
      </View>
    </View>
  );
}

export const PIN_MOTION = motion.press;
