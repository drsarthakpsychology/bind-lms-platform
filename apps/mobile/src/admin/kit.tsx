/**
 * The admin kit: small parts over the app's design system (src/ds), the
 * native twins of the website's admin kit (src/app/(dashboard)/admin/_v2/kit.tsx):
 * Status (a dot and words), Tag, Meter, Figures, Block, SearchBox, Check,
 * ActionBar, ConfirmSheet, OptionRow, Facts, Notice, Avatar, DayBars.
 * Nothing in src/ds is changed.
 */
import { Check as CheckIcon, Search, X } from "lucide-react-native";
import * as React from "react";
import { AccessibilityInfo, Animated as RNAnimated, PanResponder, Pressable, ScrollView, TextInput, View, type StyleProp, type ViewStyle } from "react-native";
import Reanimated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import type { UseQueryResult } from "@tanstack/react-query";

import { Button, Field, Loaded as DsLoaded, Sheet, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { layout, space, type as scale, useTheme, type Palette } from "@/theme";
import type { Tone } from "./format";

/** Status colours stay out of the brand pair: a dot never carries meaning alone, the words do. */
export function toneColor(c: Palette, tone: Tone): string {
  switch (tone) {
    case "ok":
      return c.ok;
    case "warn":
      return c.warn;
    case "alert":
      return c.alertFg;
    case "info":
      return c.accent;
    default:
      return c.faint;
  }
}

/** A status in words with a small dot. */
export function Status({ tone, children, strong, testID }: { tone: Tone; children: React.ReactNode; strong?: boolean; testID?: string }) {
  const c = useTheme();
  return (
    <View testID={testID} style={{ flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1, minWidth: 0 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: toneColor(c, tone) }} />
      <T v="small" tone={tone === "alert" ? "alert" : "ink"} style={[{ flexShrink: 1 }, strong ? { fontFamily: scale.bodyStrong.fontFamily } : null]}>
        {children}
      </T>
    </View>
  );
}

/** A small flat label (a cohort, a flag). */
export function Tag({ children, tone = "quiet" }: { children: React.ReactNode; tone?: "quiet" | "warn" | "alert" }) {
  const c = useTheme();
  const bg = tone === "alert" ? c.alertBg : tone === "warn" ? c.warnBg : c.tint;
  const fg = tone === "alert" ? c.alertFg : tone === "warn" ? c.warnFg : c.ink;
  return (
    <View style={{ borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: bg, maxWidth: "100%" }}>
      <T v="caption" style={{ color: fg }}>
        {children}
      </T>
    </View>
  );
}

export function Tags({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[1] }}>{children}</View>;
}

/** A thin progress line with its number on the left. */
export function Meter({ pct, label, tone = "info" }: { pct: number; label?: string; tone?: "info" | "warn" }) {
  const c = useTheme();
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], minWidth: 0 }} accessible accessibilityRole="progressbar" accessibilityLabel={label ?? `${p}%`} accessibilityValue={{ min: 0, max: 100, now: p }}>
      {label ? (
        <T v="small" num>
          {label}
        </T>
      ) : null}
      <View style={{ height: 4, flex: 1, minWidth: 32, borderRadius: 2, overflow: "hidden", backgroundColor: c.hairline }}>
        <View style={{ height: "100%", width: `${p}%`, borderRadius: 2, backgroundColor: tone === "warn" ? toneColor(c, "warn") : c.dark ? c.primary : c.brand }} />
      </View>
    </View>
  );
}

