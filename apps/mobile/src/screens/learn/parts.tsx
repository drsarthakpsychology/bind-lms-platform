import type { UseQueryResult } from "@tanstack/react-query";
import { Check, ChevronRight, Lock } from "lucide-react-native";
import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { isClosed, reasonOf } from "@/api/errors";
import { useOffline } from "@/api/online";
import { IconDot, QuietEmpty, Skeleton, StillTrying, Stone, T } from "@/ds";
import { LoadSwap, SkeletonIn } from "@/motion";
import { fonts, layout, space, useTheme } from "@/theme";

/**
 * Parts shared by the Learn area's screens (lectures, modules, doubts), built
 * from the Layers kit (docs/DESIGN.md). Nothing here talks to the server.
 *
 *   Fetched     loading, error and offline for one query, with no stickers
 *   Tile        a stone you tap as a whole: icon, title, quiet line, a mark
 *   Pill        one small status word ("Next", "Due today")
 *   StateMark   done, locked, or a number, in a round mark
 *   TilesSkeleton, CardSkeleton   loading in the shape of the content
 */

/**
 * Loading, error, offline or the content, for one query. Errors are calm
 * words on an outlined stone with Try again: never a sticker, never Jyo.
 */
export function Fetched<T>({ q, skeleton, what = "this", children }: { q: UseQueryResult<T>; skeleton?: React.ReactNode; what?: string; children: (data: T) => React.ReactNode }) {
  const offline = useOffline();
  let body: React.ReactNode = null;
  const waiting = q.data === undefined && !q.isError && q.fetchStatus === "paused";
  if (q.data !== undefined) body = children(q.data);
  else if (waiting || (q.isError && offline)) body = <QuietEmpty testID="waiting-online" title="This opens when you are back online" body="Everything you opened before is saved on this phone." action={{ label: "Try now", onPress: () => void q.refetch() }} />;
  else if (q.isError) body = isClosed(q.error) ? <QuietEmpty testID="closed" title="Not open for your account" body="This part of VIBHA is not switched on for you yet." /> : <QuietEmpty testID="load-error" title={`Could not load ${what}`} body={reasonOf(q.error)} action={{ label: "Try again", onPress: () => void q.refetch() }} />;
  return (
    <LoadSwap
      ready={q.data !== undefined || q.isError || waiting}
      skeleton={
        <View style={{ gap: space[3] }}>
          {skeleton ?? <TilesSkeleton />}
          <StillTrying failed={q.failureCount > 0} />
        </View>
      }
    >
      {body}
    </LoadSwap>
  );
}

/** Stone-shaped placeholders for a list of tiles. */
export function TilesSkeleton({ rows = 4, card }: { rows?: number; /** A taller first card (the "keep going" stone). */ card?: boolean }) {
  return (
    <SkeletonIn>
      <View accessibilityRole="progressbar" accessibilityLabel="Loading" style={{ gap: space[2] }}>
        {card ? <Skeleton h={96} r={layout.radiusLg} style={{ marginBottom: space[4] }} /> : null}
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} h={68} r={22} />
        ))}
      </View>
    </SkeletonIn>
  );
}

export type PillTone = "stone" | "lime" | "ink" | "warm" | "field";

/** One small status word. Colour is never the only sign: the word says it. */
export function Pill({ children, tone = "stone", icon }: { children: string; tone?: PillTone; icon?: React.ReactNode }) {
  const c = useTheme();
  const bg = tone === "lime" ? c.lime : tone === "ink" ? c.ink : tone === "warm" ? c.missBg : tone === "field" ? c.fieldTint : c.hairline;
  const fg = tone === "lime" ? c.onLime : tone === "ink" ? c.bg : tone === "field" ? c.onField : c.ink;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", backgroundColor: bg, borderRadius: 999, paddingVertical: 3, paddingHorizontal: space[2] + 2 }}>
      {icon}
      <T v="caption" num maxFontSizeMultiplier={1.3} style={{ color: fg, fontFamily: fonts.bold }}>
        {children}
      </T>
    </View>
  );
}

/** Where one item stands: a tick when done, a lock when it opens later, else its number (or a dot). */
export function StateMark({ state, n, size = 36 }: { state: "done" | "locked" | "now" | "todo"; n?: number | string; size?: number }) {
  const c = useTheme();
  const bg = state === "done" ? c.ink : state === "now" ? c.lime : c.bg;
  const fg = state === "done" ? c.bg : state === "now" ? c.onLime : c.muted;
  return (
    <View accessibilityLabel={state === "done" ? "Done" : state === "locked" ? "Opens later" : undefined} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
      {state === "done" ? (
        <Check size={size * 0.48} color={fg} strokeWidth={3} />
      ) : state === "locked" ? (
        <Lock size={size * 0.42} color={fg} />
      ) : (
        <T v="caption" num maxFontSizeMultiplier={1.2} style={{ color: fg, fontFamily: fonts.bold, fontSize: 13 }}>
          {n ?? ""}
        </T>
      )}
    </View>
  );
}

export type TileProps = {
  title: string;
  meta?: string;
  /** A lucide icon, shown in a soft round patch. */
  icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  /** Anything else on the left instead of `icon` (a StateMark, a ring). */
  lead?: React.ReactNode;
  /** On the right: a Pill, a score, a tick. A string becomes quiet text. */
  trailing?: React.ReactNode;
  /** Under the title and meta (a progress line). */
  below?: React.ReactNode;
  onPress?: () => void;
  /** Opens a screen by growing into it (pass the push). */
  grow?: () => void;
  /** Outlined, for things that are not open yet. */
  quiet?: boolean;
  /** No arrow at the right. */
  plain?: boolean;
  dim?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * A stone you tap as a whole: something on the left, a title that wraps, one
 * quiet line, and a mark on the right. 64px or taller. Use in a `StaggerList`
 * with `space[2]` between tiles.
 */
export function Tile({ title, meta, icon, lead, trailing, below, onPress, grow, quiet, plain, dim, testID, accessibilityLabel, style }: TileProps) {
  const c = useTheme();
  const can = !!(onPress || grow);
  return (
    <Stone testID={testID} quiet={quiet} pad={space[3] + 2} onPress={grow ? undefined : onPress} grow={grow} accessibilityLabel={accessibilityLabel ?? (meta ? `${title}. ${meta}` : title)} style={style}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: 36, opacity: dim ? 0.6 : 1 }}>
        {lead ?? (icon ? <IconDot icon={icon} /> : null)}
        <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
          <T v="bodyStrong">{title}</T>
          {meta ? (
            <T v="small" tone="muted" num>
              {meta}
            </T>
          ) : null}
          {below}
        </View>
        {typeof trailing === "string" ? (
          <T v="small" tone="muted" num style={{ flexShrink: 1, maxWidth: "40%", textAlign: "right" }}>
            {trailing}
          </T>
        ) : (
          trailing
        )}
        {can && !plain ? <ChevronRight size={18} color={c.faint} /> : null}
      </View>
    </Stone>
  );
}

/** A group on a layer: its quiet label and what is under it, 8px apart. */
export function Group({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ gap: space[2] }, style]}>{children}</View>;
}
