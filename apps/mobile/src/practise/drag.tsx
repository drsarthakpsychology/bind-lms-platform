import * as React from "react";
import { type LayoutRectangle, type StyleProp, type ViewStyle } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { haptic } from "@/lib/haptics";

/**
 * Drag and drop, native: Gesture Handler moves the card on the UI thread
 * (Reanimated), and on release the drop point is tested against the drop
 * zones' measured boxes. Every drag target can also be tapped (select, then
 * tap a zone), so the game works with a screen reader and in tests.
 */
export type Zones = React.MutableRefObject<Record<string, LayoutRectangle>>;

type Measurable = { measureInWindow?: (cb: (x: number, y: number, width: number, height: number) => void) => void } | null;

export function useZones(): { zones: Zones; hit: (x: number, y: number) => string | null; measure: (id: string) => (ref: unknown) => void } {
  const zones = React.useRef<Record<string, LayoutRectangle>>({});
  const refs = React.useRef<Record<string, Measurable>>({});
  const hit = React.useCallback((x: number, y: number) => {
    // Measure again on drop: the board may have scrolled or reflowed.
    for (const [id, r] of Object.entries(zones.current)) if (x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height) return id;
    return null;
  }, []);
  const measure = React.useCallback(
    (id: string) => (node: unknown) => {
      const ref = node as Measurable;
      refs.current[id] = ref;
      if (!ref) {
        delete zones.current[id];
        return;
      }
      requestAnimationFrame(() => ref.measureInWindow?.((x, y, width, height) => (zones.current[id] = { x, y, width, height })));
    },
    [],
  );
  React.useEffect(() => {
    const again = () => Object.entries(refs.current).forEach(([id, ref]) => ref?.measureInWindow?.((x, y, width, height) => (zones.current[id] = { x, y, width, height })));
    const t = setInterval(again, 800);
    return () => clearInterval(t);
  }, []);
  return { zones, hit, measure };
}

/** A card that follows the finger and springs back unless dropped on a zone. */
export function Draggable({ children, onDrop, onLift, enabled = true, style, testID }: { children: React.ReactNode; onDrop: (x: number, y: number) => boolean; onLift?: (on: boolean) => void; enabled?: boolean; style?: StyleProp<ViewStyle>; testID?: string }) {
  const reduce = useReducedMotion();
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const lift = useSharedValue(0);
  const settle = React.useCallback(
    (ax: number, ay: number) => {
      const placed = onDrop(ax, ay);
      onLift?.(false);
      if (placed) haptic.success();
      else haptic.select();
    },
    [onDrop, onLift],
  );
  const liftOn = React.useCallback(() => {
    haptic.select();
    onLift?.(true);
  }, [onLift]);
  const pan = usePanGesture({
    enabled,
    minDistance: 4,
    onActivate: () => {
      "worklet";
      lift.value = withTiming(1, { duration: 120 });
      scheduleOnRN(liftOn);
    },
    onUpdate: (e) => {
      "worklet";
      x.value = e.translationX;
      y.value = e.translationY;
    },
    onDeactivate: (e) => {
      "worklet";
      scheduleOnRN(settle, e.absoluteX, e.absoluteY);
      x.value = withSpring(0, { damping: 18, stiffness: 220 });
      y.value = withSpring(0, { damping: 18, stiffness: 220 });
      lift.value = withTiming(0, { duration: 160 });
    },
  });
  const moved = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { translateY: y.value }, { scale: reduce ? 1 : 1 + lift.value * 0.04 }, { rotate: `${lift.value * -2}deg` }], zIndex: lift.value > 0 ? 10 : 0, shadowOpacity: lift.value * 0.25 }));
  return (
    <GestureDetector gesture={pan}>
      <Animated.View testID={testID} style={[{ shadowColor: "#000", shadowOffset: { width: 3, height: 3 }, shadowRadius: 0, elevation: 0 }, style, moved]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
