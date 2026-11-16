/**
 * Form pieces for the signed-out screens: a field whose frame wakes up on
 * focus (ink border, a lime block shadow slides out behind it), shakes once
 * on an error, and a submit button that turns into a spinner and then a tick.
 */
import { Eye, EyeOff } from "lucide-react-native";
import * as React from "react";
import { ActivityIndicator, Pressable, TextInput, View, type TextInputProps } from "react-native";
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming, type SharedValue } from "react-native-reanimated";
import Svg from "react-native-svg";

import { T } from "@/ds";
import { DrawInk } from "@/motion";
import { fonts, layout, space, type as scale, useTheme } from "@/theme";
import { INK, LIME, bouncy, easeOut, snappy } from "./motion";

/** Moves a view side to side once when `n` changes (a wrong answer). */
export function useShake(n: number) {
  const reduce = useReducedMotion();
  const x = useSharedValue(0);
  React.useEffect(() => {
    if (!n || reduce) return;
    x.set(withSequence(withTiming(-9, { duration: 45 }), withTiming(9, { duration: 70 }), withTiming(-6, { duration: 60 }), withTiming(4, { duration: 55 }), withTiming(0, { duration: 50 })));
  }, [n, reduce, x]);
  return useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
}

export type AuthFieldProps = Omit<TextInputProps, "style"> & {
  label: string;
  error?: string | null;
  hint?: string;
  secret?: boolean;
  /** Several lines (a message). */
  area?: boolean;
  icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  inputRef?: React.Ref<React.ComponentRef<typeof TextInput>>;
  testID?: string;
};

export function AuthField({ label, error, hint, secret, area, icon: Icon, inputRef, onFocus, onBlur, testID, ...rest }: AuthFieldProps) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [show, setShow] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const f = useSharedValue(0);
  const bad = useSharedValue(0);
  const [shakes, setShakes] = React.useState(0);
  const prevError = React.useRef<string | null | undefined>(null);
  React.useEffect(() => {
    bad.set(withTiming(error ? 1 : 0, { duration: 160 }));
    if (error && error !== prevError.current) setShakes((s) => s + 1);
    prevError.current = error;
  }, [error, bad]);
  const shake = useShake(shakes);

  const line = c.dark ? "rgba(255,255,255,0.28)" : "rgba(17,17,17,0.24)";
  const frame = useAnimatedStyle(() => ({
    borderColor: bad.value > 0.5 ? c.danger : interpolateColor(f.value, [0, 1], [line, c.dark ? "#ffffff" : INK]),
    transform: [{ translateX: -f.value * 2 }, { translateY: -f.value * 2 }],
  }));
  const block = useAnimatedStyle(() => ({ opacity: f.value * (1 - bad.value), transform: [{ translateX: interpolate(f.value, [0, 1], [0, 2]) }, { translateY: interpolate(f.value, [0, 1], [0, 2]) }] }));

  return (
    <Animated.View style={[{ gap: space[2] }, shake]}>
      <T v="small" style={{ fontFamily: fonts.semibold, color: error ? c.danger : focused ? c.ink : c.muted }}>
        {label}
      </T>
      <View>
        <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 3, top: 3, right: -3, bottom: -3, borderRadius: layout.radius + 2, backgroundColor: LIME, borderWidth: 2, borderColor: INK }, block]} />
        <Animated.View style={[{ flexDirection: "row", alignItems: area ? "flex-start" : "center", minHeight: area ? 128 : 56, borderRadius: layout.radius + 2, borderWidth: 2, backgroundColor: c.card, paddingLeft: Icon ? space[3] : space[4], paddingRight: space[2], gap: space[3] }, frame]}>
          {Icon ? <Icon size={20} color={error ? c.danger : focused ? c.ink : c.muted} strokeWidth={2.2} /> : null}
          <TextInput
            ref={inputRef}
            testID={testID}
            accessibilityLabel={label}
            accessibilityHint={error ?? hint}
            placeholderTextColor={c.muted}
            selectionColor={c.brand}
            cursorColor={c.link}
            secureTextEntry={secret && !show}
            multiline={area}
            textAlignVertical={area ? "top" : "center"}
            maxFontSizeMultiplier={1.4}
            {...rest}
            onFocus={(e) => {
              setFocused(true);
              f.set(reduce ? 1 : withSpring(1, snappy));
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              f.set(reduce ? 0 : withTiming(0, { duration: 160, easing: easeOut }));
              onBlur?.(e);
            }}
            style={[scale.body, { flex: 1, color: c.ink, minHeight: area ? 124 : layout.target, paddingVertical: area ? space[3] : 0 }, { outlineStyle: "none" } as object]}
          />
          {secret ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={show ? "Hide password" : "Show password"}
              onPress={() => {
                setShow((s) => !s);
              }}
              hitSlop={6}
              style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}
            >
              {show ? <EyeOff size={20} color={c.muted} /> : <Eye size={20} color={c.muted} />}
            </Pressable>
          ) : null}
        </Animated.View>
      </View>
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite" testID={testID ? `${testID}-error` : undefined}>
          {error}
        </T>
      ) : hint ? (
        <T v="small" tone="muted">
          {hint}
        </T>
      ) : null}
    </Animated.View>
  );
}

