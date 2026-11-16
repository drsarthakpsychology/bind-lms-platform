import * as React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";

import { presets } from "./enter";
import { useMotionTier } from "./tier";

/**
 * List to page continuity, the cheap way (no shared-element machinery): a
 * pressed row notes its title and where it was on screen; the page that opens
 * with the same title lets that title glide up (or down) from the row's place
 * into its own while the page slides in. One animated view, UI thread only.
 *
 * The note lasts one second, so a later page with the same name never plays it.
 */
type Mark = { title: string; y: number };
let mark: Mark | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

export const continuity = {
  /** Called by a pressed row: its title and the top of the row in window coordinates. */
  mark(title: string, y: number): void {
    if (!title || !Number.isFinite(y)) return;
    mark = { title: title.trim(), y };
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      mark = null;
    }, 1000);
  },
  /** Where the row with this title was, if one was pressed in the last second. */
  peek(title: string | undefined): number | undefined {
    if (!mark || !title) return undefined;
    return mark.title === title.trim() ? mark.y : undefined;
  },
  clear(): void {
    mark = null;
  },
};

/**
 * The entering animation for a page title: glides from the pressed row when
 * one with this title was just pressed, else `fallback`. Low-end Android and
 * Reduce Motion get the fallback (low) or nothing (reduced).
 *
 *   const entering = useFromRow(page.name, presets.head());
 *   <Animated.View entering={entering}><T v="display">{page.name}</T></Animated.View>
 */
export function useFromRow<F = undefined>(title: string | undefined, fallback?: F) {
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  const y = React.useMemo(() => continuity.peek(title), [title]);
  if (reduce) return undefined;
  if (low || y === undefined) return fallback;
  return presets.fromRow(y);
}

/**
 * A page title that grows out of the row that opened it (else arrives with
 * the header fade and lift).
 *
 *   <FromRow title={page.name}><T v="display">{page.name}</T></FromRow>
 */
export function FromRow({ title, children, style }: { title: string | undefined; children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { low } = useMotionTier();
  const entering = useFromRow(title, presets.head(low));
  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}
