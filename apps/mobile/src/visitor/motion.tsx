/**
 * Motion pieces for the signed-out screens (Welcome, Request, Sign in, PIN).
 * Kept here, not in the shared kit, so this work cannot clash with the app's
 * motion kit; the two can be merged later.
 *
 * Rules (Screenrove motion guidelines, Emil Kowalski): only transform and
 * opacity move; strong ease-out for entering; presses answer in about 120ms;
 * scroll motion is tied to the finger (it plays backwards when you scroll
 * back); with Reduce Motion everything is simply in place.
 */
import * as React from "react";
import { Pressable, Text, View, type LayoutChangeEvent, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

/** The brand's two colours, fixed in both themes (the website's blue and lime panels). */
export const BLUE = "#1d44d8";
export const LIME = "#cdf24b";
export const INK = "#111111";

/** Quintic ease-out: anything entering. */
export const easeOut = Easing.bezier(0.23, 1, 0.32, 1);
/** A light spring for presses and pops. */
export const snappy = { damping: 18, stiffness: 260, mass: 0.6 } as const;
/** A spring with a little bounce, for rare delight (a stamp, a check). */
export const bouncy = { damping: 11, stiffness: 180, mass: 0.7 } as const;

/* -------------------------------------------------------------- the stage */

type Stage = { y: SharedValue<number>; vh: SharedValue<number>; reduce: boolean };
const StageCtx = React.createContext<Stage | null>(null);
const ChapterCtx = React.createContext<SharedValue<number> | null>(null);

/** Wraps a scrolling story: `y` is the scroll offset, `vh` the visible height. */
export function ScrollStage({ y, vh, children }: { y: SharedValue<number>; vh: SharedValue<number>; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const value = React.useMemo(() => ({ y, vh, reduce }), [y, vh, reduce]);
  return <StageCtx.Provider value={value}>{children}</StageCtx.Provider>;
}

function useStage(): Stage {
  const s = React.useContext(StageCtx);
  if (!s) throw new Error("ScrollStage missing");
  return s;
}

/** The scroll offset of the story (for pieces that move with it directly). */
export function useScrollY(): SharedValue<number> {
  return useStage().y;
}

/** A chapter of the story. Must be a direct child of the scroll content, so its y is the scroll position it starts at. */
export function Chapter({ children, style, testID, onTop }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; testID?: string; /** Reports the chapter's top (for the progress line). */ onTop?: (y: number) => void }) {
  const top = useSharedValue(0);
  const onLayout = (e: LayoutChangeEvent) => {
    top.set(e.nativeEvent.layout.y);
    onTop?.(e.nativeEvent.layout.y);
  };
  return (
    <ChapterCtx.Provider value={top}>
      <View testID={testID} onLayout={onLayout} style={style}>
        {children}
      </View>
    </ChapterCtx.Provider>
  );
}

/**
 * 0 when the element's top is at the bottom edge of the screen, 1 once it has
 * come `span` points further up. Tied to scrolling, so it reverses.
 */
function useProgress(local: SharedValue<number>, lag: number, span: number): SharedValue<number> {
  const { y, vh } = useStage();
  const top = React.useContext(ChapterCtx);
  return useDerivedValue(() => {
    const at = (top ? top.value : 0) + local.value + lag;
    return interpolate(y.value + vh.value * 0.92 - at, [0, span], [0, 1], Extrapolation.CLAMP);
  });
}

type RevealKind = "up" | "left" | "right" | "scale" | "fade";

/** Rises (or slides) into place as it scrolls into view. */
export function Reveal({ children, kind = "up", lag = 0, span = 160, style, testID }: { children: React.ReactNode; kind?: RevealKind; /** Start a little later (points), for a stagger. */ lag?: number; span?: number; style?: StyleProp<ViewStyle>; testID?: string }) {
  const { reduce } = useStage();
  const local = useSharedValue(0);
  const p = useProgress(local, lag, span);
  const anim = useAnimatedStyle(() => {
    if (reduce) return { opacity: 1 };
    const v = p.value;
    const e = 1 - Math.pow(1 - v, 3);
    switch (kind) {
      case "left":
        return { opacity: v, transform: [{ translateX: (1 - e) * -36 }] };
      case "right":
        return { opacity: v, transform: [{ translateX: (1 - e) * 36 }] };
      case "scale":
        return { opacity: v, transform: [{ scale: 0.9 + e * 0.1 }] };
      case "fade":
        return { opacity: v };
      default:
        return { opacity: v, transform: [{ translateY: (1 - e) * 32 }] };
    }
  });
  return (
    <Animated.View testID={testID} onLayout={(e) => local.set(e.nativeEvent.layout.y)} style={[style, anim]}>
      {children}
    </Animated.View>
  );
}

/** Moves at a different speed from the page: `speed` 0.2 drifts down slowly, -0.2 rises faster. `spin` turns it (degrees per 100pt). */
export function Parallax({ children, speed = 0.2, spin = 0, style }: { children: React.ReactNode; speed?: number; spin?: number; style?: StyleProp<ViewStyle> }) {
  const { y, reduce } = useStage();
  const top = React.useContext(ChapterCtx);
  const anim = useAnimatedStyle(() => {
    if (reduce) return {};
    const d = y.value - (top ? top.value : 0);
    return { transform: [{ translateY: d * speed }, { rotate: `${(d / 100) * spin}deg` }] };
  });
  return (
    <Animated.View pointerEvents="none" style={[style, anim]}>
      {children}
    </Animated.View>
  );
}

/**
 * A number whose digits roll up from 0 like a counter as it scrolls into
 * view. Pixel digits. Screen readers hear the plain number.
 */
export function DigitRoll({ value, size = 44, color, lag = 0 }: { value: string; size?: number; color: string; lag?: number }) {
  const { reduce } = useStage();
  const local = useSharedValue(0);
  const p = useProgress(local, lag, 200);
  const lh = Math.round(size * 1.15);
  const text: TextStyle = { fontFamily: "PixDigits", fontSize: size, lineHeight: lh, color, height: lh, textAlign: "center" };
  return (
    <View onLayout={(e) => local.set(e.nativeEvent.layout.y)} accessible accessibilityRole="text" accessibilityLabel={value} style={{ flexDirection: "row", height: lh, overflow: "hidden" }}>
      {value.split("").map((ch, i) => {
        const d = Number(ch);
        if (Number.isNaN(d) || ch === " ") {
          return (
            <Text key={i} allowFontScaling={false} style={text}>
              {ch}
            </Text>
          );
        }
        return <Digit key={i} d={d} i={i} lh={lh} text={text} p={p} reduce={reduce} />;
      })}
    </View>
  );
}

function Digit({ d, i, lh, text, p, reduce }: { d: number; i: number; lh: number; text: TextStyle; p: SharedValue<number>; reduce: boolean }) {
  const anim = useAnimatedStyle(() => {
    const raw = reduce ? 1 : p.value;
    // Later digits finish a touch later: a little cascade.
    const v = Math.min(1, Math.max(0, raw * 1.15 - i * 0.08));
    const e = 1 - Math.pow(1 - v, 3);
    return { transform: [{ translateY: -d * lh * e }] };
  });
  return (
    <Animated.View style={anim} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {Array.from({ length: 10 }, (_, n) => (
        <Text key={n} allowFontScaling={false} style={text}>
          {n}
        </Text>
      ))}
    </Animated.View>
  );
}

/* ------------------------------------------------------ the opening moment */

/**
 * A value that runs 0 to 1 once, after `delay` ms, on mount: drives the
 * opening sequence. Reduce Motion: starts at 1.
 */
export function useIntro(delay: number, duration = 700): SharedValue<number> {
  const reduce = useReducedMotion();
  const v = useSharedValue(reduce ? 1 : 0);
  React.useEffect(() => {
    if (reduce) return;
    v.set(withDelay(delay, withTiming(1, { duration, easing: easeOut })));
  }, [reduce, delay, duration, v]);
  return v;
}

/** Same, on a spring (pops with a little overshoot). */
export function useIntroSpring(delay: number, cfg: { damping: number; stiffness: number; mass: number } = bouncy): SharedValue<number> {
  const reduce = useReducedMotion();
  const v = useSharedValue(reduce ? 1 : 0);
  React.useEffect(() => {
    if (reduce) return;
    v.set(withDelay(delay, withSpring(1, cfg)));
  }, [reduce, delay, cfg, v]);
  return v;
}

/* ---------------------------------------------------------------- presses */

/** Anything tappable: shrinks to 0.97 while held, on a quick spring. */
export function Press({ children, style, scaleTo = 0.97, ...rest }: Omit<PressableProps, "style" | "children"> & { children: React.ReactNode; style?: StyleProp<ViewStyle>; scaleTo?: number }) {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        if (!reduce) s.set(withSpring(scaleTo, snappy));
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        s.set(reduce ? 1 : withSpring(1, snappy));
        rest.onPressOut?.(e);
      }}
    >
      <Animated.View style={[style, anim]}>{children}</Animated.View>
    </Pressable>
  );
}
