import { Check, Lightbulb } from "lucide-react-native";
import * as React from "react";
import { AccessibilityInfo, Platform, Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { cancelAnimation, Easing, LinearTransition, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { haptic } from "@/lib/haptics";
import { Burst, curves, dur, presets, Press, springs, useCardRef, useGrowCard, usePressScale, useMotionTier } from "@/motion";
import { fonts, layout, space, useTheme, type Palette } from "@/theme";
import { Button } from "./button";
import { T } from "./text";

/**
 * The Layers parts (docs/DESIGN.md).
 *
 *   on the field   FieldCard, FieldProgress, RoundButton
 *   on a layer     Label, Stone, Pebbles, OptionList, HintBubble, QuietEmpty
 *   rising         ResultSheet (an answer's result), Flood (a mark confirmed)
 *   choosing       ChoicePebbles (two big choices), HoldButton (press and hold)
 *
 * Depth is real overlap and one soft shadow. No glass, no blur, no outlines.
 */

/** The one soft shadow a layer casts on the field. */
export function layerShadow(c: Palette): ViewStyle {
  if (Platform.OS === "web") return { boxShadow: c.dark ? "0 -12px 30px -12px rgba(0,0,10,0.7)" : "0 -12px 30px -12px rgba(5,10,40,0.45)" } as ViewStyle;
  if (Platform.OS === "android") return { elevation: 6, shadowColor: "#050a28" };
  return { shadowColor: "#050a28", shadowOpacity: 0.28, shadowRadius: 16, shadowOffset: { width: 0, height: -8 } };
}

/* ------------------------------------------------------- field and layer */

/**
 * The blue field, for a screen that lays itself out (a player, a scanner).
 * Most screens use `Screen`, which already is a field with a layer on it.
 * Holds the status-bar inset and white text; put a `Layer` after it.
 */
export function BlueField({ children, style, safeTop = true }: { children?: React.ReactNode; style?: StyleProp<ViewStyle>; safeTop?: boolean }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  return <View style={[{ backgroundColor: c.field, paddingTop: (safeTop ? insets.top : 0) + space[3], paddingHorizontal: layout.gutter, paddingBottom: space[5] + LAYER_OVERLAP, gap: space[3] }, style]}>{children}</View>;
}

/** how far a `Layer` climbs over the `BlueField` above it. */
export const LAYER_OVERLAP = 28;

/**
 * The soft white layer that rises over the field: 30px top corners, one soft
 * shadow, and it arrives by rising and settling on the layer spring (a fade on
 * low-end Android, nothing with Reduce Motion). Put it right after a `BlueField`.
 */
export function Layer({ children, style, testID = "layer" }: { children?: React.ReactNode; style?: StyleProp<ViewStyle>; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  return (
    <Animated.View testID={testID} entering={reduce ? undefined : presets.layer(low)} style={[{ flex: 1, marginTop: -LAYER_OVERLAP, backgroundColor: c.bg, borderTopLeftRadius: layout.radiusLayer, borderTopRightRadius: layout.radiusLayer, paddingTop: space[5], paddingHorizontal: layout.gutter, gap: space[5], ...layerShadow(c) }, style]}>
      {children}
    </Animated.View>
  );
}

/* ------------------------------------------------------------ on the field */

/**
 * The "now" pill on the blue field: what is happening or coming next, with at
 * most one lime action. One per screen. `live` shows the lime dot (it pulses
 * twice on arrival, then rests).
 */
export function FieldCard({ title, meta, action, live, onPress, testID }: { title: string; meta?: string; action?: { label: string; onPress: () => void; testID?: string }; live?: boolean; onPress?: () => void; testID?: string }) {
  const c = useTheme();
  const body = (
    <>
      {live ? <LiveDot /> : null}
      <View style={{ flex: 1, minWidth: 0 }}>
        <T v="bodyStrong" tone="onField" style={{ fontFamily: fonts.bold, fontSize: 15, lineHeight: 20 }}>
          {title}
        </T>
        {meta ? (
          <T v="small" tone="onFieldMuted" style={{ fontSize: 13, lineHeight: 18 }}>
            {meta}
          </T>
        ) : null}
      </View>
      {action ? <Button small label={action.label} onPress={action.onPress} testID={action.testID} /> : null}
    </>
  );
  const box: ViewStyle = { flexDirection: "row", alignItems: "center", gap: space[3], backgroundColor: c.fieldTint, borderRadius: 22, paddingVertical: space[3], paddingLeft: space[4], paddingRight: action ? space[3] : space[4], minHeight: 64 };
  if (!onPress)
    return (
      <View testID={testID} style={box}>
        {body}
      </View>
    );
  return (
    <Press testID={testID} accessibilityRole="button" accessibilityLabel={meta ? `${title}, ${meta}` : title} onPress={onPress} scale={0.98} innerStyle={box}>
      {body}
    </Press>
  );
}

function LiveDot() {
  const c = useTheme();
  const reduce = useReducedMotion();
  const v = useSharedValue(0);
  React.useEffect(() => {
    if (reduce) return;
    v.set(withDelay(400, withRepeat(withSequence(withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 0 })), 2, false)));
  }, [reduce, v]);
  const ring = useAnimatedStyle(() => ({ opacity: 0.35 * (1 - v.value), transform: [{ scale: 1 + v.value * 1.6 }] }));
  return (
    <View style={{ width: 10, height: 10, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[{ position: "absolute", width: 10, height: 10, borderRadius: 5, backgroundColor: c.lime }, ring]} />
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.lime }} />
    </View>
  );
}

