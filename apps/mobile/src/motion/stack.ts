import { Platform } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

import { useMotionTier } from "./tier";

/**
 * Screen transitions for the native stack (react-native-screens: they run in
 * the platform's own animator, off the JS thread, so a busy JS thread never
 * drops a frame of them). One kind per route:
 *
 * - push    a step deeper (a lesson, a medicine, a thread). The new screen
 *           slides in from the right over the old one, which drifts left and
 *           dims a little (parallax), on both platforms. Back plays the exact
 *           reverse; the edge swipe (anywhere on iPhone) follows the finger.
 * - sheet   something you write and send (Ask a doubt, New message). iPhone:
 *           the system page sheet, the page behind steps back, swipe down to
 *           close. Android: slides up from the bottom and back down.
 * - overlay not a step deeper (Search, the attendance code): a short fade.
 * - play    a focused mode with no edge swipe (a game, a test, a quiz): fades
 *           up from the bottom, so it reads as "entering" rather than "next".
 * - group   the account groups (signed out, student, admin): no slide.
 *
 * Low-end Android (`useMotionTier().low`): every kind becomes a plain fade, the
 * cheapest native transition (one layer, opacity only). Reduce Motion: a short
 * fade too, the switch still clear without movement.
 */
export type RouteKind = "push" | "sheet" | "overlay" | "play";

export type StackMotion = {
  animation: "default" | "fade" | "fade_from_bottom" | "slide_from_bottom" | "ios_from_right" | "none";
  animationDuration?: number;
  gestureEnabled?: boolean;
  fullScreenGestureEnabled?: boolean;
  animationMatchesGesture?: boolean;
  presentation?: "modal";
};

/** Durations (ms). Exits run on the same native animator in reverse. iOS reads them; Android's animators have their own. */
export const stackDur = { push: 320, sheet: 300, overlay: 180, play: 260, fade: 200, reduced: 150 } as const;

export function routeMotion(kind: RouteKind, opts: { reduce: boolean; low: boolean; os?: string }): StackMotion {
  const os = opts.os ?? Platform.OS;
  const sheet = kind === "sheet" ? ({ presentation: "modal" } as const) : null;
  if (opts.reduce) return { ...sheet, animation: "fade", animationDuration: stackDur.reduced };
  // iPhone's page sheet is the system's own (it animates itself); the low tier is Android only.
  if (kind === "sheet" && os === "ios") return { presentation: "modal", animation: "default" };
  if (opts.low && os === "android") return { ...sheet, animation: "fade", animationDuration: stackDur.fade };
  switch (kind) {
    case "push":
      return {
        animation: os === "web" ? "default" : "ios_from_right",
        animationDuration: stackDur.push,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        // The swipe back runs the same parallax as the back button.
        animationMatchesGesture: true,
      };
    case "sheet":
      return { presentation: "modal", animation: "slide_from_bottom", animationDuration: stackDur.sheet };
    case "overlay":
      return { animation: "fade", animationDuration: stackDur.overlay };
    case "play":
      return { animation: "fade_from_bottom", animationDuration: stackDur.play };
  }
}

/** All four kinds for this phone, worked out once per render of a layout. */
export function useStackMotion(): Record<RouteKind, StackMotion> {
  const reduce = !!useReducedMotion();
  const { low } = useMotionTier();
  return {
    push: routeMotion("push", { reduce, low }),
    sheet: routeMotion("sheet", { reduce, low }),
    overlay: routeMotion("overlay", { reduce, low }),
    play: routeMotion("play", { reduce, low }),
  };
}

/** The push motion as the stack default (kept for the visitor stack and older callers). */
export function stackMotion(reduce: boolean, low = false) {
  return routeMotion("push", { reduce, low });
}

/** Deprecated: use `useStackMotion().sheet`. */
export const modalMotion = { animation: "slide_from_bottom" as const, animationDuration: stackDur.sheet };
/** Deprecated: use `useStackMotion().overlay`. */
export const fadeMotion = { animation: "fade" as const, animationDuration: stackDur.overlay };
