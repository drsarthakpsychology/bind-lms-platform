import { Bell, CloudOff, Search } from "lucide-react-native";
import * as React from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useOffline } from "@/api/online";
import { FlowGap, presets, useFromRow, useGrowIn, useMotionTier, usePressScale } from "@/motion";

import { AreaProvider, fonts, layout, space, useAccent, useLightStatusBar, useTheme, type Area } from "@/theme";
import { Button } from "./button";
import { ProgressLine } from "./parts";
import { useBottomChrome } from "./bottom-chrome";
import { useKeyboardPad } from "./keyboard-pad";
import { layerShadow } from "./layers";
import { T } from "./text";

/** The VIBHA wordmark, as on the website: wide black Archivo, with the school line under it in the pixel face. */
export function Wordmark({ sub = "School of Psychology", size = 22, onField }: { sub?: string | null; size?: number; /** White, for the blue field. */ onField?: boolean }) {
  const c = useTheme();
  const subSize = Math.max(9, Math.round(size * 0.45));
  return (
    <View accessible accessibilityRole="header" accessibilityLabel={sub ? `VIBHA ${sub}` : "VIBHA"}>
      <T style={{ fontFamily: fonts.wordmark, fontSize: size, lineHeight: size + 2, letterSpacing: -0.4, color: onField ? c.onField : c.ink }} maxFontSizeMultiplier={1.2}>
        VIBHA
      </T>
      {sub ? (
        <T tone={onField ? "onFieldMuted" : "muted"} maxFontSizeMultiplier={1.2} style={{ fontFamily: fonts.semibold, fontSize: subSize + 1, lineHeight: subSize + 5, letterSpacing: 0.2, marginTop: 1 }}>
          {sub}
        </T>
      ) : null}
    </View>
  );
}

/** A 48px round icon button. Sinks to 0.88 while pressed; the unread dot pops in. */
export function IconButton({ label, onPress, children, dot, testID, onField }: { label: string; onPress: () => void; children: React.ReactNode; /** A small dot (unread). */ dot?: boolean; testID?: string; /** Sits on the blue field: a soft round patch behind it, a lime dot. */ onField?: boolean }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const { style, handlers } = usePressScale(0.88);
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} {...handlers} hitSlop={4} android_ripple={{ color: onField ? c.fieldTint : c.tint, borderless: true, radius: 24 }} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}>
      {onField ? <View pointerEvents="none" style={{ position: "absolute", width: 38, height: 38, borderRadius: 19, backgroundColor: c.fieldTint }} /> : null}
      <Animated.View style={style}>{children}</Animated.View>
      {dot ? <Animated.View entering={reduce ? undefined : presets.pop(300)} style={{ position: "absolute", top: 11, right: 11, width: 9, height: 9, borderRadius: 5, backgroundColor: onField ? c.lime : c.accent, borderWidth: 1.5, borderColor: onField ? c.field : c.card }} /> : null}
    </Pressable>
  );
}

/** The bar on top of the tab screens, on the blue field: wordmark, search, bell. Nothing else. */
export function TopBar({ onSearch, onBell, unread = 0, sub }: { onSearch?: () => void; onBell?: () => void; unread?: number; sub?: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: c.field }}>
      <View style={{ minHeight: 56, paddingLeft: Math.max(layout.gutter, insets.left), paddingRight: Math.max(space[2], insets.right), flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Wordmark sub={sub ?? null} onField />
        <View style={{ flexDirection: "row" }}>
          {onSearch ? (
            <IconButton label="Search" onPress={onSearch} testID="top-search" onField>
              <Search size={20} color={c.onField} />
            </IconButton>
          ) : null}
          {onBell ? (
            <IconButton label={unread ? `Notifications, ${unread} unread` : "Notifications"} onPress={onBell} dot={unread > 0} testID="top-bell" onField>
              <Bell size={20} color={c.onField} />
            </IconButton>
          ) : null}
        </View>
      </View>
    </View>
  );
}

/**
 * A small calm pill while the phone cannot reach the server: what is on the
 * screen is the copy saved on this phone, and it refreshes by itself when the
 * internet is back. Never an error screen while there is something to show.
 */
