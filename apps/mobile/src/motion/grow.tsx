import * as React from "react";
import { Dimensions, type StyleProp, type View, type ViewStyle } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";

import { stackDur, type StackMotion } from "./stack";
import { useMotionTier } from "./tier";
import { curves } from "./tokens";

/**
 * "What you tap becomes what you see next", the cheap way (no shared-element
 * machinery). A pressed card notes where it is on screen; the screen that
 * opens next grows out of that place: it starts at the card's size and spot,
 * with the card's round corners, and opens to full size on the sheet curve.
 * One animated view (the screen's root), transform, opacity and corner radius
 * only, on the UI thread.
 *
 *   const ref = useCardRef();
 *   <Card ref... onPress={() => growFrom(ref, () => router.push("/lecture/l5"))} />
 *
 * The route must use `growOr(route.key, m.push)` for its stack animation (see
 * app/_layout.tsx), so the native slide does not fight the grow. Going back,
 * the screen fades out over the page it came from (the native stack cannot be
 * held while a swipe back is under way, so a true shrink is not attempted).
 *
 * Reduce Motion: a short fade, no growth. Low-end Android: the same.
 * A screen opened any other way (a row, a link, a notification) slides in from
 * the side as usual.
 */
type Rect = { x: number; y: number; w: number; h: number };
/** Anything that can say where it is on screen (a View). */
export type Measurable = { measureInWindow?: (cb: (x: number, y: number, w: number, h: number) => void) => void };
/** The ref to put on the card that grows (`Stone ref={ref}`), then pass to `growFrom`. */
export type CardRef = React.ComponentRef<typeof View>;
export function useCardRef() {
  return React.useRef<CardRef>(null);
}

let mark: { rect: Rect; at: number } | null = null;
const WINDOW = 600;

function pending(): Rect | null {
  return mark && Date.now() - mark.at < WINDOW ? mark.rect : null;
}

/** Notes where the pressed card is, then runs `open` (a `router.push`). Falls back to a plain open if it cannot be measured. */
export function growFrom(ref: React.RefObject<Measurable | null>, open: () => void): void {
  const node = ref.current;
  if (!node || typeof node.measureInWindow !== "function") {
    open();
    return;
  }
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    open();
  };
  node.measureInWindow((x, y, w, h) => {
    if (w > 0 && h > 0 && [x, y, w, h].every(Number.isFinite)) mark = { rect: { x, y, w, h }, at: Date.now() };
    go();
  });
  // A view that never answers (off screen, unmounted) must not swallow the tap.
  setTimeout(go, 80);
}

const decided = new Map<string, boolean>();
/** The stack motion for a route that can grow out of a card: a short fade under the grow when a card was just pressed, else `normal`. Decided once per visit, so going back matches. */
export function growOr(routeKey: string, normal: StackMotion, reduce = false): StackMotion {
  if (!decided.has(routeKey)) {
    if (decided.size > 60) decided.clear();
    decided.set(routeKey, !reduce && pending() !== null);
  }
  return decided.get(routeKey) ? { animation: "fade", animationDuration: stackDur.fade, gestureEnabled: true } : normal;
}

/** The animated style for the root of a screen that may have grown out of a card. Plain (no style) otherwise. */
export function useGrowIn(): StyleProp<ViewStyle> | null {
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  // Read once, on the first render of the screen that opens.
  const [from] = React.useState<Rect | null>(() => {
    const r = pending();
    if (r) mark = null;
    return r;
  });
  const on = !!from && !reduce && !low;
  const p = useSharedValue(on ? 0 : 1);
  React.useEffect(() => {
    if (on) p.set(withTiming(1, { duration: 440, easing: curves.sheet }));
  }, [on, p]);
  const win = Dimensions.get("window");
  const style = useAnimatedStyle(() => {
    if (!from) return { opacity: 1 };
    const s = Math.max(0.3, Math.min(1, from.w / win.width));
    const dx = from.x + from.w / 2 - win.width / 2;
    const dy = from.y + from.h / 2 - win.height / 2;
    const k = 1 - p.value;
    return {
      opacity: interpolate(p.value, [0, 0.25], [0, 1], "clamp"),
      borderRadius: 26 * k,
      overflow: p.value < 1 ? ("hidden" as const) : ("visible" as const),
      transform: [{ translateX: dx * k }, { translateY: dy * k }, { scale: s + (1 - s) * p.value }],
    };
  });
  return on ? (style as unknown as StyleProp<ViewStyle>) : null;
}

/** For a screen that does not use `Screen` from the kit: wrap its root in this. */
export function GrowIn({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const grow = useGrowIn();
  return <Animated.View style={[{ flex: 1 }, style, grow]}>{children}</Animated.View>;
}
