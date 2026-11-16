import { Platform } from "react-native";
import { KeyboardState, useAnimatedKeyboard, useSharedValue, type SharedValue } from "react-native-reanimated";

/**
 * The keyboard, frame by frame on the UI thread: `height` follows the
 * keyboard as it slides (0 when closed), `state` says opening, open, closing
 * or closed. For parts that move with the keyboard (the sign-in band, the tab
 * bar) instead of jumping after Android's late "keyboard did show".
 *
 * The app draws edge to edge, so both system bars count as see-through for
 * Reanimated (it then leaves the window's own layout alone). The web build has
 * no keyboard events: there the keyboard always reads as closed.
 */
export type KeyboardInfo = { height: SharedValue<number>; state: SharedValue<KeyboardState> };

function useNativeKeyboard(): KeyboardInfo {
  return useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true, isNavigationBarTranslucentAndroid: true });
}

function useNoKeyboard(): KeyboardInfo {
  const height = useSharedValue(0);
  const state = useSharedValue(KeyboardState.CLOSED);
  return { height, state };
}

export const useKeyboard: () => KeyboardInfo = Platform.OS === "web" ? useNoKeyboard : useNativeKeyboard;
export { KeyboardState };
