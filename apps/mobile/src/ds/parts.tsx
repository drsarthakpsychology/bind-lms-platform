import { reasonOf } from "@/api/errors";
import { ChevronRight } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, StyleSheet, Switch, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from "react-native-reanimated";

import { crumb } from "@/lib/breadcrumb";
import { haptic } from "@/lib/haptics";
import { presets, ProgressFill, RollingNumber, Shimmer, SkeletonIn, springs, staggerDelay, usePressScale } from "@/motion";
import type { StateMood } from "@/lib/reactions/stickers";
import { layout, space, useTheme } from "@/theme";
import { Button } from "./button";
import { StackGap } from "./gap";
import { Meme } from "./meme";
import { T } from "./text";

/* ------------------------------------------------------------- Section */

/** A heading and its content. No border, no background: whitespace groups it. */
export function Section({ title, action, children, quiet, style }: { title?: string; action?: React.ReactNode; children?: React.ReactNode; /** A small grey label instead of a heading (settings groups). */ quiet?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ gap: space[3] }, style]}>
      {title || action ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: space[4],
          }}
        >
          {title ? (
            <T v={quiet ? "small" : "h3"} tone={quiet ? "muted" : "ink"} style={{ flex: 1 }}>
              {title}
            </T>
          ) : (
            <View />
          )}
          {action}
        </View>
      ) : null}
      <StackGap.Provider value={(StyleSheet.flatten(style)?.gap as number | undefined) ?? space[3]}>{children}</StackGap.Provider>
    </View>
  );
}

/* ------------------------------------------------------- RowList + Row */

/** Rows with a 1px hairline between them and above and below. The first rows rise in one after another when the list appears; rows added or removed later slide the others into place. */
export function RowList({ children, bare, still, style }: { children?: React.ReactNode; /** No line above the first and below the last row. */ bare?: boolean; /** No motion at all (results that change as you type). */ still?: boolean; style?: StyleProp<ViewStyle> }) {
  const c = useTheme();
  const reduce = useReducedMotion() || !!still;
  const items = React.Children.toArray(children).filter(Boolean);
  // Long lists (the medicine library) skip the per-row layout spring: it would cost more than it shows.
  const animate = !reduce && items.length <= 40;
  return (
    <View accessibilityRole="list" style={[{ borderColor: c.hairline, borderTopWidth: bare ? 0 : 1, borderBottomWidth: bare ? 0 : 1 }, style]}>
      {items.map((child, i) => (
        <Animated.View key={(React.isValidElement(child) && child.key) || i} entering={!reduce && i < 12 ? presets.rise(staggerDelay(i)) : undefined} exiting={animate ? presets.out() : undefined} layout={animate ? presets.layout() : undefined} style={i > 0 ? { borderTopWidth: 1, borderColor: c.hairline } : null}>
          {child}
        </Animated.View>
      ))}
    </View>
  );
}

export type RowProps = {
  title: string;
  meta?: string;
  icon?: React.ReactNode;
  /** Right side: a value or a small status word. Not a second button. */
  trailing?: React.ReactNode;
  onPress?: () => void;
  /** Defaults to true when the row can be pressed. */
  chevron?: boolean;
  /** A blue dot before the title (unread). */
  unread?: boolean;
  /** The place you are in (the playing lecture). */
  current?: boolean;
  /** Red words: sign out, delete. */
  danger?: boolean;
  /** Extra content under the title and meta (a progress line). */
  below?: React.ReactNode;
  testID?: string;
  accessibilityLabel?: string;
};

/**
 * One row: an optional icon, a title that wraps, an optional quiet line, and
 * something on the right. At least 56px tall. The whole row is the target.
 */
export function Row({ title, meta, icon, trailing, onPress, chevron, unread, current, danger, below, testID, accessibilityLabel }: RowProps) {
  const c = useTheme();
  const body = (
    <>
      {icon ? <View style={{ width: 24, alignItems: "center" }}>{icon}</View> : null}
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
          {unread ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.accent }} /> : null}
          <T v="bodyStrong" tone={danger ? "danger" : current ? "link" : "ink"} style={{ flex: 1 }}>
            {title}
          </T>
        </View>
        {meta ? (
          <T v="small" tone="muted">
            {meta}
          </T>
        ) : null}
        {below}
      </View>
      {typeof trailing === "string" ? (
        // A long value (a long name) wraps on the right and never runs over the title.
        <T v="small" tone="muted" num style={{ flexShrink: 1, maxWidth: "55%", textAlign: "right" }}>
          {trailing}
        </T>
      ) : trailing !== undefined && trailing !== null && trailing !== false ? (
        // A long status ("Password set, not signed in") wraps instead of squeezing the title to one word a line.
        <View style={{ flexShrink: 1, maxWidth: "50%", alignItems: "flex-end" }}>{trailing}</View>
      ) : null}
      {onPress && chevron !== false ? <ChevronRight size={20} color={c.muted} /> : null}
    </>
  );
  const base: ViewStyle = {
    minHeight: layout.row,
    paddingVertical: space[2],
    flexDirection: "row",
    alignItems: "center",
    gap: space[4],
  };
  if (!onPress)
    return (
      <View testID={testID} style={base}>
        {body}
      </View>
    );
  return (
    <PressRow testID={testID} label={accessibilityLabel ?? (meta ? `${title}. ${meta}` : title)} current={!!current} onPress={onPress} base={base}>
      {body}
    </PressRow>
  );
}