/** Progress through a set, on the field: a lime bar on a soft track, with "14 of 20" beside it. */
export function FieldProgress({ done, total, label }: { done: number; total: number; label?: string }) {
  const c = useTheme();
  const pct = Math.max(0, Math.min(1, done / Math.max(1, total)));
  return (
    <View testID="field-progress" accessible accessibilityRole="progressbar" accessibilityLabel={label ?? `${done} of ${total}`} accessibilityValue={{ min: 0, max: total, now: done }} style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
      <View style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: c.fieldTint, overflow: "hidden" }}>
        <View style={{ width: `${pct * 100}%`, height: 8, borderRadius: 4, backgroundColor: c.lime }} />
      </View>
      <T v="caption" tone="onField" num style={{ fontFamily: fonts.bold }}>
        {label ?? `${done} of ${total}`}
      </T>
    </View>
  );
}

/** A 40px round button. On the field it is a soft see-through disc (close, back); on a layer it is stone. */
export function RoundButton({ label, onPress, children, onField, testID }: { label: string; onPress: () => void; children: React.ReactNode; onField?: boolean; testID?: string }) {
  const c = useTheme();
  return (
    <Press testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={6} scale={0.9} squish innerStyle={{ width: 40, height: 40, borderRadius: 20, backgroundColor: onField ? c.fieldTint : c.card, alignItems: "center", justifyContent: "center" }}>
      {children}
    </Press>
  );
}

/* -------------------------------------------------------------- on a layer */

/** The small quiet heading over a group on a layer ("Keep going", "Quick"). Not a page title. */
export function Label({ children, action }: { children: string; /** A text link at the right ("Week"). */ action?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 20, paddingHorizontal: space[1] }}>
      <T v="label" tone="muted" accessibilityRole="header">
        {children}
      </T>
      {action}
    </View>
  );
}

