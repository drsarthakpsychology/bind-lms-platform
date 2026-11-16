import { useFocusEffect } from "expo-router";
import * as React from "react";
import { BackHandler } from "react-native";

/**
 * Android's back button for one screen, only while that screen is on top.
 *
 * A plain BackHandler listener stays live when another screen is pushed over
 * this one (Rx Detective's "How it works" opens a medicine page): back on the
 * page above then ran this screen's handler (an unseen "Leave this game?"
 * sheet underneath) and the page above never closed. Return false from the
 * handler to let the system go back as usual.
 */
export function useHardwareBack(handler: () => boolean | void, enabled = true): void {
  const latest = React.useRef(handler);
  React.useEffect(() => {
    latest.current = handler;
  });
  useFocusEffect(
    React.useCallback(() => {
      if (!enabled) return undefined;
      const sub = BackHandler.addEventListener("hardwareBackPress", () => latest.current() !== false);
      return () => sub.remove();
    }, [enabled]),
  );
}