/** Numbers in one quiet line (two per row on a phone), never boxed. A number can open a screen. */
export function Figures({ items }: { items: { value: string; label: string; onPress?: () => void; testID?: string }[] }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: space[4] }}>
      {items.map((it, i) => {
        const body = (
          <>
            <T v="h2" num>
              {it.value}
            </T>
            <T v="caption" tone="muted" style={it.onPress ? { textDecorationLine: "underline", textDecorationColor: c.cardLine } : null}>
              {it.label}
            </T>
          </>
        );
        return (
          <View key={i} style={{ width: "50%", paddingRight: space[4], minWidth: 0 }}>
            {it.onPress ? (
              <Pressable testID={it.testID} accessibilityRole="button" accessibilityLabel={`${it.value} ${it.label}`} onPress={it.onPress} hitSlop={6} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, alignSelf: "flex-start" })}>
                {body}
              </Pressable>
            ) : (
              <View accessible accessibilityLabel={`${it.value} ${it.label}`}>
                {body}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

/** A heading with an optional count and one link on the right. */
export function Block({ title, count, action, children, style, testID }: { title: string; count?: number; action?: { label: string; onPress: () => void; testID?: string }; children?: React.ReactNode; style?: StyleProp<ViewStyle>; testID?: string }) {
  return (
    <View testID={testID} style={[{ gap: space[3] }, style]}>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: space[3] }}>
        <T v="h3" style={{ flexShrink: 1 }}>
          {title}
        </T>
        {count ? (
          <T v="small" tone="muted" num>
            {count}
          </T>
        ) : null}
        <View style={{ flex: 1 }} />
        {action ? (
          <Pressable testID={action.testID} accessibilityRole="link" onPress={action.onPress} hitSlop={10} style={{ minHeight: 32, justifyContent: "center" }}>
            <T v="small" tone="link">
              {action.label}
            </T>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/** "Nothing here" inside a section: one quiet line between hairlines, no cat (the cat is for whole screens). */
export function Quiet({ children }: { children: React.ReactNode }) {
  const c = useTheme();
  return (
    <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline, paddingVertical: space[4] }}>
      <T v="small" tone="muted">
        {children}
      </T>
    </View>
  );
}

/** The search box above a list. */
export function SearchBox({ value, onChange, placeholder, label, testID }: { value: string; onChange: (v: string) => void; placeholder: string; label: string; testID?: string }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], minHeight: layout.target, borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.fieldLine, backgroundColor: c.card, paddingLeft: space[3], flex: 1, minWidth: 0 }}>
      <Search size={18} color={c.muted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={c.faint}
        keyboardAppearance={c.dark ? "dark" : "light"}
        selectionColor={c.accent}
        accessibilityLabel={label}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        maxFontSizeMultiplier={1.4}
        style={[scale.body, { flex: 1, minWidth: 0, color: c.ink, minHeight: layout.target - 4 }, { outlineStyle: "none" } as object]}
        testID={testID}
      />
      {value ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => onChange("")} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}>
          <X size={18} color={c.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** A 48px tap area around a small square tick box. */
export function Check({ on, onPress, label, testID }: { on: boolean; onPress: () => void; label: string; testID?: string }) {
  const c = useTheme();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: on }}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}
    >
      <View style={{ width: 22, height: 22, borderRadius: 5, borderWidth: 1.5, borderColor: on ? c.link : c.fieldLine, backgroundColor: on ? c.link : "transparent", alignItems: "center", justifyContent: "center" }}>
        {on ? <CheckIcon size={15} strokeWidth={3} color={c.bg} /> : null}
      </View>
    </Pressable>
  );
}

/**
 * The one action bar, shown only while something is selected. It sits where
 * the thumb is (the screen's pinned footer): the count, then the actions,
 * then Clear.
 */
export function ActionBar({ count, onClear, children, testID }: { count: number; onClear: () => void; children?: React.ReactNode; testID?: string }) {
  return (
    <View testID={testID} accessibilityLabel="Actions for the selected students" style={{ gap: space[2] }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <T v="bodyStrong" num>
          {count} selected
        </T>
        <Button kind="text" label="Clear" onPress={onClear} testID="action-clear" />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>{children}</View>
    </View>
  );
}

/** A compact outline button for the action bar and row actions. */
export function SmallButton({ label, onPress, icon, busy, danger, testID }: { label: string; onPress: () => void; icon?: React.ReactNode; busy?: boolean; danger?: boolean; testID?: string }) {
  const c = useTheme();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: !!busy, disabled: !!busy }}
      disabled={busy}
      onPress={onPress}
      style={({ pressed }) => ({ minHeight: 44, paddingHorizontal: space[3], borderRadius: 10, borderWidth: 1.5, borderColor: danger ? c.danger : c.cardLine, flexDirection: "row", alignItems: "center", gap: space[2], backgroundColor: pressed ? c.tint : "transparent", opacity: busy ? 0.55 : 1 })}
    >
      {icon}
      <T v="small" tone={danger ? "danger" : "ink"} style={{ fontFamily: scale.bodyStrong.fontFamily }}>
        {busy ? `${label}…` : label}
      </T>
    </Pressable>
  );
}