/** A pressable row: a tint fades in under the finger and the row sinks to 0.98 on a stiff spring. */
function PressRow({ children, onPress, label, current, base, testID }: { children: React.ReactNode; onPress: () => void; label: string; current: boolean; base: ViewStyle; testID?: string }) {
  const c = useTheme();
  const { style, handlers } = usePressScale(0.98);
  const [down, setDown] = React.useState(false);
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: current }}
      onPress={() => {
        crumb.action(label);
        onPress();
      }}
      onPressIn={() => {
        handlers.onPressIn();
        setDown(true);
      }}
      onPressOut={() => {
        handlers.onPressOut();
        setDown(false);
      }}
      android_ripple={{ color: c.tint }}
      style={{ marginHorizontal: -space[2] }}
    >
      <Animated.View
        style={[
          base,
          {
            paddingHorizontal: space[2],
            borderRadius: 8,
            backgroundColor: down ? c.tint : "transparent",
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

/** A settings row with a switch on the right. The whole row toggles it. */
export function SwitchRow({ title, meta, value, onChange, disabled, testID }: { title: string; meta?: string; value: boolean; onChange: (next: boolean) => void; disabled?: boolean; testID?: string }) {
  const c = useTheme();
  const toggle = () => {
    if (disabled) return;
    haptic.select();
    onChange(!value);
  };
  return (
    <Pressable
      testID={testID}
      accessibilityRole="switch"
      accessibilityLabel={title}
      accessibilityHint={meta}
      accessibilityState={{ checked: value, disabled: !!disabled }}
      onPress={toggle}
      style={{
        minHeight: layout.row,
        paddingVertical: space[2],
        flexDirection: "row",
        alignItems: "center",
        gap: space[4],
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <T v="bodyStrong">{title}</T>
        {meta ? (
          <T v="small" tone="muted">
            {meta}
          </T>
        ) : null}
      </View>
      <View pointerEvents="none" importantForAccessibility="no-hide-descendants">
        <Switch value={value} disabled={disabled} trackColor={{ false: c.fieldLine, true: c.switchOn }} thumbColor={value ? c.switchThumb : "#ffffff"} ios_backgroundColor={c.fieldLine} {...({ activeThumbColor: c.switchThumb, activeTrackColor: c.switchOn } as object)} />
      </View>
    </Pressable>
  );
}

/* ---------------------------------------------------------- Tint, Card */

/** A soft fill, no border: a small group that must read as one thing. */
export function Tint({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const c = useTheme();
  return <View style={[{ borderRadius: layout.radius, backgroundColor: c.tint, padding: space[4], gap: space[2] }, style]}>{children}</View>;
}

/** One object tapped as a whole (a certificate, a case): a 1.5px outline, 12px corners, no shadow. */
export function Card({ children, onPress, accessibilityLabel, style, testID }: { children?: React.ReactNode; onPress?: () => void; accessibilityLabel?: string; style?: StyleProp<ViewStyle>; testID?: string }) {
  const c = useTheme();
  const base: ViewStyle = {
    borderRadius: layout.radius,
    borderWidth: 1.5,
    borderColor: c.cardLine,
    backgroundColor: c.card,
    padding: space[4],
    gap: space[3],
  };
  if (!onPress)
    return (
      <View testID={testID} style={[base, style]}>
        {children}
      </View>
    );
  return (
    <PressCard testID={testID} label={accessibilityLabel} onPress={onPress} base={base} style={style}>
      {children}
    </PressCard>
  );
}

/** A pressable card: sinks to 0.97 and its outline darkens to ink while held. */
function PressCard({ children, onPress, label, base, style, testID }: { children?: React.ReactNode; onPress: () => void; label?: string; base: ViewStyle; style?: StyleProp<ViewStyle>; testID?: string }) {
  const c = useTheme();
  const { style: anim, handlers } = usePressScale(0.97);
  const [down, setDown] = React.useState(false);
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      onPressIn={() => {
        handlers.onPressIn();
        setDown(true);
      }}
      onPressOut={() => {
        handlers.onPressOut();
        setDown(false);
      }}
    >
      <Animated.View style={[base, down ? { borderColor: c.ink } : null, style, anim]}>{children}</Animated.View>
    </Pressable>
  );
}

/* ------------------------------------------------- Stat, ProgressLine */

/** A number and its label, inline. Several sit in one row with gaps, no boxes. */
export function Stat({ value, label, pixel }: { value: string; label: string; /** The pixel font, for scores only. */ pixel?: boolean }) {
  // A plain number (with an optional sign, unit or %) rolls into place.
  const frac = /^(\d+)\/(\d+)$/.exec(value);
  const m = /^(\D{0,2})(\d{1,3}(?:,\d{3})*|\d+)(\D{0,3})$/.exec(value);
  return (
    <View style={{ minWidth: 0, flexShrink: 1 }} accessible accessibilityLabel={`${label}: ${value}`}>
      {frac ? (
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <RollingNumber v={pixel ? "score" : "h2"} value={Number(frac[1] ?? 0)} />
          <T v={pixel ? "score" : "h2"} num>
            /{frac[2]}
          </T>
        </View>
      ) : m ? (
        <RollingNumber v={pixel ? "score" : "h2"} prefix={m[1] ?? ""} suffix={m[3] ?? ""} value={Number((m[2] ?? "0").replace(/,/g, ""))} format={m[2]?.includes(",") ? (n) => n.toLocaleString("en-IN") : undefined} />
      ) : (
        <T v={pixel ? "score" : "h2"} num>
          {value}
        </T>
      )}
      <T v="caption" tone="muted">
        {label}
      </T>
    </View>
  );
}

/** A thin line that fills from the left (700ms, strong ease-out; transform only). `value` is 0 to 100. */
export function ProgressLine({ value, label, height = 6 }: { value: number; label?: string; height?: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label ?? "Progress"} accessibilityValue={{ min: 0, max: 100, now: pct }} style={{ alignSelf: "stretch" }}>
      <ProgressFill pct={pct} height={height} />
    </View>
  );
}

/* ------------------------------------------------------------ Skeleton */

/** A grey shape standing in for content while it loads. A soft light sweeps across it; still when motion is reduced. */
export function Skeleton({ w = "100%", h = 16, r = 6, style }: { w?: number | `${number}%`; h?: number; r?: number; style?: StyleProp<ViewStyle> }) {
  const c = useTheme();
  return (
    <View style={[{ width: w, height: h, borderRadius: r, backgroundColor: c.skeleton, overflow: "hidden" }, style]}>
      <Shimmer />
    </View>
  );
}

/** A list of rows while it loads. */
export function RowsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <SkeletonIn>
      <View accessibilityRole="progressbar" accessibilityLabel="Loading" style={{ gap: space[1] }}>
        {Array.from({ length: rows }, (_, i) => (
          <View key={i} style={{ minHeight: layout.row, justifyContent: "center", gap: space[2] }}>
            <Skeleton w={i % 2 ? "58%" : "72%"} h={16} />
            <Skeleton w={i % 2 ? "34%" : "44%"} h={12} />
          </View>
        ))}
      </View>
    </SkeletonIn>
  );
}

/* ---------------------------------------------------------- EmptyState */

/** Older mood names, still accepted: they map to the meme that fits them best. */
type OldMood = "calm" | "sleepy" | "puzzled";
const OLD: Record<OldMood, StateMood> = { calm: "soon", sleepy: "empty", puzzled: "missing" };
export type EmptyMood = StateMood | OldMood;

/**
 * Nothing here, or something went wrong: a meme picture (see STATE_STICKER
 * for which one each `mood` shows), one line, and at most one action.
 */
export function EmptyState({ title, body, action, mood = "empty", testID }: { title: string; body?: string; action?: { label: string; onPress: () => void; primary?: boolean }; mood?: EmptyMood; testID?: string }) {
  const m = mood in OLD ? OLD[mood as OldMood] : (mood as StateMood);
  return (
    <View testID={testID} style={{ alignItems: "flex-start", gap: space[3], paddingVertical: space[5] }}>
      <Meme mood={m} />
      <T v="h2">{title}</T>
      {body ? (
        <T tone="muted" style={{ maxWidth: 420 }}>
          {body}
        </T>
      ) : null}
      {action ? <Button kind={action.primary ? "primary" : "quiet"} label={action.label} onPress={action.onPress} style={{ marginTop: space[2] }} /> : null}
    </View>
  );
}

/** The usual "could not load" state. */
export function LoadError({ onRetry, what = "this", error }: { onRetry: () => void; what?: string; /** The failure, so the line says what really happened. */ error?: unknown }) {
  // Only blame the internet when the phone really could not reach the server (reasonOf).
  const body = reasonOf(error);
  return <EmptyState mood="error" title={`Could not load ${what}`} body={body} action={{ label: "Try again", onPress: onRetry }} testID="load-error" />;
}

/* ------------------------------------------------------- Chips, TabRow */

/** One chip: sinks while pressed. */
function Chip({ name, on, onPress }: { name: string; on: boolean; onPress: () => void }) {
  const c = useTheme();
  const { style, handlers } = usePressScale(0.94);
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={name} onPress={onPress} {...handlers} style={{ minHeight: layout.target, justifyContent: "center", maxWidth: "100%" }}>
      <Animated.View
        style={[
          {
            minHeight: 36,
            paddingHorizontal: space[4],
            paddingVertical: space[1],
            justifyContent: "center",
            borderRadius: 18,
            borderWidth: 1.5,
            borderColor: on ? c.ink : c.cardLine,
            backgroundColor: on ? c.ink : "transparent",
          },
          style,
        ]}
      >
        <T v="small" style={{ color: on ? c.bg : c.ink }}>
          {name}
        </T>
      </Animated.View>
    </Pressable>
  );
}

/** Filter chips that wrap; with `scroll`, one row that slides sideways (filters above a list). */
export function Chips<V extends string>({ options, value, onChange, label, scroll }: { options: { id: V; name: string }[]; value: V; onChange: (v: V) => void; label: string; scroll?: boolean }) {
  const row = (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: "row", flexWrap: scroll ? "nowrap" : "wrap", gap: space[2] }}>
      {options.map((o) => (
        <Chip
          key={o.id}
          name={o.name}
          on={o.id === value}
          onPress={() => {
            haptic.select();
            onChange(o.id);
          }}
        />
      ))}
    </View>
  );
  if (!scroll) return row;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -layout.gutter }} contentContainerStyle={{ paddingHorizontal: layout.gutter }}>
      {row}
    </ScrollView>
  );
}

