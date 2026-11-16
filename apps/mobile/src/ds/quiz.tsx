import { Check, X } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

import { Rich } from "@/study/rich";
import { haptic } from "@/lib/haptics";
import { settingsStore } from "@/lib/settings";
import { layout, motion, space, useTheme } from "@/theme";
import { T } from "./text";

export type OptionState = "idle" | "picked" | "right" | "wrong" | "dim";

/**
 * One answer option: a large row (56px or more) with a letter, the text that
 * wraps, and after checking a tick or a cross. The whole row is the target.
 */
export function OptionRow({ index, text, state = "idle", onPress, testID, disabled }: { index: number; text: string; state?: OptionState; onPress?: () => void; testID?: string; disabled?: boolean }) {
  const c = useTheme();
  const letter = String.fromCharCode(65 + index);
  const border = state === "picked" ? c.ink : state === "right" ? (c.dark ? c.primary : c.ink) : state === "wrong" ? c.danger : c.cardLine;
  const bg = state === "right" ? c.successBg : state === "wrong" ? c.alertBg : state === "picked" ? c.tint : "transparent";
  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected: state === "picked" || state === "right" || state === "wrong", disabled: !!disabled }}
      accessibilityLabel={`${letter}. ${text.replace(/[*`]/g, "")}${state === "right" ? ". Right answer" : state === "wrong" ? ". Wrong" : ""}`}
      disabled={disabled}
      onPress={() => {
        haptic.select();
        onPress?.();
      }}
      style={({ pressed }) => ({ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[3], paddingHorizontal: space[4], paddingVertical: space[3], borderRadius: layout.radius, borderWidth: state === "picked" || state === "right" || state === "wrong" ? 2 : 1.5, borderColor: border, backgroundColor: pressed && !disabled ? c.tint : bg, opacity: state === "dim" ? 0.55 : 1, transform: [{ scale: pressed && !disabled ? 0.99 : 1 }] })}
    >
      <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: state === "picked" ? c.ink : c.tint }}>
        <T v="caption" style={{ color: state === "picked" ? c.bg : c.ink }}>
          {letter}
        </T>
      </View>
      <Rich text={text} style={{ flex: 1 }} />
      {state === "right" ? <Check size={20} color={c.dark ? c.primary : c.ink} /> : state === "wrong" ? <X size={20} color={c.danger} /> : null}
    </Pressable>
  );
}

const REACT_RIGHT = ["Nice.", "Spot on.", "That's it.", "Exactly."];
const REACT_WRONG = ["Not quite.", "Close, but no.", "Let's see why."];

/**
 * The verdict: a full-width ink band that rises from the bottom after an
 * answer, with a one-word reaction (when reactions are on) and why.
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
    <Animated.View testID={testID} entering={reduce ? undefined : FadeInDown.duration(motion.state)} accessibilityLiveRegion="polite" accessibilityRole="alert" style={{ backgroundColor: c.band, borderRadius: layout.radius, padding: space[4], gap: space[1], flexDirection: "row", alignItems: "flex-start" }}>
      <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: right ? c.primary : c.danger, marginRight: space[3], marginTop: 1 }}>
        {right ? <Check size={18} color="#111111" strokeWidth={3} /> : <X size={18} color="#ffffff" strokeWidth={3} />}
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