type StoneProps = {
  children?: React.ReactNode;
  onPress?: () => void;
  /** Opens the next screen by growing into it (pass the `router.push`). The card settles back when you return. Use instead of `onPress`. */
  grow?: () => void;
  accessibilityLabel?: string;
  /** An outline instead of a fill, for the quieter second thing. */
  quiet?: boolean;
  pad?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

function stoneFace(c: Palette, quiet: boolean | undefined, pad: number): ViewStyle {
  return { borderRadius: quiet ? 22 : layout.radiusLg, padding: pad, backgroundColor: quiet ? "transparent" : c.card, borderWidth: quiet ? 1.5 : 0, borderColor: c.card };
}

/** A stone surface resting on the layer: 26px corners, no outline, no shadow. Pressable with `onPress`, or `grow` when it opens a screen. */
export const Stone = React.forwardRef<React.ComponentRef<typeof View>, StoneProps>(function Stone({ children, onPress, grow, accessibilityLabel, quiet, pad = space[4], style, testID }, ref) {
  const c = useTheme();
  const face = stoneFace(c, quiet, pad);
  if (grow)
    return (
      <GrowStone open={grow} face={face} accessibilityLabel={accessibilityLabel} style={style} testID={testID}>
        {children}
      </GrowStone>
    );
  if (!onPress)
    return (
      <View ref={ref} testID={testID} style={[face, style]}>
        {children}
      </View>
    );
  return (
    <View ref={ref} collapsable={false} style={style}>
      <Press testID={testID} accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} scale={0.98} innerStyle={face}>
        {children}
      </Press>
    </View>
  );
});

function GrowStone({ children, open, face, accessibilityLabel, style, testID }: { children?: React.ReactNode; open: () => void; face: ViewStyle; accessibilityLabel?: string; style?: StyleProp<ViewStyle>; testID?: string }) {
  const ref = useCardRef();
  const { style: settle, press } = useGrowCard(ref, open);
  return (
    <Animated.View ref={ref} collapsable={false} style={[style, settle]}>
      <Press testID={testID} accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={press} scale={0.98} innerStyle={face}>
        {children}
      </Press>
    </Animated.View>
  );
}

/** Four hand-shaped corner sets, so no two pebbles in a row are the same. */
const PEBBLE: ViewStyle[] = [
  { borderTopLeftRadius: 27, borderTopRightRadius: 33, borderBottomRightRadius: 28, borderBottomLeftRadius: 31 },
  { borderTopLeftRadius: 33, borderTopRightRadius: 27, borderBottomRightRadius: 32, borderBottomLeftRadius: 28 },
  { borderTopLeftRadius: 29, borderTopRightRadius: 31, borderBottomRightRadius: 34, borderBottomLeftRadius: 26 },
  { borderTopLeftRadius: 32, borderTopRightRadius: 28, borderBottomRightRadius: 27, borderBottomLeftRadius: 33 },
];
/** The corner set for pebble number `i`. */
export function pebbleShape(i: number): ViewStyle {
  return PEBBLE[((i % 4) + 4) % 4]!;
}

export type Pebble = { label: string; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; onPress: () => void; /** Lime: the one that matters right now (at most one). */ live?: boolean; testID?: string };

/** Quick actions: two to four 60px pebbles in one row, an icon in each and a short label under it. */
export function Pebbles({ items }: { items: Pebble[] }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row" }}>
      {items.slice(0, 4).map((it, i) => (
        <Press key={it.label} testID={it.testID} accessibilityRole="button" accessibilityLabel={it.label} onPress={it.onPress} scale={0.9} squish style={{ flex: 1 }} innerStyle={{ alignItems: "center", gap: 6, paddingVertical: 2 }}>
          <View style={[{ width: 60, height: 60, alignItems: "center", justifyContent: "center", backgroundColor: it.live ? c.lime : c.card }, pebbleShape(i)]}>
            <it.icon size={22} color={it.live ? c.onLime : c.ink} strokeWidth={1.9} />
          </View>
          <T v="caption" numberOfLines={1} maxFontSizeMultiplier={1.25}>
            {it.label}
          </T>
        </Press>
      ))}
    </View>
  );
}

