import * as React from "react";
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

import { haptic } from "@/lib/haptics";
import { dur, springs } from "./tokens";

type Feel = "select" | "tap" | "none";

/**
 * The press feel as a hook, for parts that keep their own Pressable:
 * spread `handlers` on the Pressable and put `style` on an Animated.View
 * inside it. Scale runs on the UI thread with a spring, so it stays smooth
 * while the JS thread is busy. With Reduce Motion it dims instead of scaling.
 */
export function usePressScale(to = 0.97, /** Squish like something soft: wider and flatter while held, a small wobble on release. For pebbles and round buttons. */ squish = false) {
  const reduce = useReducedMotion();
  const p = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    if (reduce) return { opacity: 1 - p.value * 0.3 };
    if (squish) return { transform: [{ scaleX: 1 + p.value * (1 - to) * 0.5 }, { scaleY: 1 - p.value * (1 - to) * 1.4 }] };
    return { transform: [{ scale: 1 - p.value * (1 - to) }] };
  });
  const handlers = React.useMemo(
    () => ({
      onPressIn: () => {
        p.set(reduce ? withTiming(1, { duration: dur.micro }) : withSpring(1, springs.press));
      },
      onPressOut: () => {
        p.set(reduce ? withTiming(0, { duration: dur.micro }) : withSpring(0, squish ? springs.bouncy : springs.press));
      },
    }),
    [p, reduce, squish],
  );
  return { style, handlers };
}

export type PressProps = Omit<PressableProps, "style" | "children"> & {
  children?: React.ReactNode;
  /** Outer box (size, margins, position). */
  style?: StyleProp<ViewStyle>;
  /** The part that scales (background, border, padding). */
  innerStyle?: StyleProp<ViewStyle>;
  /** How far it shrinks: 0.97 for rows and cards, 0.92 for small icons. */
  scale?: number;
  /** The haptic on press: none (default; plain navigation has none), "select" for picking a choice, "tap" for an action that commits. */
  feel?: Feel;
  /** Soft squish instead of an even shrink (pebbles, round buttons). */
  squish?: boolean;
};

/**
 * Anything you can press that is not a Button: scales to 0.97 on a stiff
 * spring while held (so the screen feels like it is listening). No haptic
 * unless `feel` asks for one: opening things is not a haptic moment. Use it for cards, tiles, icon buttons and custom rows.
 */
export function Press({ children, style, innerStyle, scale = 0.97, feel = "none", squish, onPress, onPressIn, onPressOut, ...rest }: PressProps) {
  const { style: anim, handlers } = usePressScale(scale, squish);
  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        handlers.onPressIn();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        handlers.onPressOut();
        onPressOut?.(e);
      }}
      onPress={
        onPress
          ? (e) => {
              if (feel === "select") haptic.select();
              else if (feel === "tap") haptic.tap();
              onPress(e);
            }
          : undefined
      }
      style={style}
    >
      <Animated.View style={[innerStyle, anim]}>{children}</Animated.View>
    </Pressable>
  );
}