/**
 * The big lime button with the hard shadow, with three faces: the label,
 * a spinner while it works, a tick when it worked. The faces cross-fade in
 * place, so the button never changes size.
 */
export function SubmitButton({ label, busyLabel, doneLabel, state, onPress, testID }: { label: string; busyLabel: string; doneLabel: string; state: "idle" | "busy" | "done"; onPress: () => void; testID?: string }) {
  const reduce = useReducedMotion();
  const down = useSharedValue(0);
  const face = useSharedValue(0); // 0 idle, 1 busy, 2 done
  React.useEffect(() => {
    const to = state === "idle" ? 0 : state === "busy" ? 1 : 2;
    face.set(reduce ? to : state === "done" ? withSpring(to, bouncy) : withTiming(to, { duration: 180, easing: easeOut }));
  }, [state, reduce, face]);
  const moved = useAnimatedStyle(() => ({ transform: [{ translateX: down.value * 3 }, { translateY: down.value * 3 }] }));
  const blocked = state !== "idle";
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={state === "idle" ? label : state === "busy" ? busyLabel : doneLabel}
      accessibilityState={{ busy: state === "busy", disabled: blocked }}
      disabled={blocked}
      onPressIn={() => down.set(reduce ? 1 : withTiming(1, { duration: 100 }))}
      onPressOut={() => down.set(reduce ? 0 : withTiming(0, { duration: 120 }))}
      onPress={() => {
        onPress();
      }}
      style={{ paddingRight: 3, paddingBottom: 3 }}
    >
      <View pointerEvents="none" style={{ position: "absolute", left: 3, top: 3, right: 0, bottom: 0, borderRadius: layout.radius + 2, backgroundColor: INK }} />
      <Animated.View style={[{ height: 56, borderRadius: layout.radius + 2, borderWidth: 2, borderColor: INK, backgroundColor: LIME, overflow: "hidden" }, moved]}>
        <Layer n={0} face={face}>
          <T v="button" style={{ color: INK, fontSize: 17 }}>
            {label}
          </T>
        </Layer>
        <Layer n={1} face={face}>
          <ActivityIndicator size="small" color={INK} />
          <T v="button" style={{ color: INK }}>
            {busyLabel}
          </T>
        </Layer>
        <Layer n={2} face={face}>
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: INK, alignItems: "center", justifyContent: "center" }}>
            {/* The tick draws itself on in lime ink as the done face lands (drawn in full with Reduce Motion). */}
            {state === "done" ? (
              <Svg width={15} height={15} viewBox="0 0 24 24">
                <DrawInk k="signin-tick" shape={TICK} o={TICK_INK} delay={80} duration={240} />
              </Svg>
            ) : null}
          </View>
          <T v="button" style={{ color: INK }}>
            {doneLabel}
          </T>
        </Layer>
      </Animated.View>
    </Pressable>
  );
}

const TICK = { t: "path", d: "M5,12.5 L10,17.5 L19,7" } as const;
const TICK_INK = { stroke: LIME, sw: 3.5, single: true, rough: 0.5 } as const;

function Layer({ n, face, children }: { n: number; face: SharedValue<number>; children: React.ReactNode }) {
  const anim = useAnimatedStyle(() => {
    const d = Math.min(1, Math.abs(face.value - n));
    return { opacity: 1 - d, transform: [{ translateY: (face.value - n) * -10 }, { scale: n === 2 ? 0.85 + (1 - d) * 0.15 : 1 }] };
  });
  return <Animated.View style={[{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: space[2] }, anim]}>{children}</Animated.View>;
}
