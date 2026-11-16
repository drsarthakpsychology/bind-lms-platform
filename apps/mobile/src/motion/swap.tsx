import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedReaction, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming, type SharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { curves, dur, shift } from "./tokens";

type Dir = -1 | 0 | 1;
type Props = {
  /** Changing this swaps the content (a question id, a round number). */
  k: string | number;
  /** Direction of travel: 1 = forward (new comes from the right), -1 = back, 0 = rises (default). */
  dir?: Dir;
  /** Style for the content's own box (gap, padding), same as the old keyed Animated.View. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLiveRegion?: "none" | "polite" | "assertive";
  children?: React.ReactNode;
};

/** Keeps its last rendered output while `frozen`, so a leaving layer never changes under the fade. */
const Hold = React.memo(
  function Hold({ node }: { node: React.ReactNode; frozen: boolean }) {
    return <>{node}</>;
  },
  (_a, b) => b.frozen,
);

/**
 * Keyed content that swaps without a blank frame. When `k` changes, the old
 * content stays on screen until the new one has laid out, then the old lifts
 * 6px and fades in 100ms while the new fades in and moves 8px from the
 * direction of travel in 180ms. Transform and opacity only, on the UI thread
 * (works in the web build too). Reduce Motion: the new content replaces the
 * old in the same frame, no movement.
 *
 *   <Swap k={q.id} dir={1} style={{ gap: space[4] }}>{question}</Swap>
 */
export function Swap({ k, dir = 0, style, testID, accessibilityLiveRegion, children }: Props) {
  const reduce = useReducedMotion();
  const painted = useSharedValue(0);
  const [st, setSt] = React.useState<{ cur: string | number; n: number; out: { k: string | number; n: number }[] }>({ cur: k, n: 0, out: [] });
  // Adjust state while rendering when the key changes (React's "store info from previous renders").
  if (st.cur !== k) {
    const n = st.n + 1;
    setSt({ cur: k, n, out: reduce ? [] : [...st.out, { k: st.cur, n: st.n }].slice(-2) });
  }
  const gone = React.useCallback((gen: number) => setSt((s) => ({ ...s, out: s.out.filter((o) => o.n !== gen) })), []);
  // Each layer is keyed by its generation, so a layer keeps its instance from live to leaving.
  const layers = [...st.out.map((o) => ({ key: o.k, n: o.n, live: false })), { key: st.cur, n: st.n, live: true }];
  return (
    <View testID={testID} accessibilityLiveRegion={accessibilityLiveRegion}>
      {layers.map((l) => (
        <Layer key={`${l.key}:${l.n}`} n={l.n} live={l.live} dir={dir} still={reduce || st.n === 0} painted={painted} onGone={gone} style={style}>
          <Hold frozen={!l.live} node={l.live ? children : null} />
        </Layer>
      ))}
    </View>
  );
}

function Layer({ n, live, dir, still, painted, onGone, style, children }: { n: number; live: boolean; dir: Dir; still: boolean; painted: SharedValue<number>; onGone: (gen: number) => void; style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  // The first content and Reduce Motion start in place; a swapped-in layer starts hidden.
  const [first] = React.useState(still);
  const o = useSharedValue(first ? 1 : 0);
  const x = useSharedValue(first ? 0 : dir * shift.swapIn);
  const y = useSharedValue(first || dir ? 0 : shift.swapIn);
  const leaving = useSharedValue(0);
  const onLayout = React.useCallback(() => {
    if (!live || first) return;
    const t = { duration: dur.swapIn, easing: curves.out };
    o.set(withTiming(1, t));
    x.set(withTiming(0, t));
    y.set(withTiming(0, t));
    painted.set(Math.max(painted.get(), n));
  }, [live, first, o, x, y, painted, n]);
  // Leave once the newer layer has painted (or after 250ms if it never reports a layout).
  useAnimatedReaction(
    () => painted.value,
    (p) => {
      if (live || leaving.get() || p <= n) return;
      leaving.set(1);
      const t = { duration: dur.swapOut, easing: curves.out };
      x.set(withTiming(-dir * shift.swapOut, t));
      y.set(withTiming(dir ? 0 : -shift.swapOut, t));
      o.set(
        withTiming(0, t, (done) => {
          if (done) scheduleOnRN(onGone, n);
        }),
      );
    },
  );
  React.useEffect(() => {
    if (live) return;
    const t = setTimeout(() => painted.set(Math.max(painted.get(), n + 1)), 250);
    return () => clearTimeout(t);
  }, [live, painted, n]);
  const anim = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ translateX: x.value }, { translateY: y.value }] }));
  return (
    <Animated.View
      onLayout={onLayout}
      pointerEvents={live ? "auto" : "none"}
      accessibilityElementsHidden={!live}
      importantForAccessibility={live ? "auto" : "no-hide-descendants"}
      style={[style, live ? null : { position: "absolute", top: 0, left: 0, right: 0 }, anim]}
    >
      {children}
    </Animated.View>
  );
}
