import { Platform } from "react-native";

/**
 * Screen transitions for the native stack (react-native-screens, so they run
 * natively, off the JS thread).
 *
 * - push: the new screen slides in from the right over a slightly dimmed,
 *   parallaxed previous screen, the same on Android and iPhone; back is the
 *   reverse and the edge swipe follows the finger.
 * - modal: slides up from the bottom (Ask a doubt, New message).
 * - fade: overlays that are not a step deeper (Search).
 * With Reduce Motion every transition becomes a short fade.
 */
export function stackMotion(reduce: boolean) {
  if (reduce) return { animation: "fade" as const, animationDuration: 150 };
  return {
    animation: Platform.OS === "web" ? ("default" as const) : ("ios_from_right" as const),
    animationDuration: 320,
    gestureEnabled: true,
    fullScreenGestureEnabled: true,
  };
}

export const modalMotion = { animation: "slide_from_bottom" as const, animationDuration: 300 };
export const fadeMotion = { animation: "fade" as const, animationDuration: 180 };
