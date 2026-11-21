import * as React from "react";
import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";

import { useOffline } from "@/api/online";
import { crumb } from "@/lib/breadcrumb";
import { curves, dur } from "@/motion";
import { fonts, layout, space, useTheme } from "@/theme";
import { T } from "./text";

const ease = curves.standard;

type ButtonProps = {
  label: string;
  onPress?: () => void;
  /** primary: the lime pill (one per screen). quiet: a stone pill. ink: the dark pill on a result. text: words only. danger: red words. */
  kind?: "primary" | "quiet" | "ink" | "text" | "danger";
  /** A 40px pill for a row or the field ("Scan in"). */
  small?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Shows a small spinner in place of the icon and blocks presses. */
  busy?: boolean;
  /** Needs the server (Post, Hand in, Send): greyed out while the phone is offline. */
  needsServer?: boolean;
  /** Fills the width (default for primary and quiet). */
  full?: boolean;
  testID?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Buttons are pills. The primary one is lime: the one live thing on a screen.
 * On press a button sinks to 0.97 over 120ms. No haptic: the result of the
 * action gives one when it matters (saved, wrong, done).
 */
export function Button({ label, onPress, kind = "primary", small, icon, disabled, busy, needsServer, full, testID, accessibilityHint, style }: ButtonProps) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const down = useSharedValue(0);
  const offline = useOffline();
  const blocked = disabled || busy || (!!needsServer && offline);
  const hint = needsServer && offline ? "Needs the internet" : accessibilityHint;
  const sunk = useAnimatedStyle(() => ({ transform: [{ scale: 1 - down.value * 0.03 }] }));
  const faded = useAnimatedStyle(() => ({ opacity: 1 - down.value * 0.35, transform: [{ scale: 1 - down.value * 0.03 }] }));
  const pressIn = () => {
    down.value = reduce ? 1 : withTiming(1, { duration: dur.press, easing: ease });
  };
  const pressOut = () => {
    down.value = reduce ? 0 : withTiming(0, { duration: dur.press, easing: ease });
  };
  // A button that sends something (it has a `busy` state) takes one press until the screen has
  // drawn again: a quick second tap lands before `busy` has drawn, and used to post a doubt or a
  // reply twice. Presses after a new draw (the next question) go through as before.
  const locked = React.useRef(false);
  React.useEffect(() => {
    locked.current = false;
  });
  const press = () => {
    if (blocked) return;
    if (busy !== undefined) {
      if (locked.current) return;
      locked.current = true;
    }
    crumb.action(label);
    onPress?.();
  };
  const a11y = { accessibilityRole: "button" as const, accessibilityLabel: label, accessibilityHint: hint, accessibilityState: { disabled: !!blocked, busy: !!busy } };

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

  // Pills. primary: lime, the one live thing. quiet: stone. ink: your choice, confirmed (the button on a result).
  const fill = blocked ? c.card : kind === "primary" ? c.primary : kind === "ink" ? c.ink : c.card;
  const tone = blocked ? "muted" : kind === "primary" ? "onPrimary" : kind === "ink" ? "onInk" : "ink";
  return (
    <Pressable {...a11y} testID={testID} onPress={press} onPressIn={pressIn} onPressOut={pressOut} disabled={blocked} hitSlop={small ? 6 : 0} style={[{ alignSelf: full === false || small ? "flex-start" : "stretch", opacity: blocked && kind !== "primary" ? 0.6 : 1 }, style]}>
      <Animated.View style={[{ minHeight: small ? 40 : kind === "primary" || kind === "ink" ? layout.primary : layout.target, paddingHorizontal: small ? space[4] : space[5], paddingVertical: small ? space[2] : space[3], borderRadius: 999, backgroundColor: fill, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[2] }, sunk]}>
        <T v={small ? "small" : "button"} tone={tone} center style={[{ flexShrink: 1 }, small ? { fontFamily: fonts.bold } : null]}>
          {label}
        </T>
        {busy ? <ActivityIndicator size="small" color={c.muted} /> : icon}
      </Animated.View>
    </Pressable>
  );
}