/**
 * Answers for one question: stone pills. The student picks one (it turns ink),
 * then presses Check (the screen's bottom Button). After the check pass
 * `checked` and `answer`: the right one turns lime with the words "Correct
 * answer"; a wrong pick turns warm with "Your answer"; the rest dim. Colour is
 * never the only sign. Up to five options.
 */
export function OptionList({ options, picked, onPick, checked = false, answer, testID = "options" }: { options: string[]; picked: number | null; onPick: (i: number) => void; /** The answer has been checked: rows lock and show the result. */ checked?: boolean; /** Index of the right answer (needed once checked). */ answer?: number; testID?: string }) {
  return (
    <View accessibilityRole="radiogroup" testID={testID} style={{ gap: space[2] }}>
      {options.slice(0, 5).map((text, i) => (
        <OptionPill key={i} text={text} picked={picked === i} checked={checked} right={checked && answer === i} onPress={() => onPick(i)} testID={`${testID}-${i}`} />
      ))}
    </View>
  );
}

function OptionPill({ text, picked, checked, right, onPress, testID }: { text: string; picked: boolean; checked: boolean; right: boolean; onPress: () => void; testID: string }) {
  const c = useTheme();
  const wrong = checked && picked && !right;
  const { style, handlers } = usePressScale(0.98);
  const state = right ? "Correct answer" : wrong ? "Your answer" : null;
  const bg = right ? c.lime : wrong ? c.missBg : picked ? c.ink : c.card;
  const fg = right ? c.onLime : wrong ? c.ink : picked ? c.bg : c.ink;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected: picked, disabled: checked }}
      accessibilityLabel={state ? `${text}. ${state}` : text}
      disabled={checked}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      {...handlers}
    >
      <Animated.View style={[{ minHeight: 52, borderRadius: layout.radius, backgroundColor: bg, paddingVertical: space[3], paddingHorizontal: space[4], flexDirection: "row", alignItems: "center", gap: space[2], opacity: checked && !right && !wrong ? 0.45 : 1 }, style]}>
        <T v="bodyStrong" style={{ flex: 1, color: fg }}>
          {text}
        </T>
        {state ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            {right ? <Check size={15} color={fg} strokeWidth={3} /> : null}
            <T v="caption" style={{ color: fg, fontFamily: fonts.bold }}>
              {state}
            </T>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

/** The hint button: a small pebble beside the question. It turns lime while the hint is open; the words go in a `HintText` under the question. Asking for a hint is the student's choice, never automatic. */
export function HintBubble({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const c = useTheme();
  return (
    <Press testID="hint-button" accessibilityRole="button" accessibilityLabel={open ? "Hide the hint" : "Show a hint"} accessibilityState={{ expanded: open }} onPress={onToggle} hitSlop={4} scale={0.9} squish innerStyle={{ width: 44, height: 44, alignItems: "center", justifyContent: "center", backgroundColor: open ? c.lime : c.card, borderTopLeftRadius: 20, borderTopRightRadius: 23, borderBottomRightRadius: 24, borderBottomLeftRadius: 19 }}>
      <Lightbulb size={20} color={open ? c.onLime : c.ink} />
    </Press>
  );
}

/** The words of a hint, a tip, or a short note: a stone bubble with one sharp corner pointing at what opened it. */
export function HintText({ children, testID = "hint" }: { children: React.ReactNode; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const v = useSharedValue(reduce ? 1 : 0);
  React.useEffect(() => {
    v.set(reduce ? 1 : withTiming(1, { duration: dur.enter, easing: curves.out }));
  }, [reduce, v]);
  const style = useAnimatedStyle(() => ({ opacity: v.value, transform: [{ translateY: (1 - v.value) * -6 }, { scale: 0.97 + 0.03 * v.value }] }));
  return (
    <Animated.View testID={testID} accessibilityLiveRegion="polite" style={[{ backgroundColor: c.card, borderRadius: layout.radius, borderTopRightRadius: 6, paddingVertical: space[3], paddingHorizontal: space[4], transformOrigin: "top right" }, style]}>
      <T v="small">{children}</T>
    </Animated.View>
  );
}

/**
 * Nothing here yet: one line in the title face, one quiet line, at most one
 * action, on an outlined stone. `art` is for Jyo, and only where
 * docs/DESIGN.md allows a companion.
 */
export function QuietEmpty({ title, body, action, art, testID }: { title: string; body?: string; action?: { label: string; onPress: () => void }; art?: React.ReactNode; testID?: string }) {
  return (
    <Stone quiet pad={space[5]} testID={testID}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
        {art}
        <View style={{ flex: 1, minWidth: 0, gap: space[1] }}>
          <T v="h2">{title}</T>
          {body ? (
            <T v="small" tone="muted">
              {body}
            </T>
          ) : null}
        </View>
      </View>
      {action ? <Button kind="quiet" full={false} label={action.label} onPress={action.onPress} style={{ marginTop: space[4] }} /> : null}
    </Stone>
  );
}

/* ------------------------------------------------------------------ rising */

/**
 * The result of an answer, rising from the bottom over the screen's footer:
 * the verdict in the title face, one or two lines of why, and one ink button.
 * Put it as the last child of a screen's root (it positions itself). Leaves
 * the way it came. With Reduce Motion it appears in place. The haptic
 * (success or warn) fires once as it arrives.
 */
export function ResultSheet({ open, right, win, title, why, action, testID = "result" }: { open: boolean; right: boolean; /** A real win (a set finished, a first right answer on a weak topic): sparks fly from the tick, once. Not for every right answer. */ win?: boolean; /** "Yes, that fits" or "Not quite". */ title: string; why?: string | null; action: { label: string; onPress: () => void }; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const v = useSharedValue(open ? 1 : 0);
  const [shown, setShown] = React.useState(open);
  if (open && !shown) setShown(true);
  if (!open && shown && reduce) setShown(false);
  React.useEffect(() => {
    if (open) {
      if (right) haptic.success();
      else haptic.warn();
      // Rises and settles on the sheet spring.
      v.set(reduce ? 1 : withSpring(1, springs.sheet));
    } else {
      v.set(reduce ? 0 : withTiming(0, { duration: 220, easing: curves.out }, (done) => {
        if (done) scheduleOnRN(setShown, false);
      }));
    }
  }, [open, right, reduce, v]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: `${(1 - v.value) * 105}%` }] }));
  // The celebration: after the sheet has landed, once per opening.
  const [fire, setFire] = React.useState(0);
  React.useEffect(() => {
    if (!open || !right || !win) return;
    const id = setTimeout(() => setFire((n) => n + 1), 320);
    return () => clearTimeout(id);
  }, [open, right, win]);
  if (!shown) return null;
  return (
    <Animated.View testID={testID} accessibilityLiveRegion="polite" accessibilityViewIsModal style={[{ position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: c.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: space[5], paddingHorizontal: layout.gutter, paddingBottom: space[5], gap: space[2], ...layerShadow(c) }, style]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
        {right ? (
          <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
            <Check size={16} color={c.onLime} strokeWidth={3} />
            {win ? <Burst fire={fire} reach={38} /> : null}
          </View>
        ) : null}
        <T v="h2">{title}</T>
      </View>
      {why ? <T v="small">{why}</T> : null}
      <Button kind="ink" label={action.label} onPress={action.onPress} style={{ marginTop: space[2] }} testID={`${testID}-next`} />
    </Animated.View>
  );
}

/**
 * A mark confirmed: the colour floods out from where the thumb was and covers
 * its parent, then a tick draws and the words arrive. Put it as the last child
 * of the area to cover (which needs `overflow: "hidden"`). `tone` lime for
 * arriving or done, field for leaving. Reduce Motion: it is simply there.
 */
export function Flood({ on, tone = "lime", title, meta, action, origin = 0.82, testID = "flood" }: { on: boolean; tone?: "lime" | "field"; title: string; meta?: string; action?: { label: string; onPress: () => void }; /** Where it starts, top to bottom (0 to 1). */ origin?: number; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  const v = useSharedValue(on ? 1 : 0);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  React.useEffect(() => {
    v.set(on ? (reduce || low ? 1 : withTiming(1, { duration: 560, easing: curves.sheet })) : 0);
  }, [on, reduce, low, v]);
  const bg = tone === "lime" ? c.lime : c.field;
  const fg = tone === "lime" ? c.onLime : c.onField;
  // A circle big enough to cover the box from its starting point.
  const r = Math.hypot(box.w / 2, box.h * Math.max(origin, 1 - origin)) + 8;
  const circle = useAnimatedStyle(() => ({ transform: [{ scale: 0.02 + 0.98 * v.value }] }));
  const words = useAnimatedStyle(() => ({ opacity: Math.max(0, (v.value - 0.55) / 0.45), transform: [{ translateY: (1 - v.value) * 10 }] }));
  if (!on) return null;
  return (
    <View testID={testID} accessibilityLiveRegion="polite" onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })} style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
      {box.w ? <Animated.View pointerEvents="none" style={[{ position: "absolute", left: box.w / 2 - r, top: box.h * origin - r, width: r * 2, height: r * 2, borderRadius: r, backgroundColor: bg }, circle]} /> : null}
      <Animated.View style={[{ alignItems: "center", gap: space[2], padding: space[5] }, words]}>
        <Svg width={72} height={72} viewBox="0 0 74 74">
          <Path d="M20 39l12 12 23-26" stroke={fg} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
        <T v="display" center style={{ color: fg }}>
          {title}
        </T>
        {meta ? (
          <T v="small" center style={{ color: fg, fontFamily: fonts.semibold }}>
            {meta}
          </T>
        ) : null}
        {action ? (
          <Pressable accessibilityRole="button" accessibilityLabel={action.label} onPress={action.onPress} style={{ marginTop: space[3], minHeight: layout.target, paddingHorizontal: space[5], borderRadius: 999, borderWidth: 1.5, borderColor: fg, justifyContent: "center" }}>
            <T v="small" style={{ color: fg, fontFamily: fonts.bold }}>
              {action.label}
            </T>
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}

/* ---------------------------------------------------------------- choosing */

export type Choice<V extends string> = { id: V; /** The big word: "IN", "OUT". */ word: string; /** Under it: "I am arriving". */ sub: string; tone: "lime" | "field" };

/**
 * Two big choices side by side (IN and OUT). Tapping one makes it grow and
 * the other step back; nothing is saved until the confirm that follows
 * (`HoldButton`). The pair is a radio group for screen readers.
 */
export function ChoicePebbles<V extends string>({ options, value, onChange, label, height = 210, testID = "choice" }: { options: [Choice<V>, Choice<V>]; value: V | null; onChange: (v: V) => void; /** Read aloud for the group: "Arriving or leaving". */ label: string; height?: number; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  const move = reduce || low ? undefined : LinearTransition.duration(380).easing(curves.sheet);
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: "row", gap: 10, height }}>
      {options.map((o, i) => {
        const on = value === o.id;
        const off = value !== null && !on;
        const fg = o.tone === "lime" ? c.onLime : c.onField;
        return (
          <Animated.View key={o.id} layout={move} style={{ flex: on ? 1.7 : 1, opacity: off ? 0.5 : 1 }}>
            <Press
              testID={`${testID}-${o.id}`}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${o.word}. ${o.sub}`}
              feel="select"
              onPress={() => onChange(o.id)}
              scale={0.95}
              squish
              style={{ flex: 1 }}
              innerStyle={[{ flex: 1, height, justifyContent: "flex-end", padding: space[4], overflow: "hidden", backgroundColor: o.tone === "lime" ? c.lime : c.dark ? "#2b3fae" : c.field }, i === 0 ? { borderTopLeftRadius: 44, borderTopRightRadius: 36, borderBottomRightRadius: 40, borderBottomLeftRadius: 32 } : { borderTopLeftRadius: 36, borderTopRightRadius: 44, borderBottomRightRadius: 32, borderBottomLeftRadius: 40 }]}
            >
              <T maxFontSizeMultiplier={1.15} numberOfLines={1} style={{ fontFamily: fonts.big, fontSize: off ? 30 : 46, lineHeight: off ? 32 : 46, letterSpacing: -1.2, color: fg }}>
                {o.word}
              </T>
              <T v="small" numberOfLines={1} maxFontSizeMultiplier={1.2} style={{ color: fg, opacity: 0.85, fontFamily: fonts.semibold }}>
                {o.sub}
              </T>
            </Press>
          </Animated.View>
        );
      })}
    </View>
  );
}

/** How long the hold takes. Long enough to be on purpose, short enough at a clinic door. */
export const HOLD_MS = 900;

/**
 * Press and hold to confirm: the lime fill sweeps across while the thumb is
 * down and the action fires when it is full; letting go early cancels and the
 * fill drains. A gentle tick at the start, a success haptic belongs to the
 * result. With Reduce Motion or a screen reader on, it is a normal button:
 * one tap confirms (and `label` should not say "hold": pass `tapLabel`).
 */
export function HoldButton({ label, tapLabel, onConfirm, disabled, testID = "hold" }: { label: string; /** The words when a single tap confirms. */ tapLabel?: string; onConfirm: () => void; disabled?: boolean; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [reader, setReader] = React.useState(false);
  React.useEffect(() => {
    let live = true;
    void AccessibilityInfo.isScreenReaderEnabled()
      .then((on) => {
        if (live) setReader(on);
      })
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener("screenReaderChanged", setReader);
    return () => {
      live = false;
      sub?.remove?.();
    };
  }, []);
  const tap = !!reduce || reader;
  const v = useSharedValue(0);
  const fired = React.useRef(false);
  const fire = React.useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    onConfirm();
  }, [onConfirm]);
  React.useEffect(() => {
    // A new question (enabled again): ready for another hold.
    fired.current = false;
    v.set(0);
  }, [disabled, label, v]);
  const [down, setDown] = React.useState(false);
  const fill = useAnimatedStyle(() => ({ transform: [{ scaleX: v.value }] }));
  const start = () => {
    if (disabled || tap) return;
    setDown(true);
    haptic.select();
    v.set(withTiming(1, { duration: HOLD_MS, easing: Easing.linear }, (done) => {
      if (done) scheduleOnRN(fire);
    }));
  };
  const stop = () => {
    setDown(false);
    if (tap || fired.current) return;
    cancelAnimation(v);
    v.set(withTiming(0, { duration: 200, easing: curves.out }));
  };
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={tap ? (tapLabel ?? label) : label}
      accessibilityHint={tap ? undefined : "Press and hold for one second"}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPressIn={start}
      onPressOut={stop}
      onPress={tap ? fire : undefined}
      // A long hold must not turn into a system long-press action.
      delayLongPress={HOLD_MS * 4}
      style={{ minHeight: 58, borderRadius: 29, backgroundColor: c.card, overflow: "hidden", alignItems: "center", justifyContent: "center", opacity: disabled ? 0.55 : 1 }}
    >
      <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, backgroundColor: c.lime, transformOrigin: "left" }, fill]} />
      {/* Dark words while the lime is under them. */}
      <T v="button" tone={disabled ? "muted" : down ? "onPrimary" : "ink"} center>
        {tap ? (tapLabel ?? label) : label}
      </T>
    </Pressable>
  );
}