/** A row in a sheet that picks one value. */
export function OptionRow({ label, meta, on, onPress, testID }: { label: string; meta?: string; on: boolean; onPress: () => void; testID?: string }) {
  const c = useTheme();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected: on }}
      accessibilityLabel={meta ? `${label}. ${meta}` : label}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      style={({ pressed }) => ({ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[3], paddingVertical: space[2], marginHorizontal: -space[2], paddingHorizontal: space[2], borderRadius: 8, backgroundColor: pressed ? c.tint : "transparent" })}
    >
      <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: on ? 7 : 1.5, borderColor: on ? c.link : c.cardLine }} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <T v="bodyStrong">{label}</T>
        {meta ? (
          <T v="small" tone="muted">
            {meta}
          </T>
        ) : null}
      </View>
    </Pressable>
  );
}

/** Before something that is hard to undo (lock, revoke). Optional reason box. */
export function ConfirmSheet({
  open,
  onClose,
  title,
  body,
  confirm,
  onConfirm,
  danger,
  busy,
  reason,
  testID,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  body?: string;
  confirm: string;
  onConfirm: (reason: string) => void;
  danger?: boolean;
  busy?: boolean;
  /** Ask for a reason (and require one). */
  reason?: { label: string; required?: boolean };
  testID?: string;
}) {
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  return (
    <Sheet open={open} onClose={onClose} title={title} testID={testID}>
      <View style={{ gap: space[4] }}>
        {body ? <T tone="muted">{body}</T> : null}
        {reason ? <Field label={reason.label} value={text} onChangeText={setText} error={error} maxLength={300} testID="confirm-reason" /> : null}
        <Button
          kind={danger ? "quiet" : "primary"}
          label={confirm}
          busy={busy}
          testID="confirm-go"
          onPress={() => {
            if (reason?.required && !text.trim()) return setError("Write a short reason.");
            setError(null);
            onConfirm(text.trim());
          }}
        />
        <Button kind="text" full label="Cancel" onPress={onClose} />
      </View>
    </Sheet>
  );
}

/** Label and value pairs, two to a line where they fit. */
export function Facts({ items }: { items: { label: string; value: string; onPress?: () => void }[] }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: space[3] }}>
      {items.map((f) => (
        <View key={f.label} style={{ width: "50%", paddingRight: space[3], minWidth: 0 }}>
          <T v="caption" tone="muted">
            {f.label}
          </T>
          {f.onPress ? (
            <Pressable accessibilityRole="link" onPress={f.onPress} hitSlop={6}>
              <T v="small" tone="link" style={{ fontFamily: scale.bodyStrong.fontFamily }}>
                {f.value}
              </T>
            </Pressable>
          ) : (
            <T v="small" style={{ fontFamily: scale.bodyStrong.fontFamily }}>
              {f.value}
            </T>
          )}
        </View>
      ))}
    </View>
  );
}

/** One tinted line: the next step on a profile, the view-only note, a warning. */
export function Notice({ children, tone = "plain", action, testID }: { children: React.ReactNode; tone?: "plain" | "warn" | "alert"; action?: React.ReactNode; testID?: string }) {
  const c = useTheme();
  const bg = tone === "alert" ? c.alertBg : tone === "warn" ? c.warnBg : c.tint;
  return (
    <View testID={testID} style={{ borderRadius: layout.radius, backgroundColor: bg, padding: space[4], gap: space[3] }}>
      {typeof children === "string" ? <T v="small">{children}</T> : children}
      {action}
    </View>
  );
}

/** The round initial (More, a thread). Blue, the brand. */
export function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  const c = useTheme();
  const initial = (name.trim()[0] ?? "A").toUpperCase();
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.brand, alignItems: "center", justifyContent: "center" }}>
      <T v="h3" tone="onBrand" maxFontSizeMultiplier={1}>
        {initial}
      </T>
    </View>
  );
}

