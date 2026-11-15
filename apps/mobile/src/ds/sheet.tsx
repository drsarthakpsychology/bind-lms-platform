import * as React from "react";
import { Modal, Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { layout, motion, space, useTheme } from "@/theme";
import { T } from "./text";

const easeOut = Easing.bezier(...motion.easeOut);
const ease = Easing.bezier(...motion.ease);

/**
 * A bottom sheet for detail that would crowd the screen (today's quests, the
 * section list). Slides up in 300ms and away in 200ms, has a grabber, closes
 * by dragging down, tapping outside, or the back gesture (the system modal's
 * own back handling, so back closes the sheet and never the screen). Sized to
 * its content, up to 85% of the screen, then it scrolls.
 */
export function Sheet({ open, onClose, title, children, testID }: { open: boolean; onClose: () => void; title?: string; children?: React.ReactNode; testID?: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const { height } = useWindowDimensions();
  const [shown, setShown] = React.useState(open);
  // Mount as soon as it opens (state adjusted while rendering, not in an effect).
  if (open && !shown) setShown(true);
  const y = useSharedValue(height);
  const fade = useSharedValue(0);

  React.useEffect(() => {
    if (open) {
      y.set(reduce ? 0 : withTiming(0, { duration: motion.sheetIn, easing: easeOut }));
      fade.set(reduce ? 1 : withTiming(1, { duration: motion.sheetIn, easing: easeOut }));
      return;
    }
    y.set(reduce ? height : withTiming(height, { duration: motion.sheetOut, easing: ease }));
    fade.set(reduce ? 0 : withTiming(0, { duration: motion.sheetOut, easing: ease }));
    const id = setTimeout(() => setShown(false), reduce ? 0 : motion.sheetOut);
    return () => clearTimeout(id);
  }, [open, reduce, height, y, fade]);

  const panel = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  const scrim = useAnimatedStyle(() => ({ opacity: fade.value }));

  // Drag the grabber down to close.
  const drag = React.useRef({ start: 0 });
  const grab = {
    onStartShouldSetResponder: () => true,
    onMoveShouldSetResponder: () => true,
    onResponderGrant: (e: { nativeEvent: { pageY: number } }) => {
      drag.current.start = e.nativeEvent.pageY;
    },
    onResponderMove: (e: { nativeEvent: { pageY: number } }) => {
      y.set(Math.max(0, e.nativeEvent.pageY - drag.current.start));
    },
    onResponderRelease: (e: { nativeEvent: { pageY: number } }) => {
      if (e.nativeEvent.pageY - drag.current.start > 80) onClose();
      else y.set(withTiming(0, { duration: motion.state, easing: easeOut }));
    },
  };

  if (!shown) return null;
  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.scrim }, scrim]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} style={{ flex: 1 }} />
        </Animated.View>
        <Animated.View testID={testID} accessibilityViewIsModal accessibilityLabel={title} style={[{ maxHeight: "85%", width: "100%", maxWidth: 640, alignSelf: "center", backgroundColor: c.card, borderTopLeftRadius: 20, borderTopRightRadius: 20 }, panel]}>
          <View {...grab} style={{ alignItems: "center", paddingTop: space[2], paddingBottom: space[3] }} accessibilityLabel="Drag down to close">
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: c.cardLine }} />
          </View>
          <ScrollView bounces={false} contentContainerStyle={{ paddingHorizontal: layout.gutter, paddingBottom: insets.bottom + space[5], gap: space[3] }}>
            {title ? <T v="h2">{title}</T> : null}
            <View>{children}</View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
