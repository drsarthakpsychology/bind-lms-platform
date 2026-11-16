import * as React from "react";
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { useTheme } from "@/theme";
import { presets } from "./enter";
import { curves, dur, shift } from "./tokens";

const BAND = 140;

/**
 * A soft light band that sweeps across a skeleton shape, left to right,
 * every 1.3s. Transform only, on the UI thread. Every skeleton mounted in
 * the same frame sweeps in step, so a whole screen shimmers as one.
 * Nothing moves with Reduce Motion.
 */
export function Shimmer() {
  const c = useTheme();
  const reduce = useReducedMotion();
  const w = useSharedValue(0);
  const t = useSharedValue(0);
  React.useEffect(() => {
    if (reduce) return;
    t.set(withRepeat(withDelay(200, withTiming(1, { duration: dur.shimmer, easing: Easing.inOut(Easing.quad) })), -1, false));
  }, [reduce, t]);
  const band = useAnimatedStyle(() => ({
    transform: [{ translateX: -BAND + t.value * (w.value + BAND * 2) }],
  }));
  if (reduce) return null;
  const hi = c.shimmer;
  return (
    <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }} onLayout={(e: LayoutChangeEvent) => w.set(e.nativeEvent.layout.width)}>
      <Animated.View style={[{ position: "absolute", top: 0, bottom: 0, width: BAND }, band]}>
        <Svg width={BAND} height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="sh" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={hi} stopOpacity={0} />
              <Stop offset="0.5" stopColor={hi} stopOpacity={1} />
              <Stop offset="1" stopColor={hi} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={BAND} height="100%" fill="url(#sh)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

/** True inside `LoadSwap`, which has already waited the 120ms. */
const Gated = React.createContext(false);

/**
 * Wraps a skeleton so it only shows when loading takes longer than 120ms
 * (a fast load never flashes grey), then fades in. Inside `LoadSwap` /
 * `Loaded` the wait has already happened, so it just fades in.
 */
export function SkeletonIn({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduce = useReducedMotion();
  const gated = React.useContext(Gated);
  return (
    <Animated.View entering={reduce ? undefined : presets.fade(gated ? 0 : dur.skeletonDelay)} style={style}>
      {children}
    </Animated.View>
  );
}

/**
 * Wraps loaded content so it settles in where the skeleton was: a fade with
 * a 6px rise (260ms, on the UI thread, also on web). Only the first
 * appearance animates. Reduce Motion: shown at once.
 */
export function Reveal({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduce = useReducedMotion();
  const v = useSharedValue(reduce ? 1 : 0);
  React.useEffect(() => {
    if (!reduce) v.set(withTiming(1, { duration: dur.enter, easing: curves.out }));
  }, [reduce, v]);
  const anim = useAnimatedStyle(() => ({ opacity: v.value, transform: [{ translateY: (1 - v.value) * shift.reveal }] }));
  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}

export type LoadPhase = "wait" | "skeleton" | "content";

/**
 * When to show a skeleton: nothing for the first 120ms (a quick load never
 * flashes grey); once it shows, it stays at least 380ms (no grey blink);
 * then the content. `revealed` is true when the content followed a wait, so
 * it should settle in with `Reveal`; saved data shows at once, still.
 */
export function useLoadGate(ready: boolean): { phase: LoadPhase; revealed: boolean } {
  const [st, setSt] = React.useState<{ phase: LoadPhase; at: number; revealed: boolean }>({ phase: ready ? "content" : "wait", at: 0, revealed: false });
  // Ready before the skeleton was due: straight to content (adjusted while rendering).
  if (ready && st.phase === "wait") setSt({ phase: "content", at: 0, revealed: true });
  if (!ready && st.phase === "content") setSt({ phase: "wait", at: 0, revealed: false });
  React.useEffect(() => {
    if (st.phase === "wait" && !ready) {
      const t = setTimeout(() => setSt({ phase: "skeleton", at: Date.now(), revealed: false }), dur.skeletonDelay);
      return () => clearTimeout(t);
    }
    if (st.phase === "skeleton" && ready) {
      const t = setTimeout(() => setSt({ phase: "content", at: 0, revealed: true }), Math.max(0, st.at + dur.skeletonMin - Date.now()));
      return () => clearTimeout(t);
    }
  }, [ready, st]);
  return { phase: st.phase, revealed: st.revealed };
}

/**
 * Loading to content in one part: nothing for 120ms, then the skeleton for
 * at least 380ms, then the content rises 6px into place. `Loaded` uses it.
 *
 *   <LoadSwap ready={!!q.data} skeleton={<LectureSkeleton />}>{q.data ? <Lecture d={q.data} /> : null}</LoadSwap>
 */
export function LoadSwap({ ready, skeleton, children, gap }: { ready: boolean; skeleton: React.ReactNode; children?: React.ReactNode; /** The parent column's gap, so several blocks keep their spacing inside the rising wrapper. */ gap?: number }) {
  const { phase, revealed } = useLoadGate(ready);
  if (phase === "wait") return null;
  if (phase === "skeleton") return <Gated.Provider value>{skeleton}</Gated.Provider>;
  return revealed ? <Reveal style={gap !== undefined ? { gap } : undefined}>{children}</Reveal> : <>{children}</>;
}