export function OfflineLine() {
  const c = useTheme();
  const offline = useOffline();
  const reduce = useReducedMotion();
  if (!offline) return null;
  return (
    <View pointerEvents="none" style={{ alignItems: "center", paddingTop: space[2], paddingHorizontal: layout.gutter }}>
      <Animated.View entering={reduce ? undefined : presets.rise(0)} testID="offline-line" accessibilityRole="alert" accessibilityLiveRegion="polite" accessibilityLabel="Offline. Showing what was saved on this phone." style={{ flexDirection: "row", alignItems: "center", gap: space[1], paddingVertical: 6, paddingHorizontal: space[3], borderRadius: 999, backgroundColor: c.band }}>
        <CloudOff size={14} color={c.onBand} />
        <T v="caption" tone="onBand" maxFontSizeMultiplier={1.4}>
          Offline, showing saved
        </T>
      </Animated.View>
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
  /** A tab screen's area: sets its one quiet accent family. */
  area?: Area;
  /** Sits on the blue field, under the title and above the layer: a greeting, a FieldCard, a FieldProgress. Short. */
  field?: React.ReactNode;
  /** The whole screen is the layer colour, with no blue field (long forms, the reader, admin lists). */
  plain?: boolean;
};

/**
 * Every screen sits in this. The blue field is the place you are in: it holds
 * the top bar, the title and at most one short thing (`field`). The soft white
 * layer rises over it with 30px corners and holds what you do now (`children`).
 * Also: a 20px side margin, 32px between sections, safe areas, pull to
 * refresh, an optional pinned footer, and a centred column on wide screens.
 * When a card grew into this screen (`growFrom`), it opens out of that card.
 */
export function Screen({ children, title, lead, top, footer, onRefresh, refreshing = false, scroll = true, safeTop, tab, bleed, gap = layout.section, testID, contentStyle, area, field, plain }: ScreenProps) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const tier = useMotionTier();
  // The field is dark blue in both themes: status bar icons are white while this screen is in front.
  useLightStatusBar(!plain);
  // Pull to refresh: the spinner shows only for the person's own pull (never
  // for quiet background refreshes), for at least 500ms so it never blinks.
  const [pulled, setPulled] = React.useState(false);
  const [hold, setHold] = React.useState(false);
  if (pulled && !hold && !refreshing) setPulled(false);
  const pull = React.useCallback(() => {
    if (!onRefresh) return;
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
  // Arrival choreography (UI thread layout animations): header, then body. Low-end Android: fades only.
  const head = reduce ? undefined : presets.head(tier.low);
  const bodyIn = reduce ? undefined : presets.body(tier.low);
  const fromRow = useFromRow(title);
  const grow = useGrowIn();
  const own = StyleSheet.flatten(contentStyle)?.gap;
  const flowGap = typeof own === "number" ? own : gap;
  const padL = Math.max(side, bleed ? 0 : insets.left);
  const padR = Math.max(side, bleed ? 0 : insets.right);
  const column: ViewStyle = { width: "100%", maxWidth: bleed ? undefined : layout.readingWidth + side * 2, alignSelf: "center" };
  const hasHead = !!(title || lead || field);
  const onField = !plain;
  // On the field: the title (gliding out of the row that opened it, when one did), the lead, then one short thing.
  const headBlock = hasHead ? (
    <View style={[column, { paddingLeft: Math.max(layout.gutter, insets.left), paddingRight: Math.max(layout.gutter, insets.right), paddingTop: top ? space[2] : space[4], paddingBottom: onField ? space[5] : 0, gap: space[4] }]}>
      {title || lead ? (
        <Animated.View entering={fromRow ? undefined : head} style={{ gap: space[1] }}>
          {title ? (
            <Animated.View entering={fromRow}>
              <T v={title.length > 28 ? "h1" : "display"} tone={onField ? "onField" : "ink"}>
                {title}
              </T>
            </Animated.View>
          ) : null}
          {lead ? (
            <Animated.View entering={fromRow ? head : undefined}>
              <T v="small" tone={onField ? "onFieldMuted" : "muted"}>
                {lead}
              </T>
            </Animated.View>
          ) : null}
        </Animated.View>
      ) : null}
      {field ? <Animated.View entering={head}>{field}</Animated.View> : null}
    </View>
  ) : onField ? (
    <View style={{ height: top ? space[2] : space[3] }} />
  ) : null;
  // The layer: soft white, 30px top corners, one soft shadow onto the field.
  const layer = (
    <View testID="layer" style={[{ flexGrow: 1, backgroundColor: c.bg }, onField ? { borderTopLeftRadius: layout.radiusLayer, borderTopRightRadius: layout.radiusLayer, ...layerShadow(c) } : null]}>
      <View style={[column, { paddingLeft: padL, paddingRight: padR, paddingTop: onField ? space[5] : space[5], paddingBottom: padBottom, gap }, contentStyle]}>
        <Animated.View entering={hasHead ? bodyIn : head} style={{ gap: flowGap }}>
          <FlowGap.Provider value={flowGap}>{children}</FlowGap.Provider>
        </Animated.View>
      </View>
    </View>
  );
  return (
    <AreaProvider area={area}>
      <Animated.View ref={root} onLayout={kbLayout} testID={testID} style={[{ flex: 1, backgroundColor: onField ? c.field : c.bg, paddingTop: safeTop ? insets.top : 0, paddingBottom: kb }, grow]}>
        {top}
        <OfflineLine />
        <View style={{ flex: 1 }}>
          {/* The layer colour under the lower half, so a pull at the end never shows the field below the layer. */}
          {onField ? <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "45%", backgroundColor: c.bg }} /> : null}
          {scroll ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentInsetAdjustmentBehavior="automatic"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              refreshControl={onRefresh ? <RefreshControl refreshing={spinning} onRefresh={pull} tintColor={onField ? c.onField : c.muted} colors={[c.brand]} progressBackgroundColor={c.raised} /> : undefined}
            >
              {headBlock}
              {layer}
            </ScrollView>
          ) : (
            <View style={{ flex: 1 }}>
              {headBlock}
              {layer}
            </View>
          )}
        </View>
        {footer ? (
          <View onLayout={(e) => setFootH(Math.round(e.nativeEvent.layout.height))} style={{ backgroundColor: c.bg, paddingTop: space[3], paddingBottom: (tab || kb ? 0 : insets.bottom) + space[3], paddingLeft: Math.max(layout.gutter, insets.left), paddingRight: Math.max(layout.gutter, insets.right) }}>
            <View style={{ width: "100%", maxWidth: layout.readingWidth, alignSelf: "center", gap: space[2] }}>{footer}</View>
          </View>
        ) : null}
      </Animated.View>
    </AreaProvider>
  );
}

