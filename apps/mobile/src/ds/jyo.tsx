import * as React from "react";
import { View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";

import { useMotionTier } from "@/motion";
import { useTheme } from "@/theme";

/**
 * Jyo, the small clay lamp (Vibha means light). VIBHA's companion.
 *
 * WHERE JYO MAY APPEAR (rare moments only, at most once on a screen):
 *   - the welcome and the first sign in                      pose "hello"
 *   - an empty screen: nothing due, no notes, no doubts yet  pose "resting"
 *   - a real win: module finished, certificate earned,
 *     a full week of attendance                              pose "wellDone"
 *   - a first-time tip, once, with a way to dismiss it       pose "hello"
 *   - a wait longer than two seconds                         pose "thinking"
 *
 * WHERE JYO MUST NEVER APPEAR:
 *   - inside a case, a patient story, or anything about risk or self harm
 *   - on medicines, doses and reference notes
 *   - on attendance results, leave decisions, errors, "you missed this"
 *   - anywhere in admin or the lead doctor's screens
 *   - on certificates; next to a button as decoration; twice on one screen
 *
 * Motion: the flame sways gently for three breaths when Jyo arrives, then
 * rests (decorative loops never run forever). It runs on the UI thread
 * (transform only). Reduce Motion and low-end Android get the still frame.
 */
export type JyoPose = "hello" | "thinking" | "wellDone" | "resting";

const FLAME: Record<JyoPose, { scale: number; lean: number }> = {
  hello: { scale: 1, lean: 0 },
  thinking: { scale: 0.8, lean: 14 },
  wellDone: { scale: 1.2, lean: 0 },
  resting: { scale: 0.4, lean: 0 },
};

export function Jyo({ pose = "hello", size = 72, still, label, testID = "jyo" }: { pose?: JyoPose; /** Width and height in px. 40 to 56 inline, 72 to 120 as an illustration. */ size?: number; /** Never animate (lists, screenshots). */ still?: boolean; /** Read aloud; leave out when the text beside it already says it. */ label?: string; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  const f = FLAME[pose];
  const sway = useSharedValue(0);
  const calm = !!still || !!reduce || low || pose === "resting";
  React.useEffect(() => {
    if (calm) {
      sway.set(0);
      return;
    }
    const half = { duration: 520, easing: Easing.inOut(Easing.sin) };
    // Three slow breaths, then still.
    sway.set(withDelay(300, withRepeat(withSequence(withTiming(1, half), withTiming(-1, { ...half, duration: 1040 }), withTiming(0, half)), 3, false)));
  }, [calm, pose, sway]);
  const flame = useAnimatedStyle(() => ({
    transform: [{ rotate: `${f.lean + sway.value * 4}deg` }, { scaleX: f.scale * (1 - Math.abs(sway.value) * 0.04) }, { scaleY: f.scale * (1 + Math.abs(sway.value) * 0.06) }],
  }));
  const blue = c.dark ? "#6d8aff" : "#1d44d8";
  const limeEdge = c.dark ? "#e6ff8a" : "#8eae14";
  const eyeY = 82;
  const happy = pose === "wellDone";
  const shut = pose === "resting";
  const look = pose === "thinking" ? { x: 1.4, y: -1.8 } : { x: 0, y: 0 };
  const eye = (x: number) =>
    shut ? (
      <G key={x}>
        <Ellipse cx={x} cy={eyeY} rx={5.4} ry={3.2} fill="#fff" />
        <Path d={`M${x - 3} ${eyeY} h6`} stroke="#14151a" strokeWidth={1.9} strokeLinecap="round" />
      </G>
    ) : happy ? (
      <G key={x}>
        <Circle cx={x} cy={eyeY} r={5.4} fill="#fff" />
        <Path d={`M${x - 3} ${eyeY + 1.2} q3 -4.2 6 0`} stroke="#14151a" strokeWidth={1.9} strokeLinecap="round" fill="none" />
      </G>
    ) : (
      <G key={x}>
        <Circle cx={x} cy={eyeY} r={5.4} fill="#fff" />
        <Circle cx={x + look.x} cy={eyeY + look.y} r={2.5} fill="#14151a" />
      </G>
    );
  return (
    <View testID={testID} accessible={!!label} accessibilityRole={label ? "image" : undefined} accessibilityLabel={label} importantForAccessibility={label ? "yes" : "no-hide-descendants"} style={{ width: size, height: size }}>
      {/* The flame: its own layer, so only a transform changes per frame. Pivots at the wick. */}
      <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width: size, height: size * (66 / 120), transformOrigin: "bottom" }, flame]}>
        <Svg width={size} height={size * (66 / 120)} viewBox="0 0 120 66">
          {happy ? <Path d="M60 8v-5M34 22l-6-5M86 22l6-5M26 44h-7M94 44h7" stroke={limeEdge} strokeWidth={2.6} strokeLinecap="round" /> : null}
          <Path d="M60 66 C43 58 46 40 60 20 C74 40 77 58 60 66 Z" fill="#cdf24b" stroke={limeEdge} strokeWidth={1.6} strokeLinejoin="round" />
          <Path d="M60 62 C53 57 55 48 60 40 C65 48 67 57 60 62 Z" fill="#fff" opacity={0.8} />
        </Svg>
      </Animated.View>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Ellipse cx={60} cy={108} rx={34} ry={4} fill={c.dark ? "rgba(0,0,0,0.35)" : "rgba(20,21,26,0.12)"} />
        {pose === "thinking" ? (
          <>
            <Circle cx={92} cy={30} r={2.4} fill={blue} />
            <Circle cx={100} cy={20} r={3.4} fill={blue} />
          </>
        ) : null}
        <Path d="M16 68 Q60 58 104 68 Q101 100 60 102 Q19 100 16 68 Z" fill={blue} />
        <Path d="M100 66 l13 -7 -5 13 Z" fill={blue} />
        <Path d="M30 72 Q60 66 90 72" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.35} fill="none" />
        {eye(48)}
        {eye(72)}
        {happy ? <Path d="M54 90 q6 8 12 0 Z" fill="#fff" /> : <Path d={pose === "thinking" ? "M56 92 h7" : shut ? "M57 92 q3 2 6 0" : "M55 91 q5 4 10 0"} stroke="#fff" strokeWidth={2} strokeLinecap="round" fill="none" />}
      </Svg>
    </View>
  );
}
