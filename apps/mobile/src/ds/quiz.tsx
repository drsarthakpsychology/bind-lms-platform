import { Check, X } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { Easing, useAnimatedProps, useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { Rich } from "@/study/rich";
import { haptic } from "@/lib/haptics";
import { settingsStore } from "@/lib/settings";
import { dur, presets, springs, usePressScale } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { T } from "./text";

export type OptionState = "idle" | "picked" | "right" | "wrong" | "dim";

const APath = Animated.createAnimatedComponent(Path);

/** A tick or a cross that draws itself on (160ms); with Reduce Motion it is simply there. */
export function DrawMark({ kind, color, size = 20 }: { kind: "tick" | "cross"; color: string; size?: number }) {
  const reduce = useReducedMotion();
  const len = kind === "tick" ? 20 : 26;
  const t = useSharedValue(reduce ? 1 : 0);
  React.useEffect(() => {
    if (!reduce) t.set(withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) }));
  }, [reduce, t]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: len * (1 - t.value) }));
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <APath d={kind === "tick" ? "M4 10.5 L8.5 15 L16.5 5" : "M5 5 L15 15 M15 5 L5 15"} stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={len} animatedProps={props} />
    </Svg>
  );
}

/**
 * One answer option: a large row (56px or more) with a letter, the text that
 * wraps, and after checking a tick or a cross. The whole row is the target.
 * It sinks to 0.98 under the finger, the letter disc pops when the row is
 * chosen, the tick or cross draws itself on, and a wrong answer shakes once.
 */
export function OptionRow({ index, text, state = "idle", onPress, testID, disabled }: { index: number; text: string; state?: OptionState; onPress?: () => void; testID?: string; disabled?: boolean }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const press = usePressScale(0.98);
  const pop = useSharedValue(1);
  const x = useSharedValue(0);
  const last = React.useRef(state);
  React.useEffect(() => {
    if (last.current === state) return;
    last.current = state;
    if (reduce) return;
    if (state === "picked" || state === "right" || state === "wrong") pop.set(withSequence(withTiming(1.12, { duration: dur.micro }), withSpring(1, springs.bouncy)));
    if (state === "wrong") x.set(withSequence(withTiming(-6, { duration: 45 }), withTiming(6, { duration: 70 }), withTiming(-3, { duration: 60 }), withTiming(0, { duration: 60 })));
  }, [state, reduce, pop, x]);
  const shake = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const disc = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  const letter = String.fromCharCode(65 + index);
  const border = state === "picked" ? c.ink : state === "right" ? (c.dark ? c.primary : c.ink) : state === "wrong" ? c.danger : c.cardLine;
  const bg = state === "right" ? c.successBg : state === "wrong" ? c.alertBg : state === "picked" ? c.tint : "transparent";
  return (
    <Animated.View style={shake}>
      <Animated.View style={disabled ? null : press.style}>
        <Pressable
          testID={testID}
          accessibilityRole="radio"
          accessibilityState={{ selected: state === "picked" || state === "right" || state === "wrong", disabled: !!disabled }}
          accessibilityLabel={`${letter}. ${text.replace(/[*`]/g, "")}${state === "right" ? ". Right answer" : state === "wrong" ? ". Wrong" : ""}`}
          disabled={disabled}
          {...press.handlers}
          onPress={() => {
            haptic.select();
            onPress?.();
          }}
          style={({ pressed }) => ({ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[3], paddingHorizontal: space[4], paddingVertical: space[3], borderRadius: layout.radius, borderWidth: state === "picked" || state === "right" || state === "wrong" ? 2 : 1.5, borderColor: border, backgroundColor: pressed && !disabled ? c.tint : bg, opacity: state === "dim" ? 0.55 : 1 })}
        >
          <Animated.View style={[{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: state === "picked" ? c.ink : c.tint }, disc]}>
            <T v="caption" style={{ color: state === "picked" ? c.bg : c.ink }}>
              {letter}
            </T>
          </Animated.View>
          <Rich text={text} style={{ flex: 1 }} />
          {state === "right" ? <DrawMark kind="tick" color={c.dark ? c.primary : c.ink} /> : state === "wrong" ? <DrawMark kind="cross" color={c.danger} /> : null}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const REACT_RIGHT = ["Nice.", "Spot on.", "That's it.", "Exactly."];
const REACT_WRONG = ["Not quite.", "Close, but no.", "Let's see why."];

/**
 * The verdict: a full-width ink band that rises from the bottom after an
 * answer (readable by 120ms, settling its last 16px on the smooth spring), with a one-word reaction (when reactions are on) and why.
 */
export function VerdictBand({ right, title, why, seed = 0, testID = "verdict" }: { right: boolean; title?: string; why?: string | null; seed?: number; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const reactions = settingsStore.use((s) => s.reactions);
  React.useEffect(() => {
    if (right) haptic.success();
    else haptic.warn();
  }, [right, seed]);
  const pool = right ? REACT_RIGHT : REACT_WRONG;
  const head = title ?? (reactions ? pool[seed % pool.length]! : right ? "Right." : "Not this one.");
  return (
    <Animated.View testID={testID} entering={reduce ? undefined : presets.verdict()} accessibilityLiveRegion="polite" accessibilityRole="alert" style={{ backgroundColor: c.band, borderRadius: layout.radius, padding: space[4], gap: space[1], flexDirection: "row", alignItems: "flex-start" }}>
      <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: right ? c.primary : c.danger, marginRight: space[3], marginTop: 1 }}>
        {right ? <Check size={18} color={c.onPrimary} strokeWidth={3} /> : <X size={18} color={c.bg} strokeWidth={3} />}
      </View>
      <View style={{ flex: 1, gap: space[1] }}>
        <T v="bodyStrong" tone="onBand">
          {head}
        </T>
        {why ? <Rich text={why} v="small" tone="onBand" /> : null}
      </View>
    </Animated.View>
  );
}
