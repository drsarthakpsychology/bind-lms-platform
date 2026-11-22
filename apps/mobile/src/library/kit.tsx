import { Stack } from "expo-router";
import { ChevronRight, Pin, Search, X } from "lucide-react-native";
import * as React from "react";
import { Pressable, RefreshControl, ScrollView, TextInput, View, type ScrollViewInstance, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { haptic } from "@/lib/haptics";
import type { Recent } from "@/lib/recent";
import type { UseQueryResult } from "@tanstack/react-query";

import { ApiFailure, isClosed, reasonOf } from "@/api/errors";
import { ComingSoon, layerShadow, OfflineLine, QuietEmpty, RowsSkeleton, StillTrying, T, toast, WaitingForInternet } from "@/ds";
import { LoadSwap, Press, presets, useFromRow, useGrowIn, useMotionTier } from "@/motion";
import { layout, space, type as scale, useLightStatusBar, useTheme } from "@/theme";

/**
 * Parts shared by everything the Notes tab opens (revision notes, the quick
 * reference, medicines). They are built from the kit's tokens and follow
 * docs/DESIGN.md; they live here because only these look-up screens use them:
 *
 *   LookupScreen   field plus layer that owns its scroll, so a page can jump to a section
 *   SearchField    the search pill on the layer
 *   FactStrip      small labelled cells, two to a row (threshold, duration, usual dose ...)
 *   Bullets        short bullets for scanning
 *   PairTable      a compact table that never scrolls sideways (label above value)
 *   Block          a heading and its content, the unit a page is scanned by
 *   JumpChips      one row of section names that scroll the page
 *   LinkCard       "Go deeper" and "Practise this" rows on one stone
 *   PinButton      pin or unpin, in the header
 *   QuietError     "could not load" on a quiet stone, never a sticker (errors get no mascot)
 *   Loads          the kit's Loaded, with QuietError and an optional "not found" state
 */

/* ---------------------------------------------------------------- shell */

export type Jump = {
  ref: React.RefObject<ScrollViewInstance | null>;
  /** Put on a section's wrapper: remembers where it is. */
  at: (id: string) => (e: { nativeEvent: { layout: { y: number } } }) => void;
  go: (id: string) => void;
  layer: (e: { nativeEvent: { layout: { y: number } } }) => void;
};

/** Scroll to a named section of a LookupScreen. Instant under Reduce Motion. */
export function useJump(): Jump {
  const reduce = useReducedMotion();
  const ref = React.useRef<ScrollViewInstance>(null);
  const ys = React.useRef<Record<string, number>>({});
  const top = React.useRef(0);
  return React.useMemo<Jump>(
    () => ({
      ref,
      at: (id) => (e) => {
        ys.current[id] = e.nativeEvent.layout.y;
      },
      layer: (e) => {
        top.current = e.nativeEvent.layout.y;
      },
      go: (id) => {
        const y = ys.current[id];
        if (y !== undefined) ref.current?.scrollTo({ y: Math.max(0, top.current + y + space[2]), animated: !reduce });
      },
    }),
    [reduce],
  );
}

/**
 * A look-up page: what it is and its name on the blue field, the layer rising
 * under it with the facts. Same look as `Screen`, but it hands out its scroll
 * (`jump`) so a row of section chips can move the page.
 */
export function LookupScreen({ testID, tag, title, sub, field, children, onRefresh, refreshing = false, jump, gap = space[5], pin }: { testID?: string; /** The small kind line over the title ("Disorder", "Antidepressants · SSRI"). */ tag?: React.ReactNode; title?: string; sub?: string; /** One short thing on the field under the title. */ field?: React.ReactNode; children?: React.ReactNode; onRefresh?: () => void; refreshing?: boolean; jump?: Jump; gap?: number; /** Shown at the right of the header. */ pin?: React.ReactNode }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const tier = useMotionTier();
  useLightStatusBar(true);
  const grow = useGrowIn();
  const head = reduce ? undefined : presets.head(tier.low);
  const fromRow = useFromRow(title, head);
  const [pulled, setPulled] = React.useState(false);
  if (pulled && !refreshing) setPulled(false);
  const column: ViewStyle = { width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" };
  const padL = Math.max(layout.gutter, insets.left);
  const padR = Math.max(layout.gutter, insets.right);
  return (
    <Animated.View testID={testID} style={[{ flex: 1, backgroundColor: c.field }, grow]}>
      {pin ? <Stack.Screen options={{ headerRight: () => pin }} /> : null}
      <OfflineLine />
      <View style={{ flex: 1 }}>
        <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "45%", backgroundColor: c.bg }} />
        <ScrollView
          ref={jump?.ref}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={pulled && refreshing}
                onRefresh={() => {
                  setPulled(true);
                  onRefresh();
                }}
                tintColor={c.onField}
                colors={[c.lime]}
                progressBackgroundColor={c.field}
              />
            ) : undefined
          }
        >
          {title || tag || field ? (
            <View style={[column, { paddingLeft: padL, paddingRight: padR, paddingTop: space[2], paddingBottom: space[5], gap: space[3] }]}>
              <View style={{ gap: space[1] }}>
                {tag ? <Animated.View entering={head}>{typeof tag === "string" ? <T v="small" tone="onFieldMuted">{tag}</T> : tag}</Animated.View> : null}
                {title ? (
                  <Animated.View entering={fromRow}>
                    <T v={title.length > 22 ? "h1" : "display"} tone="onField">
                      {title}
                    </T>
                  </Animated.View>
                ) : null}
                {sub ? (
                  <Animated.View entering={head}>
                    <T v="small" tone="onFieldMuted">
                      {sub}
                    </T>
                  </Animated.View>
                ) : null}
              </View>
              {field ? <Animated.View entering={head}>{field}</Animated.View> : null}
            </View>
          ) : (
            <View style={{ height: space[3] }} />
          )}
          <Animated.View testID="layer" onLayout={jump?.layer} entering={reduce ? undefined : presets.layer(tier.low)} style={{ flexGrow: 1, backgroundColor: c.bg, borderTopLeftRadius: layout.radiusLayer, borderTopRightRadius: layout.radiusLayer, ...layerShadow(c) }}>
            <View style={[column, { paddingLeft: padL, paddingRight: padR, paddingTop: space[5], paddingBottom: insets.bottom + space[7], gap }]}>{children}</View>
          </Animated.View>
        </ScrollView>
      </View>
    </Animated.View>
  );
}