/** Underlined tabs inside a screen (About, Materials). One ink underline springs to the tab you pick. */
export function TabRow<V extends string>({ tabs, value, onChange, scroll = true }: { tabs: { id: V; name: string }[]; value: V; onChange: (v: V) => void; /** False when a parent already scrolls the row sideways. */ scroll?: boolean }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const boxes = React.useRef<Record<string, { x: number; w: number }>>({});
  const x = useSharedValue(0);
  const w = useSharedValue(0);
  const move = React.useCallback(
    (id: string, animate: boolean) => {
      const b = boxes.current[id];
      if (!b) return;
      x.set(animate && !reduce ? withSpring(b.x, springs.snappy) : b.x);
      w.set(animate && !reduce ? withSpring(b.w, springs.snappy) : b.w);
    },
    [reduce, x, w],
  );
  React.useEffect(() => move(value, true), [value, move]);
  const bar = useAnimatedStyle(() => ({
    opacity: w.value > 0 ? 1 : 0,
    transform: [{ translateX: x.value }, { scaleX: w.value }],
  }));
  const rowStyle: ViewStyle = { flexDirection: "row", gap: space[5], borderBottomWidth: 1, borderColor: c.hairline };
  const items = (
    <>
      {tabs.map((t) => {
        const on = t.id === value;
        return (
          <Pressable
            key={t.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onLayout={(e: LayoutChangeEvent) => {
              boxes.current[t.id] = { x: e.nativeEvent.layout.x, w: e.nativeEvent.layout.width };
              if (on) move(t.id, false);
            }}
            onPress={() => {
              haptic.select();
              onChange(t.id);
            }}
            style={{ minHeight: layout.target, justifyContent: "center" }}
          >
            <T v="bodyStrong" tone={on ? "ink" : "muted"}>
              {t.name}
            </T>
          </Pressable>
        );
      })}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            left: 0,
            bottom: -1,
            width: 1,
            height: 2,
            backgroundColor: c.ink,
            transformOrigin: "left",
          },
          bar,
        ]}
      />
    </>
  );
  if (!scroll)
    return (
      <View accessibilityRole="tablist" style={rowStyle}>
        {items}
      </View>
    );
  // Slides sideways when the names do not fit (a narrow phone with large text), instead of cutting the last tab off.
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityRole="tablist" style={{ flexGrow: 0 }} contentContainerStyle={[rowStyle, { minWidth: "100%" }]}>
      {items}
    </ScrollView>
  );
}
