import * as React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

import { T } from "@/ds";
import { curves, dur, RollingNumber } from "@/motion";
import { fixed, fonts, space } from "@/theme";
import { InkUnderline } from "@/moments/ink";

/**
 * The lecture intro (storyboard 5), over the black video area until the
 * first Play: "LECTURE 5" in the pixel font with its number rolling in
 * (300ms), "Week 3" fading up, and a lime ink underline drawing itself from
 * 150ms. It sits in the top corner and never takes touches, so Play works
 * from the first frame; pressing Play fades it away. With Reduce Motion it
 * is simply there.
 */
export type IntroInfo = { number: number | null; week: number };

const LIME = fixed.lime;

export function LectureIntro({ info, gone }: { info: IntroInfo; gone: boolean }) {
  const reduce = useReducedMotion();
  const week = useSharedValue(reduce ? 1 : 0);
  const out = useSharedValue(1);
  React.useEffect(() => {
    if (!reduce) week.set(withDelay(dur.press, withTiming(1, { duration: dur.enter, easing: curves.out })));
  }, [reduce, week]);
  React.useEffect(() => {
    out.set(withTiming(gone ? 0 : 1, { duration: dur.exit, easing: curves.out }));
  }, [gone, out]);
  const weekStyle = useAnimatedStyle(() => ({ opacity: week.value, transform: [{ translateY: (1 - week.value) * 8 }] }));
  const outStyle = useAnimatedStyle(() => ({ opacity: out.value }));
  const big = { fontFamily: fonts.pixel, fontSize: 22, lineHeight: 28, color: LIME, letterSpacing: 1 };
  const label = `${info.number ? `Lecture ${info.number}, ` : ""}Week ${info.week}`;
  return (
    <Animated.View pointerEvents="none" accessible accessibilityLabel={label} testID="lecture-intro" style={[{ position: "absolute", top: space[3], left: space[4] }, outStyle]}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: space[2] }}>
        <T style={big} maxFontSizeMultiplier={1.1}>
          {info.number ? "LECTURE" : `WEEK ${info.week}`}
        </T>
        {info.number ? <RollingNumber value={info.number} style={{ ...big, fontFamily: fonts.pixelDigits }} /> : null}
      </View>
      <InkUnderline width={info.number ? 132 : 104} color={LIME} delay={150} k={`lecture-${info.number ?? info.week}`} />
      {info.number ? (
        <Animated.View style={weekStyle}>
          <T v="small" style={{ color: "rgba(255,255,255,0.8)", paddingTop: space[1] }}>
            Week {info.week}
          </T>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}
