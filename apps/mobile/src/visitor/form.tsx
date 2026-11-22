/**
 * Form pieces for the signed-out screens, in the Layers look (docs/DESIGN.md):
 * a stone field whose ink ring settles in on focus and which shakes once on
 * an error, and the lime pill that turns into a flame while it works and a
 * tick when it worked.
 */
import { Eye, EyeOff } from "lucide-react-native";
import * as React from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming, type SharedValue } from "react-native-reanimated";
import Svg from "react-native-svg";

import { Flame, T } from "@/ds";
import { curves, DrawInk, dur, springs, usePressScale } from "@/motion";
import { fonts, layout, space, type as scale, useTheme } from "@/theme";

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

/**
 * A field on a layer: a stone box with 18px corners. On focus an ink ring
 * settles onto it (from a hair larger, opacity and transform only) and the
 * label and icon turn ink. An error turns the ring warm red, shakes the field
 * once and says what to fix in words under it.
 */
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
    bad.set(reduce ? (error ? 1 : 0) : withTiming(error ? 1 : 0, { duration: dur.state, easing: curves.standard }));
    if (error && error !== prevError.current) setShakes((s) => s + 1);
    prevError.current = error;
  }, [error, bad, reduce]);
  const shake = useShake(shakes);

  const ring = useAnimatedStyle(() => ({ opacity: f.value * (1 - bad.value), transform: [{ scaleX: 1.012 - f.value * 0.012 }, { scaleY: 1.06 - f.value * 0.06 }] }));
  const badRing = useAnimatedStyle(() => ({ opacity: bad.value }));
  const radius = layout.radius;

  return (
    <Animated.View style={[{ gap: space[2] }, shake]}>
      <T v="small" style={{ fontFamily: fonts.semibold, color: error ? c.danger : focused ? c.ink : c.muted, paddingHorizontal: space[1] }}>
        {label}
      </T>
      <View>
        <View style={{ flexDirection: "row", alignItems: area ? "flex-start" : "center", minHeight: area ? 128 : 56, borderRadius: radius, backgroundColor: c.card, paddingLeft: space[4], paddingRight: secret ? space[1] : space[4], gap: space[3] }}>
          {Icon ? (
            <View style={{ paddingTop: area ? space[4] : 0 }}>
              <Icon size={20} color={error ? c.danger : focused ? c.ink : c.faint} strokeWidth={2} />
            </View>
          ) : null}
          <TextInput
            ref={inputRef}
            testID={testID}
            accessibilityLabel={label}
            accessibilityHint={error ?? hint}
            placeholderTextColor={c.faint}
            selectionColor={c.accent}
            cursorColor={c.link}
            keyboardAppearance={c.dark ? "dark" : "light"}
            secureTextEntry={secret && !show}
            multiline={area}
            textAlignVertical={area ? "top" : "center"}
            maxFontSizeMultiplier={1.4}
            {...rest}
            onFocus={(e) => {
              setFocused(true);
              f.set(reduce ? 1 : withSpring(1, springs.snappy));
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              f.set(reduce ? 0 : withTiming(0, { duration: dur.state, easing: curves.out }));
              onBlur?.(e);
            }}
            style={[scale.body, { flex: 1, color: c.ink, minHeight: area ? 124 : layout.target, paddingVertical: area ? space[3] : 0 }, { outlineStyle: "none" } as object]}
          />
          {secret ? (
            <Pressable accessibilityRole="button" accessibilityLabel={show ? "Hide password" : "Show password"} onPress={() => setShow((s) => !s)} hitSlop={6} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}>
              {show ? <EyeOff size={20} color={c.muted} /> : <Eye size={20} color={c.muted} />}
            </Pressable>
          ) : null}
        </View>
        {/* The rings sit over the box and never take a touch. */}
        <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: radius, borderWidth: 2, borderColor: c.ink }, ring]} />
        <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: radius, borderWidth: 2, borderColor: c.danger }, badRing]} />
      </View>
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite" testID={testID ? `${testID}-error` : undefined} style={{ paddingHorizontal: space[1] }}>
          {error}
        </T>
      ) : hint ? (
        <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
          {hint}
        </T>
      ) : null}
    </Animated.View>
  );
}

/**
 * The one lime pill of a signed-out screen, with three faces: the label,
 * Jyo's flame while it works, a tick that draws itself when it worked. The
 * faces cross-fade in place, so the button never changes size.
 */
export function SubmitButton({ label, busyLabel, doneLabel, state, onPress, testID }: { label: string; busyLabel: string; doneLabel: string; state: "idle" | "busy" | "done"; onPress: () => void; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { style: pressed, handlers } = usePressScale(0.97);
  const face = useSharedValue(0); // 0 idle, 1 busy, 2 done
  React.useEffect(() => {
    const to = state === "idle" ? 0 : state === "busy" ? 1 : 2;
    face.set(reduce ? to : state === "done" ? withSpring(to, springs.bouncy) : withTiming(to, { duration: dur.state, easing: curves.out }));
  }, [state, reduce, face]);
  const blocked = state !== "idle";
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={state === "idle" ? label : state === "busy" ? busyLabel : doneLabel} accessibilityState={{ busy: state === "busy", disabled: blocked }} disabled={blocked} {...handlers} onPress={onPress}>
      <Animated.View style={[{ height: 56, borderRadius: 28, backgroundColor: c.lime, overflow: "hidden" }, pressed]}>
        <Face n={0} face={face}>
          <T v="button" tone="onPrimary" style={{ fontSize: 17 }}>
            {label}
          </T>
        </Face>
        <Face n={1} face={face}>
          {state === "busy" ? <Flame size={22} testID="submit-flame" /> : null}
          <T v="button" tone="onPrimary">
            {busyLabel}
          </T>
        </Face>
        <Face n={2} face={face}>
          <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c.onLime, alignItems: "center", justifyContent: "center" }}>
            {/* The tick draws itself on in lime as the done face lands (drawn in full with Reduce Motion). */}
            {state === "done" ? (
              <Svg width={15} height={15} viewBox="0 0 24 24">
                <DrawInk k="signin-tick" shape={TICK} o={{ stroke: c.lime, sw: 3.5, single: true, rough: 0.3 }} delay={80} duration={240} />
              </Svg>
            ) : null}
          </View>
          <T v="button" tone="onPrimary">
            {doneLabel}
          </T>
        </Face>
      </Animated.View>
    </Pressable>
  );
}

const TICK = { t: "path", d: "M5,12.5 L10,17.5 L19,7" } as const;

function Face({ n, face, children }: { n: number; face: SharedValue<number>; children: React.ReactNode }) {
  const anim = useAnimatedStyle(() => {
    const d = Math.min(1, Math.abs(face.value - n));
    return { opacity: 1 - d, transform: [{ translateY: (face.value - n) * -10 }, { scale: n === 2 ? 0.9 + (1 - d) * 0.1 : 1 }] };
  });
  return <Animated.View style={[{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: space[2] }, anim]}>{children}</Animated.View>;
}
