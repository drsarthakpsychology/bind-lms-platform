import { ChevronRight } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, Switch, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

import { haptic } from "@/lib/haptics";
import { SketchCat } from "@/sketch/cat";
import { layout, motion, space, useTheme } from "@/theme";
import { Button } from "./button";
import { T } from "./text";

/* ------------------------------------------------------------- Section */

/** A heading and its content. No border, no background: whitespace groups it. */
export function Section({ title, action, children, quiet, style }: { title?: string; action?: React.ReactNode; children?: React.ReactNode; /** A small grey label instead of a heading (settings groups). */ quiet?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ gap: space[3] }, style]}>
      {title || action ? (
        <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: space[4] }}>
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
      {children}
    </View>
  );
}

/* ------------------------------------------------------- RowList + Row */

/** Rows with a 1px hairline between them and above and below. */
export function RowList({ children, bare, style }: { children?: React.ReactNode; /** No line above the first and below the last row. */ bare?: boolean; style?: StyleProp<ViewStyle> }) {
  const c = useTheme();
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <View accessibilityRole="list" style={[{ borderColor: c.hairline, borderTopWidth: bare ? 0 : 1, borderBottomWidth: bare ? 0 : 1 }, style]}>
      {items.map((child, i) => (
        <View key={i} style={i > 0 ? { borderTopWidth: 1, borderColor: c.hairline } : null}>
          {child}
        </View>
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
          {unread ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.brand }} /> : null}
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
        <T v="small" tone="muted" num>
          {trailing}
        </T>
      ) : (
        trailing
      )}
      {onPress && chevron !== false ? <ChevronRight size={20} color={c.muted} /> : null}
    </>
  );
  const base: ViewStyle = { minHeight: layout.row, paddingVertical: space[2], flexDirection: "row", alignItems: "center", gap: space[4] };
  if (!onPress) return <View testID={testID} style={base}>{body}</View>;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (meta ? `${title}. ${meta}` : title)}
      accessibilityState={{ selected: !!current }}
      onPress={onPress}
      android_ripple={{ color: c.tint }}
      style={({ pressed }) => [base, { marginHorizontal: -space[2], paddingHorizontal: space[2], borderRadius: 8, backgroundColor: pressed ? c.tint : "transparent" }]}
    >
      {body}
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
    <Pressable testID={testID} accessibilityRole="switch" accessibilityLabel={title} accessibilityHint={meta} accessibilityState={{ checked: value, disabled: !!disabled }} onPress={toggle} style={{ minHeight: layout.row, paddingVertical: space[2], flexDirection: "row", alignItems: "center", gap: space[4], opacity: disabled ? 0.5 : 1 }}>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <T v="bodyStrong">{title}</T>
        {meta ? (
          <T v="small" tone="muted">
            {meta}
          </T>
        ) : null}
      </View>
      <View pointerEvents="none" importantForAccessibility="no-hide-descendants">
        <Switch value={value} disabled={disabled} trackColor={{ false: c.cardLine, true: c.brand }} thumbColor="#ffffff" ios_backgroundColor={c.cardLine} {...({ activeThumbColor: "#ffffff", activeTrackColor: c.brand } as object)} />
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
  const base: ViewStyle = { borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: c.card, padding: space[4], gap: space[3] };
  if (!onPress) return <View testID={testID} style={[base, style]}>{children}</View>;
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={({ pressed }) => [base, pressed ? { borderColor: c.ink, transform: [{ scale: 0.99 }] } : null, style]}>
      {children}
    </Pressable>
  );
}

/* ------------------------------------------------- Stat, ProgressLine */

/** A number and its label, inline. Several sit in one row with gaps, no boxes. */
export function Stat({ value, label, pixel }: { value: string; label: string; /** The pixel font, for scores only. */ pixel?: boolean }) {
  return (
    <View style={{ minWidth: 0, flexShrink: 1 }} accessible accessibilityLabel={`${label}: ${value}`}>
      <T v={pixel ? "score" : "h2"} num>
        {value}
      </T>
      <T v="caption" tone="muted">
        {label}
      </T>
    </View>
  );
}

