import { Bell, Search } from "lucide-react-native";
import * as React from "react";
import { Pressable, RefreshControl, ScrollView, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { haptic } from "@/lib/haptics";
import { presets, usePressScale } from "@/motion";
import { fonts, layout, motion, space, useTheme } from "@/theme";
import { Button } from "./button";
import { ProgressLine } from "./parts";
import { useKeyboardPad } from "./keyboard-pad";
import { T } from "./text";

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
};

/**
 * Every screen sits in this: the app canvas, a 20px side margin, 32px between
 * sections, safe areas, a 200ms fade on arrival, pull to refresh, and an
 * optional pinned footer. Wide screens (tablets, landscape) keep a centred
 * column so lines stay readable.
 */
export function Screen({ children, title, lead, top, footer, onRefresh, refreshing = false, scroll = true, safeTop, tab, bleed, gap = layout.section, testID, contentStyle }: ScreenProps) {
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
  const side = bleed ? 0 : layout.gutter;
  const padBottom = (footer || tab ? 0 : insets.bottom) + space[6];
  const inner = (
    <View style={[{ width: "100%", maxWidth: bleed ? undefined : layout.readingWidth + side * 2, alignSelf: "center", paddingLeft: Math.max(side, bleed ? 0 : insets.left), paddingRight: Math.max(side, bleed ? 0 : insets.right), paddingTop: space[5], paddingBottom: padBottom, gap }, contentStyle]}>
      {title || lead ? (
        <View style={{ gap: space[1] }}>
          {title ? (
            <Animated.View entering={reduce ? undefined : presets.rise(0)}>
              <T v="h1">{title}</T>
            </Animated.View>
          ) : null}
          {lead ? (
            <T v="small" tone="muted">
              {lead}
            </T>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
  return (
    <View ref={root} onLayout={kbLayout} testID={testID} style={{ flex: 1, backgroundColor: c.bg, paddingTop: safeTop ? insets.top : 0, paddingBottom: kb }}>
      {top}
      <Animated.View entering={reduce ? undefined : FadeIn.duration(motion.page)} style={{ flex: 1 }}>
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
        <View style={{ backgroundColor: c.bg, borderTopWidth: 1, borderColor: c.hairline, paddingTop: space[3], paddingBottom: (tab || kb ? 0 : insets.bottom) + space[3], paddingLeft: Math.max(layout.gutter, insets.left), paddingRight: Math.max(layout.gutter, insets.right) }}>
          <View style={{ width: "100%", maxWidth: layout.readingWidth, alignSelf: "center", gap: space[2] }}>{footer}</View>
        </View>
      ) : null}
    </View>
  );
}

/**
 * The one thing to do on this screen. Large title, an optional thin progress
 * line, where they stopped, and one full-width lime button. No box around the
 * words. One per screen.
 */
export function Hero({ context, title, meta, progress, progressLabel, action, below }: { context?: string; title: string; meta?: string; progress?: number; progressLabel?: string; action: { label: string; onPress: () => void; icon?: React.ReactNode; testID?: string }; below?: React.ReactNode }) {
  return (
    <View style={{ gap: space[4] }}>
      <View style={{ gap: space[2] }}>
        {context ? (
          <T v="small" tone="muted">
            {context}
          </T>
        ) : null}
        {/* A long title steps down a size so the button stays in reach. */}
        <T v={title.length > 36 ? "h1" : "display"}>{title}</T>
        {meta ? <T tone="muted">{meta}</T> : null}
      </View>
      {progress !== undefined ? <ProgressLine value={progress} label={progressLabel} /> : null}
      <Button label={action.label} onPress={action.onPress} icon={action.icon} testID={action.testID} />
      {below}
    </View>
  );
}
