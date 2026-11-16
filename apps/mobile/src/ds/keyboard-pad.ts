import * as React from "react";
import { Keyboard, Platform, type KeyboardEvent, type View } from "react-native";

type Box = React.ComponentRef<typeof View>;

/**
 * How much of a view the keyboard covers, in px (0 when closed). Give the
 * view `ref` and `onLayout`, and put `pad` as its bottom padding.
 *
 * The app draws edge to edge, and on Android 15 and later (and whenever a
 * screen follows the keyboard frame by frame) the window no longer shrinks
 * when the keyboard opens. So a screen pads itself: it measures where its own
 * bottom is on the screen and how high the keyboard reaches. When the window
 * did shrink, the bottom is already above the keyboard and this stays 0, so
 * nothing is counted twice. It measures again when the view moves (the tab
 * bar hides while typing). Nothing on the web.
 */
export function useKeyboardPad(): { ref: React.RefObject<Box | null>; pad: number; onLayout: () => void } {
  const ref = React.useRef<Box>(null);
  const top = React.useRef<number | null>(null);
  const [pad, setPad] = React.useState(0);
  const measure = React.useCallback(() => {
    const k = top.current;
    const node = ref.current;
    if (k === null || !node) return;
    // Padding sits inside the view, so its frame (and this sum) ignores what we added.
    node.measureInWindow((_x: number, y: number, _w: number, h: number) => setPad(Math.max(0, Math.round(y + h - k))));
  }, []);
  React.useEffect(() => {
    if (Platform.OS === "web") return;
    const ios = Platform.OS === "ios";
    const show = (e: KeyboardEvent) => {
      top.current = e.endCoordinates.screenY;
      measure();
    };
    const hide = () => {
      top.current = null;
      setPad(0);
    };
    const subs = [Keyboard.addListener(ios ? "keyboardWillShow" : "keyboardDidShow", show), Keyboard.addListener(ios ? "keyboardWillHide" : "keyboardDidHide", hide)];
    if (ios) subs.push(Keyboard.addListener("keyboardWillChangeFrame", show));
    return () => subs.forEach((s) => s.remove());
  }, [measure]);
  return { ref, pad, onLayout: measure };
}