/** A thin lime line that fills over 600ms. `value` is 0 to 100. */
export function ProgressLine({ value, label, height = 6 }: { value: number; label?: string; height?: number }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const fill = useSharedValue(0);
  React.useEffect(() => {
    fill.value = reduce ? pct / 100 : withTiming(pct / 100, { duration: motion.fill, easing: Easing.bezier(...motion.easeOut) });
  }, [pct, reduce, fill]);
  const bar = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label ?? "Progress"} accessibilityValue={{ min: 0, max: 100, now: pct }} style={{ height, borderRadius: height / 2, backgroundColor: c.hairline, overflow: "hidden", alignSelf: "stretch" }}>
      <Animated.View style={[{ height: "100%", borderRadius: height / 2, backgroundColor: c.dark ? c.primary : c.ink }, bar]} />
    </View>
  );
}

/* ------------------------------------------------------------ Skeleton */

/** A grey shape standing in for content while it loads. Breathes gently; still when motion is reduced. */
export function Skeleton({ w = "100%", h = 16, r = 6, style }: { w?: number | `${number}%`; h?: number; r?: number; style?: StyleProp<ViewStyle> }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const o = useSharedValue(1);
  React.useEffect(() => {
    if (reduce) return;
    o.value = withRepeat(withTiming(0.45, { duration: 900, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [reduce, o]);
  const pulse = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[{ width: w, height: h, borderRadius: r, backgroundColor: c.skeleton }, pulse, style]} />;
}

/** A list of rows while it loads. */
export function RowsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <View accessibilityRole="progressbar" accessibilityLabel="Loading" style={{ gap: space[1] }}>
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={{ minHeight: layout.row, justifyContent: "center", gap: space[2] }}>
          <Skeleton w={i % 2 ? "58%" : "72%"} h={16} />
          <Skeleton w={i % 2 ? "34%" : "44%"} h={12} />
        </View>
      ))}
    </View>
  );
}

/* ---------------------------------------------------------- EmptyState */

/** Nothing here, or something went wrong: the cat, one line, and at most one action. */
export function EmptyState({ title, body, action, mood = "calm", testID }: { title: string; body?: string; action?: { label: string; onPress: () => void; primary?: boolean }; mood?: "calm" | "sleepy" | "puzzled"; testID?: string }) {
  return (
    <View testID={testID} style={{ alignItems: "flex-start", gap: space[3], paddingVertical: space[5] }}>
      <SketchCat mood={mood} />
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
export function LoadError({ onRetry, what = "this" }: { onRetry: () => void; what?: string }) {
  return <EmptyState mood="puzzled" title={`Could not load ${what}`} body="Check your internet and try again." action={{ label: "Try again", onPress: onRetry }} testID="load-error" />;
}

/* ------------------------------------------------------- Chips, TabRow */

/** Filter chips that wrap; with `scroll`, one row that slides sideways (filters above a list). */
export function Chips<V extends string>({ options, value, onChange, label, scroll }: { options: { id: V; name: string }[]; value: V; onChange: (v: V) => void; label: string; scroll?: boolean }) {
  const c = useTheme();
  const row = (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: "row", flexWrap: scroll ? "nowrap" : "wrap", gap: space[2] }}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            accessibilityLabel={o.name}
            onPress={() => {
              haptic.select();
              onChange(o.id);
            }}
            style={{ minHeight: layout.target, justifyContent: "center" }}
          >
            <View style={{ minHeight: 36, paddingHorizontal: space[4], justifyContent: "center", borderRadius: 18, borderWidth: 1.5, borderColor: on ? c.ink : c.cardLine, backgroundColor: on ? c.ink : "transparent" }}>
              <T v="small" style={{ color: on ? c.bg : c.ink }}>
                {o.name}
              </T>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
  if (!scroll) return row;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -layout.gutter }} contentContainerStyle={{ paddingHorizontal: layout.gutter }}>
      {row}
    </ScrollView>
  );
}

/** Underlined tabs inside a screen (About, Materials). */
export function TabRow<V extends string>({ tabs, value, onChange }: { tabs: { id: V; name: string }[]; value: V; onChange: (v: V) => void }) {
  const c = useTheme();
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: "row", gap: space[5], borderBottomWidth: 1, borderColor: c.hairline }}>
      {tabs.map((t) => {
        const on = t.id === value;
        return (
          <Pressable
            key={t.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => {
              haptic.select();
              onChange(t.id);
            }}
            style={{ minHeight: layout.target, justifyContent: "center", borderBottomWidth: 2, borderColor: on ? c.ink : "transparent", marginBottom: -1 }}
          >
            <T v="bodyStrong" tone={on ? "ink" : "muted"}>
              {t.name}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}
