import * as React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

import { curves } from "./tokens";

/**
 * A line of text that rises out of a mask (the Welcome headline, game
 * titles): the line slides up from below its own box, clipped, so it reads
 * like type being set. `h` is the line's height. Transform only. Reduce
 * Motion: the line is simply there.
 *
 *   <MaskLine delay={380} h={32}><Text>Learn psychiatry</Text></MaskLine>
 */
export function MaskLine({ delay = 0, h, duration = 720, children }: { delay?: number; h: number; duration?: number; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const t = useSharedValue(reduce ? 1 : 0);
  React.useEffect(() => {
    if (reduce) return;
    t.set(withDelay(delay, withTiming(1, { duration, easing: curves.out })));
  }, [reduce, delay, duration, t]);
  const anim = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - t.value) * h }] }));
  return (
    <View style={{ overflow: "hidden", height: h + 4 }}>
      <Animated.View style={anim}>{children}</Animated.View>
    </View>
  );
}
