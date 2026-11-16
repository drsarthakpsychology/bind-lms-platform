import * as React from "react";
import { View, type LayoutChangeEvent, type StyleProp, type TextStyle } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSpring } from "react-native-reanimated";

import { T, type TProps } from "@/ds/text";
import { springs } from "./tokens";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** One digit place: a clipped column of 0 to 9 that rolls to its digit on a light spring. */
function Column({ digit, from, delay, v, tone, style }: { digit: number; from: number; delay: number; v: TProps["v"]; tone: TProps["tone"]; style?: StyleProp<TextStyle> }) {
  const reduce = useReducedMotion();
  const h = useSharedValue(0);
  const d = useSharedValue(reduce ? digit : from);
  React.useEffect(() => {
    d.set(reduce ? digit : withDelay(delay, withSpring(digit, springs.digit)));
  }, [digit, delay, reduce, d]);
  const roll = useAnimatedStyle(() => ({ transform: [{ translateY: -d.value * h.value }] }));
  return (
    <View style={{ overflow: "hidden" }}>
      {/* sizes the column; invisible */}
      <T v={v} num style={[style, { opacity: 0 }]} onLayout={(e: LayoutChangeEvent) => h.set(e.nativeEvent.layout.height)}>
        0
      </T>
      <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0 }, roll]}>
        {DIGITS.map((n) => (
          <T key={n} v={v} tone={tone} num style={style}>
            {n}
          </T>
        ))}
      </Animated.View>
    </View>
  );
}

/**
 * A number whose digits roll into place (counting up from zero the first
 * time, then from the old value). Tabular figures, so nothing next to it
 * shifts. Commas, signs, "%" and words stay still. Screen readers hear the
 * final value only. With Reduce Motion it simply shows the number.
 *
 * `<RollingNumber value={86} suffix="%" v="h1" />`
 */
export function RollingNumber({ value, prefix = "", suffix = "", v = "h2", tone, style, format = (n) => String(n), testID }: { value: number; prefix?: string; suffix?: string; v?: TProps["v"]; tone?: TProps["tone"]; style?: StyleProp<TextStyle>; format?: (n: number) => string; testID?: string }) {
  const reduce = useReducedMotion();
  const text = `${prefix}${format(Math.round(value))}${suffix}`;
  if (reduce) {
    return (
      <T v={v} tone={tone} num style={style} testID={testID}>
        {text}
      </T>
    );
  }
  const chars = text.split("");
  const digitCount = chars.filter((ch) => ch >= "0" && ch <= "9").length;
  let place = 0;
  return (
    <View testID={testID} accessible accessibilityLabel={text} accessibilityRole="text" style={{ flexDirection: "row", alignItems: "flex-end" }}>
      {chars.map((ch, i) => {
        if (ch >= "0" && ch <= "9") {
          const k = place++;
          // Keyed from the right, so 99 -> 100 keeps the units column rolling.
          return <Column key={`d${digitCount - k}`} digit={Number(ch)} from={0} delay={(digitCount - 1 - k) * 30} v={v} tone={tone} style={style} />;
        }
        return (
          <T key={`c${i}`} v={v} tone={tone} num style={style}>
            {ch}
          </T>
        );
      })}
    </View>
  );
}