/** Minutes per day for 30 days, as thin bars. The pixel font labels the peak. */
export function DayBars({ days }: { days: { day: string; min: number }[] }) {
  const c = useTheme();
  const max = Math.max(10, ...days.map((d) => d.min));
  const peak = Math.max(0, ...days.map((d) => d.min));
  return (
    <View style={{ gap: space[2] }}>
      <View accessible accessibilityRole="image" accessibilityLabel={`Minutes per day for the last 30 days. Most in one day: ${peak} minutes.`} style={{ height: 96, flexDirection: "row", alignItems: "flex-end", gap: 3, borderBottomWidth: 1, borderColor: c.hairline }}>
        {days.map((d) => (
          <View key={d.day} style={{ flex: 1, height: `${Math.max(d.min ? 5 : 1, (d.min / max) * 100)}%`, borderTopLeftRadius: 2, borderTopRightRadius: 2, backgroundColor: d.min ? (c.dark ? c.primary : c.brand) : c.hairline }} />
        ))}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <T v="caption" tone="muted" num>
          {days[0]?.day.slice(5).split("-").reverse().join("/") ?? ""}
        </T>
        <T v="caption" tone="muted">
          Today
        </T>
      </View>
    </View>
  );
}

/** A plain row with a leading tick box: for lists you can select from. */
export function SelectRow({ on, onToggle, label, children, testID }: { on: boolean; onToggle: () => void; label: string; children: React.ReactNode; testID?: string }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: -space[2], paddingRight: space[2], borderRadius: 8, backgroundColor: on ? c.selected : "transparent" }}>
      <Check on={on} onPress={onToggle} label={label} testID={testID ? `${testID}-check` : undefined} />
      <View style={{ flex: 1, minWidth: 0 }}>{children}</View>
    </View>
  );
}

/** Just the dot, for a row icon where the words sit in the row itself. */
export function Dot({ tone }: { tone: Tone }) {
  const c = useTheme();
  return <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: toneColor(c, tone) }} />;
}

/* ------------------------------------------------------------- motion bits */

/**
 * Filter chips: the picked one fills and gets a tick that fades in; each
 * press gives a small squeeze and a tick of the phone. Scrolls sideways when
 * there are many. Reduce Motion turns the movement off, never the meaning.
 */
export function FilterChips<V extends string>({ options, value, onChange, label, testID }: { options: { id: V; name: string; count?: number }[]; value: V; onChange: (v: V) => void; label: string; testID?: string }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -layout.gutter, flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: layout.gutter }} testID={testID}>
      <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: "row", gap: space[2] }}>
        {options.map((o) => (
          <Chip key={o.id} on={o.id === value} name={o.name} count={o.count} onPress={() => onChange(o.id)} testID={testID ? `${testID}-${o.id || "all"}` : undefined} />
        ))}
      </View>
    </ScrollView>
  );
}

function Chip({ on, name, count, onPress, testID }: { on: boolean; name: string; count?: number; onPress: () => void; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [scale] = React.useState(() => new RNAnimated.Value(1));
  const to = (v: number) => {
    if (reduce) return;
    RNAnimated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: v === 1 ? 10 : 0 }).start();
  };
  return (
    <Pressable
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected: on }}
      accessibilityLabel={count !== undefined ? `${name}, ${count}` : name}
      onPressIn={() => to(0.94)}
      onPressOut={() => to(1)}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      style={{ minHeight: layout.target, justifyContent: "center" }}
    >
      <RNAnimated.View style={{ transform: [{ scale }], minHeight: 36, paddingHorizontal: space[3], flexDirection: "row", alignItems: "center", gap: space[1], borderRadius: 18, borderWidth: 1.5, borderColor: on ? c.ink : c.cardLine, backgroundColor: on ? c.ink : "transparent" }}>
        {on ? (
          <Reanimated.View entering={reduce ? undefined : FadeIn.duration(160)}>
            <CheckIcon size={14} color={c.bg} strokeWidth={3} />
          </Reanimated.View>
        ) : null}
        <T v="small" style={{ color: on ? c.bg : c.ink }}>
          {name}
        </T>
        {count !== undefined ? (
          <T v="caption" num style={{ color: on ? c.bg : c.muted }}>
            {count}
          </T>
        ) : null}
      </RNAnimated.View>
    </Pressable>
  );
}

