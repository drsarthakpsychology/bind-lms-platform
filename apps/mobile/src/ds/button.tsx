import * as React from "react";
import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";

import { haptic } from "@/lib/haptics";
import { layout, motion, space, useTheme } from "@/theme";
import { T } from "./text";

const SHADOW = 3;
const ease = Easing.bezier(...motion.ease);

type ButtonProps = {
  label: string;
  onPress?: () => void;
  /** primary: lime with the hard shadow (one per screen). quiet: an outline. text: words only. danger: red words. */
  kind?: "primary" | "quiet" | "text" | "danger";
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Shows a small spinner in place of the icon and blocks presses. */
  busy?: boolean;
  /** Fills the width (default for primary and quiet). */
  full?: boolean;
  testID?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Buttons. The primary one is the only lime thing on a screen besides
 * progress, and the only thing with a hard shadow: on press it moves 3px into
 * its shadow over 120ms, with a light haptic.
 */
export function Button({ label, onPress, kind = "primary", icon, disabled, busy, full, testID, accessibilityHint, style }: ButtonProps) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const down = useSharedValue(0);
  const blocked = disabled || busy;
  const moved = useAnimatedStyle(() => ({ transform: [{ translateX: down.value * SHADOW }, { translateY: down.value * SHADOW }] }));
  const faded = useAnimatedStyle(() => ({ opacity: 1 - down.value * 0.35, transform: [{ scale: 1 - down.value * 0.03 }] }));
  const pressIn = () => {
    down.value = reduce ? 1 : withTiming(1, { duration: motion.press, easing: ease });
  };
  const pressOut = () => {
    down.value = reduce ? 0 : withTiming(0, { duration: motion.press, easing: ease });
  };
  const press = () => {
    if (blocked) return;
    if (kind === "primary") haptic.tap();
    onPress?.();
  };
  const a11y = { accessibilityRole: "button" as const, accessibilityLabel: label, accessibilityHint, accessibilityState: { disabled: !!blocked, busy: !!busy } };

  if (kind === "text" || kind === "danger") {
    return (
      <Pressable {...a11y} testID={testID} onPress={press} onPressIn={pressIn} onPressOut={pressOut} disabled={blocked} hitSlop={8} style={[{ minHeight: layout.target, justifyContent: "center", alignSelf: full ? "stretch" : "flex-start", alignItems: full ? "center" : "flex-start", opacity: blocked ? 0.5 : 1 }, style]}>
        <Animated.View style={[{ flexDirection: "row", alignItems: "center", gap: space[2] }, faded]}>
          <T v="button" tone={kind === "danger" ? "danger" : "link"}>
            {label}
          </T>
          {busy ? <ActivityIndicator size="small" color={c.muted} /> : icon}
        </Animated.View>
      </Pressable>
    );
  }

  if (kind === "quiet") {
    return (
      <Pressable {...a11y} testID={testID} onPress={press} onPressIn={pressIn} onPressOut={pressOut} disabled={blocked} style={[{ alignSelf: full === false ? "flex-start" : "stretch", opacity: blocked ? 0.5 : 1 }, style]}>
        <Animated.View style={[{ minHeight: layout.target, paddingHorizontal: space[5], paddingVertical: space[3], borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[2] }, faded]}>
          <T v="button" center style={{ flexShrink: 1 }}>
            {label}
          </T>
          {busy ? <ActivityIndicator size="small" color={c.muted} /> : icon}
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable {...a11y} testID={testID} onPress={press} onPressIn={pressIn} onPressOut={pressOut} disabled={blocked} style={[{ alignSelf: full === false ? "flex-start" : "stretch", paddingRight: SHADOW, paddingBottom: SHADOW }, style]}>
      {/* the hard shadow: a solid block 3px down and right */}
      <View pointerEvents="none" style={{ position: "absolute", left: SHADOW, top: SHADOW, right: 0, bottom: 0, borderRadius: layout.radius, backgroundColor: blocked ? "transparent" : c.shadow }} />
      <Animated.View
        style={[
          { minHeight: layout.primary, paddingHorizontal: space[5], paddingVertical: space[3], borderRadius: layout.radius, borderWidth: 2, borderColor: blocked ? c.cardLine : c.dark ? c.onPrimary : c.line, backgroundColor: blocked ? c.tint : c.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[2] },
          blocked ? null : moved,
        ]}
      >
        <T v="button" tone={blocked ? "muted" : "onPrimary"} center style={{ flexShrink: 1 }}>
          {label}
        </T>
        {busy ? <ActivityIndicator size="small" color={c.muted} /> : icon}
      </Animated.View>
    </Pressable>
  );
}
