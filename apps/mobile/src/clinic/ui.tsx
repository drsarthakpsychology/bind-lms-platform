import { Check, ChevronRight } from "lucide-react-native";
import * as React from "react";
import { AccessibilityInfo, Pressable, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from "react-native";
import Animated, { cancelAnimation, Easing, LinearTransition, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import type { Tone } from "@/admin/format";
import { Flame, HOLD_MS, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { curves, Press, presets, staggerDelay, useMotionTier } from "@/motion";
import { fonts, layout, space, useTheme, type Palette } from "@/theme";
import type { AttendState, ClinicSession, LeaveStatus, OpdVisitStatus } from "./contract";
import { LEAVE_WORD, rangeLabel, sessionTitle, stateWord, timeLabel, VISIT_WORD } from "./logic";
import { KIND_ICON, LEAVE_TONE, STATE_TONE, VISIT_TONE } from "./parts";

/**
 * The student clinic screens' own parts, in the Layers look (docs/DESIGN.md).
 * The admin clinic screens keep ./parts.tsx.
 *
 *   Pill         a status word on a soft patch (never colour alone)
 *   StoneList    one stone holding lines split by hairlines
 *   Line         a pressable line inside a StoneList
 *   SessionLine2 a session: start time leading, title, where, my state
 *   ChoicePair   the two big IN and OUT pebbles; one can be off, with its reason
 *   HoldToMark   press and hold; the colour floods out from under the thumb
 *   MarkFlood    the confirmed mark covering the layer
 */

function pillColors(c: Palette, tone: Tone): { bg: string; fg: string } {
  switch (tone) {
    case "ok":
      return { bg: c.successBg, fg: c.successFg };
    case "warn":
      return { bg: c.warnBg, fg: c.warnFg };
    case "alert":
      return { bg: c.alertBg, fg: c.alertFg };
    case "info":
      return { bg: c.pill, fg: c.link };
    default:
      return { bg: c.tint, fg: c.muted };
  }
}

/** A status word on a soft patch. The word carries the meaning; the colour only helps. */
export function Pill({ tone, children, testID }: { tone: Tone; children: string; testID?: string }) {
  const c = useTheme();
  const k = pillColors(c, tone);
  return (
    <View testID={testID} style={{ alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: k.bg, flexShrink: 1 }}>
      <T v="caption" style={{ color: k.fg, fontFamily: fonts.bold }} maxFontSizeMultiplier={1.4}>
        {children}
      </T>
    </View>
  );
}

export const StatePill = ({ s, late }: { s: AttendState; late?: boolean }) => <Pill tone={STATE_TONE[s]}>{stateWord(s, late)}</Pill>;
export const LeavePill = ({ s, testID }: { s: LeaveStatus; testID?: string }) => (
  <Pill tone={LEAVE_TONE[s]} testID={testID}>
    {LEAVE_WORD[s]}
  </Pill>
);
export const VisitPill = ({ s }: { s: OpdVisitStatus }) => <Pill tone={VISIT_TONE[s]}>{VISIT_WORD[s]}</Pill>;

/** One stone holding several lines, split by hairlines. The first lines rise in one after another. */
export function StoneList({ children, testID, style }: { children?: React.ReactNode; testID?: string; style?: StyleProp<ViewStyle> }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <View testID={testID} accessibilityRole="list" style={[{ backgroundColor: c.card, borderRadius: layout.radiusLg, overflow: "hidden" }, style]}>
      {items.map((ch, i) => (
        <Animated.View key={(React.isValidElement(ch) && ch.key) || i} entering={!reduce && i < 8 ? presets.rise(staggerDelay(i)) : undefined} style={i ? { borderTopWidth: 1, borderColor: c.hairline } : null}>
          {ch}
        </Animated.View>
      ))}
    </View>
  );
}

/** A line inside a StoneList: 56px or more, the whole line is the target when it opens something. */
export function Line({ children, onPress, label, testID, chevron }: { children: React.ReactNode; onPress?: () => void; label?: string; testID?: string; chevron?: boolean }) {
  const c = useTheme();
  const box: ViewStyle = { minHeight: layout.row, paddingVertical: space[3], paddingHorizontal: space[4], flexDirection: "row", alignItems: "center", gap: space[3] };
  if (!onPress)
    return (
      <View testID={testID} accessible={!!label} accessibilityLabel={label} style={box}>
        {children}
      </View>
    );
  return (
    <Press testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} scale={0.98} innerStyle={box}>
      {children}
      {chevron ? <ChevronRight size={18} color={c.muted} /> : null}
    </Press>
  );
}

/** A session on a day: the start time leads, then the title and where, and my state at the right. */
export function SessionLine2({ s, onPress, testID }: { s: ClinicSession; onPress?: () => void; testID?: string }) {
  const c = useTheme();
  const Icon = KIND_ICON[s.kind] ?? KIND_ICON.other;
  const cancelled = s.status === "cancelled";
  const where = s.place || (s.link || s.kind === "online_class" ? "Online" : "");
  const label = `${sessionTitle(s)}, ${rangeLabel(s.start, s.end)}${where ? `, ${where}` : ""}${cancelled ? ", cancelled" : ""}${s.mine ? `, ${stateWord(s.mine.state, s.mine.late)}` : ""}`;
  return (
    <Line testID={testID} onPress={onPress} label={label}>
      <View style={{ width: 62 }}>
        <T v="bodyStrong" num tone={cancelled ? "muted" : "ink"} maxFontSizeMultiplier={1.3}>
          {timeLabel(s.start)}
        </T>
        <Icon size={15} color={c.muted} style={{ marginTop: 2 }} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <T v="bodyStrong" style={cancelled ? { textDecorationLine: "line-through", color: c.muted } : undefined}>
          {sessionTitle(s)}
        </T>
        <T v="small" tone="muted" num>
          {`until ${timeLabel(s.end)}${where ? ` · ${where}` : ""}`}
        </T>
        {cancelled || s.status === "moved" ? (
          <T v="small" tone="alert">
            {cancelled ? "Cancelled" : "Moved"}
            {s.note ? `. ${s.note}` : ""}
          </T>
        ) : null}
      </View>
      {s.mine && !cancelled ? <StatePill s={s.mine.state} late={s.mine.late} /> : null}
    </Line>
  );
}

/* ----------------------------------------------------------- IN and OUT */

export type Dir = "in" | "out";
type Option = { allowed: boolean; reason: string | null };
const WORD: Record<Dir, string> = { in: "IN", out: "OUT" };
const SUB: Record<Dir, string> = { in: "I am arriving", out: "I am leaving" };

/** The colour a direction floods with: lime for arriving, the field blue for leaving. */
export function dirColors(c: Palette, dir: Dir): { bg: string; fg: string } {
  return dir === "in" ? { bg: c.lime, fg: c.onLime } : { bg: c.dark ? "#2b3fae" : c.field, fg: c.onField };
}

/**
 * The two big choices, IN on the left and OUT on the right (the kit's
 * ChoicePebbles, plus one thing it cannot do: a choice that makes no sense
 * now is stone grey, cannot be pressed, and its one-line reason sits under
 * the pair). Tapping one makes it grow and the other step back. Nothing is
 * chosen for the student and nothing is saved here.
 */
export function ChoicePair({ value, onChange, options, locked, height = 200 }: { value: Dir | null; onChange: (d: Dir | null) => void; options: Record<Dir, Option>; /** While the mark is being sent. */ locked?: boolean; height?: number }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  const move = reduce || low ? undefined : LinearTransition.duration(380).easing(curves.sheet);
  return (
    <View style={{ gap: space[3] }}>
      <View accessibilityRole="radiogroup" accessibilityLabel="Arriving or leaving" style={{ flexDirection: "row", gap: 10, height }}>
        {(["in", "out"] as const).map((d, i) => {
          const o = options[d];
          const on = value === d;
          const off = value !== null && !on;
          const k = o.allowed ? dirColors(c, d) : { bg: c.card, fg: c.faint };
          return (
            <Animated.View key={d} layout={move} style={{ flex: on ? 1.7 : 1, opacity: o.allowed && off ? 0.5 : 1 }}>
              <Press
                testID={`scan-choose-${d}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: on, disabled: !o.allowed || !!locked }}
                accessibilityLabel={`Mark ${WORD[d]}`}
                accessibilityHint={o.allowed ? SUB[d] : (o.reason ?? undefined)}
                disabled={!o.allowed || !!locked}
                feel="select"
                onPress={() => onChange(on ? null : d)}
                scale={0.95}
                squish
                style={{ flex: 1 }}
                innerStyle={[{ flex: 1, height, justifyContent: "flex-end", padding: space[4], overflow: "hidden", backgroundColor: k.bg }, i === 0 ? { borderTopLeftRadius: 44, borderTopRightRadius: 36, borderBottomRightRadius: 40, borderBottomLeftRadius: 32 } : { borderTopLeftRadius: 36, borderTopRightRadius: 44, borderBottomRightRadius: 32, borderBottomLeftRadius: 40 }]}
              >
                <T maxFontSizeMultiplier={1.15} numberOfLines={1} style={{ fontFamily: fonts.big, fontSize: off || !o.allowed ? 30 : 46, lineHeight: off || !o.allowed ? 32 : 46, letterSpacing: -1.2, color: k.fg }}>
                  {WORD[d]}
                </T>
                <T v="small" numberOfLines={1} maxFontSizeMultiplier={1.2} style={{ color: k.fg, opacity: 0.85, fontFamily: fonts.semibold }}>
                  {o.allowed ? SUB[d] : "Not now"}
                </T>
              </Press>
            </Animated.View>
          );
        })}
      </View>
      {(["in", "out"] as const).map((d) =>
        options[d].reason ? (
          <View key={d} style={{ flexDirection: "row", gap: space[2], paddingHorizontal: space[1] }}>
            <T v="small" tone="muted" style={{ fontFamily: fonts.bold }}>
              {WORD[d]} is off:
            </T>
            <T v="small" tone="muted" style={{ flex: 1 }} testID={`scan-why-${d}`}>
              {options[d].reason}
            </T>
          </View>
        ) : null,
      )}
    </View>
  );
}

/** True when one tap must confirm: Reduce Motion is on, or a screen reader is. */
export function useTapConfirm(): boolean {
  const reduce = useReducedMotion();
  const [reader, setReader] = React.useState(false);
  React.useEffect(() => {
    let live = true;
    void Promise.resolve(AccessibilityInfo.isScreenReaderEnabled())
      .then((on) => {
        if (live) setReader(!!on);
      })
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener("screenReaderChanged", setReader);
    return () => {
      live = false;
      sub?.remove?.();
    };
  }, []);
  return !!reduce || reader;
}

/**
 * Press and hold to confirm a mark. While the thumb is down the colour floods
 * out in a circle from under it; when it has covered the pill (the kit's
 * HOLD_MS) the mark is sent. Letting go early drains it and sends nothing.
 * The moment is timed on the JS side too, so a dropped frame never loses a
 * mark. With Reduce Motion or a screen reader it is a normal button: one tap.
 * `busy` keeps it full and says "Sending". `onConfirm` gets where the thumb
 * was (0 to 1 across the screen) so the result can flood from the same place.
 */
export function HoldToMark({ dir, onConfirm, disabled, busy, testID = "scan-confirm" }: { dir: Dir | null; onConfirm: (at: { x: number; y: number } | null) => void; disabled?: boolean; busy?: boolean; testID?: string }) {
  const c = useTheme();
  const tap = useTapConfirm();
  const v = useSharedValue(0);
  const x = useSharedValue(0);
  const [w, setW] = React.useState(0);
  const [down, setDown] = React.useState(false);
  const fired = React.useRef(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  React.useEffect(() => clear, []);
  // A new choice, or the send came back unsent: ready for another hold.
  const holdKey = busy ? null : `ready:${dir ?? ""}`;
  const [readyFor, setReadyFor] = React.useState(holdKey);
  if (holdKey !== readyFor) {
    setReadyFor(holdKey);
    if (holdKey) setDown(false);
  }
  React.useEffect(() => {
    if (busy) return;
    fired.current = false;
    cancelAnimation(v);
    v.set(0);
  }, [dir, busy, v]);
  const off = !!disabled || dir === null;
  const k = dir ? dirColors(c, dir) : { bg: c.lime, fg: c.onLime };
  const word = dir ? WORD[dir] : "";
  const label = busy ? "Sending" : off ? "Choose IN or OUT first" : tap ? `Confirm ${word}` : `Hold to mark ${word}`;
  const fire = (e: GestureResponderEvent | null) => {
    if (fired.current || off || busy) return;
    fired.current = true;
    const n = e?.nativeEvent;
    onConfirm(n && typeof n.pageX === "number" ? { x: n.pageX, y: n.pageY } : null);
  };
  const start = (e: GestureResponderEvent) => {
    if (off || busy || tap || fired.current) return;
    setDown(true);
    haptic.select();
    x.set(e.nativeEvent?.locationX ?? w / 2);
    v.set(withTiming(1, { duration: HOLD_MS, easing: Easing.linear }));
    clear();
    timer.current = setTimeout(() => fire(e), HOLD_MS);
  };
  const stop = () => {
    clear();
    if (tap || fired.current) return;
    setDown(false);
    cancelAnimation(v);
    v.set(withTiming(0, { duration: 200, easing: curves.out }));
  };
  // A circle wide enough to cover the pill from wherever the thumb is.
  const r = Math.max(w, 1);
  const circle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value - r }, { scale: 0.04 + 0.96 * v.value }], opacity: v.value > 0 ? 1 : 0 }));
  const full = !!busy || (tap && !off);
  return (
    <View style={{ gap: space[2] }}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={tap || off || busy ? undefined : "Press and hold for one second"}
        accessibilityState={{ disabled: off || !!busy, busy: !!busy }}
        disabled={off || !!busy}
        onLayout={(e) => setW(e.nativeEvent.layout.width)}
        onPressIn={start}
        onPressOut={stop}
        onPress={tap ? fire : undefined}
        // A long hold must not turn into a system long-press action.
        delayLongPress={HOLD_MS * 4}
        style={{ minHeight: 64, borderRadius: 32, backgroundColor: full ? k.bg : c.card, overflow: "hidden", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: space[2], opacity: off ? 0.6 : 1 }}
      >
        {full ? null : <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 32 - r, width: r * 2, height: r * 2, borderRadius: r, backgroundColor: k.bg }, circle]} />}
        <T v="button" center style={{ color: off ? c.muted : full || down ? k.fg : c.ink }}>
          {label}
        </T>
        {busy ? <Flame size={20} /> : null}
      </Pressable>
      {tap || off ? null : (
        <T v="small" tone="muted" center>
          Press and hold for one second. Letting go early cancels.
        </T>
      )}
    </View>
  );
}

/**
 * A mark confirmed: the colour floods out from where the thumb was and covers
 * its parent (which needs `overflow: "hidden"`), then the tick and the words
 * arrive. The kit's Flood, with room for the lines an attendance result needs.
 * Reduce Motion and low-end Android: it is simply there.
 */
export function MarkFlood({ dir, from, children, testID = "scan-done", accessibilityLabel }: { dir: Dir; /** Where the thumb was, in window px (null: low centre). */ from: { x: number; y: number } | null; children: React.ReactNode; testID?: string; accessibilityLabel?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  const still = !!reduce || low;
  const v = useSharedValue(still ? 1 : 0);
  const [box, setBox] = React.useState<{ w: number; h: number; x: number; y: number } | null>(null);
  const ref = React.useRef<React.ComponentRef<typeof View>>(null);
  React.useEffect(() => {
    v.set(still ? 1 : withTiming(1, { duration: 560, easing: curves.sheet }));
  }, [still, v]);
  const k = dirColors(c, dir);
  const ox = box ? Math.max(0, Math.min(box.w, from ? from.x - box.x : box.w / 2)) : 0;
  const oy = box ? Math.max(0, Math.min(box.h, from ? from.y - box.y : box.h * 0.82)) : 0;
  const r = box ? Math.hypot(Math.max(ox, box.w - ox), Math.max(oy, box.h - oy)) + 8 : 0;
  const circle = useAnimatedStyle(() => ({ transform: [{ scale: 0.02 + 0.98 * v.value }] }));
  const words = useAnimatedStyle(() => ({ opacity: Math.max(0, (v.value - 0.55) / 0.45), transform: [{ translateY: (1 - v.value) * 10 }] }));
  return (
    <View
      ref={ref}
      testID={testID}
      accessibilityLiveRegion="polite"
      accessibilityLabel={accessibilityLabel}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        const done = (px = 0, py = 0) => setBox({ w: width, h: height, x: px, y: py });
        if (ref.current?.measureInWindow) ref.current.measureInWindow((px: number, py: number) => done(px, py));
        else done();
      }}
      style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: still ? k.bg : "transparent" }}
    >
      {box && !still ? <Animated.View pointerEvents="none" style={[{ position: "absolute", left: ox - r, top: oy - r, width: r * 2, height: r * 2, borderRadius: r, backgroundColor: k.bg }, circle]} /> : null}
      <Animated.View style={[{ alignItems: "center", gap: space[2], padding: space[5], alignSelf: "stretch" }, words]}>
        <Svg width={72} height={72} viewBox="0 0 74 74">
          <Path d="M20 39l12 12 23-26" stroke={k.fg} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
        {children}
      </Animated.View>
    </View>
  );
}

/** An outlined pill on a flood ("Done"). */
export function FloodAction({ label, onPress, color, testID }: { label: string; onPress: () => void; color: string; testID?: string }) {
  return (
    <Press testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} scale={0.96} style={{ marginTop: space[4] }} innerStyle={{ minHeight: layout.primary, minWidth: 160, paddingHorizontal: space[6], borderRadius: 999, borderWidth: 1.5, borderColor: color, alignItems: "center", justifyContent: "center" }}>
      <T v="button" style={{ color }}>
        {label}
      </T>
    </Press>
  );
}

/** A small tick in a lime disc, for a line that is done. */
export function Tick({ size = 22 }: { size?: number }) {
  const c = useTheme();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
      <Check size={size * 0.62} color={c.onLime} strokeWidth={3} />
    </View>
  );
}