/**
 * A row that slides left to show one action (Revoke, Mark paid, Email ...).
 * The same action is always on the row's own screen or sheet too, and a
 * screen reader gets it as a named action, so the swipe is a shortcut only.
 */
export function SwipeRow({ children, action, enabled = true, testID }: { children: React.ReactNode; action: { label: string; onPress: () => void; danger?: boolean }; enabled?: boolean; testID?: string }) {
  const c = useTheme();
  const [x] = React.useState(() => new RNAnimated.Value(0));
  const W = 96;
  // The gesture and its "is it open" flag live together, made once per row.
  const { pan, settle } = React.useMemo(() => {
    const st = { opened: false };
    const to = (v: number) => {
      st.opened = v !== 0;
      RNAnimated.spring(x, { toValue: v, useNativeDriver: true, speed: 22, bounciness: v ? 6 : 0 }).start();
    };
    const responder = PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) => enabled && Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_e, g) => x.setValue(Math.max(-W * 1.3, Math.min(0, g.dx + (st.opened ? -W : 0)))),
      onPanResponderRelease: (_e, g) => {
        const end = g.dx + (st.opened ? -W : 0);
        if (end < -W * 0.5) {
          if (!st.opened) haptic.select();
          to(-W);
        } else to(0);
      },
      onPanResponderTerminate: () => to(st.opened ? -W : 0),
    });
    return { pan: responder, settle: to };
  }, [enabled, x]);
  if (!enabled) return <>{children}</>;
  const run = () => {
    settle(0);
    action.onPress();
  };
  return (
    <View testID={testID} style={{ overflow: "hidden" }} accessibilityActions={[{ name: action.label, label: action.label }]} onAccessibilityAction={(e) => e.nativeEvent.actionName === action.label && run()}>
      <View style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: W, alignItems: "stretch", justifyContent: "center" }}>
        <Pressable accessibilityRole="button" accessibilityLabel={action.label} onPress={run} testID={testID ? `${testID}-action` : undefined} style={({ pressed }) => ({ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: action.danger ? c.danger : c.ink, opacity: pressed ? 0.85 : 1 })}>
          <T v="small" style={{ color: c.bg, fontFamily: scale.bodyStrong.fontFamily }}>
            {action.label}
          </T>
        </Pressable>
      </View>
      <RNAnimated.View {...pan.panHandlers} style={{ transform: [{ translateX: x }], backgroundColor: c.bg }}>
        {children}
      </RNAnimated.View>
    </View>
  );
}

/** Announce a change to screen readers (a sent message, a revoked key). */
export const announce = (line: string) => AccessibilityInfo.announceForAccessibility?.(line);

/* --------------------------------------------------------- never crash */

type BoundaryState = { failed: boolean };
/**
 * Admin screens must never take the app down. If something the server sent
 * cannot be drawn, this part shows a quiet line and the rest of the screen
 * keeps working.
 */
export class AdminBoundary extends React.Component<{ children: React.ReactNode; what?: string }, BoundaryState> {
  override state: BoundaryState = { failed: false };
  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }
  override componentDidCatch(e: unknown) {
    if (__DEV__) console.warn("Admin screen part failed to draw", e);
  }
  override render() {
    if (!this.state.failed) return this.props.children;
    return (
      <View style={{ gap: space[2], paddingVertical: space[3] }} testID="admin-part-failed">
        <T v="small" tone="muted">
          {`This part${this.props.what ? ` (${this.props.what})` : ""} could not be shown. Pull down to try again, or open it on the website.`}
        </T>
        <Button kind="text" full={false} label="Try again" onPress={() => this.setState({ failed: false })} />
      </View>
    );
  }
}

/** The design system's Loaded, with the admin boundary around what it draws. */
export function Loaded<T>(props: { q: UseQueryResult<T>; skeleton?: React.ReactNode; what?: string; soon?: boolean; children: (data: T) => React.ReactNode }) {
  const { children, ...rest } = props;
  return <DsLoaded {...rest}>{(d) => <AdminBoundary what={props.what}>{children(d)}</AdminBoundary>}</DsLoaded>;
}
