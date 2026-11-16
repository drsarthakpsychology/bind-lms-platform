import { Bell, CloudOff, Search } from "lucide-react-native";
import * as React from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useOffline } from "@/api/online";
import { haptic } from "@/lib/haptics";
import { FlowGap, presets, usePressScale } from "@/motion";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { AreaProvider, fonts, layout, space, useAccent, useTheme, type Area } from "@/theme";
import { Button } from "./button";
import { ProgressLine } from "./parts";
import { useBottomChrome } from "./bottom-chrome";
import { useKeyboardPad } from "./keyboard-pad";
import { T } from "./text";
import { TitleInk } from "@/moments/title";

/** The VIBHA wordmark: wide black Archivo, with the school line under it. */
export function Wordmark({ sub = "School of Psychology", size = 22 }: { sub?: string | null; size?: number }) {
  const c = useTheme();
  return (
    <View accessible accessibilityRole="header" accessibilityLabel={sub ? `VIBHA ${sub}` : "VIBHA"}>
      <T style={{ fontFamily: fonts.wordmark, fontSize: size, lineHeight: size + 2, letterSpacing: -0.4, color: c.ink }} maxFontSizeMultiplier={1.2}>
        VIBHA
      </T>
      {sub ? (
        <T v="caption" tone="muted" maxFontSizeMultiplier={1.2}>
          {sub}
        </T>
      ) : null}
    </View>
  );
}

/** A 48px round icon button. Sinks to 0.88 while pressed; the unread dot pops in. */
export function IconButton({ label, onPress, children, dot, testID }: { label: string; onPress: () => void; children: React.ReactNode; /** A small blue dot (unread). */ dot?: boolean; testID?: string }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { style, handlers } = usePressScale(0.88);
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} {...handlers} hitSlop={4} android_ripple={{ color: c.tint, borderless: true, radius: 24 }} style={({ pressed }) => ({ width: layout.target, height: layout.target, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: pressed ? c.tint : "transparent" })}>
      <Animated.View style={style}>{children}</Animated.View>
      {dot ? <Animated.View entering={reduce ? undefined : presets.pop(300)} style={{ position: "absolute", top: 11, right: 11, width: 9, height: 9, borderRadius: 5, backgroundColor: c.accent, borderWidth: 1.5, borderColor: c.card }} /> : null}
    </Pressable>
  );
}

/** The bar on top of the tab screens: wordmark, search, bell. Nothing else. */
export function TopBar({ onSearch, onBell, unread = 0, sub }: { onSearch?: () => void; onBell?: () => void; unread?: number; sub?: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: c.card, borderBottomWidth: 1, borderColor: c.hairline }}>
      <View style={{ minHeight: 56, paddingLeft: Math.max(layout.gutter, insets.left), paddingRight: Math.max(space[2], insets.right), flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Wordmark sub={sub} />
        <View style={{ flexDirection: "row" }}>
          {onSearch ? (
            <IconButton label="Search" onPress={onSearch} testID="top-search">
              <Search size={22} color={c.ink} />
            </IconButton>
          ) : null}
          {onBell ? (
            <IconButton label={unread ? `Notifications, ${unread} unread` : "Notifications"} onPress={onBell} dot={unread > 0} testID="top-bell">
              <Bell size={22} color={c.ink} />
            </IconButton>
          ) : null}
        </View>
      </View>
    </View>
  );
}

/** One thin line while the phone cannot reach the server. Saved copies still show under it. */
export function OfflineLine() {
  const c = useTheme();
  const offline = useOffline();
  const reduce = useReducedMotion();
  if (!offline) return null;
  return (
    <Animated.View entering={reduce ? undefined : presets.rise(0)} testID="offline-line" accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ flexDirection: "row", alignItems: "center", gap: space[2], paddingVertical: space[2], paddingHorizontal: layout.gutter, backgroundColor: c.band }}>
      <CloudOff size={16} color={c.onBand} />
      <T v="small" tone="onBand" style={{ flex: 1 }}>
        You are offline. Showing what was saved on this phone.
      </T>
    </Animated.View>
  );
}

export type ScreenProps = {
  children?: React.ReactNode;
  /** The screen's one H1. */
  title?: string;
  /** One quiet line under the title. */
  lead?: string;
  /** Rendered above the scrolling area (the TopBar). */
  top?: React.ReactNode;
  /** Pinned at the bottom, above the gesture bar: the primary action. */
  footer?: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  /** False for screens that manage their own scrolling. */
  scroll?: boolean;
  /** Add the status-bar inset (screens with no bar above them). */
  safeTop?: boolean;
  /** Inside the tab bar: it already clears the gesture bar. */
  tab?: boolean;
  /** No side margin (the lecture video goes edge to edge). */
  bleed?: boolean;
  gap?: number;
  testID?: string;
  contentStyle?: StyleProp<ViewStyle>;
  /** A tab screen's area: sets its one accent family and a soft glow behind the header. */
  area?: Area;
};

