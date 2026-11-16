import { Delete } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";

import { T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { dur, springs } from "@/motion";
import { fonts, space, useTheme } from "@/theme";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"] as const;
const LIME = "#cdf24b";
const INK = "#111111";

export type PinTone = "normal" | "error" | "success";

/**
 * Four dots and a number pad. Calls `onComplete` when the last digit goes in.
 * `shake` (any changing number) makes the dots shake: a wrong PIN.
 * `tone` colours the dots: red for a wrong PIN, lime when it is right.
 * Each dot pops as its digit goes in; keys sink a little under the finger.
 * The pad is the app's own, so the PIN never passes through a keyboard app.
 */
export function PinPad({ value, onChange, onComplete, length = 4, shake = 0, disabled, tone = "normal" }: { value: string; onChange: (next: string) => void; onComplete: (pin: string) => void; length?: number; shake?: number; disabled?: boolean; tone?: PinTone }) {
  const reduce = useReducedMotion();
  const x = useSharedValue(0);
  React.useEffect(() => {
    if (!shake || reduce) return;
    x.set(withSequence(withTiming(-12, { duration: 45 }), withTiming(12, { duration: 70 }), withTiming(-8, { duration: 60 }), withTiming(5, { duration: 55 }), withTiming(0, { duration: 50 })));
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
      <Animated.View accessible accessibilityRole="text" accessibilityLabel={`${value.length} of ${length} digits entered`} accessibilityLiveRegion="polite" style={[{ flexDirection: "row", gap: space[5], height: 24, alignItems: "center" }, dots]}>
        {Array.from({ length }, (_, i) => (
          <Dot key={i} i={i} on={i < value.length} tone={tone} />
        ))}
      </Animated.View>
      <View style={{ width: 288, flexDirection: "row", flexWrap: "wrap", rowGap: space[2] }}>
        {KEYS.map((k, i) => (k === "" ? <View key={i} style={{ width: 96, height: 72 }} /> : <Key key={i} k={k} disabled={disabled} onPress={() => press(k)} />))}
      </View>
    </View>
  );
}

function Dot({ i, on, tone }: { i: number; on: boolean; tone: PinTone }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const pop = useSharedValue(1);
  React.useEffect(() => {
    if (on && !reduce) pop.set(withSequence(withTiming(1.35, { duration: 90 }), withSpring(1, springs.dot)));
  }, [on, reduce, pop]);
  React.useEffect(() => {
    // The success wave: each dot jumps in turn.
    if (tone === "success" && !reduce) pop.set(withSequence(withTiming(1, { duration: i * 60 }), withTiming(1.45, { duration: 110 }), withSpring(1, springs.wave)));
  }, [tone, reduce, pop, i]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  const color = tone === "error" ? c.danger : tone === "success" ? LIME : c.ink;
  const filled = on || tone === "success";
  return <Animated.View testID={`pin-dot-${i}`} style={[{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, backgroundColor: filled ? color : "transparent", borderColor: tone === "success" ? INK : filled ? color : c.cardLine }, anim]} />;
}

function Key({ k, onPress, disabled }: { k: string; onPress: () => void; disabled?: boolean }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const down = useSharedValue(0);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: 1 - down.value * 0.08 }] }));
  const glow = useAnimatedStyle(() => ({ opacity: down.value }));
  return (
    <Pressable
      testID={k === "del" ? "pin-del" : `pin-key-${k}`}
      accessibilityRole="button"
      accessibilityLabel={k === "del" ? "Delete last digit" : k}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => down.set(reduce ? 1 : withTiming(1, { duration: dur.press / 2 }))}
      onPressOut={() => down.set(reduce ? 0 : withTiming(0, { duration: dur.press * 2 }))}
      style={{ width: 96, height: 72, alignItems: "center", justifyContent: "center" }}
    >
      {/* A faint circle on every digit key: the 3x4 grid reads at a glance and the target is clear. */}
      <Animated.View style={[{ width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", opacity: disabled ? 0.4 : 1, backgroundColor: k === "del" ? "transparent" : c.dark ? "rgba(255,255,255,0.07)" : "rgba(17,17,17,0.045)" }, anim]}>
        <Animated.View pointerEvents="none" style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 36, backgroundColor: c.dark ? "rgba(205,242,75,0.22)" : "rgba(29,68,216,0.10)" }, glow]} />
        {k === "del" ? (
          <Delete size={26} color={c.ink} />
        ) : (
          <T style={{ fontFamily: fonts.bold, fontSize: 30, lineHeight: 36 }} maxFontSizeMultiplier={1.2}>
            {k}
          </T>
        )}
      </Animated.View>
    </Pressable>
  );
}

export const PIN_MOTION = dur.press;
