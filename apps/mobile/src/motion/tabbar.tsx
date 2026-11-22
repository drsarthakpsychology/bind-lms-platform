import type { BottomTabBarProps, BottomTabNavigationOptions } from "expo-router/build/layouts/Tabs";
import * as React from "react";
import { Platform, Pressable, View, type LayoutChangeEvent, type ViewStyle } from "react-native";
import Animated, { interpolate, useAnimatedReaction, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { reportTabBar } from "@/ds/bottom-chrome";
import { T } from "@/ds/text";
import { KeyboardState, useKeyboard } from "@/lib/keyboard";
import { fonts, useTheme, type Area } from "@/theme";
import { presets } from "./enter";
import { useMotionTier } from "./tier";
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

function noPlace() {
  return undefined;
}

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

function TabItem({ label, Icon, focused, onPress, onLongPress, a11y, onPlace, glide }: { label: string; Icon?: TabIcon; focused: boolean; onPress: () => void; onLongPress: () => void; a11y?: string; /** Reports where this tab sits in the bar, so the pill can slide to it. */ onPlace: (x: number, w: number) => void; /** Neighbours glide aside when the current tab widens (off with Reduce Motion and on low-end Android). */ glide: boolean }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const press = useSharedValue(0);
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: 1 + press.value * 0.05 }, { scaleY: 1 - press.value * 0.1 }] }));
  return (
    <Animated.View layout={glide ? presets.layout() : undefined} onLayout={(e: LayoutChangeEvent) => onPlace(e.nativeEvent.layout.x, e.nativeEvent.layout.width)} style={{ flexGrow: focused ? 0 : 1, flexShrink: 0, minWidth: PILL_H, height: PILL_H }}>
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
          press.set(reduce ? 0 : withSpring(0, springs.bouncy));
        }}
        hitSlop={{ top: 10, bottom: 10 }}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        {/* The current tab sits on the lime pill and is the only one that shows its name; the others are icons (their names are still read aloud). */}
        <Animated.View testID={focused ? "tab-current" : undefined} style={[{ height: PILL_H, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingLeft: focused ? 12 : 0, paddingRight: focused ? 15 : 0 }, iconStyle]}>
          {Icon ? <Icon size={20} color={focused ? c.onLime : BAR_FG} strokeWidth={focused ? 2.3 : 2} /> : null}
          {focused ? (
            <Animated.View entering={reduce ? undefined : presets.fadeState(60)}>
              <T allowFontScaling={false} numberOfLines={1} style={{ fontFamily: fonts.bold, fontSize: 13, lineHeight: 17, color: c.onLime }}>
                {label}
              </T>
            </Animated.View>
          ) : null}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/**
 * The bottom tab bar: a dark pill floating over the layer (the page scrolls
 * under it; `Screen tab` pads its content so the last thing clears the bar),
 * an icon for each tab, and one lime pill under the current tab with its
 * name. The screens switch at once (they are peers, used all day), and the
 * lime pill slides to the new tab on the snappy spring while its neighbours
 * glide aside. Icons squish under the thumb. No haptic: switching tabs is
 * navigation. Reduce Motion and low-end Android: the pill jumps.
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
  // The one lime pill: it slides (transform) and stretches (width) to the current tab. One small view, UI thread.
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  const x = useSharedValue(0);
  const w = useSharedValue(0);
  const placed = React.useRef(false);
  const place = React.useCallback(
    (px: number, pw: number) => {
      if (!placed.current || reduce || low) {
        placed.current = true;
        x.set(px);
        w.set(pw);
      } else {
        x.set(withSpring(px, springs.snappy));
        w.set(withSpring(pw, springs.snappy));
      }
    },
    [reduce, low, x, w],
  );
  const pill = useAnimatedStyle(() => ({ width: w.value, opacity: w.value > 0 ? 1 : 0, transform: [{ translateX: x.value }] }));
  if (kb.up) return null;
  return (
    <Animated.View onLayout={(e: LayoutChangeEvent) => reportTabBar(Math.round(e.nativeEvent.layout.height))} pointerEvents="box-none" style={[{ position: "absolute", left: 0, right: 0, bottom: 0, paddingBottom: Math.max(insets.bottom, 12), paddingTop: 6, paddingLeft: Math.max(insets.left, 20), paddingRight: Math.max(insets.right, 20), alignItems: "center" }, kb.style]}>
      <View accessibilityRole="tablist" testID="tab-bar" style={[{ flexDirection: "row", alignItems: "center", gap: 2, height: BAR_H, width: "100%", maxWidth: 340, paddingHorizontal: 7, borderRadius: BAR_H / 2, backgroundColor: c.dark ? "#2a2e3b" : "#12131a" }, barShadow]}>
        <Animated.View pointerEvents="none" testID="tab-pill" style={[{ position: "absolute", left: 0, top: (BAR_H - PILL_H) / 2, height: PILL_H, borderRadius: PILL_H / 2, backgroundColor: c.lime }, pill]} />
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
              glide={!reduce && !low}
              onPlace={focused ? place : noPlace}
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