/** The soft pastel glow behind a tab screen's header: the area's wash fading into the canvas. Scrolls away with the page. */
function AreaGlow({ area }: { area: Area }) {
  const a = useAccent();
  // One gradient id per area: tabs stay mounted side by side, and a shared id would paint every glow in the first tab's colour.
  const id = `area-glow-${area}`;
  return (
    <View pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants" testID="area-glow" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 260 }}>
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={a.wash} stopOpacity={0.85} />
            <Stop offset="0.55" stopColor={a.wash} stopOpacity={0.35} />
            <Stop offset="1" stopColor={a.wash} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

/**
 * Every screen sits in this: the app canvas, a 20px side margin, 32px between
 * sections, safe areas, a 200ms fade on arrival, pull to refresh, and an
 * optional pinned footer. Wide screens (tablets, landscape) keep a centred
 * column so lines stay readable.
 */
export function Screen({ children, title, lead, top, footer, onRefresh, refreshing = false, scroll = true, safeTop, tab, bleed, gap = layout.section, testID, contentStyle, area }: ScreenProps) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  // Pull to refresh: the spinner shows only for the person's own pull (never
  // for quiet background refreshes), for at least 500ms so it never blinks,
  // and the pull gives a selection haptic.
  const [pulled, setPulled] = React.useState(false);
  const [hold, setHold] = React.useState(false);
  if (pulled && !hold && !refreshing) setPulled(false);
  const pull = React.useCallback(() => {
    if (!onRefresh) return;
    haptic.select();
    setPulled(true);
    setHold(true);
    setTimeout(() => setHold(false), 500);
    onRefresh();
  }, [onRefresh]);
  const spinning = pulled && (hold || refreshing);
  // The keyboard covers the bottom: lift the footer (a reply box) and shorten the list above it.
  const { ref: root, pad: kb, onLayout: kbLayout } = useKeyboardPad();
  // The toast sits above this footer and the tab bar, so it never covers the buttons.
  const [footH, setFootH] = React.useState(0);
  useBottomChrome(footer ? footH : 0, !!tab, kb);
  const side = bleed ? 0 : layout.gutter;
  const padBottom = (footer || tab ? 0 : insets.bottom) + space[6];
  const own = StyleSheet.flatten(contentStyle)?.gap;
  const flowGap = typeof own === "number" ? own : gap;
  const body = (
    <View style={[{ width: "100%", maxWidth: bleed ? undefined : layout.readingWidth + side * 2, alignSelf: "center", paddingLeft: Math.max(side, bleed ? 0 : insets.left), paddingRight: Math.max(side, bleed ? 0 : insets.right), paddingTop: space[5], paddingBottom: padBottom, gap }, contentStyle]}>
      {title || lead ? (
        <View style={{ gap: space[1] }}>
          {title ? (
            <Animated.View entering={reduce ? undefined : presets.rise(0)}>
              <T v="h1">{title}</T>
              {tab ? <TitleInk title={title} /> : null}
            </Animated.View>
          ) : null}
          {lead ? (
            <T v="small" tone="muted">
              {lead}
            </T>
          ) : null}
        </View>
      ) : null}
      <FlowGap.Provider value={flowGap}>{children}</FlowGap.Provider>
    </View>
  );
  const inner = area ? (
    <View>
      <AreaGlow area={area} />
      {body}
    </View>
  ) : (
    body
  );
  return (
    <AreaProvider area={area}>
    <View ref={root} onLayout={kbLayout} testID={testID} style={{ flex: 1, backgroundColor: c.bg, paddingTop: safeTop ? insets.top : 0, paddingBottom: kb }}>
      {top}
      <OfflineLine />
      <Animated.View entering={reduce ? undefined : presets.fadeState()} style={{ flex: 1 }}>
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            refreshControl={onRefresh ? <RefreshControl refreshing={spinning} onRefresh={pull} tintColor={c.muted} colors={[c.dark ? c.primary : c.brand]} progressBackgroundColor={c.card} /> : undefined}
          >
            {inner}
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>{inner}</View>
        )}
      </Animated.View>
      {footer ? (
        <View onLayout={(e) => setFootH(Math.round(e.nativeEvent.layout.height))} style={{ backgroundColor: c.bg, borderTopWidth: 1, borderColor: c.hairline, paddingTop: space[3], paddingBottom: (tab || kb ? 0 : insets.bottom) + space[3], paddingLeft: Math.max(layout.gutter, insets.left), paddingRight: Math.max(layout.gutter, insets.right) }}>
          <View style={{ width: "100%", maxWidth: layout.readingWidth, alignSelf: "center", gap: space[2] }}>{footer}</View>
        </View>
      ) : null}
    </View>
    </AreaProvider>
  );
}

/**
 * The one thing to do on this screen. Large title, an optional thin progress
 * line, where they stopped, and one full-width lime button. No box around the
 * words. One per screen.
 */
export function Hero({ context, title, meta, progress, progressLabel, action, below }: { context?: string; title: string; meta?: string; progress?: number; progressLabel?: string; action: { label: string; onPress: () => void; icon?: React.ReactNode; testID?: string }; below?: React.ReactNode }) {
  const c = useTheme();
  const a = useAccent();
  // In a tab screen the hero sits on a soft card in the area's wash, and a short context line speaks in the pixel voice.
  const pix = a.on && !!context && context.length <= 28;
  return (
    <View testID={a.on ? "hero-card" : undefined} style={[{ gap: space[4] }, a.on ? { backgroundColor: a.wash, borderRadius: 20, padding: space[5] } : null]}>
      <View style={{ gap: space[2] }}>
        {context ? (
          pix ? (
            <T tone="accent" maxFontSizeMultiplier={1.3} style={{ fontFamily: fonts.pixel, fontSize: 12, lineHeight: 16, letterSpacing: 0.4 }}>
              {context}
            </T>
          ) : (
            <T v="small" tone="muted">
              {context}
            </T>
          )
        ) : null}
        {/* A long title steps down a size so the button stays in reach. */}
        <T v={(title ?? "").length > 36 ? "h1" : "display"}>{title ?? ""}</T>
        {meta ? <T tone="muted">{meta}</T> : null}
      </View>
      {progress !== undefined ? <ProgressLine value={progress} label={progressLabel} track={a.on ? c.hairline : undefined} /> : null}
      <Button label={action.label} onPress={action.onPress} icon={action.icon} testID={action.testID} />
      {below}
    </View>
  );
}