/* --------------------------------------------------------------- search */

/** The search pill on a layer: stone, no outline, a clear button once there is text. */
export function SearchField({ value, onChange, placeholder, label, testID }: { value: string; onChange: (v: string) => void; placeholder: string; label: string; testID: string }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], minHeight: layout.primary, borderRadius: layout.primary / 2, backgroundColor: c.card, paddingLeft: space[4], paddingRight: value ? 0 : space[4] }}>
      <Search size={18} color={c.muted} />
      <TextInput testID={testID} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={c.muted} accessibilityLabel={label} autoCorrect={false} autoCapitalize="none" returnKeyType="search" maxFontSizeMultiplier={1.4} style={[scale.body, { flex: 1, color: c.ink, minHeight: layout.target }, { outlineStyle: "none" } as object]} />
      {value ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Clear the search" onPress={() => onChange("")} testID={`${testID}-clear`} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}>
          <X size={18} color={c.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

/* ---------------------------------------------------------------- facts */

export type Fact = { label: string; value: string };

/**
 * The strip of key facts at the top of a card: small labelled cells, two to a
 * row on a phone. Give it any number of facts; empty ones are left out, so a
 * card can gain a slot later without a new layout. Never animated: these are
 * numbers people copy down.
 */
export function FactStrip({ facts, testID = "facts" }: { facts: (Fact | null | undefined | false)[]; testID?: string }) {
  const c = useTheme();
  const shown = facts.filter((f): f is Fact => !!f && !!f.value);
  if (!shown.length) return null;
  return (
    <View testID={testID} style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
      {shown.map((f, i) => (
        // An odd last cell takes the whole row, so a long value is never squeezed.
        <View key={f.label} accessible accessibilityLabel={`${f.label}: ${f.value}`} style={{ flexGrow: 1, flexBasis: shown.length % 2 === 1 && i === shown.length - 1 ? "100%" : "46%", minWidth: 0, gap: 2, backgroundColor: c.card, borderRadius: layout.radius, paddingVertical: space[3], paddingHorizontal: space[4] }}>
          <T v="caption" tone="muted">
            {f.label}
          </T>
          <T v="bodyStrong" num>
            {f.value}
          </T>
        </View>
      ))}
    </View>
  );
}

/* -------------------------------------------------------------- content */

/** A heading and what is under it. The unit a look-up page is scanned by. */
export function Block({ title, children, onLayout, testID, alert, note }: { title: string; children?: React.ReactNode; onLayout?: (e: { nativeEvent: { layout: { y: number } } }) => void; testID?: string; /** The one warm band on a page. */ alert?: boolean; /** A quiet line under the content. */ note?: string }) {
  const c = useTheme();
  return (
    <View onLayout={onLayout} testID={testID} style={[{ gap: space[3] }, alert ? { backgroundColor: c.alertBg, borderRadius: layout.radiusLg, padding: space[4] } : null]}>
      <T v="h2" tone={alert ? "alert" : "ink"}>
        {title}
      </T>
      {children}
      {note ? (
        <T v="caption" tone="muted">
          {note}
        </T>
      ) : null}
    </View>
  );
}

/** Short bullets. `render` draws one line (so a page can pass rich text). */
export function Bullets({ items, tone, steps, render }: { items: string[]; tone?: "alert"; /** Numbered. */ steps?: boolean; render?: (text: string, i: number) => React.ReactNode }) {
  const c = useTheme();
  return (
    <View style={{ gap: space[2] }}>
      {items.map((t, k) => (
        <View key={k} style={{ flexDirection: "row", gap: space[3] }}>
          {steps ? (
            <T v="bodyStrong" tone={tone ?? "muted"} num style={{ minWidth: 18 }}>
              {k + 1}.
            </T>
          ) : (
            <View style={{ width: 6, height: 6, marginTop: 10, borderRadius: 3, backgroundColor: tone ? c.alertFg : c.faint }} />
          )}
          <View style={{ flex: 1, minWidth: 0 }}>{render ? render(t, k) : <T tone={tone ?? "ink"}>{t}</T>}</View>
        </View>
      ))}
    </View>
  );
}

export type Pair = { label: string; value: string; onPress?: () => void; testID?: string };

/**
 * A compact two-column table made for a phone: each row is a strong label
 * with its value under it, on one stone, hairlines between. Nothing scrolls
 * sideways. A row with `onPress` opens something and shows a chevron.
 */
export function PairTable({ rows, testID }: { rows: Pair[]; testID?: string }) {
  const c = useTheme();
  if (!rows.length) return null;
  return (
    <View testID={testID} accessibilityRole="list" style={{ backgroundColor: c.card, borderRadius: layout.radiusLg, paddingHorizontal: space[4] }}>
      {rows.map((r, i) => {
        const body = (
          <>
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <T v="bodyStrong">{r.label}</T>
              {r.value ? (
                <T v="small" tone="muted">
                  {r.value}
                </T>
              ) : null}
            </View>
            {r.onPress ? <ChevronRight size={18} color={c.muted} /> : null}
          </>
        );
        const line: ViewStyle = { minHeight: r.onPress ? layout.row : 0, paddingVertical: space[3], flexDirection: "row", alignItems: "center", gap: space[3], borderTopWidth: i ? 1 : 0, borderColor: c.hairline };
        return r.onPress ? (
          <Press key={`${r.label}-${i}`} testID={r.testID} accessibilityRole="button" accessibilityLabel={r.value ? `${r.label}. ${r.value}` : r.label} onPress={r.onPress} scale={0.98} innerStyle={line}>
            {body}
          </Press>
        ) : (
          <View key={`${r.label}-${i}`} testID={r.testID} style={line}>
            {body}
          </View>
        );
      })}
    </View>
  );
}

/** One row of section names; a tap scrolls the page there. Slides sideways when the names do not fit. */
export function JumpChips({ items, onJump, label = "Jump to" }: { items: { id: string; name: string }[]; onJump: (id: string) => void; label?: string }) {
  const c = useTheme();
  if (items.length < 2) return null;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityLabel={label} style={{ marginHorizontal: -layout.gutter, flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: layout.gutter, gap: space[2] }}>
      {items.map((x) => (
        <Press key={x.id} testID={`jump-${x.id}`} accessibilityRole="button" accessibilityLabel={`Go to ${x.name}`} onPress={() => onJump(x.id)} scale={0.95} innerStyle={{ minHeight: 44, justifyContent: "center", paddingHorizontal: space[4], borderRadius: 22, backgroundColor: c.card }}>
          <T v="small">{x.name}</T>
        </Press>
      ))}
    </ScrollView>
  );
}

export type LinkItem = { title: string; meta?: string; icon?: React.ReactNode; onPress: () => void; testID?: string };

/** "Go deeper" and "Practise this": where this card leads, as rows on one stone. */
export function LinkCard({ items, testID }: { items: (LinkItem | null | undefined | false)[]; testID?: string }) {
  const c = useTheme();
  const shown = items.filter((x): x is LinkItem => !!x);
  if (!shown.length) return null;
  return (
    <View testID={testID} style={{ backgroundColor: c.card, borderRadius: layout.radiusLg, paddingHorizontal: space[4] }}>
      {shown.map((x, i) => (
        <Press key={x.title} testID={x.testID} accessibilityRole="link" accessibilityLabel={x.meta ? `${x.title}. ${x.meta}` : x.title} onPress={x.onPress} scale={0.98} innerStyle={{ minHeight: layout.row, paddingVertical: space[2], flexDirection: "row", alignItems: "center", gap: space[3], borderTopWidth: i ? 1 : 0, borderColor: c.hairline }}>
          {x.icon ? <View style={{ width: 24, alignItems: "center" }}>{x.icon}</View> : null}
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <T v="bodyStrong">{x.title}</T>
            {x.meta ? (
              <T v="small" tone="muted">
                {x.meta}
              </T>
            ) : null}
          </View>
          <ChevronRight size={18} color={c.muted} />
        </Press>
      ))}
    </View>
  );
}

/** The quiet tag over a list row's group or under a title ("Disorder"). */
export function KindTag({ children, style }: { children: string; style?: StyleProp<ViewStyle> }) {
  const c = useTheme();
  return (
    <View style={[{ alignSelf: "flex-start", paddingHorizontal: space[2], paddingVertical: 2, borderRadius: 8, backgroundColor: c.tint }, style]}>
      <T v="caption" tone="muted">
        {children}
      </T>
    </View>
  );
}

/* ------------------------------------------------------------------ pin */

/** Pin or unpin this page. Sits in the header, on the field. The pin fills when on. */
export function PinButton({ list, id, name }: { list: Recent; id: string; name: string }) {
  const c = useTheme();
  const on = list.use().includes(id);
  return (
    <Press
      testID="pin"
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      accessibilityLabel={on ? `Unpin ${name}` : `Pin ${name}`}
      hitSlop={6}
      squish
      scale={0.9}
      onPress={() => {
        haptic.select();
        if (on) list.remove(id);
        else list.add(id);
        toast.show(on ? "Unpinned" : "Pinned to the top of the list");
      }}
      innerStyle={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: on ? c.lime : c.fieldTint }}
    >
      <Pin size={19} color={on ? c.onLime : c.onField} fill={on ? c.onLime : "transparent"} strokeWidth={2} />
    </Press>
  );
}