/**
 * The one thing to do on this screen, on a stone card: a short context line,
 * the title, where they stopped, an optional thin progress line and the one
 * lime button. One per screen.
 */
export function Hero({ context, title, meta, progress, progressLabel, action, below }: { context?: string; title: string; meta?: string; progress?: number; progressLabel?: string; action: { label: string; onPress: () => void; icon?: React.ReactNode; testID?: string }; below?: React.ReactNode }) {
  const c = useTheme();
  const a = useAccent();
  return (
    <View testID={a.on ? "hero-card" : undefined} style={{ gap: space[4], backgroundColor: c.card, borderRadius: layout.radiusLg, padding: space[5] }}>
      <View style={{ gap: space[1] }}>
        {context ? (
          <T v="label" tone="muted">
            {context}
          </T>
        ) : null}
        {/* A long title steps down a size so the button stays in reach. */}
        <T v={(title ?? "").length > 36 ? "h2" : "h1"}>{title ?? ""}</T>
        {meta ? (
          <T v="small" tone="muted">
            {meta}
          </T>
        ) : null}
      </View>
      {progress !== undefined ? <ProgressLine value={progress} label={progressLabel} /> : null}
      <Button label={action.label} onPress={action.onPress} icon={action.icon} testID={action.testID} />
      {below}
    </View>
  );
}
