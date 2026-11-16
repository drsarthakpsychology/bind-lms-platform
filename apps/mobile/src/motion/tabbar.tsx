import type { BottomTabBarProps, BottomTabNavigationOptions } from "expo-router/build/layouts/Tabs";
import * as React from "react";
import { Animated as RNAnimated, Easing as RNEasing, Pressable, View, type LayoutChangeEvent } from "react-native";
import Animated, { interpolate, useAnimatedReaction, useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { reportTabBar } from "@/ds/bottom-chrome";
import { T } from "@/ds/text";
import { KeyboardState, useKeyboard } from "@/lib/keyboard";
import { fonts, useTheme } from "@/theme";
import { dur, shift, springs } from "./tokens";

export type TabIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const PILL_W = 60;
const PILL_H = 32;
const BAR_H = 64;

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
  const pop = useSharedValue(1);
  const press = useSharedValue(0);
  const first = React.useRef(true);
  React.useEffect(() => {
    // Pop the icon when this tab becomes the current one (not on first mount).
    if (first.current) {
      first.current = false;
      return;
    }
    if (focused && !reduce) pop.set(withSequence(withTiming(0.82, { duration: 90 }), withSpring(1, springs.bouncy)));
  }, [focused, reduce, pop]);
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value * (1 - press.value * 0.08) }, { translateY: -press.value }],
  }));
  const color = focused ? c.link : c.muted;
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
      style={{ flex: 1, height: BAR_H, alignItems: "center", justifyContent: "center", gap: 2 }}
    >
      <Animated.View style={[{ height: PILL_H, alignItems: "center", justifyContent: "center" }, iconStyle]}>{Icon ? <Icon size={24} color={color} strokeWidth={focused ? 2.4 : 2} /> : null}</Animated.View>
      <T
        allowFontScaling={false}
        numberOfLines={1}
        style={{
          fontFamily: focused ? fonts.bold : fonts.semibold,
          fontSize: 12,
          lineHeight: 16,
          color,
        }}
      >
        {label}
      </T>
    </Pressable>
  );
}

/**
 * The bottom tab bar with motion: a soft pill sits behind the current tab's
 * icon and springs to the tab you press, stretching a little as it travels
 * (it reads as one thing moving, never two indicators crossing). The icon
 * pops on arrival and presses sink slightly. No haptic: switching tabs is
 * navigation. With Reduce Motion the pill jumps and nothing pops.
 *
 * Pass as `tabBar` to Expo Router's <Tabs>; give each screen
 * `options.tabBarIcon` as a plain icon component via `tabIcons`.
 */
export function MotionTabBar({ state, descriptors, emitter, navigateToTab, insets, icons }: BottomTabBarProps & { icons: Record<string, TabIcon> }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const kb = useKeyboardBar(BAR_H + insets.bottom);
  // Tell the toast how tall the bar is (nothing while it is behind the keyboard).
  React.useEffect(() => {
    if (kb.up) reportTabBar(0);
  }, [kb.up]);
  React.useEffect(() => () => reportTabBar(0), []);
  const n = state.routes.length;
  const itemW = useSharedValue(0);
  const x = useSharedValue(state.index);
  React.useEffect(() => {
    x.set(reduce ? state.index : withSpring(state.index, springs.snappy));
  }, [state.index, reduce, x]);
  const pill = useAnimatedStyle(() => {
    const w = itemW.value;
    const target = Math.round(x.value);
    // Stretch while travelling: up to 1.6x wide halfway between tabs.
    const travel = Math.min(1, Math.abs(x.value - target) * 2);
    return {
      opacity: w > 0 ? 1 : 0,
      transform: [{ translateX: x.value * w + (w - PILL_W) / 2 }, { scaleX: 1 + travel * 0.6 }, { scaleY: 1 - travel * 0.12 }],
    };
  });
  if (kb.up) return null;
  const pillColor = c.pill;
  return (
    <Animated.View onLayout={(e: LayoutChangeEvent) => reportTabBar(Math.round(e.nativeEvent.layout.height))} style={[{ backgroundColor: c.card, borderTopWidth: 1, borderColor: c.hairline, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }, kb.style]}>
      <View accessibilityRole="tablist" style={{ flexDirection: "row", height: BAR_H }} onLayout={(e: LayoutChangeEvent) => itemW.set(e.nativeEvent.layout.width / n)}>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              width: PILL_W,
              height: PILL_H,
              marginTop: (BAR_H - PILL_H - 18) / 2,
              borderRadius: PILL_H / 2,
              backgroundColor: pillColor,
            },
            pill,
          ]}
        />
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
 * Tab screens switch with Material's "fade through": the old tab fades out in
 * the first half, the new one fades in and rises 8px in the second half, so
 * two pages of text never show at once (220ms). Off with Reduce Motion.
 */
export function tabSceneOptions(reduce: boolean): Pick<BottomTabNavigationOptions, "animation" | "sceneStyleInterpolator" | "transitionSpec"> {
  if (reduce) return { animation: "none" };
  return {
    animation: "shift",
    transitionSpec: {
      animation: "timing",
      config: { duration: dur.tabOut + dur.tabIn, easing: RNEasing.bezier(0.2, 0, 0, 1) },
    },
    sceneStyleInterpolator: ({ current }: { current: { progress: RNAnimated.Value } }) => ({
      sceneStyle: {
        opacity: current.progress.interpolate({ inputRange: [-1, -0.5, 0, 0.5, 1], outputRange: [0, 0, 1, 0, 0] }),
        transform: [{ translateY: current.progress.interpolate({ inputRange: [-1, 0, 1], outputRange: [shift.tab, 0, shift.tab] }) }],
      },
    }),
  };
}
