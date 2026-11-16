import { useFocusEffect } from "expo-router";
import * as React from "react";

import { createStore } from "@/lib/store";

/** What covers the bottom of the screen in front, so a toast can sit above it. */
type Front = { id: number; footer: number; tab: boolean; kb: number };
type Chrome = { tabBar: number; front: Front | null };

export const bottomChrome = createStore<Chrome>({ tabBar: 0, front: null });

let seq = 0;

/**
 * Called by `Screen`: while the screen is in front it reports its pinned
 * footer's measured height, whether the tab bar sits under it and how much
 * the keyboard pushes it up. Nothing per frame: only when one of them changes.
 */
export function useBottomChrome(footer: number, tab: boolean, kb: number) {
  const [id] = React.useState(() => ++seq);
  useFocusEffect(
    React.useCallback(() => {
      bottomChrome.set({ front: { id, footer, tab, kb } });
      return () => {
        if (bottomChrome.get().front?.id === id) bottomChrome.set({ front: null });
      };
    }, [id, footer, tab, kb]),
  );
}

/** Called by the tab bar with its measured height (0 while hidden behind the keyboard). */
export function reportTabBar(h: number) {
  if (bottomChrome.get().tabBar !== h) bottomChrome.set({ tabBar: h });
}

/**
 * How far above the bottom edge a toast sits: over the front screen's footer
 * and the tab bar (both measured), or over the safe area when there is
 * neither. `inset` is the bottom safe area.
 */
export function toastBottom(c: Chrome, inset: number): number {
  const f = c.front;
  if (!f) return inset + (c.tabBar || 0);
  const under = f.tab ? c.tabBar : 0;
  // A footer pads itself over the safe area when there is no tab bar under it.
  const base = f.footer > 0 ? f.footer + under : under > 0 ? under : inset;
  return base + f.kb;
}
