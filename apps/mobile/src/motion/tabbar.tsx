import type { BottomTabBarProps, BottomTabNavigationOptions } from "expo-router/build/layouts/Tabs";
import * as React from "react";
import { Platform, Pressable, View, type LayoutChangeEvent, type ViewStyle } from "react-native";
import Animated, { interpolate, useAnimatedReaction, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { reportTabBar } from "@/ds/bottom-chrome";
import { T } from "@/ds/text";
import { KeyboardState, useKeyboard } from "@/lib/keyboard";
import { fonts, useTheme, type Area } from "@/theme";
import { springs } from "./tokens";

export type TabIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

/** Counts tab switches, so a screen can tell "its tab came to the front" from "the page above it closed". */
let switches = 0;
export function tabSwitchCount(): number {
  return switches;
}

const PILL_H = 42;
const BAR_H = 56;
/** Icons of the tabs you are not on: soft white on the dark pill, both themes. */
const BAR_FG = "rgba(255,255,255,0.72)";
const barShadow: ViewStyle = Platform.OS === "web" ? ({ boxShadow: "0 14px 26px -12px rgba(0,0,0,0.6)" } as ViewStyle) : Platform.OS === "android" ? { elevation: 8 } : { shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } };

/**
 * The bar follows the keyboard (UI thread, frame by frame, through the app's
 * one keyboard hook so the edge-to-edge flags agree): it slides down behind
 * the keyboard as it opens and fades, leaves the layout once it is open
 * (Android would otherwise put the bar above the keyboard), comes back as soon
 * as the keyboard starts closing and slides up with it.
 */
function useKeyboardBar(barH: number) {
  const kb = useKeyboard();
  const [up, setUp] = React.useState(false);
  useAnimatedReaction(
    () => kb.state.value,
    (st, prev) => {
      if (st === prev) return;
      if (st === KeyboardState.OPEN) scheduleOnRN(setUp, true);
      else if (st === KeyboardState.CLOSING || st === KeyboardState.CLOSED) scheduleOnRN(setUp, false);
    },
  );
  const style = useAnimatedStyle(() => {
    const h = Math.max(0, kb.height.value);
    return { opacity: interpolate(h, [0, barH], [1, 0], "clamp"), transform: [{ translateY: interpolate(h, [0, barH], [0, barH], "clamp") }] };
  });
  return { up, style };
}

function TabItem({ label, Icon, focused, onPress, onLongPress, a11y }: { label: string; Icon?: TabIcon; focused: boolean; onPress: () => void; onLongPress: () => void; a11y?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const press = useSharedValue(0);
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 - press.value * 0.08 }] }));
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={a11y ?? label}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        if (!reduce) press.set(withSpring(1, springs.press));
      }}
      onPressOut={() => {
        press.set(reduce ? 0 : withSpring(0, springs.press));
      }}
      hitSlop={{ top: 10, bottom: 10 }}
      style={{ flexGrow: focused ? 0 : 1, flexShrink: 0, minWidth: PILL_H, height: PILL_H, alignItems: "center", justifyContent: "center" }}
    >
      {/* The current tab is the lime pill and the only one that shows its name; the others are icons (their names are still read aloud). */}
      <Animated.View testID={focused ? "tab-current" : undefined} style={[{ height: PILL_H, borderRadius: PILL_H / 2, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingLeft: focused ? 12 : 0, paddingRight: focused ? 15 : 0, backgroundColor: focused ? c.lime : "transparent" }, iconStyle]}>
        {Icon ? <Icon size={20} color={focused ? c.onLime : BAR_FG} strokeWidth={focused ? 2.3 : 2} /> : null}
        {focused ? (
          <T allowFontScaling={false} numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 13, lineHeight: 17, color: c.onLime }}>
            {label}
          </T>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

/**
 * The bottom tab bar: a dark pill floating over the layer, an icon for each
 * tab, and the current tab as a lime pill with its name. Tabs switch at once
 * (they are peers, used all day: no slide, no travelling indicator). Presses
 * sink slightly. No haptic: switching tabs is navigation.
 *
 * Pass as `tabBar` to Expo Router's <Tabs>; give each screen its icon via `icons`.
 */
export function MotionTabBar({ state, descriptors, emitter, navigateToTab, insets, icons }: BottomTabBarProps & { icons: Record<string, TabIcon>; /** Kept for older callers; the bar no longer wears area colours. */ areas?: Record<string, Area | undefined> }) {
  const c = useTheme();
  const kb = useKeyboardBar(BAR_H + insets.bottom);
  // Tell the toast how tall the bar is (nothing while it is behind the keyboard).
  React.useEffect(() => {
    if (kb.up) reportTabBar(0);
  }, [kb.up]);
  React.useEffect(() => () => reportTabBar(0), []);
  React.useEffect(() => {
    switches += 1;
  }, [state.index]);
  if (kb.up) return null;
  return (
    <Animated.View onLayout={(e: LayoutChangeEvent) => reportTabBar(Math.round(e.nativeEvent.layout.height))} style={[{ backgroundColor: c.bg, paddingBottom: Math.max(insets.bottom, 10), paddingTop: 6, paddingLeft: insets.left, paddingRight: insets.right, alignItems: "center" }, kb.style]}>
      <View accessibilityRole="tablist" testID="tab-bar" style={[{ flexDirection: "row", alignItems: "center", gap: 2, height: BAR_H, width: "100%", maxWidth: 340, paddingHorizontal: 7, borderRadius: BAR_H / 2, backgroundColor: c.dark ? "#2a2e3b" : "#12131a" }, barShadow]}>
        {state.routes.map((route, index) => {
          const focused = index === state.index;
          const options = descriptors[route.key]?.options as BottomTabNavigationOptions | undefined;
          const label = typeof options?.title === "string" ? options.title : route.name;
          return (
            <TabItem
              key={route.key}
              label={label}
              Icon={icons[route.name]}
              focused={focused}
              a11y={options?.tabBarAccessibilityLabel}
              onPress={() => {
                const event = emitter.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) navigateToTab(route.key);
              }}
              onLongPress={() => emitter.emit({ type: "tabLongPress", target: route.key })}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

/**
 * Tabs switch at once: they are peers, pressed dozens of times a session, so
 * nothing slides or fades between them (docs/DESIGN.md, motion rule 2).
 */
export function tabSceneOptions(_reduce?: boolean, _low?: boolean): Pick<BottomTabNavigationOptions, "animation"> {
  return { animation: "none" };
}
