import * as React from "react";
import { BackHandler, Keyboard, useWindowDimensions } from "react-native";

import { setImmersive, watchTilt } from "../../modules/system-bars/src";
import { allowRotation, goLandscape, holdPortrait } from "@/lib/orientation";

/**
 * Full screen for the lecture video, as one small state machine so it can be
 * tested without a phone.
 *
 * `lock` is what the screen is allowed to do:
 *  - "free": it follows the phone (and the phone's own auto-rotate setting).
 *    Turning the phone on its side enters full screen; turning it upright
 *    again leaves it.
 *  - "landscape": the full-screen button was pressed; the screen stays on its
 *    side. Holding the phone on its side and then upright again leaves full
 *    screen (read from the phone's sensor, so it works with auto-rotate off too).
 *  - "portrait": full screen was left with the button or Back while the phone
 *    was still on its side. The screen stays upright (no bounce back into full
 *    screen) until the phone is held upright, then it is "free" again.
 * `wide`: the screen has really turned on its side during this full screen, so
 * the upright frame right after pressing the button never counts as "turned upright".
 * `sideways`: the phone itself has been on its side during this full screen.
 * `held`: how the phone is held now (true on its side, false upright, null not known).
 */
export type FullState = { full: boolean; lock: "free" | "landscape" | "portrait"; wide: boolean; sideways: boolean; held: boolean | null };

export type FullEvent =
  /** The full-screen button. */
  | { type: "button" }
  /** The phone's Back button or gesture. */
  | { type: "back" }
  /** The screen's shape changed (the app's window turned). */
  | { type: "window"; landscape: boolean }
  /** The phone was physically turned (reported even while the screen is locked). */
  | { type: "tilt"; landscape: boolean };

export const FULL_START: FullState = { full: false, lock: "free", wide: false, sideways: false, held: null };

/** Leave full screen. Upright phone: free at once. On its side (or not known): stay upright until it is. */
const leave = (s: FullState): FullState => ({ ...s, full: false, lock: s.held === false ? "free" : "portrait", wide: false, sideways: false });

export function fullReducer(s: FullState, e: FullEvent): FullState {
  switch (e.type) {
    case "button":
      return s.full ? leave(s) : { ...s, full: true, lock: "landscape", wide: false, sideways: s.held === true };
    case "back":
      return s.full ? leave(s) : s;
    case "window":
      if (e.landscape) {
        if (s.full) return s.wide ? s : { ...s, wide: true };
        return s.lock === "free" ? { ...s, full: true, lock: "free", wide: true, sideways: s.held === true } : s;
      }
      // Turned upright after turning into full screen.
      if (s.full && s.lock === "free" && s.wide) return { ...s, full: false, wide: false, sideways: false };
      return s;
    case "tilt": {
      const t = { ...s, held: e.landscape };
      if (e.landscape) return s.full ? { ...t, sideways: true } : t;
      // Upright again after the button turned the screen and the phone followed.
      if (s.full && s.lock === "landscape" && s.sideways) return { ...t, full: false, lock: "free", wide: false, sideways: false };
      if (!s.full && s.lock === "portrait") return { ...t, lock: "free" };
      return t;
    }
  }
}

/** Back leaves full screen first (true: Back was used up). */
export const backLeavesFull = (s: FullState): boolean => s.full;

/**
 * The lecture screen's full screen: the state above, wired to the screen
 * lock, the hidden system bars, Back, and the window's shape. One owner (the
 * lecture screen), so the player itself is never moved or remounted: the
 * screen just hides everything around it. `enabled`: the lecture has a video.
 */
export function useFullScreen(enabled: boolean): { full: boolean; toggle: () => void } {
  const [s, send] = React.useReducer(fullReducer, FULL_START);
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const full = enabled && s.full;

  React.useEffect(() => {
    if (enabled) send({ type: "window", landscape });
  }, [landscape, enabled]);

  // The phone's physical tilt (Android build with the system-bars module; nothing elsewhere).
  React.useEffect(() => watchTilt((l) => send({ type: "tilt", landscape: l })), []);

  React.useEffect(() => {
    // A lecture without a video (or still loading) stays upright like every other screen.
    if (!enabled) void holdPortrait();
    else if (s.lock === "landscape") void goLandscape();
    else if (s.lock === "portrait") void holdPortrait();
    else void allowRotation();
  }, [s.lock, enabled]);

  React.useEffect(() => {
    setImmersive(full);
    // An answer being typed below the video is hidden in full screen: put the keyboard away too.
    if (full) Keyboard.dismiss();
  }, [full]);

  // Leaving the lecture: bars back, upright again.
  React.useEffect(
    () => () => {
      setImmersive(false);
      void holdPortrait();
    },
    [],
  );

  React.useEffect(() => {
    if (!full) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      send({ type: "back" });
      return true;
    });
    return () => sub.remove();
  }, [full]);

  const toggle = React.useCallback(() => send({ type: "button" }), []);
  return { full, toggle };
}
