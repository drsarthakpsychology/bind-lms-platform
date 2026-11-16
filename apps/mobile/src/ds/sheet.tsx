import * as React from "react";
import { Modal, Pressable, ScrollView, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { GestureDetector, GestureHandlerRootView, usePanGesture } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { haptic } from "@/lib/haptics";
import { curves, dur, springs } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { useKeyboardPad } from "./keyboard-pad";
import { T } from "./text";

/** Close when pulled past this share of the sheet's height... */
const CLOSE_AT = 0.25;
/** ...or flicked down faster than 0.4px/ms (Vaul's numbers). */
const FLICK = 400;

/**
 * A bottom sheet for detail that would crowd the screen (today's quests, the
 * section list). Springs up from its own measured height (about 450ms, no
 * bounce) and slides away in 200ms; the scrim and the sheet move from one
 * value, so they always agree. Drag down on the grabber, or anywhere once the
 * content is scrolled to the top: the sheet follows the finger 1:1 on the UI
 * thread (rubber band upward), closes past 25% of its height or on a quick
 * flick, else springs back. Tapping outside or the back gesture closes it too.
 * Sized to its content, up to 85% of the screen, then it scrolls. With the
 * keyboard up, the sheet sits on top of it (useKeyboardPad).
 */
export function Sheet({ open, onClose, title, children, testID }: { open: boolean; onClose: () => void; title?: string; children?: React.ReactNode; testID?: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const [shown, setShown] = React.useState(open);
  // Mount as soon as it opens (state adjusted while rendering, not in an effect).
  if (open && !shown) setShown(true);
  /** 0 = closed, 1 = open; the sheet's place and the scrim both come from it. */
  const p = useSharedValue(reduce && open ? 1 : 0);
  /** The sheet's measured height (0 until it has laid out). */
  const h = useSharedValue(0);
  // Plain state, changed only when it flips (not per scroll frame).
  const [atTop, setAtTop] = React.useState(true);
  const want = useSharedValue(open);
  // Edge to edge, the window may not shrink for the keyboard: lift the sheet above it.
  const { ref: kbRef, pad: kbPad, onLayout: kbLayout } = useKeyboardPad();

  const rise = React.useCallback(() => {
    p.set(reduce ? 1 : withSpring(1, springs.sheet));
  }, [p, reduce]);
  React.useEffect(() => {
    want.set(open);
    if (open) {
      haptic.select();
      // Rise now if the height is known; otherwise onLayout starts it.
      if (h.get() > 0 || reduce) rise();
      return;
    }
    if (reduce) {
      p.set(0);
      setTimeout(() => setShown(false), 0);
      return;
    }
    p.set(
      withTiming(0, { duration: dur.sheetOut, easing: curves.inOut }, (done) => {
        if (done) scheduleOnRN(setShown, false);
      }),
    );
  }, [open, reduce, p, h, want, rise]);
  const onLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      const first = h.get() === 0;
      h.set(e.nativeEvent.layout.height);
      if (first && want.get()) rise();
    },
    [h, want, rise],
  );

  const panel = useAnimatedStyle(() => {
    const H = h.value || 2000;
    const v = p.value;
    // Above fully open, the sheet only gives a little (rubber band).
    return { opacity: h.value > 0 || reduce ? 1 : 0, transform: [{ translateY: v > 1 ? -(v - 1) * H * 0.2 : (1 - v) * H }] };
  });
  const scrim = useAnimatedStyle(() => ({ opacity: Math.min(1, Math.max(0, p.value)) }));

  const close = React.useCallback(() => {
    haptic.select();
    onClose();
  }, [onClose]);
  const config = (enabled: boolean) => ({
    enabled,
    activeOffsetY: 8,
    failOffsetY: -8,
    onUpdate: (e: { translationY: number }) => {
      "worklet";
      const H = h.value || 1;
      p.value = 1 - e.translationY / H;
    },
    onDeactivate: (e: { translationY: number; velocityY: number }) => {
      "worklet";
      const H = h.value || 1;
      if (e.translationY > H * CLOSE_AT || (e.translationY > 0 && e.velocityY > FLICK)) scheduleOnRN(close);
      else p.value = withSpring(1, springs.snappy);
    },
  });
  const grabPan = usePanGesture(config(true));
  const bodyPan = usePanGesture(config(atTop));
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const top = e.nativeEvent.contentOffset.y <= 0;
    if (top !== atTop) setAtTop(top);
  };

  if (!shown) return null;
  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View ref={kbRef} onLayout={kbLayout} style={{ flex: 1, justifyContent: "flex-end", paddingBottom: kbPad }}>
        <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.scrim }, scrim]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} style={{ flex: 1 }} />
        </Animated.View>
        <GestureDetector gesture={bodyPan}>
          <Animated.View testID={testID} onLayout={onLayout} accessibilityViewIsModal accessibilityLabel={title} style={[{ maxHeight: "85%", width: "100%", maxWidth: 640, alignSelf: "center", backgroundColor: c.raised, borderTopLeftRadius: 20, borderTopRightRadius: 20 }, panel]}>
            <GestureDetector gesture={grabPan}>
              <View style={{ alignItems: "center", paddingTop: space[2], paddingBottom: space[3] }} accessibilityLabel="Drag down to close">
                <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: c.fieldLine }} />
              </View>
            </GestureDetector>
            <ScrollView bounces={false} onScroll={onScroll} scrollEventThrottle={32} contentContainerStyle={{ paddingHorizontal: layout.gutter, paddingBottom: insets.bottom + space[5], gap: space[3] }}>
              {title ? <T v="h2">{title}</T> : null}
              <View>{children}</View>
            </ScrollView>
          </Animated.View>
        </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