/* --------------------------------------------------------------- loading */

/** "Could not load": a quiet stone with one Try again. No sticker and no companion on an error. */
export function QuietError({ what = "this", error, onRetry, testID = "load-error" }: { what?: string; error?: unknown; onRetry: () => void; testID?: string }) {
  return <QuietEmpty testID={testID} title={`Could not load ${what}`} body={reasonOf(error)} action={{ label: "Try again", onPress: onRetry }} />;
}

/**
 * The kit's `Loaded` for look-up pages: a skeleton that becomes the content,
 * waiting offline, "coming soon" for a route the server does not have yet,
 * `missing` for a page that is not there (404), and QuietError otherwise.
 */
export function Loads<D>({ q, skeleton, what, soon, missing, children }: { q: UseQueryResult<D>; skeleton?: React.ReactNode; what?: string; soon?: string; /** Shown when the server answers "not found" (and `soon` is not set). */ missing?: React.ReactNode; children: (data: D) => React.ReactNode }) {
  const waiting = q.data === undefined && !q.isError && q.fetchStatus === "paused";
  let body: React.ReactNode = null;
  const notFound = q.error instanceof ApiFailure && q.error.code === "not_found";
  if (q.data !== undefined) body = children(q.data);
  else if (waiting) body = <WaitingForInternet onRetry={() => void q.refetch()} />;
  else if (q.isError) {
    if (isClosed(q.error)) body = <QuietEmpty title="Not open for your account" body="This part of VIBHA is not switched on for you yet." testID="closed" />;
    else if (notFound && soon) body = <ComingSoon web={soon} />;
    else if (notFound && missing) body = missing;
    else body = <QuietError what={what} error={q.error} onRetry={() => void q.refetch()} />;
  }
  return (
    <LoadSwap
      ready={q.data !== undefined || q.isError || waiting}
      skeleton={
        <View style={{ gap: space[3] }}>
          {skeleton ?? <RowsSkeleton />}
          <StillTrying failed={q.failureCount > 0} />
        </View>
      }
    >
      {body}
    </LoadSwap>
  );
}
