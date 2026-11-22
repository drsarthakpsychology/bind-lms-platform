import { Check, Delete } from "lucide-react-native";
import * as React from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSequence, withSpring, withTiming } from "react-native-reanimated";

import { T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Burst, curves, dur, springs, usePressScale } from "@/motion";
import { fonts, space, useTheme } from "@/theme";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"] as const;

export type PinTone = "normal" | "error" | "success";

/**
 * Four dots and a number pad, in the Layers look: the keys are stone pebbles
 * that squish under the thumb, the dots fill with ink.
 * Calls `onComplete` when the last digit goes in.
 * `shake` (any changing number) makes the dots shake: a wrong PIN.
 * `tone` colours the dots: warm red for a wrong PIN; lime, with a wave, a
 * tick and a few sparks, when it is right.
 * The pad is the app's own, so the PIN never passes through a keyboard app.
 */
export function PinPad({ value, onChange, onComplete, length = 4, shake = 0, disabled, tone = "normal" }: { value: string; onChange: (next: string) => void; onComplete: (pin: string) => void; length?: number; shake?: number; disabled?: boolean; tone?: PinTone }) {
  const reduce = useReducedMotion();
  const { height } = useWindowDimensions();
  // Short phones get smaller keys so the whole pad and its links stay on screen.
  const key = height < 700 ? 60 : 72;
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

  const cell = key + 24;
  return (
    <View style={{ alignItems: "center", gap: height < 700 ? space[5] : space[6] }}>
      <Animated.View accessible accessibilityRole="text" accessibilityLabel={tone === "success" ? "PIN accepted" : tone === "error" ? "Wrong PIN" : `${value.length} of ${length} digits entered`} accessibilityLiveRegion="polite" style={[{ flexDirection: "row", gap: space[4], height: 28, alignItems: "center" }, dots]}>
        {Array.from({ length }, (_, i) => (
          <Dot key={i} i={i} on={i < value.length} tone={tone} />
        ))}
        {tone === "success" ? <Burst fire={1} reach={72} count={12} /> : null}
      </Animated.View>
      <View style={{ width: cell * 3, flexDirection: "row", flexWrap: "wrap", rowGap: space[2] }}>
        {KEYS.map((k, i) => (k === "" ? <View key={i} style={{ width: cell, height: key }} /> : <Key key={i} k={k} size={key} cell={cell} disabled={disabled} onPress={() => press(k)} />))}
      </View>
    </View>
  );
}

function Dot({ i, on, tone }: { i: number; on: boolean; tone: PinTone }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const pop = useSharedValue(1);
  const fill = useSharedValue(on ? 1 : 0);
  React.useEffect(() => {
    fill.set(reduce ? (on ? 1 : 0) : withTiming(on ? 1 : 0, { duration: on ? dur.micro : dur.state, easing: curves.out }));
    if (on && !reduce) pop.set(withSequence(withTiming(1.3, { duration: 90 }), withSpring(1, springs.dot)));
  }, [on, reduce, pop, fill]);
  React.useEffect(() => {
    // The success wave: each dot jumps in turn.
    if (tone === "success" && !reduce) pop.set(withDelay(i * 60, withSequence(withTiming(1.45, { duration: 110 }), withSpring(1, springs.wave))));
  }, [tone, reduce, pop, i]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  const core = useAnimatedStyle(() => ({ opacity: fill.value, transform: [{ scale: 0.9 + fill.value * 0.1 }] }));
  const win = tone === "success";
  const color = tone === "error" ? c.danger : win ? c.lime : c.ink;
  return (
    <Animated.View testID={`pin-dot-${i}`} style={[{ width: 20, height: 20, borderRadius: 10, backgroundColor: c.card, alignItems: "center", justifyContent: "center" }, anim]}>
      <Animated.View style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: 10, backgroundColor: color }, win ? { opacity: 1 } : core]} />
      {/* Right: said with a tick as well as the colour. */}
      {win ? <Check size={13} color={c.onLime} strokeWidth={3.4} /> : null}
    </Animated.View>
  );
}

function Key({ k, onPress, disabled, size, cell }: { k: string; onPress: () => void; disabled?: boolean; size: number; cell: number }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { style: squish, handlers } = usePressScale(0.9, true);
  const down = useSharedValue(0);
  const ink = useAnimatedStyle(() => ({ opacity: down.value }));
  const del = k === "del";
  return (
    <Pressable
      testID={del ? "pin-del" : `pin-key-${k}`}
      accessibilityRole="button"
      accessibilityLabel={del ? "Delete last digit" : k}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        handlers.onPressIn();
        down.set(reduce ? 1 : withTiming(1, { duration: dur.press / 2 }));
      }}
      onPressOut={() => {
        handlers.onPressOut();
        down.set(reduce ? 0 : withTiming(0, { duration: dur.press * 2 }));
      }}
      style={{ width: cell, height: size, alignItems: "center", justifyContent: "center", opacity: disabled ? 0.45 : 1 }}
    >
      {/* A stone pebble under every digit: the 3x4 grid reads at a glance and the target is clear. */}
      <Animated.View style={[{ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center", backgroundColor: del ? "transparent" : c.card, overflow: "hidden" }, squish]}>
        {/* Under the thumb the pebble darkens a step: your current choice. */}
        <Animated.View pointerEvents="none" style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.hairline }, ink]} />
        {del ? (
          <Delete size={26} color={c.ink} strokeWidth={1.9} />
        ) : (
          <T style={{ fontFamily: fonts.display, fontSize: size < 72 ? 25 : 28, lineHeight: 34 }} num maxFontSizeMultiplier={1.2}>
            {k}
          </T>
        )}
      </Animated.View>
    </Pressable>
  );
}

export const PIN_MOTION = dur.press;
